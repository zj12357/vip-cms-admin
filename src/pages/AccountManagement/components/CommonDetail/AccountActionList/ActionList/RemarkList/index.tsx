import React, { FC, useState, useCallback, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import { useHttp } from '@/hooks';
import { getRemarkList, remarksTop, deleteRemark } from '@/api/accountAction';
import {
    GetRemarkListParams,
    RemarkListType,
    RemarkListItem,
    RemarksTopParams,
} from '@/types/api/accountAction';
import ActionModalForm from './ActionModalForm';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { selectDepartmentList } from '@/store/common/commonSlice';
import AuthButton from '@/components/AuthButton';

type RemarkListProps = {};

const RemarkList: FC<RemarkListProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const accountInfo = useAppSelector(selectAccountInfo);
    const departmentList = useAppSelector(selectDepartmentList);

    const { fetchData: _fetchRemarkList } = useHttp<
        GetRemarkListParams,
        RemarkListType
    >(getRemarkList);

    const { fetchData: _fetchRemarksTop } = useHttp<RemarksTopParams, null>(
        remarksTop,
        ({ msg }) => {
            reloadData();
            message.success(msg);
        },
    );

    const { fetchData: _fetchDeleteRemark } = useHttp<number, null>(
        deleteRemark,
        ({ msg }) => {
            reloadData();
            message.success(msg);
        },
    );

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    const columns: ProColumns<RemarkListItem, any>[] = [
        {
            title: '时间',
            dataIndex: 'created_at',
            valueType: 'milliDateTime',
            hideInSearch: true,
        },
        {
            title: '部门',
            dataIndex: 'department',
            valueType: 'select',
            fieldProps: {
                options: departmentList,
            },
        },
        {
            title: '备注内容',
            dataIndex: 'content',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <p
                        style={{
                            width: '300px',
                        }}
                    >
                        {text}
                    </p>
                );
            },
        },
        {
            title: '操作人',
            dataIndex: 'operator',
            hideInSearch: true,
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

                <AuthButton
                    key="delete"
                    normal="customerAccount-remark-delete"
                    verify={(pass: boolean) => {
                        if (pass) {
                            handleDelete(record);
                        }
                    }}
                    buttonProps={{
                        type: 'link',
                    }}
                ></AuthButton>,
                <div
                    key="top"
                    onClick={() => {
                        handleremarksTop(record);
                    }}
                    className="m-primary-font-color pointer"
                >
                    {!!record.is_top ? '取消置顶' : '置顶'}
                </div>,
            ],
        },
    ];
    const handleDelete = (record: RemarkListItem) => {
        _fetchDeleteRemark(record.remarks_id);
    };

    const handleremarksTop = (record: RemarkListItem) => {
        _fetchRemarksTop({
            id: record.remarks_id,
            member_id: accountInfo.member_id,
            is_top: record.is_top ? 0 : 1,
        });
    };
    return (
        <div>
            <ProTable<RemarkListItem>
                columns={columns}
                params={{
                    member_id: accountInfo.member_id,
                }}
                request={async (params) => {
                    const res = await _fetchRemarkList({
                        page: params.current ?? 1,
                        size: params.pageSize ?? 20,
                        member_id: params.member_id,
                        department: params.department,
                    });
                    return {
                        data: res.data?.list ?? [],
                        total: res.data?.total ?? 0,
                        success: true,
                    };
                }}
                rowKey={(record) => record.remarks_id}
                search={{
                    labelWidth: 'auto',
                    span: 12,
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
                scroll={{ x: 1000 }}
            />
        </div>
    );
};

export default RemarkList;
