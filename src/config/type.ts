import React, { ReactNode } from 'react';

export interface RouteIfoType {
    path: string;
    routes: RouteIfoItemType[];
}

export interface RouteIfoItemType {
    path: string;
    name: string;
    icon?: ReactNode;
    access?: string;
    routes?: RouteIfoItemType[];
}
