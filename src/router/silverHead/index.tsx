import React, { FC } from 'react';
import { RouteObject } from 'react-router-dom';
import Redirect from '../Redirect';
import { WrapperRouteComponent } from '../config';

const Overview = React.lazy(
    () => import('@/pages/SilverHeadManagement/Overview'),
);
const ChipManagement = React.lazy(
    () => import('@/pages/SilverHeadManagement/Overview/ChipManagement'),
);
const ChipSetting = React.lazy(
    () => import('@/pages/SilverHeadManagement/Overview/ChipSetting'),
);
const SilverOverview = React.lazy(
    () => import('@/pages/SilverHeadManagement/Overview/SilverOverview'),
);
const MonthlyRecord = React.lazy(
    () => import('@/pages/SilverHeadManagement/MonthlyRecord'),
);
const BuyRecord = React.lazy(
    () => import('@/pages/SilverHeadManagement/BuyRecord'),
);
const ShiftRecord = React.lazy(
    () => import('@/pages/SilverHeadManagement/ShiftRecord'),
);
const All = React.lazy(() => import('@/pages/SilverHeadManagement/All'));
type SilverHeadRouteProps = {};

const SilverHeadRoute = (props: SilverHeadRouteProps) => {
    const routeList: RouteObject[] = [
        {
            path: '/silverHead',
            element: <Redirect to="/silverHead/overview" />,
        },
        {
            path: '/silverHead/overview',
            element: (
                <WrapperRouteComponent
                    element={<Overview {...props} />}
                    titleId="银头概况"
                    auth
                />
            ),
            children: [
                {
                    path: '/silverHead/overview/overview',
                    element: (
                        <WrapperRouteComponent
                            element={<SilverOverview {...props} />}
                            titleId="银头概况"
                            auth
                        />
                    ),
                },
                {
                    path: '/silverHead/overview/chipSetting',
                    element: (
                        <WrapperRouteComponent
                            element={<ChipSetting {...props} />}
                            titleId="场馆筹码配置"
                            auth
                        />
                    ),
                },
                {
                    path: '/silverHead/overview/chipManagement',
                    element: (
                        <WrapperRouteComponent
                            element={<ChipManagement {...props} />}
                            titleId="场馆筹码管理"
                            auth
                        />
                    ),
                },
            ],
        },

        {
            path: '/silverHead/shiftRecord',
            element: (
                <WrapperRouteComponent
                    element={<ShiftRecord {...props} />}
                    titleId="交班记录"
                    auth
                />
            ),
        },
        {
            path: '/silverHead/monthlyRecord',
            element: (
                <WrapperRouteComponent
                    element={<MonthlyRecord {...props} />}
                    titleId="月结记录"
                    auth
                />
            ),
        },
        {
            path: '/silverHead/buyRecord',
            element: (
                <WrapperRouteComponent
                    element={<BuyRecord {...props} />}
                    titleId="大场买码记录"
                    auth
                />
            ),
        },
        {
            path: '/silverHead/all',
            element: (
                <WrapperRouteComponent
                    element={<All {...props} />}
                    titleId="全部银头概览"
                    auth
                />
            ),
        },
    ];
    return routeList;
};

export default SilverHeadRoute;
