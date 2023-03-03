import React, { FC, useState } from 'react';
import {
    ModalForm,
    ProFormText,
    ProFormSelect,
} from '@ant-design/pro-components';
import { Button, message, Row, Col, Descriptions } from 'antd';
import { useSearchParams, useParams } from 'react-router-dom';
import { useHttp, useLatest } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import { tradeCompanyCard } from '@/api/account';
import { TradeCompanyCardParams } from '@/types/api/account';
import FormCurrency from '@/components/Currency/FormCurrency';
import AuthButton from '@/components/AuthButton';
import { formatCurrency } from '@/utils/tools';

type WithdrawFormProps = {
    cardName: string;
    reloadData: () => void;
};

const WithdrawForm: FC<WithdrawFormProps> = ({ reloadData }) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentHall = useAppSelector(selectCurrentHall);
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数
    const { id } = useParams<{ id: string }>();

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
            type: 2,
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
                        normal="companyInternalCardDetail-withdraw"
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
                title="取款"
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
                initialValues={updatedValues}
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
                            name="currency_id"
                            label="取款币种"
                            width="md"
                            options={currencyList}
                            placeholder="请选择取款币种"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择取款币种',
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
                            label="取款金额"
                            placeholder="请输入取款金额"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入取款金额',
                                },
                            ]}
                        />
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

export default WithdrawForm;
