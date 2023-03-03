import React from 'react';
import { RouteObject } from 'react-router-dom';
import Redirect from '../Redirect';
import { WrapperRouteComponent } from '../config';

const EBetSetup = React.lazy(() => import('@/pages/EBetManagement/Setup'));

const DeskOverview = React.lazy(
    () => import('@/pages/EBetManagement/Setup/DeskOverview'),
);

const Gamble = React.lazy(() => import('@/pages/EBetManagement/Setup/Gamble'));

const BetManage = React.lazy(
    () => import('@/pages/EBetManagement/Setup/BetManage'),
);

const Announce = React.lazy(
    () => import('@/pages/EBetManagement/Setup/Announce'),
);

const Archive = React.lazy(
    () => import('@/pages/EBetManagement/Setup/Archive'),
);

const AgentPhone = React.lazy(
    () => import('@/pages/EBetManagement/Setup/AgentPhone'),
);

const Better = React.lazy(() => import('@/pages/EBetManagement/Setup/Better'));

const BetterReport = React.lazy(
    () => import('@/pages/EBetManagement/Setup/BetterReport'),
);

const DeskLimit = React.lazy(
    () => import('@/pages/EBetManagement/Setup/DeskLimit'),
);

const DeskConfig = React.lazy(
    () => import('@/pages/EBetManagement/Setup/DeskConfig'),
);

const UserLimitConfig = React.lazy(
    () => import('@/pages/EBetManagement/Setup/UserLimitConfig'),
);

const CommissionConfig = React.lazy(
    () => import('@/pages/EBetManagement/Setup/CommissionConfig'),
);

const ChipConfig = React.lazy(
    () => import('@/pages/EBetManagement/Setup/ChipConfig'),
);

const BaseConfig = React.lazy(
    () => import('@/pages/EBetManagement/Setup/BaseConfig'),
);

const TopAgentLimit = React.lazy(
    () => import('@/pages/EBetManagement/Setup/TopAgentLimit'),
);

type EBetRouteProps = {};

const EBetRoute = (props: EBetRouteProps) => {
    const routeList: RouteObject[] = [
        {
            path: '/eBet',
            element: <Redirect to="/eBet/setup" />,
        },
        {
            path: '/eBet/setup',
            element: (
                <WrapperRouteComponent
                    element={<EBetSetup {...props} />}
                    titleId="电投设置"
                    auth
                />
            ),
            children: [
                {
                    path: '/eBet/setup/deskOverview',
                    element: (
                        <WrapperRouteComponent
                            element={<DeskOverview {...props} />}
                            titleId="桌台即时概况"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/gamble',
                    element: (
                        <WrapperRouteComponent
                            element={<Gamble {...props} />}
                            titleId="局管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/betManage',
                    element: (
                        <WrapperRouteComponent
                            element={<BetManage {...props} />}
                            titleId="注单管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/announce',
                    element: (
                        <WrapperRouteComponent
                            element={<Announce {...props} />}
                            titleId="公告管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/archive',
                    element: (
                        <WrapperRouteComponent
                            element={<Archive {...props} />}
                            titleId="提案管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/agentPhone',
                    element: (
                        <WrapperRouteComponent
                            element={<AgentPhone {...props} />}
                            titleId="代理电话配置"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/better',
                    element: (
                        <WrapperRouteComponent
                            element={<Better {...props} />}
                            titleId="电投手管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/betterReport',
                    element: (
                        <WrapperRouteComponent
                            element={<BetterReport {...props} />}
                            titleId="电投手开工报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/deskLimit',
                    element: (
                        <WrapperRouteComponent
                            element={<DeskLimit {...props} />}
                            titleId="桌台限红管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/deskConfig',
                    element: (
                        <WrapperRouteComponent
                            element={<DeskConfig {...props} />}
                            titleId="桌台参数设置"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/userLimitConfig',
                    element: (
                        <WrapperRouteComponent
                            element={<UserLimitConfig {...props} />}
                            titleId="用户限红参数管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/commissionConfig',
                    element: (
                        <WrapperRouteComponent
                            element={<CommissionConfig {...props} />}
                            titleId="转码参数管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/chipConfig',
                    element: (
                        <WrapperRouteComponent
                            element={<ChipConfig {...props} />}
                            titleId="筹码参数管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/baseConfig',
                    element: (
                        <WrapperRouteComponent
                            element={<BaseConfig {...props} />}
                            titleId="基础数据管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/eBet/setup/topAgentLimit',
                    element: (
                        <WrapperRouteComponent
                            element={<TopAgentLimit {...props} />}
                            titleId="一级代理限红配置"
                            auth
                        />
                    ),
                },
            ],
        },
    ];
    return routeList;
};

export default EBetRoute;
