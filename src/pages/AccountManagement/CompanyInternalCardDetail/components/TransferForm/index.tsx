import React, { FC, useRef, useState } from 'react';
import {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProForm,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Button, message, Row, Col, Descriptions } from 'antd';
import { useSearchParams, useParams } from 'react-router-dom';
import { useHttp, useLatest } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import {
    selectCurrencyList,
    selectCurrentHall,
    selectHallList,
} from '@/store/common/commonSlice';
import { tradeCompanyCard } from '@/api/account';
import { TradeCompanyCardParams } from '@/types/api/account';
import { internalCardType } from '@/common/commonConstType';
import FormCurrency from '@/components/Currency/FormCurrency';
import AuthButton from '@/components/AuthButton';
import { formatCurrency } from '@/utils/tools';

type TransferFormProps = {
    cardName: string;
    reloadData: () => void;
};

const TransferForm: FC<TransferFormProps> = ({ reloadData, cardName }) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentHall = useAppSelector(selectCurrentHall);
    const [selectHall, setSelectHall] = useState<number>();
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数
    const { id } = useParams<{ id: string }>();
    const formRef = useRef<ProFormInstance>();

    const updatedValues = useLatest({
        cardNumber: searchParams.get('cardNumber'),
        cardName: searchParams.get('cardName'),
        hall: currentHall.hall_name,
    }).current;

    const { fetchData: _fetchTradeCompanyCard } = useHttp<
        TradeCompanyCardParams,
        null
    >(tradeCompanyCard, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const handleTradeCompanyCard = async (values: any) => {
        const params = {
            company_card_code: id ?? '',
            hall_id: currentHall.id,
            hall_code: currentHall.hall_name,
            currency_id: values.currency_id,
            currency_code:
                currencyList.find((item) => item.value === values.currency_id)
                    ?.label ?? '',
            amount: values.amount,
            type: 3,
            in_company_card_code: values.in_company_card_code,
            hall_id_out: values.hall_id_out,
        };
        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const { code } = await _fetchTradeCompanyCard(doubleParams);
        if (code === 10000) {
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
        }
    };

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal="companyInternalCardDetail-transfer"
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
                                <Descriptions.Item label="场馆" span={12}>
                                    {hallList.find(
                                        (item) =>
                                            +item.value ===
                                            +doubleParams.hall_id_out,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="币种" span={12}>
                                    {currencyList.find(
                                        (item) =>
                                            +item.value ===
                                            +doubleParams.currency_id,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="金额" span={12}>
                                    {formatCurrency(doubleParams.amount)}万
                                </Descriptions.Item>
                                <Descriptions.Item label="卡名" span={12}>
                                    {internalCardType.find(
                                        (item) =>
                                            item.value ===
                                            doubleParams.in_company_card_code,
                                    )?.label ?? ''}
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
                onFinish={handleTradeCompanyCard}
                title="转账"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setIsPass(false);
                        setIsPass(false);
                        setDoubleVisible(false);
                        setDoubleParams({});
                    },
                }}
                initialValues={updatedValues}
                formRef={formRef}
                visible={isPass}
            >
                <Row wrap={false}>
                    <Col span={12}>
                        <ProFormText
                            width="md"
                            name="cardNumber"
                            label="卡号"
                            disabled
                        />
                        <ProFormText
                            width="md"
                            name="cardName"
                            label="卡名"
                            disabled
                        />

                        <ProFormSelect
                            name="hall_id_out"
                            label="转账场馆"
                            width="md"
                            options={hallList}
                            placeholder="请选择转账场馆"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择转账场馆',
                                },
                            ]}
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                                onSelect: (val: number) => {
                                    setSelectHall(val);
                                },
                            }}
                            showSearch
                        />

                        <ProFormSelect
                            name="currency_id"
                            label="转账币种"
                            width="md"
                            options={currencyList}
                            placeholder="请选择转账币种"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择转账币种',
                                },
                            ]}
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                            }}
                            showSearch
                        />
                        <FormCurrency
                            width="md"
                            name="amount"
                            label="转账金额"
                            placeholder="请输入转账金额"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入转账金额',
                                },
                            ]}
                        />
                        <ProFormSelect
                            name="in_company_card_code"
                            label="收款卡名"
                            width="md"
                            options={
                                selectHall === currentHall.id
                                    ? internalCardType.filter(
                                          (v) => v.value !== cardName,
                                      )
                                    : internalCardType
                            }
                            placeholder="请选择收款卡名"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择收款卡名',
                                },
                            ]}
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                            }}
                            showSearch
                        />

                        <ProForm.Item noStyle shouldUpdate>
                            {(form) => {
                                const value =
                                    internalCardType.find(
                                        (item) =>
                                            item.value ===
                                            form.getFieldValue(
                                                'in_company_card_code',
                                            ),
                                    )?.cardNumber ?? '';

                                return (
                                    <ProFormText
                                        width="md"
                                        name="in_company_card_name"
                                        label="收款卡号"
                                        disabled
                                        fieldProps={{
                                            value,
                                        }}
                                        placeholder=""
                                    />
                                );
                            }}
                        </ProForm.Item>
                    </Col>
                    <Col span={12}>
                        <ProFormText
                            width="md"
                            name="hall"
                            label="场馆"
                            disabled
                        />
                    </Col>
                </Row>
            </ModalForm>
        </div>
    );
};

export default TransferForm;
