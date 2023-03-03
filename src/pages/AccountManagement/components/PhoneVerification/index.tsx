/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useState } from 'react';
import { ProTable, ModalForm } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message, Popover, List } from 'antd';
import { hideMiddleNumber } from '@/utils/tools';
import { useHttp } from '@/hooks';
import { getAuthorizerAllList, createVerifyPhoneRecord } from '@/api/account';
import {
    AuthorizerAllListItem,
    CreateVerifyPhoneRecordParams,
} from '@/types/api/account';
import { authorizePermissionType } from '@/common/commonConstType';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { usePhone } from '@/pages/Communication/Telephone/CallModal/usePhone';
import { selectKyc, setKyc } from '@/store/communication/communicationSlice';
import { useDispatch } from 'react-redux';
import './index.scoped.scss';
import type { ProFormInstance } from '@ant-design/pro-components';

type PhoneVerificationProps = {
    for: string;
    form: React.MutableRefObject<ProFormInstance<any> | undefined>;
    identity_module: number;
};

const PhoneVerificationRecord: FC<any> = ({
    for: why,
    handleAuthorizerInfo,
}) => {
    const { onDial } = usePhone();

    const [popoverVisible, setPopoverVisible] = useState(false);
    const accountInfo = useAppSelector(selectAccountInfo);
    const handlePopoverVisible = (visible: boolean) => {
        setPopoverVisible(visible);
    };

    const { fetchData: _fetchAuthorizerAllList } = useHttp<
        string,
        AuthorizerAllListItem[]
    >(getAuthorizerAllList);

    const columns: ProColumns<AuthorizerAllListItem>[] = [
        {
            dataIndex: 'authorizer_name',
            title: '授权人姓名',
        },

        {
            dataIndex: 'permission',
            title: '权限',
            valueType: 'checkbox',
            fieldProps: {
                options: authorizePermissionType,
            },
        },

        {
            valueType: 'option',
            title: '操作',
            render: (text, record, _, action) => [
                <Popover
                    key="verify"
                    placement="top"
                    trigger="click"
                    // visible={popoverVisible}
                    // onVisibleChange={handlePopoverVisible}
                    content={
                        <List
                            dataSource={record.telephone_list || []}
                            renderItem={(item, index) => (
                                <List.Item
                                    key={index}
                                    // onClick={() => handlePopoverVisible(false)}
                                >
                                    <span style={{ marginRight: '14px' }}>
                                        {hideMiddleNumber(item.telephone ?? '')}
                                    </span>
                                    <div
                                        className="m-primary-font-color pointer"
                                        onClick={() => {
                                            onDial(item.telephone, why);
                                            handleAuthorizerInfo(record);
                                        }}
                                    >
                                        呼叫
                                    </div>
                                </List.Item>
                            )}
                        ></List>
                    }
                >
                    <div className="m-primary-font-color pointer">验证</div>
                </Popover>,
            ],
        },
    ];

    return (
        <>
            <ProTable<AuthorizerAllListItem>
                columns={columns}
                request={async () => {
                    const res = await _fetchAuthorizerAllList(
                        accountInfo.member_id,
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
                rowKey={(item) => item.authorizer_id}
                pagination={{
                    showQuickJumper: true,
                }}
                toolBarRender={false}
                search={false}
            />
        </>
    );
};

const PhoneVerification: FC<PhoneVerificationProps> = ({
    for: why,
    form,
    identity_module,
}) => {
    let dispath = useDispatch();
    const [visible, setVisible] = useState<boolean>(false);
    const { status } = useAppSelector(selectKyc) || {};
    const accountInfo = useAppSelector(selectAccountInfo);
    const [authorizerInfo, setAuthorizerInfo] = useState<AuthorizerAllListItem>(
        {} as AuthorizerAllListItem,
    );

    const { fetchData: _fetchCreateVerifyPhoneRecord } = useHttp<
        CreateVerifyPhoneRecordParams,
        null
    >(createVerifyPhoneRecord);

    useEffect(() => {
        if (status !== undefined) {
            setVisible(false);
        }

        if (status !== null) {
            form.current?.setFieldsValue({
                phone_verifier_pass: status,
            });
            if (authorizerInfo?.authorizer_id) {
                if (status === false) {
                    _fetchCreateVerifyPhoneRecord({
                        member_code: accountInfo.member_code,
                        identity_module,
                        status: 2,
                        authorizer_id: authorizerInfo?.authorizer_id,
                    });
                } else if (status === true) {
                    _fetchCreateVerifyPhoneRecord({
                        member_code: accountInfo.member_code,
                        identity_module,
                        status: 1,
                        authorizer_id: authorizerInfo?.authorizer_id,
                    });
                }
            }
        }
    }, [status]);

    useEffect(() => {
        dispath(
            setKyc({
                for: '',
                callId: '',
                status: undefined,
            }),
        );
    }, []);

    const btnText = useMemo(() => {
        switch (status) {
            case undefined:
                return '电话验证';
            case null:
                return '验证中';
            case false:
                return '验证失败';
            case true:
                return '验证成功';
        }
    }, [status]);

    return (
        <ModalForm
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    setVisible(false);
                },
                maskClosable: false,
            }}
            visible={visible}
            trigger={
                <Button
                    type="primary"
                    loading={status === null}
                    disabled={status === true || status === null}
                    onClick={() => {
                        setVisible(true);
                    }}
                    className={`btn 
                        ${
                            status === null
                                ? 'progress'
                                : status === false
                                ? 'falil'
                                : status === true
                                ? 'success'
                                : ''
                        }
                    `}
                >
                    {btnText}
                </Button>
            }
            onFinish={async (values: any) => {
                setVisible(false);
            }}
            title="电话验证"
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
        >
            <PhoneVerificationRecord
                for={why}
                handleAuthorizerInfo={(val: AuthorizerAllListItem) => {
                    setAuthorizerInfo(val);
                }}
            ></PhoneVerificationRecord>
        </ModalForm>
    );
};

export default PhoneVerification;
