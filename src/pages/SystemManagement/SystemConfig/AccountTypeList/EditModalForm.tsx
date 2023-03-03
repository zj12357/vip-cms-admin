import React, { FC, memo, useState } from 'react';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useHttp } from '@/hooks';
import { updateMemberType, createMemberType } from '@/api/system';
import {
    UpdateMemberTypeParams,
    MemberTypeListItem,
    CreateMemberTypeParams,
} from '@/types/api/system';
import AuthButton from '@/components/AuthButton';

type CurrencyModalFormProps = {
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: MemberTypeListItem;
};

const CurrencyModalForm: FC<CurrencyModalFormProps> = memo(
    ({ reloadData, record, type }) => {
        const accountTitle: Record<string, string> = {
            add: '新增户口类型',
            edit: '编辑户口类型',
        };
        const [isPass, setIsPass] = useState(false); //操作码是否通过

        const { fetchData: _fetchCreateMemberType } = useHttp<
            CreateMemberTypeParams,
            null
        >(createMemberType, ({ msg }) => {
            message.success(msg);
            reloadData();
        });

        const { fetchData: _fetchUpdateMemberType } = useHttp<
            UpdateMemberTypeParams,
            null
        >(updateMemberType, ({ msg }) => {
            message.success(msg);
            reloadData();
        });

        const handleUpdateMemberType = async (values: any) => {
            let res: any;
            const commonParams = {
                name: values.name,
            };
            if (type === 'add') {
                res = await _fetchCreateMemberType({
                    ...commonParams,
                });
            } else if (type === 'edit') {
                res = await _fetchUpdateMemberType({
                    member_type_id: record?.member_type_id ?? 0,
                    ...commonParams,
                });
            }

            if (res.code === 10000) {
                setIsPass(false);
            }
        };
        return (
            <div>
                <ModalForm
                    trigger={
                        <AuthButton
                            normal={
                                type === 'add'
                                    ? 'account-type-add'
                                    : 'account-type-edit'
                            }
                            verify={(pass) => {
                                setIsPass(pass);
                            }}
                            buttonProps={{
                                type: type === 'add' ? 'primary' : 'link',
                            }}
                        ></AuthButton>
                    }
                    onFinish={handleUpdateMemberType}
                    title={accountTitle[type]}
                    style={{
                        maxHeight: '70vh',
                        overflowY: 'auto',
                    }}
                    modalProps={{
                        destroyOnClose: true,
                        onCancel: () => {
                            setIsPass(false);
                        },
                    }}
                    width={400}
                    initialValues={{
                        name: record?.name,
                    }}
                    visible={isPass}
                >
                    <ProForm.Group>
                        <ProFormText
                            name="name"
                            label="户口类型"
                            width="md"
                            placeholder="请输入户口类型"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入户口类型',
                                },
                            ]}
                        />
                    </ProForm.Group>
                </ModalForm>
            </div>
        );
    },
);

export default CurrencyModalForm;
