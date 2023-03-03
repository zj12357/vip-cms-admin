import React, { FC } from 'react';
import { RouteObject } from 'react-router-dom';
import Redirect from '../Redirect';
import { WrapperRouteComponent } from '../config';

const ConsumList = React.lazy(
    () => import('@/pages/ServiceManagement/ConsumList'),
);
const IntegraList = React.lazy(
    () => import('@/pages/ServiceManagement/IntegraList'),
);

const GiftMoneyList = React.lazy(
    () => import('@/pages/ServiceManagement/GiftMoneyList'),
);
const ConsumConfig = React.lazy(
    () => import('@/pages/ServiceManagement/ConsumConfig'),
);

type ServiceRouteProps = {};

const ServiceRoute = (props: ServiceRouteProps) => {
    const routeList: RouteObject[] = [
        {
            path: '/service',
            element: <Redirect to="/service/consumList" />,
        },
        {
            path: '/service/consumList',
            element: (
                <WrapperRouteComponent
                    element={<ConsumList {...props} />}
                    titleId="消费列表"
                    auth
                />
            ),
        },
        {
            path: '/service/integralList',
            element: (
                <WrapperRouteComponent
                    element={<IntegraList {...props} />}
                    titleId="积分列表"
                    auth
                />
            ),
        },
        {
            path: '/service/giftMoneyList',
            element: (
                <WrapperRouteComponent
                    element={<GiftMoneyList {...props} />}
                    titleId="礼遇金列表"
                    auth
                />
            ),
        },
        {
            path: '/service/consumConfig',
            element: (
                <WrapperRouteComponent
                    element={<ConsumConfig {...props} />}
                    titleId="消费配置"
                    auth
                />
            ),
        },
    ];
    return routeList;
};

export default ServiceRoute;
