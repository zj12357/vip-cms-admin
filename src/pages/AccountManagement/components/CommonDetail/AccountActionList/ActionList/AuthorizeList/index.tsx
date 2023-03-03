import React, { FC, useState, useCallback, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Popover, List, Popconfirm, message } from 'antd';
import AddAuthorizeForm from './AddAuthorizeForm';
import SetPassword from './SetPassword';
import { hideMiddleNumber } from '@/utils/tools';
import { useHttp } from '@/hooks';
import { getAuthorizerList, deleteAuthorizer } from '@/api/accountAction';
import {
    AuthorizerListType,
    GetAuthorizerListParams,
    AuthorizerListItem,
} from '@/types/api/accountAction';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { authorizePermissionType } from '@/common/commonConstType';
import moment from 'moment';
import AuthButton from '@/components/AuthButton';
import ShowModal from '@/components/Opcode/ShowModal';

type AuthorizeListProps = {};

const AuthorizeList: FC<AuthorizeListProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const accountInfo = useAppSelector(selectAccountInfo);

    const { fetchData: _fetchGetAuthorizerList } = useHttp<
        GetAuthorizerListParams,
        AuthorizerListType
    >(getAuthorizerList);

    const { fetchData: _fetchDeleteAuthorizer } = useHttp<string, null>(
        deleteAuthorizer,
        ({ msg }) => {
            reloadData();
            message.success(msg);
        },
    );

    const columns: ProColumns<AuthorizerListItem>[] = [
        {
            title: '授权人姓名',
            dataIndex: 'authorizer_name',
            hideInSearch: true,
        },
        {
            title: '联系方式',
            dataIndex: 'contact',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <AuthButton
                        buttonProps={{
                            type: 'primary',
                            size: 'small',
                        }}
                        childrenType="modal"
                        normal="customerAccount-authorizer-check"
                    >
                        <ShowModal
                            data={record.telephone_list}
                            title="联系方式"
                            infoType="authorize"
                        ></ShowModal>
                    </AuthButton>
                );
            },
        },
        {
            title: '权限',
            dataIndex: 'permission',
            hideInSearch: true,
            valueType: 'checkbox',
            fieldProps: {
                options: authorizePermissionType,
            },
        },
        {
            title: '密码状态',
            dataIndex: 'password',
            valueType: 'select',
            hideInSearch: true,
            valueEnum: {
                0: { text: '未设置', status: 'Error' },
                1: { text: '已设置', status: 'Success' },
            },
            render: (text, record, _, action) => {
                return (
                    <SetPassword
                        trigger={<div className="pointer">{text}</div>}
                        status={record.password === '0' ? false : true}
                        reloadData={reloadData}
                        record={record}
                    ></SetPassword>
                );
            },
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <Popover
                    key="verify"
                    placement="top"
                    content={
                        <List
                            dataSource={record.telephone_list}
                            renderItem={(item, index) => (
                                <List.Item key={index}>
                                    <span style={{ marginRight: '14px' }}>
                                        {hideMiddleNumber(item?.phone ?? '')}
                                    </span>
                                    <Button type="primary" size="small">
                                        呼叫
                                    </Button>
                                </List.Item>
                            )}
                        ></List>
                    }
                >
                    <div
                        onClick={() => {
                            console.log(text, record, _, action);
                        }}
                        className="m-primary-font-color pointer"
                    >
                        验证
                    </div>
                </Popover>,
                <AddAuthorizeForm
                    key="edit"
                    type="edit"
                    reloadData={reloadData}
                    record={record}
                ></AddAuthorizeForm>,

                <AuthButton
                    key="delete"
                    buttonProps={{
                        type: 'link',
                    }}
                    normal="customerAccount-authorizer-delete"
                    isSecond={true}
                    secondDom={<div>请确定是否要删除</div>}
                    secondVerify={(val) => {
                        if (val) {
                            handleDelete(record);
                        }
                    }}
                ></AuthButton>,
            ],
        },
    ];
    const handleDelete = (record: AuthorizerListItem) => {
        _fetchDeleteAuthorizer(record.authorizer_id);
    };

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);
    return (
        <div>
            <ProTable<AuthorizerListItem>
                columns={columns}
                params={{
                    member_id: accountInfo.member_id,
                }}
                request={async (params) => {
                    const res = await _fetchGetAuthorizerList({
                        page: params.current ?? 1,
                        size: params.pageSize ?? 20,
                        member_id: params.member_id,
                    });
                    return {
                        data: (res.data?.list ?? []).map((item) => ({
                            ...item,
                            birthday: moment.unix(+item.birthday).valueOf(),
                            permission: item.permission
                                ?.split(',')
                                ?.map((v) => +v) as any,
                            grade_list: item.grade_list?.map((v) => {
                                return {
                                    ...v,
                                    certificate_validity: v.certificate_validity
                                        ?.split('-')
                                        .map((g) => moment.unix(+g).valueOf()),
                                };
                            }) as any,
                            telephone_list: item.telephone_list?.map((v) => {
                                return {
                                    ...v,
                                    area_code: v.telephone.split('-')?.[0],
                                    telephone: v.telephone.split('-')?.[1],
                                    sending_method: v.sending_method
                                        ?.split(',')
                                        .map((t) => +t),
                                    phone: v.telephone,
                                };
                            }) as any,
                        })),
                        total: res.data?.total ?? 0,
                        success: true,
                    };
                }}
                rowKey={(item) => item.authorizer_id}
                search={{
                    labelWidth: 'auto',
                    span: 12,
                    defaultCollapsed: false,
                    optionRender: () => [
                        <AddAuthorizeForm
                            key="add"
                            type="add"
                            reloadData={reloadData}
                        ></AddAuthorizeForm>,
                    ],
                }}
                toolBarRender={false}
                actionRef={tableRef}
                scroll={{ x: 1000 }}
            />
        </div>
    );
};

export default AuthorizeList;
