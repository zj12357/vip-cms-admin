import React, { FC } from 'react';
import { SpinProps, Spin } from 'antd';
import './index.scoped.scss';

type LoadingComponentProps = {};

const LoadingComponent: FC<LoadingComponentProps & SpinProps> = (props) => {
    return <Spin {...props} className="loading-box"></Spin>;
};

export default LoadingComponent;
