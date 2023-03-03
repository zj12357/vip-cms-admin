import React, { FC } from 'react';
import { ProCard } from '@ant-design/pro-components';
import PageRoute from '@/components/PageRoute';

type Props = {};

const Accounting: FC<Props> = (props) => {
    return (
        <ProCard>
            <PageRoute {...props} fourthRoute></PageRoute>
        </ProCard>
    );
};
export default Accounting;
