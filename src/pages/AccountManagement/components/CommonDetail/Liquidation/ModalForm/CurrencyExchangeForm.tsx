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
import { exchangeCurrency, getCurrencyRate } from '@/api/account';
import {
    ExchangeCurrencyParams,
    GetCurrencyRateParams,
    CurrencyRateType,
} from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import TradeTable from '@/pages/AccountManagement/components/TradeTable';
import FormCurrency from '@/components/Currency/FormCurrency';
import Big from 'big.js';
import AuthButton from '@/components/AuthButton';
import { formatCurrency } from '@/utils/tools';
import _ from 'lodash';

type CurrencyExchangeProps = {};

const CurrencyExchangeForm: FC<CurrencyExchangeProps> = (props) => {
    const formRef = useRef<ProFormInstance>();
    const accountInfo = useAppSelector(selectAccountInfo);
    const currentHall = useAppSelector(selectCurrentHall);
    const currencyList = useAppSelector(selectCurrencyList);
    const [inCurrency, setInCurrency] = useState<number>(); //兑入币种
    const [outCurrency, setOutCurrency] = useState<number>(); //兑出币种
    const [inAmount, setInAmount] = useState<string>('0'); //兑入金额
    const [outAmount, setOutAmount] = useState<number>(0); //兑出金额
    const [exchangeRate, setExchangeRate] = useState<string>(''); //实时汇率
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        hall: currentHall.hall_name,
    }).current;

    const { fetchData: _fetchCurrencyRate } = useHttp<
        GetCurrencyRateParams,
        CurrencyRateType
    >(getCurrencyRate, ({ data }) => {
        setExchangeRate(data?.left_unit_rate ?? '0');
    });

    const { fetchData: _fetchExchangeCurrency } = useHttp<
        ExchangeCurrencyParams,
        null
    >(exchangeCurrency, ({ msg }) => {
        message.success(msg);
    });

    const handleExchangeCurrency = async (values: any) => {
        const params = {
            member_code: accountInfo.member_code,
            member_name: accountInfo.member_name,
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
            remark: values.remark,
            hall: currentHall.id,
            exchange: exchangeRate,
        };
        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchExchangeCurrency(doubleParams);
        if (res.code === 10000) {
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
        }
    };

    const handleExchangeAmount = useCallback(
        (value: number, exchangeRate: string) => {
            if (_.isNaN(+exchangeRate)) {
                message.error('汇率需要是数字');
                return;
            }
            const totalOutAmount = new Big(value)
                .times(Number(exchangeRate))
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
            handleExchangeAmount(+inAmount, exchangeRate);
        }
    }, [handleExchangeAmount, inAmount, exchangeRate, outCurrency, inCurrency]);

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal="customerAccount-currencyExchange"
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
                                <Descriptions.Item label="户口" span={12}>
                                    {accountInfo?.member_code}
                                </Descriptions.Item>
                                <Descriptions.Item label="户名" span={12}>
                                    {accountInfo?.member_name}
                                </Descriptions.Item>
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
                    },
                }}
                width={1100}
                request={async (params) => {
                    return Promise.resolve({
                        success: true,
                    });
                }}
                initialValues={updatedValues}
                formRef={formRef}
                visible={isPass}
            >
                <Row wrap={false}>
                    <Col span={10}>
                        <ProFormText
                            width="md"
                            name="member_code"
                            label="户口"
                            disabled
                        />
                        <ProFormText
                            width="md"
                            name="member_name"
                            label="户口"
                            disabled
                        />
                        <ProFormSelect
                            name="cash_in_currency_id"
                            label="币种"
                            width="md"
                            options={currencyList}
                            placeholder="请选择币种"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择币种',
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

                        <ProFormText
                            width="md"
                            name="exchange_rate_display"
                            label="汇率展示"
                            tooltip="选择兑入货币和兑出货币"
                            disabled
                            placeholder={''}
                        />
                        <ProFormSelect
                            name="cash_out_currency_id"
                            label="币种"
                            width="md"
                            options={currencyList}
                            placeholder="请选择币种"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择币种',
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
                        <ProFormTextArea
                            width="md"
                            name="remark"
                            label="备注"
                            placeholder="请输入备注s"
                        />
                    </Col>
                    <Col span={14}>
                        <ProFormText
                            width="md"
                            name="hall"
                            label="场馆"
                            disabled
                        />
                        <TradeTable></TradeTable>
                    </Col>
                </Row>
            </ModalForm>
        </div>
    );
};

export default CurrencyExchangeForm;
