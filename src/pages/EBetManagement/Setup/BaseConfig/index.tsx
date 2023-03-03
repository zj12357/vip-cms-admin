import React from 'react';
import { ProColumns, ProTable } from '@ant-design/pro-components';

type BaseConfigProps = {};

type BaseConfigListItem = {
    key: number;
    field: string;
};

const BaseConfig: React.FC<BaseConfigProps> = (props) => {
    const columns: ProColumns<BaseConfigListItem>[] = [
        {
            title: '序号',
            dataIndex: 'field',
        },
        {
            title: '筹码',
            dataIndex: 'field',
        },
        {
            title: '币值',
            dataIndex: 'field',
            hideInSearch: true,
        },
        {
            title: '状态',
            dataIndex: 'field',
            hideInSearch: true,
        },
        {
            title: '操作',
            dataIndex: 'field',
            hideInSearch: true,
        },
    ];
    return (
        <div>
            <ProTable<BaseConfigListItem>
                columns={columns}
                toolBarRender={false}
            />
        </div>
    );
};

export default BaseConfig;
