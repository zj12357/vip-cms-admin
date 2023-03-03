import React, { FC, useState, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { getAuthorizerAllList } from '@/api/account';
import { AuthorizerAllListItem } from '@/types/api/account';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
    selectAccountInfo,
    setAuthorizerInfo,
} from '@/store/account/accountSlice';
import { authorizePermissionType } from '@/common/commonConstType';

type VerifierProps = {
    member_id?: string;
};

const Verifier: FC<VerifierProps> = ({ member_id }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const accountInfo = useAppSelector(selectAccountInfo);
    const { fetchData: _fetchAuthorizerAllList } = useHttp<
        string,
        AuthorizerAllListItem[]
    >(getAuthorizerAllList);

    const handleAuthorizerInfo = (info: AuthorizerAllListItem) => {
        dispatch(setAuthorizerInfo(info));
        setVisible(false);
    };

    const columns: ProColumns<AuthorizerAllListItem>[] = [
        {
            title: '授权人姓名',
            dataIndex: 'authorizer_name',
        },

        {
            title: '权限',
            dataIndex: 'permission',
            valueType: 'checkbox',
            fieldProps: {
                options: authorizePermissionType,
            },
        },

        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <div
                    key="verification"
                    className="m-primary-font-color pointer"
                    onClick={() => handleAuthorizerInfo(record)}
                >
                    验证
                </div>,
            ],
        },
    ];
    useEffect(() => {
        return () => {
            dispatch(setAuthorizerInfo({} as AuthorizerAllListItem));
        };
    }, [dispatch]);
    return (
        <div>
            <ModalForm
                trigger={
                    <Button
                        type="primary"
                        onClick={() => {
                            console.log(accountInfo);
                            setVisible(true);
                        }}
                    >
                        选择验证人
                    </Button>
                }
                title="现场验证人"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setVisible(false);
                    },
                }}
                visible={visible}
            >
                <ProTable<AuthorizerAllListItem>
                    columns={columns}
                    request={async (params) => {
                        const res = await _fetchAuthorizerAllList(
                            member_id || accountInfo.member_id,
                        );
                        return {
                            data: res.data?.map((item) => {
                                return {
                                    ...item,
                                    permission: item.permission
                                        ?.split(',')
                                        ?.map((v) => +v) as any,
                                };
                            }),
                            success: true,
                        };
                    }}
                    rowKey={(record) => record.authorizer_id}
                    search={false}
                    toolBarRender={false}
                />
            </ModalForm>
        </div>
    );
};

export default Verifier;
