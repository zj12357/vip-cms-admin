import React, { FC } from 'react';
import { RouteObject } from 'react-router-dom';
import Redirect from '../Redirect';
import { WrapperRouteComponent } from '../config';

const AdmissionList = React.lazy(
    () => import('@/pages/AdmissionManagement/AdmissionList'),
);
const AdmissionRecord = React.lazy(
    () => import('@/pages/AdmissionManagement/AdmissionRecord'),
);
const AdmissionDetail = React.lazy(
    () =>
        import(
            '@/pages/AdmissionManagement/AdmissionList/AdmissionDetail/index'
        ),
);

type AdmissionRouteProps = {};

const AdmissionRoute = (props: AdmissionRouteProps) => {
    const routeList: RouteObject[] = [
        {
            path: '/admission',
            element: <Redirect to="/admission/list" />,
        },
        {
            path: '/admission/list',
            element: (
                <WrapperRouteComponent
                    element={<AdmissionList {...props} />}
                    titleId="开工列表"
                    auth
                />
            ),
        },
        {
            path: '/admission/list/admissionDetail/:id',
            element: (
                <WrapperRouteComponent
                    element={<AdmissionDetail {...props} />}
                    titleId="开工详情"
                    auth
                />
            ),
        },
        {
            path: '/admission/record',
            element: (
                <WrapperRouteComponent
                    element={<AdmissionRecord {...props} />}
                    titleId="入场记录"
                    auth
                />
            ),
        },
    ];
    return routeList;
};

export default AdmissionRoute;
