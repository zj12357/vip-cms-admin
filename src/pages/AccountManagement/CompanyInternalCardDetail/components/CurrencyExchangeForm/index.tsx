import React, { FC, useEffect, useRef, useState, useCallback } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Button, message, Row, Col, Descriptions } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { internalCardExchangeCurrency, getCurrencyRate } from '@/api/account';
import {
    InternalCardExchangeCurrencyParams,
    GetCurrencyRateParams,
    CurrencyRateType,
} from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import { useSearchParams, useParams } from 'react-router-dom';
import FormCurrency from '@/components/Currency/FormCurrency';
import Big from 'big.js';
import AuthButton from '@/components/AuthButton';
import { formatCurrency } from '@/utils/tools';
import { isFloatingPointNumber } from '@/utils/validate';
import _ from 'lodash';

type CurrencyExchangeProps = {
    cardName: string;
    reloadData: () => void;
};

const CurrencyExchangeForm: FC<CurrencyExchangeProps> = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { id = '' } = useParams<{ id: string }>();
    const formRef = useRef<ProFormInstance>();
    const currentHall = useAppSelector(selectCurrentHall);
    const currencyList = useAppSelector(selectCurrencyList);
    const [inCurrency, setInCurrency] = useState<number>(); //兑入币种
    const [outCurrency, setOutCurrency] = useState<number>(); //兑出币种
    const [inAmount, setInAmount] = useState<string>('0'); //兑入金额
    const [outAmount, setOutAmount] = useState<number>(0); //兑出金额
    const [exchangeRate, setExchangeRate] = useState<string>(''); //实时汇率
    const [artificialRate, setArtificialRate] = useState<string>(''); //人工汇率
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const updatedValues = useLatest({
        card_code: searchParams.get('cardNumber'),
        card_name: searchParams.get('cardName'),
        hall: currentHall.hall_name,
    }).current;

    const { fetchData: _fetchCurrencyRate } = useHttp<
        GetCurrencyRateParams,
        CurrencyRateType
    >(getCurrencyRate, ({ data }) => {
        setExchangeRate(data?.left_unit_rate ?? '0');
    });

    const { fetchData: _fetchExchangeCurrency } = useHttp<
        InternalCardExchangeCurrencyParams,
        null
    >(internalCardExchangeCurrency, ({ msg }) => {
        message.success(msg);
    });

    const handleExchangeCurrency = async (values: any) => {
        const params = {
            company_card: id,
            cash_in_currency_id: values.cash_in_currency_id,
            cash_in_currency_code:
                currencyList.find(
                    (item) => +item.value === +values.cash_in_currency_id,
                )?.label ?? '',
            cash_in_amount: values.cash_in_amount,
            cash_out_currency_id: values.cash_out_currency_id,
            cash_out_currency_code:
                currencyList.find(
                    (item) => +item.value === +values.cash_out_currency_id,
                )?.label ?? '',
            cash_out_amount: new Big(outAmount).times(1000000).toNumber(),
            hall: currentHall.id,
            exchange: artificialRate || exchangeRate,
        };
        setDoubleParams(params);
        setDoubleVisible(true);
    };
    const handleExchangeAmount = useCallback(
        (value: number, artificialRate: string, exchangeRate: string) => {
            if (_.isNaN(+artificialRate) || _.isNaN(+exchangeRate)) {
                message.error('汇率需要是数字');
                return;
            }
            const totalOutAmount = new Big(value)
                .times(Number(artificialRate || exchangeRate))
                .toNumber();

            formRef.current?.setFieldsValue({
                cash_out_amount: formatCurrency(totalOutAmount, 4, false),
            });

            setOutAmount(formatCurrency(totalOutAmount, 4, false));
            if (inCurrency && outCurrency) {
                const inCurrencyCcode =
                    currencyList.find((item) => +item.value === +inCurrency)
                        ?.label ?? '';
                const outCurrencyCcode =
                    currencyList.find((item) => +item.value === +outCurrency)
                        ?.label ?? '';
                formRef.current?.setFieldsValue({
                    exchange_rate_display: `${value}${inCurrencyCcode} = ${totalOutAmount}${outCurrencyCcode}`,
                });
            }
        },
        [currencyList, inCurrency, outCurrency],
    );

    const handleDoubleSuccess = async () => {
        const res = await _fetchExchangeCurrency(doubleParams);
        if (res.code === 10000) {
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
            resetState();
        }
    };

    const resetState = () => {
        setInCurrency(0);
        setOutCurrency(0);
        setInAmount('0');
        setOutAmount(0);
        setExchangeRate('');
        setArtificialRate('');
    };

    useEffect(() => {
        if (inCurrency && outCurrency) {
            if (inCurrency === outCurrency) {
                message.error('兑入币种和兑出币种不能相同');
                return;
            }
            _fetchCurrencyRate({
                left_currency_id: inCurrency,
                right_currency_id: outCurrency,
            });
        }
    }, [_fetchCurrencyRate, inCurrency, outCurrency]);

    useEffect(() => {
        if (inAmount && outCurrency && inCurrency) {
            handleExchangeAmount(+inAmount, artificialRate, exchangeRate);
        }
    }, [
        handleExchangeAmount,
        inAmount,
        artificialRate,
        exchangeRate,
        outCurrency,
        inCurrency,
    ]);
    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal="companyInternalCardDetail-currencyExchange"
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        buttonProps={{
                            type: 'primary',
                        }}
                        firstVisible={isPass}
                        isSecond={true}
                        secondDom={
                            <Descriptions column={24}>
                                <Descriptions.Item label="兑入币种" span={12}>
                                    {currencyList.find(
                                        (item) =>
                                            +item.value ===
                                            +doubleParams.cash_in_currency_id,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="兑入金额" span={12}>
                                    {formatCurrency(
                                        doubleParams.cash_in_amount,
                                    )}
                                    万
                                </Descriptions.Item>
                                <Descriptions.Item label="兑出币种" span={12}>
                                    {currencyList.find(
                                        (item) =>
                                            +item.value ===
                                            +doubleParams.cash_out_currency_id,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="兑出金额" span={12}>
                                    {formatCurrency(
                                        doubleParams.cash_out_amount,
                                    )}
                                    万
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        secondVerify={(val) => {
                            if (val) {
                                handleDoubleSuccess();
                            }
                        }}
                        secondVisible={doubleVisible}
                        secondOnClose={() => setDoubleVisible(false)}
                    ></AuthButton>
                }
                onFinish={handleExchangeCurrency}
                title="货币兑换"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setIsPass(false);
                        setDoubleVisible(false);
                        setDoubleParams({});
                        resetState();
                    },
                }}
                request={async (params) => {
                    return Promise.resolve({
                        success: true,
                    });
                }}
                initialValues={updatedValues}
                formRef={formRef}
                visible={isPass}
            >
                <ProForm.Group>
                    <ProFormText width="md" name="hall" label="场馆" disabled />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="card_code"
                        label="卡号"
                        disabled
                    />
                    <ProFormText
                        width="md"
                        name="card_name"
                        label="卡名"
                        disabled
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        name="cash_in_currency_id"
                        label="兑入币种"
                        width="md"
                        options={currencyList}
                        placeholder="请选择兑入币种"
                        rules={[
                            {
                                required: true,
                                message: '请选择兑入币种',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onSelect: (val: number) => setInCurrency(val),
                        }}
                        showSearch
                    />

                    <FormCurrency
                        width="md"
                        name="cash_in_amount"
                        label="兑入金额"
                        placeholder="请输入兑入金额"
                        rules={[
                            {
                                required: true,
                                message: '请输入兑入金额',
                            },
                        ]}
                        fieldProps={{
                            onChange: (e: any) => {
                                setInAmount(e.target.value);
                            },
                        }}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="artificial_exchange_rate"
                        label="人工汇率"
                        placeholder="请输入人工汇率"
                        rules={[
                            {
                                pattern: isFloatingPointNumber,
                                message: '请输入数字',
                            },
                        ]}
                        fieldProps={{
                            onChange: (e) => {
                                setArtificialRate(e.target.value);
                            },
                        }}
                    />
                    <ProFormText
                        width="md"
                        name="exchange_rate_display"
                        label="汇率展示"
                        tooltip="选择兑入货币和兑出货币"
                        disabled
                        placeholder={''}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        name="cash_out_currency_id"
                        label="兑出币种"
                        width="md"
                        options={currencyList}
                        placeholder="请选择兑出币种"
                        rules={[
                            {
                                required: true,
                                message: '请选择兑出币种',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onSelect: (val: number) => setOutCurrency(val),
                        }}
                        showSearch
                    />
                    <FormCurrency
                        width="md"
                        name="cash_out_amount"
                        label="兑出金额"
                        disabled
                        placeholder={''}
                        convertValue={(val) => {
                            return formatCurrency(val, 4, false) as any;
                        }}
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};

export default CurrencyExchangeForm;
