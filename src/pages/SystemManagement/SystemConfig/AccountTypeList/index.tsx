import React, { FC, useState, useCallback, useEffect, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Switch, Button, message } from 'antd';
import { useHttp } from '@/hooks';
import { getMemberTypeList, updateMemberType } from '@/api/system';
import { MemberTypeListItem, UpdateMemberTypeParams } from '@/types/api/system';
import EditModalForm from './EditModalForm';
import OccupyModalForm from './OccupyModalForm';
import CommissionModalForm from './CommissionModalForm';

type AccountTypeListProps = {};

const AccountTypeList: FC<AccountTypeListProps> = (props) => {
    const columns: ProColumns<MemberTypeListItem, any>[] = [
        {
            title: '户口类型名称',
            dataIndex: 'name',
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
            dataIndex: 'last_operator',
            hideInSearch: true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <EditModalForm
                    type="edit"
                    key="edit"
                    record={record}
                    reloadData={reloadData}
                ></EditModalForm>,
                <OccupyModalForm
                    key="occupy"
                    record={record}
                    reloadData={reloadData}
                ></OccupyModalForm>,
                <CommissionModalForm
                    record={record}
                    reloadData={reloadData}
                    key="commission"
                ></CommissionModalForm>,
            ],
        },
    ];
    const tableRef = useRef<ActionType>();

    const { fetchData: _fetchGetMemberTypeList } = useHttp<
        null,
        MemberTypeListItem[]
    >(getMemberTypeList);

    const { fetchData: _fetchUpdateMemberType } = useHttp<
        UpdateMemberTypeParams,
        null
    >(updateMemberType, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    return (
        <div>
            <ProTable<MemberTypeListItem>
                columns={columns}
                request={async () => {
                    const res = await _fetchGetMemberTypeList();
                    return {
                        data: res.data,
                        success: true,
                    };
                }}
                rowKey={(record) => record.member_type_id}
                search={{
                    labelWidth: 'auto',
                    span: 12,
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <EditModalForm
                            key="add"
                            type="add"
                            reloadData={reloadData}
                        ></EditModalForm>,
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

export default AccountTypeList;
