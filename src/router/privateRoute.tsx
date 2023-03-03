import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteProps, useLocation } from 'react-router-dom';
import { selectToken } from '@/store/user/userSlice';
import { useAppSelector } from '@/store/hooks';
import { RouteIfoItemType } from '@/config/type';
import {
    findMenuType,
    findPageType,
    findAllRoute,
} from '@/common/commonHandle';
import { selectMenuList } from '@/store/user/userSlice';
import { whiteList } from './whiteList';

const PrivateRoute = (props: RouteProps) => {
    const location = useLocation();
    const { pathname } = location;
    const token = useAppSelector(selectToken);
    //获取左边导航的菜单,本地调试可以使用menuRoute
    const menuList = useAppSelector(selectMenuList);
    const leftMenuList = findMenuType(menuList, [], 'L', 'children');

    //权限路由
    const flattenRoute: (arr: RouteIfoItemType[]) => string[] = (
        arr: RouteIfoItemType[],
    ): string[] => {
        return arr.reduce((res: string[], next: RouteIfoItemType) => {
            res = res.concat(next.path);
            if (Array.isArray(next.routes)) {
                res = res.concat(flattenRoute(next.routes));
            }
            return res;
        }, []);
    };

    const flattenMenuRouteList = flattenRoute(leftMenuList.routes);
    const flattenPageRouteList = flattenRoute(
        findPageType(menuList, pathname, 'children'),
    );
    const flattenAllRouteList = findAllRoute(menuList, 'children');

    //不是首页
    const noHome = pathname !== '/' && pathname !== '/welcome';
    //不在左边的菜单权限列表里面
    const noMenuLsit = !flattenMenuRouteList.some((item) =>
        item.includes(pathname),
    );
    //不在页面权限列表里面
    const noPageLsit = !flattenPageRouteList.some((item) =>
        item.includes(pathname),
    );
    //不在白名单里面
    const noWhiteList = !whiteList.some((item) => pathname.includes(item));
    //不在路由列表里面
    const noALLRouteList = !flattenAllRouteList.some((item) =>
        item.includes(pathname),
    );

    const noAuthority =
        noHome && noMenuLsit && noPageLsit && noWhiteList && noALLRouteList;

    return token ? (
        noAuthority ? (
            <Navigate to={{ pathname: '/403' }} replace />
        ) : (
            props.element
        )
    ) : (
        <Navigate to={{ pathname: '/user/login' }} replace />
    );
};

export default PrivateRoute;
