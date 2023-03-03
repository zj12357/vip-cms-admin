import React, { ComponentType } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RenderRouter from './router';
import store from './store';
import { compose } from '@reduxjs/toolkit';
import WithReduxProvider from './components/HOC/withReduxProvider';
import withErrorScreen from './components/ErrorScreen/withErrorScreen';
import withAntdConfig from './components/HOC/withAntdConfig';
import withOfflineMask from './components/HOC/withOfflineMask';
import withAuth from './components/HOC/withAuth';
import withCommonConfig from './components/HOC/withCommonConfig';

const RouteComponent = (props: any) => {
    // props接收前面所有高阶组件传过来的值，按需传给要渲染的子组件
    return (
        <Router>
            <RenderRouter {...props}></RenderRouter>
        </Router>
    );
};

// 从右到左依次执行
const renderer: (c: ComponentType) => ComponentType = compose(
    WithReduxProvider(store),
    withErrorScreen,
    withAuth,
    withOfflineMask,
    withAntdConfig,
    withCommonConfig,
);

const Main = renderer(RouteComponent);

function App() {
    return <Main></Main>;
}

export default App;
