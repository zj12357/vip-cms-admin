import React, { FC } from 'react';
import { ProCard } from '@ant-design/pro-components';
import PageRoute from '@/components/PageRoute';

type Props = {};

const Overview: FC<Props> = (props) => {
    return (
        <ProCard>
            <PageRoute {...props}></PageRoute>
        </ProCard>
    );
};
export default Overview;
