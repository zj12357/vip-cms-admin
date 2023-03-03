import React, { FC, useEffect } from 'react';
import { message, Row, Col, Button } from 'antd';
import { useAppSelector } from '@/store/hooks';
import {
    selectAuthorizerInfo,
    selectAccountType,
    selectAccountInfo,
} from '@/store/account/accountSlice';
import { useHttp } from '@/hooks';
import { verifyAuthorizerPassword, VerifyAccountPassword } from '@/api/account';
import {
    VerifyAuthorizerPasswordParams,
    VerifyAccountPasswordParams,
} from '@/types/api/account';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormText, ProFormSwitch } from '@ant-design/pro-components';
import Verifier from '@/pages/AccountManagement/components/Verifier';
import PhoneVerification from '@/pages/AccountManagement/components/PhoneVerification';
import { cryptoEncrypt } from '@/common/commonHandle';
import { ACCOUNT_AES_KEY } from '@/common/constants';

type VerifierPasswordProps = {
    formRef: React.MutableRefObject<ProFormInstance<any> | undefined>;
    for: string;
    identity_module: number;
    member_id?: string;
};

const VerifierPassword: FC<VerifierPasswordProps> = ({
    formRef,
    for: why,
    identity_module,
    member_id,
}) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const accountType = useAppSelector(selectAccountType);
    const authorizerInfo = useAppSelector(selectAuthorizerInfo);
    const { fetchData: _fetchVerifyAuthorizerPassword } = useHttp<
        VerifyAuthorizerPasswordParams,
        boolean
    >(verifyAuthorizerPassword, ({ msg }) => {
        message.success(msg);
    });

    const { fetchData: _fetchVerifyAccountPassword } = useHttp<
        VerifyAccountPasswordParams,
        boolean
    >(VerifyAccountPassword, ({ msg, data }) => {
        message.success('验证通过');
        formRef.current?.setFieldsValue({
            verifier_pass: !!data,
        });
    });

    const handleAccountVerify = async () => {
        if (!formRef.current?.getFieldValue('authorizer_name')) {
            message.error('请先选择验证人');
            return;
        }
        if (!formRef.current?.getFieldValue('authorizer_password')) {
            message.error('请输入验证密码');
            return;
        }

        const { data } = await _fetchVerifyAuthorizerPassword({
            authorizer_id: authorizerInfo.authorizer_id,
            password: cryptoEncrypt(
                formRef.current?.getFieldValue('authorizer_password'),
                ACCOUNT_AES_KEY,
            ),
            identity_module,
            member_code: accountInfo.member_code,
        });
        formRef.current?.setFieldsValue({
            verifier_pass: !!data,
        });
    };

    const handleCompanyVerify = async () => {
        const password = formRef.current?.getFieldValue('password');
        if (!password) {
            message.error('请输入验证密码');
            return;
        }
        const { data } = await _fetchVerifyAccountPassword({
            member_code: accountInfo.member_code,
            password: cryptoEncrypt(password, ACCOUNT_AES_KEY),
        });
        formRef.current?.setFieldsValue({
            verifier_pass: !!data,
        });
    };

    useEffect(() => {
        if (authorizerInfo.authorizer_name) {
            formRef.current?.setFieldsValue({
                authorizer_name: authorizerInfo.authorizer_name,
            });
        }
    }, [authorizerInfo.authorizer_name, formRef]);
    return (
        <div>
            <>
                <ProFormText
                    width={220}
                    name="authorizer_name"
                    label="验证人"
                    placeholder="请选择验证人"
                    disabled
                    addonAfter={<Verifier member_id={member_id}></Verifier>}
                />

                <ProFormText.Password
                    width={200}
                    name="authorizer_password"
                    label="验证密码"
                    placeholder="请输入验证密码"
                    fieldProps={{
                        maxLength: 6,
                        visibilityToggle: false,
                    }}
                    addonAfter={
                        <Row wrap={false}>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={() => handleAccountVerify()}
                                >
                                    现场验证
                                </Button>
                            </Col>
                            <Col offset={2}>
                                <PhoneVerification
                                    for={why}
                                    form={formRef}
                                    identity_module={identity_module}
                                ></PhoneVerification>
                            </Col>
                        </Row>
                    }
                />
            </>

            <div
                style={{
                    display: 'none',
                }}
            >
                <ProFormSwitch name="verifier_pass" />
            </div>
            <div
                style={{
                    display: 'none',
                }}
            >
                <ProFormSwitch name="phone_verifier_pass" />
            </div>
        </div>
    );
};

export default VerifierPassword;
