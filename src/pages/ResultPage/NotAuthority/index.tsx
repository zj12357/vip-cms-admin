import { Button, Result } from 'antd';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import './index.scoped.scss';

interface Props {}

const NotAuthority: FC<Props> = () => (
    <Result
        status="403"
        title="403"
        subTitle="你没有权限访问此页面"
        extra={
            <NavLink to="/">
                <Button type="primary" icon={<LeftOutlined />}>
                    返回首页
                </Button>
            </NavLink>
        }
    />
);

export default NotAuthority;
