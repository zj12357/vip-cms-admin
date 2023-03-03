import React, { FC } from 'react';
import { RouteObject } from 'react-router-dom';
import Redirect from '../Redirect';
import { WrapperRouteComponent } from '../config';

const SceneList = React.lazy(() => import('@/pages/SceneManagement/SceneList'));
const OneCycleList = React.lazy(
    () => import('@/pages/SceneManagement/SceneList/OneCycleList'),
);
const CustomerDetails = React.lazy(
    () => import('@/pages/SceneManagement/SceneList/CustomerDetails'),
);

const SceneRecord = React.lazy(
    () => import('@/pages/SceneManagement/SceneRecord'),
);

const SceneReport = React.lazy(
    () => import('@/pages/SceneManagement/SceneReport'),
);

type SceneRouteProps = {};

const SceneRoute = (props: SceneRouteProps) => {
    const routeList: RouteObject[] = [
        {
            path: '/scene',
            element: <Redirect to="/scene/list" />,
        },
        {
            path: '/scene/list',
            element: (
                <WrapperRouteComponent
                    element={<SceneList {...props} />}
                    titleId="入场列表"
                    auth
                />
            ),
        },
        {
            path: '/scene/list/oneCycleList',
            element: (
                <WrapperRouteComponent
                    element={<OneCycleList {...props} />}
                    titleId="围数列表"
                    auth
                />
            ),
        },
        {
            path: '/scene/list/CustomerDetails/:id',
            element: (
                <WrapperRouteComponent
                    element={<CustomerDetails {...props} />}
                    titleId="客户详情"
                    auth
                />
            ),
        },
        // {
        //     path: '/scene/record',
        //     element: (
        //         <WrapperRouteComponent
        //             element={<SceneRecord {...props} />}
        //             titleId="围数记录"
        //             auth
        //         />
        //     ),
        // },
        // {
        //     path: '/scene/report',
        //     element: (
        //         <WrapperRouteComponent
        //             element={<SceneReport {...props} />}
        //             titleId="围数报表"
        //             auth
        //         />
        //     ),
        // },
    ];
    return routeList;
};

export default SceneRoute;
