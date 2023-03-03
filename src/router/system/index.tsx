import React, { FC } from 'react';
import { RouteObject } from 'react-router-dom';
import Redirect from '../Redirect';
import { WrapperRouteComponent } from '../config';

const DepartmentConfig = React.lazy(
    () => import('@/pages/SystemManagement/DepartmentConfig'),
);
const AccountConfig = React.lazy(
    () => import('@/pages/SystemManagement/AccountConfig'),
);
const MenuConfig = React.lazy(
    () => import('@/pages/SystemManagement/MenuConfig'),
);
const SystemConfig = React.lazy(
    () => import('@/pages/SystemManagement/SystemConfig'),
);

const VenueList = React.lazy(
    () => import('@/pages/SystemManagement/SystemConfig/VenueList'),
);
const VipList = React.lazy(
    () => import('@/pages/SystemManagement/SystemConfig/VipList'),
);
const AccountTypeList = React.lazy(
    () => import('@/pages/SystemManagement/SystemConfig/AccountTypeList'),
);
const AccountIdentityList = React.lazy(
    () => import('@/pages/SystemManagement/SystemConfig/AccountIdentityList'),
);
const CurrencyList = React.lazy(
    () => import('@/pages/SystemManagement/SystemConfig/CurrencyList'),
);
const ExchangeRateList = React.lazy(
    () => import('@/pages/SystemManagement/SystemConfig/ExchangeRateList'),
);

const IntegralList = React.lazy(
    () => import('@/pages/SystemManagement/SystemConfig/IntegralList'),
);

const CreditCfg = React.lazy(
    () => import('@/pages/SystemManagement/SystemConfig/CreditCfg'),
);

type SystemRouteProps = {};

const SystemRoute = (props: SystemRouteProps) => {
    const routeList: RouteObject[] = [
        {
            path: '/system',
            element: <Redirect to="/system/departmentConfig" />,
        },
        {
            path: '/system/departmentConfig',
            element: (
                <WrapperRouteComponent
                    element={<DepartmentConfig {...props} />}
                    titleId="部门配置"
                    auth
                />
            ),
        },
        {
            path: '/system/accountConfig',
            element: (
                <WrapperRouteComponent
                    element={<AccountConfig {...props} />}
                    titleId="账号配置"
                    auth
                />
            ),
        },
        {
            path: '/system/menuConfig',
            element: (
                <WrapperRouteComponent
                    element={<MenuConfig {...props} />}
                    titleId="菜单配置"
                    auth
                />
            ),
        },
        {
            path: '/system/systemConfig',
            element: (
                <WrapperRouteComponent
                    element={<SystemConfig {...props} />}
                    titleId="系统配置"
                    auth
                />
            ),
            children: [
                {
                    path: '/system/systemConfig/venueList',
                    element: (
                        <WrapperRouteComponent
                            element={<VenueList {...props} />}
                            titleId="场馆管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/system/systemConfig/vipList',
                    element: (
                        <WrapperRouteComponent
                            element={<VipList {...props} />}
                            titleId="VIP管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/system/systemConfig/accountTypeList',
                    element: (
                        <WrapperRouteComponent
                            element={<AccountTypeList {...props} />}
                            titleId="户口类型管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/system/systemConfig/accountIdentityList',
                    element: (
                        <WrapperRouteComponent
                            element={<AccountIdentityList {...props} />}
                            titleId="户口身份管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/system/systemConfig/currencyList',
                    element: (
                        <WrapperRouteComponent
                            element={<CurrencyList {...props} />}
                            titleId="货币管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/system/systemConfig/exchangeRateList',
                    element: (
                        <WrapperRouteComponent
                            element={<ExchangeRateList {...props} />}
                            titleId="汇率管理"
                            auth
                        />
                    ),
                },

                {
                    path: '/system/systemConfig/integralList',
                    element: (
                        <WrapperRouteComponent
                            element={<IntegralList {...props} />}
                            titleId="积分结算配置"
                            auth
                        />
                    ),
                },

                {
                    path: '/system/systemConfig/creditCfg',
                    element: (
                        <WrapperRouteComponent
                            element={<CreditCfg {...props} />}
                            titleId="信贷管理"
                            auth
                        />
                    ),
                },
            ],
        },
    ];
    return routeList;
};

export default SystemRoute;
