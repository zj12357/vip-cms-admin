import React, { FC, useState, useCallback, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable, ProCard } from '@ant-design/pro-components';
import { message, Switch } from 'antd';
import AccountModalForm from './AccountModalForm';
import AccountDetail from './AccountDetail';
import { useHttp } from '@/hooks';
import {
    getDepartList,
    getDepartTitleList,
    getDepartLevelList,
    getAdminAccountList,
    deleteAdminAccount,
    updateAdminState,
} from '@/api/system';
import {
    GetDepartListParams,
    DepartListItem,
    GetDepartTitleListParams,
    DepartTitleListItem,
    GetDepartLevelListParams,
    DepartLevelListItem,
    GetAdminAccountListParams,
    AdminAccountListItem,
    AdminAccountListType,
    UpdateAdminStateParams,
} from '@/types/api/system';
import AuthButton from '@/components/AuthButton';
import { transPosition } from '../common';

type AccountConfigProps = {};

const AccountConfig: FC<AccountConfigProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const [currentDepartment, setCurrentDepartment] = useState<number>();

    const { fetchData: _fetchDeleteAdminAccount } = useHttp<number, null>(
        deleteAdminAccount,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const { fetchData: _fetchUpdateAdminState } = useHttp<
        UpdateAdminStateParams,
        null
    >(updateAdminState, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const { fetchData: _fetchDepartList } = useHttp<
        GetDepartListParams,
        DepartListItem[]
    >(getDepartList);

    const { fetchData: _fetchDepartTitleList } = useHttp<
        GetDepartTitleListParams,
        DepartTitleListItem[]
    >(getDepartTitleList);

    const { fetchData: _fetchDepartLevelList } = useHttp<
        GetDepartLevelListParams,
        DepartLevelListItem[]
    >(getDepartLevelList);

    const { fetchData: _fetchAdminAccountList } = useHttp<
        GetAdminAccountListParams,
        AdminAccountListType
    >(getAdminAccountList);

    const columns: ProColumns<AdminAccountListItem, any>[] = [
        {
            title: '员工姓名',
            dataIndex: 'user_name',
        },
        {
            title: '账号名',
            dataIndex: 'login_name',
            hideInSearch: true,
        },
        {
            title: '部门',
            dataIndex: 'department_id',
            valueType: 'select',
            fieldProps: {
                fieldNames: {
                    label: 'department_name',
                    value: 'id',
                },
                onChange: (val: number, option: any) => {
                    setCurrentDepartment(option?.value);
                },
            },
            request: async () => {
                const res = await _fetchDepartList();
                return res.data ?? [];
            },
            hideInTable: true,
        },
        {
            title: '职务',
            dataIndex: 'department_title_id',
            valueType: 'select',
            fieldProps: {
                placeholder: '请先选择部门',
            },
            formItemProps: {
                tooltip: '请先选择部门',
            },
            request: async (params) => {
                if (!currentDepartment) {
                    return [];
                }
                const res = await _fetchDepartTitleList({
                    department_id: params.department_id,
                });

                return transPosition(res.data, 'department_title_name') ?? [];
            },
            params: {
                department_id: currentDepartment,
            },
            hideInTable: true,
        },
        {
            title: '职级',
            dataIndex: 'department_level_id',
            valueType: 'select',
            fieldProps: {
                placeholder: '请先选择部门',
            },
            formItemProps: {
                tooltip: '请先选择部门',
            },
            request: async (params) => {
                if (!currentDepartment) {
                    return [];
                }
                const res = await _fetchDepartLevelList({
                    department_id: params.department_id,
                });

                return transPosition(res.data, 'department_level_name') ?? [];
            },
            params: {
                department_id: currentDepartment,
            },
            hideInTable: true,
        },
        {
            title: '部门',
            dataIndex: 'department_name',
            hideInSearch: true,
        },
        {
            title: '职务',
            dataIndex: 'department_title_name',
            hideInSearch: true,
        },
        {
            title: '职级',
            dataIndex: 'department_level_name',
            hideInSearch: true,
        },
        {
            title: '电话',
            dataIndex: 'tel',
            hideInSearch: true,
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            valueType: 'milliDateTime',
            hideInSearch: true,
        },
        {
            title: '创建人',
            dataIndex: 'created_name',
            hideInSearch: true,
        },
        {
            title: '最后登录时间',
            dataIndex: 'last_login_at',
            valueType: 'milliDateTime',
            hideInSearch: true,
        },
        {
            title: '状态',
            dataIndex: 'state',
            valueType: 'select',
            valueEnum: {
                1: { text: '可用', status: 'Success' },
                2: { text: '禁用', status: 'Error' },
            },
            search: {
                transform: (val) => {
                    return {
                        state: +val,
                    };
                },
            },
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <AuthButton
                    key="switch"
                    normal="account-disable"
                    verify={(pass: boolean) => {
                        if (pass) {
                            handleSwitchAccount(record);
                        }
                    }}
                    trigger={
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                            checked={record.state === 1 ? true : false}
                        />
                    }
                ></AuthButton>,

                <AccountDetail
                    key="detail"
                    trigger={
                        <div className="m-primary-font-color pointer">详情</div>
                    }
                    record={record}
                ></AccountDetail>,
                <AccountModalForm
                    key="edit"
                    type="edit"
                    reloadData={reloadData}
                    record={record}
                ></AccountModalForm>,
                <AuthButton
                    key="del"
                    normal="account-del"
                    verify={(pass: boolean) => {
                        if (pass) {
                            handleDelete(record);
                        }
                    }}
                    buttonProps={{
                        type: 'link',
                    }}
                ></AuthButton>,
            ],
        },
    ];

    const handleDelete = (record: AdminAccountListItem) => {
        _fetchDeleteAdminAccount(record?.admin_id ?? 0);
    };

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    const handleSwitchAccount = (record: AdminAccountListItem) => {
        _fetchUpdateAdminState({
            admin_id: record.admin_id,
            state: record.state === 1 ? 2 : 1,
        });
    };
    return (
        <ProCard>
            <ProTable<AdminAccountListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchAdminAccountList({
                        page: params.current ?? 1,
                        size: params.pageSize ?? 20,
                        state: params.state,
                        user_name: params.user_name,
                        department_id: params.department_id,
                        department_level_id: params.department_level_id,
                        department_title_id: params.department_title_id,
                    });
                    return {
                        data: res.data.list ?? [],
                        total: res.data?.total ?? 0,
                        success: true,
                    };
                }}
                rowKey={(record) => record.admin_id}
                search={{
                    labelWidth: 'auto',
                    span: 6,
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <AccountModalForm
                            key="add"
                            type="add"
                            reloadData={reloadData}
                        ></AccountModalForm>,
                        dom,
                    ],
                }}
                toolBarRender={false}
                actionRef={tableRef}
                scroll={{
                    x: 1200,
                }}
            />
        </ProCard>
    );
};

export default AccountConfig;
