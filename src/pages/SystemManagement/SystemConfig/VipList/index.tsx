import React, { FC, useState, useCallback, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import VipModalForm from './VipModalForm';
import { useHttp } from '@/hooks';
import { getVipList, deleteVip } from '@/api/system';
import { VipListItem } from '@/types/api/system';
import AuthButton from '@/components/AuthButton';

type VipListProps = {};

const VipList: FC<VipListProps> = (props) => {
    const tableRef = useRef<ActionType>();

    const { fetchData: _fetchVipList } = useHttp<null, VipListItem[]>(
        getVipList,
    );

    const { fetchData: _fetchDeleteVip } = useHttp<number, null>(
        deleteVip,
        ({ msg }) => {
            reloadData();
            message.success(msg);
        },
    );

    const columns: ProColumns<VipListItem, any>[] = [
        {
            title: '等级名称',
            dataIndex: 'vip_level_name',
            hideInSearch: true,
        },
        {
            title: '晋级参数',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return <div>转码量</div>;
            },
        },
        {
            title: '晋级转码量',
            dataIndex: 'promotion_amount',
            hideInSearch: true,
        },
        {
            title: '保级转码量(三个月)',
            dataIndex: 'keep_amount',
            hideInSearch: true,
        },
        {
            title: '修改时间',
            dataIndex: 'updated_at',
            valueType: 'milliDateTime',
            hideInSearch: true,
        },
        {
            title: '最后操作人',
            dataIndex: 'updated_name',
            hideInSearch: true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <VipModalForm
                    key="adit"
                    type="edit"
                    reloadData={reloadData}
                    record={record}
                ></VipModalForm>,
                // <AuthButton
                //     normal="vip-delete"
                //     verify={(pass) => {
                //         pass && handleDelete(record);
                //     }}
                //     buttonProps={{
                //         type: 'link',
                //         style: {
                //             padding: '4px',
                //         },
                //     }}
                //     key="del"
                // ></AuthButton>,
            ],
        },
    ];

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    const handleDelete = (record: VipListItem) => {
        _fetchDeleteVip(record.id);
    };

    return (
        <div>
            <ProTable<VipListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchVipList();
                    return {
                        data: res.data ?? [],
                        success: true,
                    };
                }}
                rowKey={(record) => record.id}
                search={{
                    labelWidth: 'auto',
                    span: 6,
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <VipModalForm
                            key="add"
                            type="add"
                            reloadData={reloadData}
                        ></VipModalForm>,
                    ],
                }}
                toolBarRender={false}
                scroll={{
                    x: 1200,
                }}
                actionRef={tableRef}
            />
        </div>
    );
};

export default VipList;
