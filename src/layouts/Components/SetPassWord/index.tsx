import React, { FC } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { isInteger } from '@/utils/validate';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHttp } from '@/hooks';
import { userUpdatePassWord, userLogout } from '@/api/user';
import { UserUpdatePassWordParams } from '@/types/api/user';
import { useAppDispatch } from '@/store/hooks';
import { loginOut } from '@/store/user/userSlice';

type SetPasswordProps = {
    trigger: JSX.Element;
};

const SetPassword: FC<SetPasswordProps> = ({ trigger }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { fetchData: _fetchUserUpdatePassWord } = useHttp<
        UserUpdatePassWordParams,
        null | string
    >(userUpdatePassWord);

    const { fetchData: _fetchUserLogout } = useHttp<null, null>(
        userLogout,
        () => {
            message.success('修改密码成功，请重新登录');
            dispatch(loginOut());
            navigate('/user/login', {
                state: location.pathname,
            });
        },
    );

    const handleUserUpdatePassWord = async (values: any) => {
        const res = await _fetchUserUpdatePassWord({
            password: values.password,
            type: 1,
        });
        if (res.code === 10000) {
            message.success(res.msg);
            _fetchUserLogout();
            return true;
        }
    };

    return (
        <div>
            <ModalForm
                trigger={trigger}
                onFinish={handleUserUpdatePassWord}
                title="重置密码"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                width={300}
            >
                <ProFormText.Password
                    width="md"
                    name="password"
                    placeholder="请输入密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码',
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
            </ModalForm>
        </div>
    );
};

export default SetPassword;
