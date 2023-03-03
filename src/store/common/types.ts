import { ReactNode } from 'react';
import { CurrentHallType } from '@/types/api/public';
export interface CommonState {
    iconList: string[];
    detailPageInfo: DetailPageInfo;
    detailPageMenuList: DetailPageMenuListItem[];
    secondRouteInfo: RouteInfo;
    thirdRouteInfo: RouteInfo;
    currencyList: CurrencyOptions[];
    hallList: SelectOptions[];
    currentHall: CurrentHallType;
    departmentList: SelectOptions[];
    chipsList: SelectOptions[];
}
export interface DetailPageMenuListItem {
    path: string;
    name: string;
    icon?: ReactNode;
}

export interface DetailPageInfo {
    path: string;
    title: string;
    backPath: string;
}

export interface RouteListItem {
    path: string;
    name: string;
    icon?: string;
}

export interface RouteInfo {
    parentPath: string;
    routeList: RouteListItem[];
}

export interface SelectOptions {
    label: string;
    value: number;
    currencyId?: number;
}

export interface CurrencyOptions {
    label: string;
    value: number;
    permission?: string;
}
