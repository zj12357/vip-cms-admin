import React, { FC } from 'react';
import { ProCard } from '@ant-design/pro-components';
import PageRoute from '@/components/PageRoute';

type SystemConfigProps = {};

const SystemConfig: FC<SystemConfigProps> = (props) => {
    return (
        <ProCard>
            <PageRoute {...props}></PageRoute>
        </ProCard>
    );
};

export default SystemConfig;
