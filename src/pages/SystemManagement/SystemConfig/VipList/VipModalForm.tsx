import React, { FC, useState } from 'react';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { createVip, updateVip } from '@/api/system';
import {
    CreateVipParams,
    UpdateVipParams,
    VipListItem,
} from '@/types/api/system';
import { isPositiveNumber } from '@/utils/validate';
import AuthButton from '@/components/AuthButton';

type VipModalFormProps = {
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: VipListItem;
};

const VipModalForm: FC<VipModalFormProps> = ({ type, reloadData, record }) => {
    const [isPass, setIsPass] = useState(false); //操作码是否通过

    const vipTitle: Record<string, string> = {
        add: ' 新增等级',
        edit: '编辑等级',
    };

    const updatedValues = useLatest({
        vip_level_name: record?.vip_level_name,
        promotion_amount: record?.promotion_amount,
        keep_amount: record?.keep_amount,
    }).current;

    const { fetchData: _fetchCreateVip } = useHttp<CreateVipParams, null>(
        createVip,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const { fetchData: _fetchUpdateVip } = useHttp<UpdateVipParams, null>(
        updateVip,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const handleVip = (values: any) => {
        const commonParams = {
            vip_level_name: values.vip_level_name,
            promotion_amount: +values.promotion_amount,
            keep_amount: +values.keep_amount,
        };
        if (type === 'add') {
            return _fetchCreateVip({
                ...commonParams,
            });
        } else if (type === 'edit') {
            return _fetchUpdateVip({
                id: record?.id ?? 0,
                ...commonParams,
            });
        }
    };
    return (
        <div>
            <ModalForm
                trigger={
                    type === 'add' ? (
                        <AuthButton
                            normal="vip-add"
                            verify={(pass) => {
                                setIsPass(pass);
                            }}
                            buttonProps={{
                                type: 'primary',
                            }}
                        ></AuthButton>
                    ) : (
                        <AuthButton
                            normal="vip-edit"
                            verify={(pass) => {
                                setIsPass(pass);
                            }}
                            buttonProps={{
                                type: 'link',
                                style: {
                                    padding: '4px',
                                },
                            }}
                        ></AuthButton>
                    )
                }
                onFinish={async (values: any) => {
                    const res = await handleVip(values);
                    if (res?.code === 10000) {
                        setIsPass(false);
                    }
                }}
                title={vipTitle[type]}
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
                visible={isPass}
                initialValues={updatedValues}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="vip_level_name"
                        label="等级名称"
                        placeholder="请输入等级名称"
                        rules={[
                            {
                                required: true,
                                message: '请输入等级名称',
                            },
                        ]}
                    />
                    <ProFormText
                        width="md"
                        name="promotion-params"
                        label="晋级参数"
                        disabled
                        initialValue="转码量"
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="promotion_amount"
                        label="晋级转码量"
                        placeholder="请输入所需转码量"
                        rules={[
                            {
                                required: true,
                                message: '请输入所需转码量',
                            },
                            {
                                pattern: isPositiveNumber,
                                message: '请输入数字',
                            },
                        ]}
                    />
                    <ProFormText
                        width="md"
                        name="keep_amount"
                        label="保级转码量"
                        placeholder="请输入所需转码量"
                        rules={[
                            {
                                required: true,
                                message: '请输入所需转码量',
                            },
                            {
                                pattern: isPositiveNumber,
                                message: '请输入数字',
                            },
                        ]}
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};

export default VipModalForm;
