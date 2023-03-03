import React, { FC } from 'react';
import { RouteObject } from 'react-router-dom';
import Redirect from '../Redirect';
import { WrapperRouteComponent } from '../config';

const AccountCustomer = React.lazy(
    () => import('@/pages/AccountManagement/AccountCustomer'),
);
const AccountCompany = React.lazy(
    () => import('@/pages/AccountManagement/AccountCompany'),
);
const CustomerSearchList = React.lazy(
    () =>
        import('@/pages/AccountManagement/AccountCustomer/CustomerSearchList'),
);
const CompanySearchList = React.lazy(
    () => import('@/pages/AccountManagement/AccountCompany/CompanySearchList'),
);

const CustomerDetail = React.lazy(
    () => import('@/pages/AccountManagement/CustomerDetail'),
);

const CompanyDetail = React.lazy(
    () => import('@/pages/AccountManagement/CompanyDetail'),
);

const CompanyInternalCard = React.lazy(
    () => import('@/pages/AccountManagement/CompanyInternalCard'),
);

const CompanyInternalCardDetail = React.lazy(
    () => import('@/pages/AccountManagement/CompanyInternalCardDetail'),
);

const MixSearchList = React.lazy(
    () => import('@/pages/AccountManagement/MixSearchList'),
);

type AccountRouteProps = {};

const AccountRoute = (props: AccountRouteProps) => {
    const routeList: RouteObject[] = [
        {
            path: '/account',
            element: <Redirect to="/account/customer" />,
        },
        {
            path: '/account/customer',
            element: (
                <WrapperRouteComponent
                    element={<AccountCustomer {...props} />}
                    titleId="客户户口"
                    auth
                />
            ),
        },
        {
            path: '/account/company',
            element: (
                <WrapperRouteComponent
                    element={<AccountCompany {...props} />}
                    titleId="公司户口"
                    auth
                />
            ),
        },
        {
            path: '/account/customerAccountDetail/:id',
            element: (
                <WrapperRouteComponent
                    element={<CustomerDetail {...props} />}
                    titleId="客户户口详情"
                    auth
                />
            ),
        },
        {
            path: '/account/companyAccountDetail/:id',
            element: (
                <WrapperRouteComponent
                    element={<CompanyDetail {...props} />}
                    titleId="公司户口详情"
                    auth
                />
            ),
        },
        {
            path: '/account/customerSearchList/:id',
            element: (
                <WrapperRouteComponent
                    element={<CustomerSearchList {...props} />}
                    titleId="客户户口搜索列表"
                    auth
                />
            ),
        },
        {
            path: '/account/companySearchList/:id',
            element: (
                <WrapperRouteComponent
                    element={<CompanySearchList {...props} />}
                    titleId="公司户口搜索列表"
                    auth
                />
            ),
        },
        {
            path: '/account/companyInternalCard',
            element: (
                <WrapperRouteComponent
                    element={<CompanyInternalCard {...props} />}
                    titleId="公司内部卡"
                    auth
                />
            ),
        },
        {
            path: '/account/companyInternalCardDetail/:id',
            element: (
                <WrapperRouteComponent
                    element={<CompanyInternalCardDetail {...props} />}
                    titleId="公司内部卡详情"
                    auth
                />
            ),
        },
        {
            path: '/account/mixSearchList/:id',
            element: (
                <WrapperRouteComponent
                    element={<MixSearchList {...props} />}
                    titleId="搜索详情"
                    auth
                />
            ),
        },
    ];
    return routeList;
};

export default AccountRoute;
