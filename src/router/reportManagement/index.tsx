import React, { FC } from 'react';
import { RouteObject } from 'react-router-dom';
import Redirect from '../Redirect';
import { WrapperRouteComponent } from '../config';
import Circle from '@/pages/ReportManagement/Accounting/Circle';

const Market = React.lazy(() => import('@/pages/ReportManagement/Market'));
const AccountOpening = React.lazy(
    () => import('@/pages/ReportManagement/Market/AccountOpening'),
);
const AccountInformation = React.lazy(
    () => import('@/pages/ReportManagement/Market/AccountInformation'),
);
const Customer = React.lazy(
    () => import('@/pages/ReportManagement/Market/Customer'),
);
const Finance = React.lazy(
    () => import('@/pages/ReportManagement/Market/Finance'),
);
const UpDown = React.lazy(
    () => import('@/pages/ReportManagement/Market/UpDown'),
);
const UpDownDetail = React.lazy(
    () => import('@/pages/ReportManagement/Market/UpDownDetail'),
);
const Operating = React.lazy(
    () => import('@/pages/ReportManagement/Market/Operating'),
);
const Maker = React.lazy(() => import('@/pages/ReportManagement/Market/Maker'));
const Transcoding = React.lazy(
    () => import('@/pages/ReportManagement/Market/Transcoding'),
);
const TranscodingSearch = React.lazy(
    () => import('@/pages/ReportManagement/Market/TranscodingSearch'),
);
const TranscodingDetail = React.lazy(
    () => import('@/pages/ReportManagement/Market/TranscodingDetail'),
);

// 记录管理
const Accounting = React.lazy(
    () => import('@/pages/ReportManagement/Accounting'),
);

const MonthlyStatement = React.lazy(
    () =>
        import(
            '@/pages/ReportManagement/Accounting/Commission/MonthlyStatement'
        ),
);
const OutgoingRecord = React.lazy(
    () =>
        import('@/pages/ReportManagement/Accounting/Commission/OutgoingRecord'),
);
const TranscodingRecord = React.lazy(
    () =>
        import(
            '@/pages/ReportManagement/Accounting/Commission/TranscodingRecord'
        ),
);
const CreditLimit = React.lazy(
    () => import('@/pages/ReportManagement/Accounting/CreditLimit'),
);
const BatchOperation = React.lazy(
    () => import('@/pages/ReportManagement/Accounting/BatchOperation'),
);
const AccountInquiry = React.lazy(
    () => import('@/pages/ReportManagement/Accounting/AccountInquiry'),
);
const AccountRemarks = React.lazy(
    () => import('@/pages/ReportManagement/Accounting/AccountRemarks'),
);

type ReportManagementRouteProps = {};

const ReportManagementRoute = (props: ReportManagementRouteProps) => {
    const routeList: RouteObject[] = [
        {
            path: '/reportManagement',
            element: <Redirect to="/reportManagement/market/accountOpening" />,
        },
        {
            path: '/reportManagement/market',
            element: (
                <WrapperRouteComponent
                    element={<Market {...props} />}
                    titleId="市场报表"
                    auth
                />
            ),
            children: [
                {
                    path: '/reportManagement/market/accountOpening',
                    element: (
                        <WrapperRouteComponent
                            element={<AccountOpening {...props} />}
                            titleId="开户报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/market/accountInformation',
                    element: (
                        <WrapperRouteComponent
                            element={<AccountInformation {...props} />}
                            titleId="户口资料报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/market/customer',
                    element: (
                        <WrapperRouteComponent
                            element={<Customer {...props} />}
                            titleId="客户报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/market/finance',
                    element: (
                        <WrapperRouteComponent
                            element={<Finance {...props} />}
                            titleId="存取款报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/market/upDown',
                    element: (
                        <WrapperRouteComponent
                            element={<UpDown {...props} />}
                            titleId="上下数报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/market/upDownDetail',
                    element: (
                        <WrapperRouteComponent
                            element={<UpDownDetail {...props} />}
                            titleId="上下数明细报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/market/operating',
                    element: (
                        <WrapperRouteComponent
                            element={<Operating {...props} />}
                            titleId="营运数报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/market/maker',
                    element: (
                        <WrapperRouteComponent
                            element={<Maker {...props} />}
                            titleId="M报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/market/transcoding',
                    element: (
                        <WrapperRouteComponent
                            element={<Transcoding {...props} />}
                            titleId="转码报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/market/transcodingSearch',
                    element: (
                        <WrapperRouteComponent
                            element={<TranscodingSearch {...props} />}
                            titleId="转码查询报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/market/transcodingDetail',
                    element: (
                        <WrapperRouteComponent
                            element={<TranscodingDetail {...props} />}
                            titleId="转码明细报表"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/market/circle',
                    element: (
                        <WrapperRouteComponent
                            element={<Circle {...props} />}
                            titleId="围数报表"
                            auth
                        />
                    ),
                },
            ],
        },

        {
            path: '/reportManagement/accounting',
            element: (
                <WrapperRouteComponent
                    element={<Accounting {...props} />}
                    titleId="记录管理"
                    auth
                />
            ),
            children: [
                {
                    path: '/reportManagement/accounting/commission',
                    children: [
                        {
                            path: '/reportManagement/accounting/commission/transcodingRecord',
                            element: (
                                <WrapperRouteComponent
                                    element={<TranscodingRecord {...props} />}
                                    titleId="转码记录"
                                    auth
                                />
                            ),
                        },
                        {
                            path: '/reportManagement/accounting/commission/outgoingRecord',
                            element: (
                                <WrapperRouteComponent
                                    element={<OutgoingRecord {...props} />}
                                    titleId="即出记录"
                                    auth
                                />
                            ),
                        },
                        {
                            path: '/reportManagement/accounting/commission/monthlyStatement',
                            element: (
                                <WrapperRouteComponent
                                    element={<MonthlyStatement {...props} />}
                                    titleId="月结明细"
                                    auth
                                />
                            ),
                        },
                    ],
                },
                {
                    path: '/reportManagement/accounting/commission/transcodingRecord',
                    element: (
                        <WrapperRouteComponent
                            element={<TranscodingRecord {...props} />}
                            titleId="转码记录"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/accounting/creditLimit',
                    element: (
                        <WrapperRouteComponent
                            element={<CreditLimit {...props} />}
                            titleId="信贷额度记录"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/accounting/batchOperation',
                    element: (
                        <WrapperRouteComponent
                            element={<BatchOperation {...props} />}
                            titleId="批额操作记录"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/accounting/accountInquiry',
                    element: (
                        <WrapperRouteComponent
                            element={<AccountInquiry {...props} />}
                            titleId="户口验证记录"
                            auth
                        />
                    ),
                },
                {
                    path: '/reportManagement/accounting/accountRemarks',
                    element: (
                        <WrapperRouteComponent
                            element={<AccountRemarks {...props} />}
                            titleId="户口备注查询"
                            auth
                        />
                    ),
                },
            ],
        },
        {
            path: '/reportManagement/accounting/commission/transcodingRecord',
            element: (
                <WrapperRouteComponent
                    element={<TranscodingRecord {...props} />}
                    titleId="转码记录"
                    auth
                />
            ),
        },
        {
            path: '/reportManagement/accounting/commission/outgoingRecord',
            element: (
                <WrapperRouteComponent
                    element={<OutgoingRecord {...props} />}
                    titleId="即出记录"
                    auth
                />
            ),
        },
        {
            path: '/reportManagement/accounting/commission/monthlyStatement',
            element: (
                <WrapperRouteComponent
                    element={<MonthlyStatement {...props} />}
                    titleId="月结明细"
                    auth
                />
            ),
        },
    ];
    return routeList;
};

export default ReportManagementRoute;
