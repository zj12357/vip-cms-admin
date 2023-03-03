import React, { FC, useEffect, useState, useMemo } from 'react';
import { Avatar, Button, Dropdown, Menu, Form, Input, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LogoutOutlined,
    CodeOutlined,
    LockOutlined,
    DownloadOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginOut, selectUserName } from '@/store/user/userSlice';
import {
    setDetailPageInfo,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import SetPassWord from '../SetPassWord';
import SetOpcode from '../SetOpcode';
import { useHttp, useNewWindow } from '@/hooks';
import { getMixList } from '@/api/account';
import { userLogout } from '@/api/user';
import { GetMixListParams, GetMixListType } from '@/types/api/account';
import _ from 'lodash';
import { randomNum, goExitFullscreen, goToFullScreen } from '@/utils/tools';
import './index.scoped.scss';
import CallModal from '@/pages/Communication/Telephone/CallModal';
import { tableListDataSource } from '@/pages/AccountManagement/CompanyInternalCard';

type HeaderProps = {};

const Header: FC<HeaderProps> = (props) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentHall = useAppSelector(selectCurrentHall);
    const userName = useAppSelector(selectUserName);
    const [installed, setInstalled] = useState(false);
    const [deferredPrompt, setDfeferredPrompt] = useState<any>();
    const [isFullscreen, setIsFullscreen] = useState<any>(
        (document?.exitFullscreen as any) ? false : true,
    );
    const { toNewWindow } = useNewWindow();

    const { fetchData: _fetchGetMixList } = useHttp<
        GetMixListParams,
        GetMixListType
    >(getMixList);

    const { fetchData: _fetchUserLogout } = useHttp<null, null>(
        userLogout,
        () => {
            message.success('退出成功');
            dispatch(loginOut());
            navigate('/user/login', {
                state: location.pathname,
            });
        },
    );

    const onFinish = async (values: any) => {
        const { code, data } = await _fetchGetMixList({
            member_code: values.member_code,
        });

        if (code === 10000 && isMoreList(data)) {
            toSearchListPage('/account/mixSearchList', values.member_code);
        } else {
            toDetailPage(data);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    //如果数据结构有一个是多个就去列表页
    const isMoreList = (values: GetMixListType) => {
        if (_.isArray(values.companyList) && values.companyList.length > 1) {
            return true;
        }
        if (_.isArray(values.memberList) && values.memberList.length > 1) {
            return true;
        }
        if (
            ((_.isArray(values.memberList) && values.memberList.length) ||
                (_.isArray(values.companyList) && values.companyList.length)) &&
            values.companyCardList.card_no
        ) {
            return true;
        }
        return false;
    };

    //单个去详情页
    const toDetailPage = (values: GetMixListType) => {
        if (
            _.isEmpty(values.companyList) &&
            _.isEmpty(values.memberList) &&
            values.companyCardList.card_no
        ) {
            toCardDetailPage(values);
        } else if (
            _.isArray(values.companyList) &&
            values.companyList?.length === 1 &&
            _.isEmpty(values.memberList) &&
            !values.companyCardList.card_no
        ) {
            toSearchListPage(
                '/account/companyAccountDetail',
                values.companyList[0].member_code,
            );
        } else if (
            _.isArray(values.memberList) &&
            values.memberList?.length === 1 &&
            _.isEmpty(values.companyList) &&
            !values.companyCardList.card_no
        ) {
            toSearchListPage(
                '/account/customerAccountDetail',
                values.memberList[0].member_code,
            );
        } else {
            message.error('搜索结果不存在');
        }
    };

    const toSearchListPage = (path: string, id: string) => {
        const backPath = location.pathname;
        dispatch(
            setDetailPageInfo({
                path: `${path}/${id}`,
                backPath,
                title: '返回上一级',
            }),
        );
        toNewWindow(`${path}/${id}`);
    };

    const toCardDetailPage = (value: GetMixListType) => {
        const backPath = location.pathname;
        const card = tableListDataSource.find(
            (item) => item.cardNumber === value.companyCardList.card_no,
        ) as any;
        dispatch(
            setDetailPageInfo({
                path: `/account/companyInternalCardDetail/${card.cardId}`,
                backPath,
                title: '返回上一级',
            }),
        );
        toNewWindow(
            `/account/companyInternalCardDetail/${card.cardId}?cardName=${card.cardName}&cardNumber=${card.cardNumber}`,
        );
    };

    const toStartPage = () => {
        navigate('/admission/list');
    };

    const installApp = async () => {
        if (deferredPrompt === null) {
            return;
        }
        //触发横幅显示
        deferredPrompt?.prompt();
        const { outcome } = await deferredPrompt?.userChoice;

        setDfeferredPrompt(null);

        if (outcome === 'accepted') {
            console.log('用户接受了安装提示');
        } else if (outcome === 'dismissed') {
            console.log('用户已取消安装提示');
        }
    };

    useEffect(() => {
        window.addEventListener('appinstalled', (e) => {
            console.log('已安装PWA', e);
            setInstalled(true);
            setDfeferredPrompt(null);
        });
        window.addEventListener('beforeinstallprompt', (e) => {
            // 阻止默认事件
            e.preventDefault();
            setDfeferredPrompt(e);
            return false;
        });
    }, []);

    const menu = (
        <Menu
            items={[
                !installed &&
                process.env.NODE_ENV === 'production' &&
                deferredPrompt
                    ? {
                          key: '1',
                          label: (
                              <span onClick={() => installApp()}>安装应用</span>
                          ),
                          icon: <DownloadOutlined />,
                      }
                    : null,
                {
                    key: '2',
                    label: (
                        <SetPassWord
                            trigger={<span>重置密码</span>}
                        ></SetPassWord>
                    ),
                    icon: <LockOutlined />,
                },
                {
                    key: '3',
                    label: (
                        <SetOpcode
                            trigger={<span>重置操作码</span>}
                        ></SetOpcode>
                    ),
                    icon: <CodeOutlined />,
                },
                {
                    key: '4',
                    label: (
                        <span onClick={() => _fetchUserLogout()}>退出系统</span>
                    ),
                    icon: <LogoutOutlined />,
                },
            ]}
        />
    );

    const HeaderAvatar = useMemo(() => {
        return (
            <Avatar
                size={28}
                src={require('@/assets/images/icons/logo-avatar.svg').default}
            />
        );
    }, []);
    return (
        <div className="m-header-box">
            <div className="m-header-search-commencement">
                <div className="m-header-hall m-primary-font-color">
                    场馆：{currentHall?.hall_name}
                </div>
                <div className="m-header-search intro-step2">
                    <Form
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        className="m-ant-form-inline"
                        style={{
                            transform: 'translateY(12px)',
                            display: 'flex',
                        }}
                    >
                        <Form.Item
                            name="member_code"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        '请输入户口名/户名/手机号/证件名进行查询',
                                },
                            ]}
                        >
                            <Input
                                placeholder="请输入户口名/户名/手机号/证件名进行查询"
                                style={{ width: '300px' }}
                            />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="m-commencement-btn">
                    <Button
                        className="intro-step3"
                        type="primary"
                        onClick={() => toStartPage()}
                    >
                        开工列表
                    </Button>
                    <CallModal
                        trigger={
                            <Button className="intro-step4" type="primary">
                                坐席
                            </Button>
                        }
                    />
                </div>
            </div>

            <div className="m-fullscreen">
                {isFullscreen ? (
                    <FullscreenExitOutlined
                        onClick={() => {
                            setIsFullscreen(false);
                            goExitFullscreen();
                        }}
                    />
                ) : (
                    <FullscreenOutlined
                        onClick={() => {
                            goToFullScreen();
                            setIsFullscreen(true);
                        }}
                    />
                )}
            </div>

            <Dropdown overlay={menu}>
                <div className="header-avatar intro-step5">
                    {HeaderAvatar}
                    <span className="header-user-name">{userName}</span>
                </div>
            </Dropdown>
        </div>
    );
};

export default Header;
