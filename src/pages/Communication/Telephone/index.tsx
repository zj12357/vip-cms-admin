import React, { useMemo } from 'react';
import { ProCard } from '@ant-design/pro-components';
import PageRoute from '@/components/PageRoute';

interface SMSPageProps {}

const CallPage: React.FC<SMSPageProps> = (props) => {
    return (
        <ProCard>
            <PageRoute {...props}></PageRoute>
        </ProCard>
    );
};

export default CallPage;
