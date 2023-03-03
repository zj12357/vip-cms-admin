import React, { FC, useRef, useState } from 'react';
import {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Button, message, Row, Col, Descriptions } from 'antd';
import VerifierPassword from '@/pages/AccountManagement/components/VerifierPassword';
import { useHttp, useLatest } from '@/hooks';
import { accountTrade, getDepositorList } from '@/api/account';
import { AccountTradeParams, DepositorListItem } from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import TradeTable from '@/pages/AccountManagement/components/TradeTable';
import FormCurrency from '@/components/Currency/FormCurrency';
import AuthButton from '@/components/AuthButton';
import usePrint from '@/hooks/usePrint';
import { OfficialDataProps } from '@/hooks/usePrint/print';
import { selectUserName } from '@/store/user/userSlice';
import { formatCurrency } from '@/utils/tools';

type WithdrawProps = {};

const WithdrawForm: FC<WithdrawProps> = (props) => {
    const userName = useAppSelector(selectUserName);

    const { RegisterPrint, handlePrint } =
        usePrint<OfficialDataProps>('Official');

    const formRef = useRef<ProFormInstance>();

    const accountInfo = useAppSelector(selectAccountInfo);
    const currencyList = useAppSelector(selectCurrencyList);
    const currentHall = useAppSelector(selectCurrentHall);
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const { fetchData: _fetchAccountTrade } = useHttp<AccountTradeParams, null>(
        accountTrade,
        ({ msg }) => {
            message.success(msg);
        },
    );

    const { fetchData: _fetchDepositorList, response: depositorOptions } =
        useHttp<string, DepositorListItem[]>(getDepositorList);

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        hall: currentHall.hall_name,
    }).current;

    const handleAccountTrade = async (values: any) => {
        if (
            values.verifier_pass === undefined &&
            values.phone_verifier_pass === undefined
        ) {
            message.error('请先验证');
            return;
        }
        if (!(values.verifier_pass || values.phone_verifier_pass)) {
            message.error('验证不通过，不能操作');
            return;
        }

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
            type: 2,
        };

        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchAccountTrade(doubleParams);
        if (res.code === 10000) {
            let data: any = res.data;
            handlePrint({
                name: doubleParams.member_name,
                account: doubleParams.member_code,
                type: '取款',
                currency: doubleParams.currency_code,
                amountCapital: `${formatCurrency(doubleParams.amount) * 10000}`,
                amountCurrency: `${formatCurrency(doubleParams.amount)}万`,
                remark: doubleParams.describe,
                manager: userName,
                id: data.id,
            });
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
                        normal="customerAccount-withdraw"
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
                width={1100}
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
                            placeholder="请输入名称"
                            disabled
                        />
                        <ProFormText
                            width="md"
                            name="member_name"
                            label="户名"
                            placeholder="请输入名称"
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
                        <Row justify="start" align="middle" wrap={false}>
                            <ProFormText
                                width={150}
                                name="trade_account"
                                label="取款人"
                                placeholder="请输入取款人"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入取款人',
                                    },
                                ]}
                            />

                            <div
                                style={{
                                    marginLeft: '28px',
                                    position: 'relative',
                                    top: '16px',
                                }}
                            >
                                <ProFormSelect
                                    name="depositor"
                                    width={150}
                                    options={(depositorOptions as any) ?? []}
                                    placeholder="请选择取款人"
                                    fieldProps={{
                                        getPopupContainer: (triggerNode) =>
                                            triggerNode.parentNode,
                                        onChange: (val, option: any) => {
                                            formRef.current?.setFieldsValue({
                                                trade_account: option?.label,
                                            });
                                        },
                                    }}
                                    showSearch
                                    request={async () => {
                                        const res = await _fetchDepositorList(
                                            accountInfo.member_id,
                                        );
                                        return (res.data ?? []).map((item) => {
                                            return {
                                                label: item,
                                                value: item,
                                            };
                                        }) as any;
                                    }}
                                />
                            </div>
                        </Row>
                        <VerifierPassword
                            formRef={formRef}
                            for="取款"
                            identity_module={1}
                        ></VerifierPassword>
                        <ProFormTextArea
                            width="md"
                            name="describe"
                            label="备注"
                            placeholder="请输入名称"
                        />
                    </Col>
                    <Col span={14}>
                        <ProFormText
                            width="md"
                            name="hall"
                            label="操作场馆"
                            placeholder="请输入名称"
                            disabled
                        />
                        <TradeTable></TradeTable>
                    </Col>
                </Row>
            </ModalForm>
            <RegisterPrint />
        </div>
    );
};

export default WithdrawForm;
