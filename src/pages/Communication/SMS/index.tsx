import React, { useMemo } from 'react';
import { ProCard } from '@ant-design/pro-components';
import PageRoute from '@/components/PageRoute';

interface SMSPageProps {}

const SMSPage: React.FC<SMSPageProps> = (props) => {
    return (
        <ProCard>
            <PageRoute {...props}></PageRoute>
        </ProCard>
    );
};

export default SMSPage;
