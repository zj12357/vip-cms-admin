import React from 'react';
import { ProColumns, ProTable } from '@ant-design/pro-components';

type ChipConfigProps = {};

type ChipConfigListItem = {
    key: number;
    field: string;
};

const ChipConfig: React.FC<ChipConfigProps> = (props) => {
    const columns: ProColumns<ChipConfigListItem>[] = [
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
            <ProTable<ChipConfigListItem>
                columns={columns}
                toolBarRender={false}
            />
        </div>
    );
};

export default ChipConfig;
