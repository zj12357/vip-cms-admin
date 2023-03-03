import React, { ComponentType, FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { selectToken } from '@/store/user/userSlice';
import { useAppSelector } from '@/store/hooks';
import {
    selectSecondRouteInfo,
    selectThirdRouteInfo,
} from '@/store/common/commonSlice';

export interface RouteItem {
    path: string;
    name: string;
    menu_name?: string;
    icon?: string;
    children?: any[];
}
export interface ButtonItem {
    normal: string;
    menu_name: string;
}
// 权限控制,过滤当前页面的权限和按钮
export default function WithAuth<Props>(
    WrappedComponent: ComponentType<Props>,
) {
    const Component: FC<Props> = (props) => {
        const token = useSelector(selectToken);
        const secondRouteInfo = useAppSelector(selectSecondRouteInfo);
        const thirdRouteInfo = useAppSelector(selectThirdRouteInfo);
        return (
            <Fragment>
                <WrappedComponent
                    {...props}
                    token={token}
                    authSecondRoute={secondRouteInfo.routeList}
                    authThirdRoute={thirdRouteInfo.routeList}
                />
            </Fragment>
        );
    };

    Component.displayName = `WithAuth(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return Component;
}
