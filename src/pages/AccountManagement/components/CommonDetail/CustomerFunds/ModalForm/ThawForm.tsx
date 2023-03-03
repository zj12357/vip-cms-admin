import React, { FC, useRef, useState } from 'react';
import {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Button, message, Row, Col, Descriptions } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import { accountTrade } from '@/api/account';
import { AccountTradeParams } from '@/types/api/account';
import TradeTable from '@/pages/AccountManagement/components/TradeTable';
import FormCurrency from '@/components/Currency/FormCurrency';
import AuthButton from '@/components/AuthButton';
import { formatCurrency } from '@/utils/tools';

type ThawProps = {};

const ThawForm: FC<ThawProps> = (props) => {
    const formRef = useRef<ProFormInstance>();
    const currencyList = useAppSelector(selectCurrencyList);
    const accountInfo = useAppSelector(selectAccountInfo);
    const currentHall = useAppSelector(selectCurrentHall);
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        hall: currentHall.hall_name,
    }).current;

    const { fetchData: _fetchAccountTrade } = useHttp<AccountTradeParams, null>(
        accountTrade,
        ({ msg }) => {
            message.success(msg);
        },
    );

    const handleAccountTrade = async (values: any) => {
        const params = {
            member_id: accountInfo.member_id,
            member_code: accountInfo.member_code,
            member_name: accountInfo.member_name,
            currency_id: +values.currency_id,
            currency_code:
                currencyList.find((item) => +item.value === +values.currency_id)
                    ?.label ?? '',
            amount: values.amount,
            trade_account: values.trade_account,
            hall: currentHall.id,
            hall_name: currentHall.hall_name,
            describe: values.describe,
            type: 5,
        };
        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchAccountTrade(doubleParams);

        if (res.code === 10000) {
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
                        normal="customerAccount-thaw"
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
                onFinish={handleAccountTrade}
                title="解冻"
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
                width={1000}
                initialValues={updatedValues}
                request={async (params) => {
                    return Promise.resolve({
                        success: true,
                    });
                }}
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
                            label="户名"
                            disabled
                        />
                        <ProFormSelect
                            name="currency_id"
                            label="解冻币种"
                            width="md"
                            options={currencyList}
                            placeholder="请选择解冻币种"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择解冻币种',
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
                            label="解冻金额"
                            placeholder="请输入解冻金额"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入解冻金额',
                                },
                            ]}
                        />
                        <ProFormTextArea
                            width="md"
                            name="describe"
                            label="备注"
                            placeholder="请输入备注"
                            fieldProps={{
                                maxLength: 100,
                            }}
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

export default ThawForm;
