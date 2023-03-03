import React, { FC } from 'react';
import { RouteObject } from 'react-router-dom';
import Redirect from './Redirect';
import {
    WrapperRouteComponent,
    WrapperRouteWithOutLayoutComponent,
} from './config';
import LoginPage from '@/pages/Login';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';

import account from './account';
import silverHead from './silverHead';
import reportManagement from './reportManagement';
import admission from './admission';
import scene from './scene';
import service from './service';
import system from './system';
import eBet from './eBet';
import consumption from './consumption';
import communication from './communication';

const NotFound = React.lazy(() => import('../pages/ResultPage/NotFound'));
const NotAuthority = React.lazy(
    () => import('../pages/ResultPage/NotAuthority'),
);
const Welcome = React.lazy(() => import('../pages/ResultPage/Welcome'));

export const routeProps = (props: any) => {
    const routeList: RouteObject[] = [
        {
            path: '/',
            element: (
                <WrapperRouteComponent
                    element={<BasicLayout {...props} />}
                    titleId=""
                    auth
                />
            ),
            children: [
                {
                    path: '/',
                    element: <Redirect to="welcome" />,
                },
                {
                    path: '/welcome',
                    element: (
                        <WrapperRouteComponent
                            element={<Welcome {...props} />}
                            titleId="盈樂贵宾会综合管理系统"
                            auth
                        />
                    ),
                },
            ],
        },
        {
            path: '/account',
            element: (
                <WrapperRouteComponent
                    element={<BasicLayout {...props} />}
                    titleId=""
                    auth
                />
            ),
            children: [...account(props)],
        },
        {
            path: '/admission',
            element: (
                <WrapperRouteComponent
                    element={<BasicLayout {...props} />}
                    titleId=""
                    auth
                />
            ),
            children: [...admission(props)],
        },
        {
            path: '/scene',
            element: (
                <WrapperRouteComponent
                    element={<BasicLayout {...props} />}
                    titleId=""
                    auth
                />
            ),
            children: [...scene(props)],
        },
        {
            path: '/service',
            element: (
                <WrapperRouteComponent
                    element={<BasicLayout {...props} />}
                    titleId=""
                    auth
                />
            ),
            children: [...service(props)],
        },
        {
            path: '/silverHead',
            element: (
                <WrapperRouteComponent
                    element={<BasicLayout {...props} />}
                    titleId=""
                    auth
                />
            ),
            children: [...silverHead(props)],
        },
        {
            path: '/reportManagement',
            element: (
                <WrapperRouteComponent
                    element={<BasicLayout {...props} />}
                    titleId=""
                    auth
                />
            ),
            children: [...reportManagement(props)],
        },
        {
            path: '/system',
            element: (
                <WrapperRouteComponent
                    element={<BasicLayout {...props} />}
                    titleId=""
                    auth
                />
            ),
            children: [...system(props)],
        },
        {
            path: '/consumptionCenter',
            element: (
                <WrapperRouteComponent
                    element={<BasicLayout {...props} />}
                    titleId=""
                    auth
                />
            ),
            children: [...consumption(props)],
        },
        {
            path: '/communication',
            element: (
                <WrapperRouteComponent
                    element={<BasicLayout {...props} />}
                    titleId=""
                    auth
                />
            ),
            children: [...communication(props)],
        },
        {
            path: '/eBet',
            element: (
                <WrapperRouteComponent
                    element={<BasicLayout {...props} />}
                    titleId=""
                    auth
                />
            ),
            children: [...eBet(props)],
        },
        {
            path: '/user',
            element: (
                <WrapperRouteWithOutLayoutComponent
                    element={<UserLayout {...props} />}
                    titleId=""
                />
            ),
            children: [
                {
                    path: '/user/login',
                    element: (
                        <WrapperRouteWithOutLayoutComponent
                            element={<LoginPage {...props} />}
                            titleId="登录"
                        />
                    ),
                },
            ],
        },
        {
            path: '*' || '/404',
            element: (
                <WrapperRouteWithOutLayoutComponent
                    element={<NotFound {...props} />}
                    titleId="404"
                />
            ),
        },
        {
            path: '/403',
            element: (
                <WrapperRouteWithOutLayoutComponent
                    element={<NotAuthority {...props} />}
                    titleId="403"
                />
            ),
        },
    ];

    return routeList;
};
