import React, { FC, useRef, useState } from 'react';
import {
    ModalForm,
    ProFormText,
    ProFormSwitch,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { message, Button, Tabs, Row, Col } from 'antd';
import { useHttp } from '@/hooks';
import {
    updateAccountPassword,
    updateDtPassword,
    VerifyAccountPassword,
    VerifyDtPassword,
} from '@/api/account';
import {
    UpdateAccountPasswordParams,
    UpdateDtPasswordParams,
    VerifyAccountPasswordParams,
    VerifyDtPasswordParams,
} from '@/types/api/account';
import { ACCOUNT_AES_KEY } from '@/common/constants';
import { isInteger } from '@/utils/validate';
import { cryptoEncrypt } from '@/common/commonHandle';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { useGetAccountInfo } from '@/pages/AccountManagement/common';
import AuthButton from '@/components/AuthButton';

type SetPasswordProps = {};

const SetPassword: FC<SetPasswordProps> = () => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const formRef = useRef<ProFormInstance>();
    const [tabType, setTabType] = useState<string>('1');
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const callback = useGetAccountInfo();

    const { fetchData: _fetchDtPassword } = useHttp<
        UpdateDtPasswordParams,
        null
    >(updateDtPassword, ({ msg }) => {
        message.success(msg);
        callback();
    });

    const { fetchData: _fetchUpdateAccountPassword } = useHttp<
        UpdateAccountPasswordParams,
        null
    >(updateAccountPassword, ({ msg }) => {
        message.success(msg);
        callback();
    });

    const { fetchData: _fetchVerifyAccountPassword } = useHttp<
        VerifyAccountPasswordParams,
        boolean
    >(VerifyAccountPassword, ({ msg, data }) => {
        message.success(msg);
        formRef.current?.setFieldsValue({
            verifier_pass: data,
        });
    });

    const { fetchData: _fetchVerifyDtPassword } = useHttp<
        VerifyDtPasswordParams,
        boolean
    >(VerifyDtPassword, ({ msg, data }) => {
        message.success(msg);
        formRef.current?.setFieldsValue({
            verifier_pass: data,
        });
    });

    const handleTabType = (type: string) => {
        setTabType(type);
        formRef.current?.resetFields();
    };
    const handlePassword = async (values: any) => {
        if (!values.verifier_pass) {
            message.error('验证密码不通过，不能操作');
            return;
        }

        let params = {
            member_code: accountInfo.member_code,
            old_password: cryptoEncrypt(values.old_password, ACCOUNT_AES_KEY),
            new_password: cryptoEncrypt(values.new_password, ACCOUNT_AES_KEY),
            confirm_password: cryptoEncrypt(
                values.confirm_password,
                ACCOUNT_AES_KEY,
            ),
            opcode: values.opcode,
        };

        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        let res: any;
        if (tabType === '1') {
            res = await _fetchUpdateAccountPassword({
                ...doubleParams,
            });
        } else if (tabType === '2') {
            res = await _fetchDtPassword({
                ...doubleParams,
            });
        }

        if (res.code === 10000) {
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
        }
    };

    const handleVerify = () => {
        const oldPassword = formRef.current?.getFieldValue('old_password');
        if (!oldPassword) {
            message.error('请输入验证密码');
            return;
        }
        if (tabType === '1') {
            _fetchVerifyAccountPassword({
                member_code: accountInfo.member_code,
                password: cryptoEncrypt(oldPassword, ACCOUNT_AES_KEY),
            });
        }
        if (tabType === '2') {
            _fetchVerifyDtPassword({
                member_code: accountInfo.member_code,
                password: cryptoEncrypt(oldPassword, ACCOUNT_AES_KEY),
            });
        }
    };

    const CommonPassword = () => {
        return (
            <>
                <ProFormText.Password
                    width={256}
                    name="old_password"
                    label="验证密码"
                    placeholder="请输入验证密码"
                    fieldProps={{
                        maxLength: 6,
                        visibilityToggle: false,
                    }}
                    rules={[
                        {
                            required: true,
                            message: '请输入验证密码',
                        },
                    ]}
                    addonAfter={
                        <Row wrap={false}>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={() => handleVerify()}
                                >
                                    验证
                                </Button>
                            </Col>
                        </Row>
                    }
                />
                <ProFormText.Password
                    width="md"
                    name="new_password"
                    label="新密码"
                    placeholder="请输入6位数字新密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入6位数字新密码',
                        },
                        {
                            pattern: /^\d{6}$/,
                            message: '请输入6位数字',
                        },
                    ]}
                    fieldProps={{
                        maxLength: 6,
                        visibilityToggle: false,
                    }}
                />
                <ProFormText.Password
                    width="md"
                    name="confirm_password"
                    label="确认密码"
                    placeholder="请输入6位数字确认密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入6位数字确认密码',
                        },
                        {
                            pattern: /^\d{6}$/,
                            message: '请输入6位数字',
                        },
                    ]}
                    fieldProps={{
                        maxLength: 6,
                        visibilityToggle: false,
                    }}
                />
                <ProFormText
                    width="md"
                    name="opcode"
                    label="操作码"
                    placeholder="请输入操作码"
                    rules={[
                        {
                            required: true,
                            message: '请输入操作码',
                        },
                    ]}
                />
                <div
                    style={{
                        display: 'none',
                    }}
                >
                    <ProFormText width="md" name="verifier_pass" />
                </div>
            </>
        );
    };

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        buttonProps={{
                            type: 'primary',
                        }}
                        normal="customerAccount-resetPassword"
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        firstVisible={isPass}
                        isSecond={true}
                        secondDom="请确定是否要重置密码"
                        secondVerify={(val) => {
                            if (val) {
                                handleDoubleSuccess();
                            }
                        }}
                        secondVisible={doubleVisible}
                        secondOnClose={() => setDoubleVisible(false)}
                    >
                        重置密码
                    </AuthButton>
                }
                onFinish={handlePassword}
                title="重置密码"
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
                width={600}
                formRef={formRef}
                visible={isPass}
            >
                <Tabs
                    type="card"
                    activeKey={tabType}
                    onChange={(val) => handleTabType(val)}
                    destroyInactiveTabPane
                >
                    <Tabs.TabPane tab="取款/转账" key="1">
                        {CommonPassword()}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="线上登录" key="2">
                        {CommonPassword()}
                    </Tabs.TabPane>
                </Tabs>
            </ModalForm>
        </div>
    );
};

export default SetPassword;
