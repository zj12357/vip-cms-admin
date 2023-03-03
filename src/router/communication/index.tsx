import React from 'react';
import { RouteObject } from 'react-router-dom';
import Redirect from '@/router/Redirect';
import { WrapperRouteComponent } from '@/router/config';
const SMS = React.lazy(() => import('@/pages/Communication/SMS'));
const Services = React.lazy(() => import('@/pages/Communication/SMS/Services'));
const Template = React.lazy(() => import('@/pages/Communication/SMS/Template'));
const History = React.lazy(() => import('@/pages/Communication/SMS/History'));
const BatchSend = React.lazy(
    () => import('@/pages/Communication/SMS/BatchSend'),
);
const Telephone = React.lazy(() => import('@/pages/Communication/Telephone'));
const CallLogs = React.lazy(
    () => import('@/pages/Communication/Telephone/CallLogs'),
);
const CallSeat = React.lazy(
    () => import('@/pages/Communication/Telephone/CallSeat'),
);

interface CommunicationPageProps {}

const CommunicationPage = (props: CommunicationPageProps) => {
    const routeList: RouteObject[] = [
        {
            path: '/communication',
            element: <Redirect to="/communication/sms" />,
        },
        {
            path: '/communication/sms',
            element: (
                <WrapperRouteComponent
                    element={<SMS {...props} />}
                    titleId="短信管理"
                    auth
                />
            ),
            children: [
                {
                    path: '/communication/sms/services',
                    element: (
                        <WrapperRouteComponent
                            element={<Services {...props} />}
                            titleId="渠道管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/communication/sms/template',
                    element: (
                        <WrapperRouteComponent
                            element={<Template {...props} />}
                            titleId="模版管理"
                            auth
                        />
                    ),
                },
                {
                    path: '/communication/sms/batchSend',
                    element: (
                        <WrapperRouteComponent
                            element={<BatchSend {...props} />}
                            titleId="群发短信"
                            auth
                        />
                    ),
                },
                {
                    path: '/communication/sms/history',
                    element: (
                        <WrapperRouteComponent
                            element={<History {...props} />}
                            titleId="发送记录"
                            auth
                        />
                    ),
                },
            ],
        },
        {
            path: '/communication/telephone',
            element: (
                <WrapperRouteComponent
                    element={<Telephone {...props} />}
                    titleId="电话管理"
                    auth
                />
            ),
            children: [
                {
                    path: '/communication/telephone/callLogs',
                    element: (
                        <WrapperRouteComponent
                            element={<CallLogs {...props} />}
                            titleId="通话记录"
                            auth
                        />
                    ),
                },
                {
                    path: '/communication/telephone/seat',
                    element: (
                        <WrapperRouteComponent
                            element={<CallSeat {...props} />}
                            titleId="坐席管理"
                            auth
                        />
                    ),
                },
            ],
        },
    ];
    return routeList;
};

export default CommunicationPage;
