import React, { FC, useState, useCallback, useRef } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable, ActionType } from '@ant-design/pro-components';
import { Switch, Button, message } from 'antd';
import AccountIdentityModalForm from './AccountIdentityModalForm';
import { useHttp } from '@/hooks';
import { getMemberIdentityList, updateMemberIdentity } from '@/api/system';
import {
    GetMemberIdentityParams,
    GetMemberIdentityListItem,
    UpdateMemberIdentityParams,
} from '@/types/api/system';

type AccountIdentityListProps = {};

const AccountIdentityList: FC<AccountIdentityListProps> = (props) => {
    const [modalFormType, setModalFormType] = useState<'add' | 'edit'>('add');
    const tableRef = useRef<ActionType>();
    const { fetchData: _fetchGetMemberIdentityList } = useHttp<
        GetMemberIdentityParams,
        GetMemberIdentityListItem[]
    >(getMemberIdentityList);

    const { fetchData: _fetchUpdateMemberIdentity } = useHttp<
        UpdateMemberIdentityParams,
        null
    >(updateMemberIdentity, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const columns: ProColumns<GetMemberIdentityListItem, any>[] = [
        {
            title: '户口身份',
            dataIndex: 'name',
            hideInSearch: true,
        },
        {
            title: '修改时间',
            dataIndex: 'updated_at',
            hideInSearch: true,
            valueType: 'milliDateTime',
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
                <AccountIdentityModalForm
                    key="edit"
                    type={modalFormType}
                    trigger={
                        <div
                            onClick={() => {
                                setModalFormType('edit');
                            }}
                            className="m-primary-font-color pointer"
                        >
                            编辑
                        </div>
                    }
                    reloadData={reloadData}
                    record={record}
                ></AccountIdentityModalForm>,

                // <Switch
                //     checkedChildren="开启"
                //     unCheckedChildren="关闭"
                //     checked={!!record.is_open}
                //     key="switch"
                //     onChange={(val) => handleOpen(val, record)}
                // />,
            ],
        },
    ];

    const handleOpen = (
        checked: boolean,
        record: GetMemberIdentityListItem,
    ) => {
        _fetchUpdateMemberIdentity({
            member_identity_id: record.member_identity_id,
            is_open: checked ? 1 : 0,
        });
    };
    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);
    return (
        <div>
            <ProTable<GetMemberIdentityListItem>
                columns={columns}
                request={async (params) => {
                    let res = await _fetchGetMemberIdentityList();
                    return {
                        data: res.data,
                        success: true,
                    };
                }}
                rowKey={(item) => item.member_identity_id}
                search={false}
                // search={{
                //     labelWidth: 'auto',
                //     span: 6,
                //     defaultCollapsed: false,
                //     optionRender: (searchConfig, formProps, dom) => [
                //         <AccountIdentityModalForm
                //             key="add"
                //             type={modalFormType}
                //             reloadData={reloadData}
                //             trigger={
                //                 <Button
                //                     type="primary"
                //                     onClick={() => {
                //                         setModalFormType('add');
                //                     }}
                //                 >
                //                     新增身份
                //                 </Button>
                //             }
                //         ></AccountIdentityModalForm>,
                //     ],
                // }}
                toolBarRender={false}
                actionRef={tableRef}
                scroll={{
                    x: 1200,
                }}
            />
        </div>
    );
};

export default AccountIdentityList;
