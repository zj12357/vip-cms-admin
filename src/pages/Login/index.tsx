import React, { FC, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
    LoginFormPage,
    ProFormText,
    ProFormSelect,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectToken } from '@/store/user/userSlice';
import { login } from '@/store/user/userSlice';
import { useHttp } from '@/hooks';
import { userLogin } from '@/api/user';
import { getHallList } from '@/api/public';
import _ from 'lodash';
import { ADMIN_NAME } from '@/common/constants';
import { UserLoginParams, UserLoginType } from '@/types/api/user';
import { HallOptions } from '@/types/api/public';
import './index.scoped.scss';
import classNames from 'classnames';
import Loading from '@/components/Loading';
import registerIntro from '@/components/Intro';
import { VERSION } from '@/common/constants';

type LoginProps = {};

const Login: FC<LoginProps> = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectToken);

    const {
        fetchData: _fetchHallList,
        response: hallList = [],
        loading,
    } = useHttp<null, HallOptions[]>(getHallList);

    const { fetchData: _fetchUserLogin } = useHttp<
        UserLoginParams,
        UserLoginType
    >(userLogin);

    const onFinish = async (values: any) => {
        _fetchUserLogin(values).then((res) => {
            if (res.code === 10000) {
                message.success('登录成功');
                dispatch(login(res.data));
                _.delay(() => {
                    navigate((location.state as string) || '/', {
                        replace: true,
                    });
                    // 新用户引导
                    // if (!localStorage.getItem('_loginFlag')) {
                    //     localStorage.setItem('_loginFlag', '1');
                    //     registerIntro().start();
                    // }
                }, 100);
            }
        });
    };

    useEffect(() => {
        if (location.pathname === '/user/login' && token) {
            navigate('/', { replace: true });
        }
    }, [location.pathname, navigate, token]);

    useEffect(() => {
        _fetchHallList();
    }, [_fetchHallList]);

    return (
        <div
            style={{
                height: '100%',
            }}
            className="m-login-box"
        >
            <LoginFormPage
                backgroundImageUrl={
                    require('@/assets/images/common/login-bg.png').default
                }
                logo={require('@/assets/images/common/login-logo.png').default}
                title={ADMIN_NAME}
                subTitle={`综合管理系统-${
                    process.env.REACT_APP_TAG ?? VERSION
                }`}
                onFinish={onFinish}
                className={classNames({
                    'login-form-box': _.isEmpty(hallList),
                })}
            >
                {loading ? (
                    <Loading></Loading>
                ) : hallList?.length > 0 ? (
                    <div>
                        <ProFormSelect
                            name="hall_id"
                            placeholder="请选择场馆"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择场馆!',
                                },
                            ]}
                            options={(hallList ?? []) as any}
                            fieldProps={{
                                size: 'large',
                                fieldNames: {
                                    label: 'hall_name',
                                    value: 'id',
                                },
                                showSearch: true,
                            }}
                        ></ProFormSelect>
                        <ProFormText
                            name="login_name"
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <UserOutlined className={'prefixIcon'} />
                                ),
                            }}
                            placeholder="请输入用户名"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <LockOutlined className={'prefixIcon'} />
                                ),
                                visibilityToggle: false,
                            }}
                            placeholder="请输入密码"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                        />
                    </div>
                ) : (
                    <div className="ip-tips">
                        您当前的IP没有权限，请联系IT申请白名单！
                    </div>
                )}
            </LoginFormPage>
        </div>
    );
};
export default Login;
