import React, { FC } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { message, Badge } from 'antd';
import { useHttp } from '@/hooks';
import {
    setAuthorizerPassword,
    updateAuthorizerPassword,
} from '@/api/accountAction';
import {
    SetAuthorizerPasswordParams,
    UpdateAuthorizerPasswordParams,
    AuthorizerListItem,
} from '@/types/api/accountAction';
import { ACCOUNT_AES_KEY } from '@/common/constants';
import { isInteger } from '@/utils/validate';
import { cryptoEncrypt } from '@/common/commonHandle';

type SetPasswordProps = {
    status: boolean;
    trigger: JSX.Element;
    reloadData: () => void;
    record: AuthorizerListItem;
};

const SetPassword: FC<SetPasswordProps> = ({
    status,
    trigger,
    reloadData,
    record,
}) => {
    const { fetchData: _fetchSetAuthorizerPassword } = useHttp<
        SetAuthorizerPasswordParams,
        null
    >(setAuthorizerPassword, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const { fetchData: _fetchUpdateAuthorizerPassword } = useHttp<
        UpdateAuthorizerPasswordParams,
        null
    >(updateAuthorizerPassword, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const newPassword = () => {
        return (
            <ProFormText.Password
                width="md"
                name="password"
                label="密码"
                placeholder="请输入6位数字密码"
                rules={[
                    {
                        required: true,
                        message: '请输入6位数字密码',
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
        );
    };
    const resetPassword = () => {
        return (
            <>
                <ProFormText.Password
                    width="md"
                    name="old_password"
                    label="旧密码"
                    placeholder="请输入6位数字旧密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入6位数字旧密码',
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
            </>
        );
    };

    const handlePassword = (values: any) => {
        if (status) {
            return _fetchUpdateAuthorizerPassword({
                authorizer_id: record.authorizer_id,
                old_password: cryptoEncrypt(
                    values.old_password,
                    ACCOUNT_AES_KEY,
                ),
                new_password: cryptoEncrypt(
                    values.new_password,
                    ACCOUNT_AES_KEY,
                ),
            });
        } else {
            return _fetchSetAuthorizerPassword({
                authorizer_id: record.authorizer_id,
                password: cryptoEncrypt(
                    values.password,
                    ACCOUNT_AES_KEY,
                ).toString(),
            });
        }
    };

    return (
        <div>
            <ModalForm
                trigger={trigger}
                onFinish={async (values: any) => {
                    let res = await handlePassword(values);
                    if (res?.code === 10000) {
                        return true;
                    }
                }}
                title={status ? '重置密码' : '设置密码'}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                width={300}
            >
                {status ? resetPassword() : newPassword()}
            </ModalForm>
        </div>
    );
};

export default SetPassword;
