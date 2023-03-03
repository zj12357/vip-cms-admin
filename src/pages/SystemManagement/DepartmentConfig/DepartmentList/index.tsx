import React, { FC, useState, useCallback, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import ActionModalForm from './DepartmentModalForm';
import { useHttp } from '@/hooks';
import { getDepartList, deleteDepart } from '@/api/system';
import { GetDepartListParams, DepartListItem } from '@/types/api/system';

type DepartmentListProps = {};

const DepartmentList: FC<DepartmentListProps> = (props) => {
    const tableRef = useRef<ActionType>();

    const { fetchData: _fetchDepartList } = useHttp<
        GetDepartListParams,
        DepartListItem[]
    >(getDepartList);

    const { fetchData: _fetchDeleteDepart } = useHttp<number, null>(
        deleteDepart,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const columns: ProColumns<DepartListItem, any>[] = [
        {
            title: '部门',
            dataIndex: 'department_name',
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            valueType: 'milliDateTime',
            hideInSearch: true,
        },
        {
            title: '操作人',
            dataIndex: 'updated_name',
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <ActionModalForm
                    key="edit"
                    type="edit"
                    reloadData={reloadData}
                    record={record}
                ></ActionModalForm>,
                // <Popconfirm
                //     key="detele"
                //     title="你确定要删除它吗?"
                //     onConfirm={() => handleDelete(record)}
                //     okText="确定"
                //     cancelText="取消"
                // >
                //     <div
                //         onClick={() => {
                //             console.log(text, record, _, action);
                //         }}
                //         className="m-primary-font-color pointer"
                //     >
                //         删除
                //     </div>
                // </Popconfirm>,
            ],
        },
    ];
    const handleDelete = (record: DepartListItem) => {
        _fetchDeleteDepart(record.id);
    };
    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    return (
        <div>
            <ProTable<DepartListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchDepartList({
                        department_name: params.department_name,
                        updated_name: params.updated_name,
                    });
                    return {
                        data: res.data ?? [],
                        total: res.data?.length ?? 0,
                        success: true,
                    };
                }}
                rowKey={(record) => record.id}
                search={{
                    labelWidth: 'auto',
                    span: 6,
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <ActionModalForm
                            key="add"
                            type="add"
                            reloadData={reloadData}
                        ></ActionModalForm>,
                        dom,
                    ],
                }}
                toolBarRender={false}
                actionRef={tableRef}
                scroll={{
                    x: 1200,
                }}
            />
        </div>
    );
};

export default DepartmentList;
