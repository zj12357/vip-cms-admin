import React, { FC, useRef, useState, useEffect } from 'react';
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
import { accountTrade, getDepositorList } from '@/api/account';
import { AccountTradeParams, DepositorListItem } from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import FormCurrency from '@/components/Currency/FormCurrency';
import usePrint from '@/hooks/usePrint';
import { OfficialDataProps } from '@/hooks/usePrint/print';
import { formatCurrency } from '@/utils/tools';
import { selectUserName } from '@/store/user/userSlice';
import AuthButton from '@/components/AuthButton';

type DepositFormProps = {};

const DepositForm: FC<DepositFormProps> = (props) => {
    const formRef = useRef<ProFormInstance>();
    const accountInfo = useAppSelector(selectAccountInfo);
    const currencyList = useAppSelector(selectCurrencyList);
    const currentHall = useAppSelector(selectCurrentHall);
    const userName = useAppSelector(selectUserName);
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const { RegisterPrint, handlePrint } =
        usePrint<OfficialDataProps>('Official');

    const { fetchData: _fetchAccountTrade } = useHttp<AccountTradeParams, null>(
        accountTrade,
        ({ msg }) => {
            message.success(msg);
        },
    );

    const { fetchData: _fetchDepositorList } = useHttp<
        string,
        DepositorListItem[]
    >(getDepositorList);

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        hall: currentHall.hall_name,
    }).current;
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
            type: 1,
        };
        setDoubleParams({
            ...doubleParams,
            ...params,
        });
        setDoubleVisible(true);
    };
    const handleDoubleSuccess = async () => {
        const res = await _fetchAccountTrade(doubleParams);

        if (res.code === 10000) {
            let data: any = res.data;
            handlePrint({
                name: doubleParams.member_name,
                account: doubleParams.member_code,
                type: '存款',
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
                        normal="customerAccount-deposit"
                        verify={(pass, auth) => {
                            setIsPass(pass);
                            setDoubleParams({
                                ...doubleParams,
                                first_auth: auth,
                            });
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
                title="存款"
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
                formRef={formRef}
                visible={isPass}
            >
                <Row wrap={false}>
                    <Col span={12}>
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
                            label="存款币种"
                            width="md"
                            options={currencyList.filter((item) =>
                                item?.permission?.includes('1'),
                            )}
                            placeholder="请选择存款币种"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择存款币种',
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
                            label="存款金额"
                            placeholder="请输入存款金额"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入存款金额',
                                },
                                {
                                    validator: async (rule, value) => {
                                        if (+value < 0) {
                                            return Promise.reject(
                                                '存款金额不能为负数',
                                            );
                                        } else {
                                            return true;
                                        }
                                    },
                                },
                            ]}
                        />

                        <Row justify="start" align="middle" wrap={false}>
                            <ProFormText
                                width={150}
                                name="trade_account"
                                label="存款人"
                                placeholder="请输入存款人"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入存款人',
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
                                    placeholder="请选择存款人"
                                    fieldProps={{
                                        getPopupContainer: (triggerNode) =>
                                            triggerNode.parentNode,
                                        onChange: (val, option) => {
                                            formRef.current?.setFieldsValue({
                                                trade_account: val,
                                            });
                                        },
                                    }}
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
                                    showSearch
                                />
                            </div>
                        </Row>

                        <ProFormTextArea
                            name="describe"
                            label="备注"
                            width="md"
                            placeholder="请输入备注"
                            fieldProps={{
                                maxLength: 100,
                            }}
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
            <RegisterPrint />
        </div>
    );
};

export default DepositForm;
