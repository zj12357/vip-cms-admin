import React, { FC } from 'react';
import { RouteObject } from 'react-router-dom';
import Redirect from '../Redirect';
import { WrapperRouteComponent } from '../config';

const ConsumerServiceList = React.lazy(
    () => import('@/pages/ConsumptionCenter/ConsumerService'),
);

type ConsumptionRouteProps = {};

const ConsumptionRoute = (props: ConsumptionRouteProps) => {
    const routeList: RouteObject[] = [
        {
            path: '/consumptionCenter/consumerService',
            element: (
                <WrapperRouteComponent
                    element={<ConsumerServiceList {...props} />}
                    titleId="消费服务"
                    auth
                />
            ),
        },
    ];
    return routeList;
};

export default ConsumptionRoute;
