import React, { FC } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormCheckbox,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { createMemberIdentity, updateMemberIdentity } from '@/api/system';
import {
    CreateMemberIdentityParams,
    UpdateMemberIdentityParams,
    GetMemberIdentityListItem,
} from '@/types/api/system';

type AccountIdentityModalFormProps = {
    trigger: JSX.Element;
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: GetMemberIdentityListItem;
};

const AccountIdentityModalForm: FC<AccountIdentityModalFormProps> = ({
    trigger,
    type,
    reloadData,
    record,
}) => {
    const identityTitle: Record<string, string> = {
        add: '新增身份',
        edit: '编辑身份',
    };

    const updatedValues = useLatest({
        name: record?.name ?? '',
    }).current;

    const { fetchData: _fetchCreateMemberIdentity } = useHttp<
        CreateMemberIdentityParams,
        null
    >(createMemberIdentity, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const { fetchData: _fetchUpdateMemberIdentity } = useHttp<
        UpdateMemberIdentityParams,
        null
    >(updateMemberIdentity, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const handleMemberIdentity = (type: 'add' | 'edit', name: string) => {
        if (type === 'add') {
            return _fetchCreateMemberIdentity({
                name,
            });
        } else if (type === 'edit') {
            return _fetchUpdateMemberIdentity({
                name,
                member_identity_id: record?.member_identity_id ?? 0,
            });
        }
    };

    return (
        <div>
            <ModalForm
                trigger={trigger}
                onFinish={async (values: any) => {
                    let res = await handleMemberIdentity(type, values.name);
                    if (res?.code === 10000) {
                        return true;
                    }
                }}
                title={identityTitle[type]}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                width={400}
                initialValues={updatedValues}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="name"
                        label="户口身份名称"
                        placeholder="请输入户口身份名称"
                        rules={[
                            {
                                required: true,
                                message: '请输入户口身份名称',
                            },
                        ]}
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};

export default AccountIdentityModalForm;
