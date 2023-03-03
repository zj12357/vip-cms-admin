import React, { useEffect } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import { routeProps } from './routerList';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false });

const RenderRouter = (props: any) => {
    const location = useLocation();
    useEffect(() => {
        NProgress.done();
        return () => {
            NProgress.start();
        };
    }, [location.pathname]);
    const routeList = routeProps(props);
    const element = useRoutes(routeList);
    return element;
};

export default RenderRouter;
