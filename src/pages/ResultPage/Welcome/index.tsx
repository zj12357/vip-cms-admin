import React, { FC } from 'react';
import { ProCard } from '@ant-design/pro-components';
import './index.scoped.scss';

type WelcomeProps = {};

const Welcome: FC<WelcomeProps> = (props) => {
    return (
        <ProCard className="m-welcome-box">
            <div className="m-welcome-logo">
                <img
                    src={
                        require('@/assets/images/icons/logo-large-icon.svg')
                            .default
                    }
                    alt=""
                    className="m-logo"
                />
                <h1 className="m-title">欢迎使用盈樂贵宾会综合管理系统</h1>
            </div>
        </ProCard>
    );
};

export default Welcome;
