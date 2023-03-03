import React, { FC, useState, Suspense, useEffect } from 'react';
import type { ProSettings } from '@ant-design/pro-components';
import {
    PageContainer,
    ProLayout,
    SettingDrawer,
} from '@ant-design/pro-components';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
    selectDetailPageInfo,
    selectDetailPageMenuList,
    setSecondRouteInfo,
    setThirdRouteInfo,
} from '@/store/common/commonSlice';
import { selectMenuList } from '@/store/user/userSlice';
import Loading from '@/components/Loading';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import _ from 'lodash';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import { menuRoute } from '@/config/route';
import proSettings from '@/config/defaultSettings';
import './index.scoped.scss';
import { ADMIN_NAME, ADMIN_ENV } from '@/common/constants';
import { findMenuType, findPageType } from '@/common/commonHandle';

type BasicLayoutProps = {};

const BasicLayout: FC<BasicLayoutProps> = (props) => {
    const [settings, setSetting] = useState<Partial<ProSettings> | undefined>(
        proSettings,
    );

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const detailPagInfo = useAppSelector(selectDetailPageInfo);
    const detailPageMenuList = useAppSelector(selectDetailPageMenuList);
    const menuList = useAppSelector(selectMenuList);

    //获取左边导航的菜单,本地调试可以使用menuRoute
    const leftMenuList = findMenuType(menuList, [], 'L', 'children');

    const handleThirdRouteInfo = (path: string) => {
        //获取页面内导航的菜单
        const pageMenuList = findPageType(menuList, path, 'children', true);
        //二级菜单默认跳转第一个页面
        const redirect = pageMenuList?.[0]?.path;

        const hasThirdChildrenMenu = pageMenuList?.[0]?.children;

        //设置三级菜单
        dispatch(
            setThirdRouteInfo({
                parentPath: path,
                routeList: pageMenuList,
            }),
        );
        //页面默认跳转如果有四级菜单就用四级里面的第一个，否则就是用三级菜单里面的第一个
        if (hasThirdChildrenMenu?.length) {
            _.delay(() => {
                redirect &&
                    navigate({ pathname: hasThirdChildrenMenu?.[0]?.path });
            }, 100);
        } else {
            _.delay(() => {
                redirect && navigate({ pathname: redirect });
            }, 100);
        }
    };

    return (
        <div
            id="m-pro-layout"
            style={{
                height: '100vh',
            }}
        >
            <ProLayout
                route={
                    location.pathname === detailPagInfo.path
                        ? detailPageMenuList
                        : leftMenuList
                }
                {...settings}
                location={{
                    pathname: location.pathname,
                }}
                fixSiderbar
                fixedHeader
                title=""
                logo={
                    require('@/assets/images/icons/logo-large-icon.svg').default
                }
                menuFooterRender={(props) => {
                    return (
                        <div className="layout-footer">
                            <img
                                alt="logo"
                                src={
                                    require('@/assets/images/icons/logo-icon.svg')
                                        .default
                                }
                                className="layout-footer-logo"
                            />
                            <span>{!props?.collapsed && ADMIN_NAME}</span>
                        </div>
                    );
                }}
                menuContentRender={(props, dom) => (
                    <div className="menu-content">
                        <span className="intro-step1">{dom}</span>
                    </div>
                )}
                onMenuHeaderClick={() => navigate('/')}
                menuItemRender={(item, dom) => (
                    <div
                        onClick={() => {
                            handleThirdRouteInfo(item.path ?? '');
                            navigate(item.path ?? '/404');
                        }}
                    >
                        {dom}
                    </div>
                )}
                rightContentRender={() => <Header></Header>}
                menuHeaderRender={(logo, title, props) => {
                    if (location.pathname !== detailPagInfo.path) {
                        return (
                            <div>
                                {logo}
                                {title}
                            </div>
                        );
                    }
                    if (props?.collapsed) {
                        return (
                            <Space>
                                <LeftOutlined
                                    style={{
                                        fontSize: 18,
                                        color: '#fff',
                                    }}
                                />
                            </Space>
                        );
                    }
                    return (
                        <Space direction="vertical">
                            <Button
                                icon={<LeftOutlined />}
                                onClick={() => {
                                    _.delay(() => {
                                        navigate(detailPagInfo.backPath ?? -1);
                                    }, 100);
                                }}
                            >
                                {detailPagInfo.title}
                            </Button>
                        </Space>
                    );
                }}
            >
                <PageContainer
                    header={{
                        breadcrumbRender: (props: any) => {
                            return (
                                <div className="header-breadcrumb">
                                    {props?.currentMenu?.locale
                                        ?.split('.')
                                        ?.slice(1)
                                        ?.join('/')}
                                </div>
                            );
                        },
                    }}
                >
                    <Suspense fallback={<Loading />}>
                        <Outlet></Outlet>
                    </Suspense>
                </PageContainer>
            </ProLayout>
            {ADMIN_ENV !== 'production' && (
                <SettingDrawer
                    pathname={location.pathname}
                    enableDarkTheme
                    getContainer={() => document.getElementById('m-pro-layout')}
                    settings={settings}
                    onSettingChange={(changeSetting) => {
                        setSetting(changeSetting);
                    }}
                    disableUrlParams={false}
                    colorList={[
                        {
                            key: 'daybreak',
                            color: '#181818',
                        },
                    ]}
                    hideHintAlert
                    hideCopyButton
                />
            )}
        </div>
    );
};

export default BasicLayout;
