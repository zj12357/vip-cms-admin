import React, { FC, useState, useCallback, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import AddCustomerForm from './AddCustomerForm';
import { useHttp } from '@/hooks';
import { getClientList, deleteClient } from '@/api/accountAction';
import {
    ClientListType,
    ClientListItem,
    GetClientListParams,
} from '@/types/api/accountAction';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';

type CustomerListProps = {};

const CustomerList: FC<CustomerListProps> = (props) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const tableRef = useRef<ActionType>();
    const [modalFormType, setModalFormType] = useState<'add' | 'edit'>('add');

    const { fetchData: _fetchClientList } = useHttp<
        GetClientListParams,
        ClientListType
    >(getClientList);

    const { fetchData: _fetchDeleteClient } = useHttp<string, null>(
        deleteClient,
        ({ msg }) => {
            reloadData();
            message.success(msg);
        },
    );

    const columns: ProColumns<ClientListItem, any>[] = [
        {
            title: '客户姓名',
            dataIndex: 'client_name',
            hideInSearch: true,
        },

        {
            title: '证件号',
            dataIndex: 'certificate_number',
            valueType: 'encryption',
            hideInSearch: true,
        },

        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <AddCustomerForm
                    key="edit"
                    type="edit"
                    reloadData={reloadData}
                    record={record}
                ></AddCustomerForm>,
                <Popconfirm
                    key="top"
                    title="你确定要删除它吗?"
                    onConfirm={() => handleDelete(record)}
                    okText="确定"
                    cancelText="取消"
                >
                    <div className="m-primary-font-color pointer">删除</div>
                </Popconfirm>,
            ],
        },
    ];
    const handleDelete = (record: ClientListItem) => {
        _fetchDeleteClient(record.client_id);
    };
    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);
    return (
        <div>
            <ProTable<ClientListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchClientList({
                        page: params.current ?? 1,
                        size: params.pageSize ?? 20,
                        member_id: accountInfo.member_id,
                    });
                    return {
                        data: res.data?.list ?? [],
                        total: res.data?.total ?? 0,
                        success: true,
                    };
                }}
                rowKey={(item) => item.client_id}
                search={{
                    labelWidth: 'auto',
                    span: 12,
                    defaultCollapsed: false,
                    optionRender: () => [
                        <AddCustomerForm
                            key="add"
                            type="add"
                            reloadData={reloadData}
                        ></AddCustomerForm>,
                    ],
                }}
                toolBarRender={false}
                actionRef={tableRef}
                scroll={{ x: 1000 }}
            />
        </div>
    );
};

export default CustomerList;
