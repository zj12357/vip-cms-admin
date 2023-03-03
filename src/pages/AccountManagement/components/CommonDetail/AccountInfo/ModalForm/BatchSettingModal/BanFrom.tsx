import React, { FC } from 'react';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { MarkerAllCreditListItem } from '@/types/api/account';
import { useLatest } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import FormCurrency from '@/components/Currency/FormCurrency';
import './index.scoped.scss';

type BanFormProps = {
    record: MarkerAllCreditListItem;
    reloadData: () => void;
};

export const BanForm: FC<BanFormProps> = ({ record }) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        adjustType: '禁批额度',
        used_amount: record.used_amount,
        available_amount: record.available_amount,
    }).current;

    return (
        <div>
            <ModalForm
                trigger={
                    <div className="m-primary-font-color pointer">详情</div>
                }
                title="批额设置"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                initialValues={updatedValues}
                submitter={false}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_code"
                        label="户口"
                        disabled
                    />
                    <ProFormText
                        width="md"
                        name="adjustType"
                        label="调整类型"
                        disabled
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_name"
                        label="户名"
                        disabled
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <FormCurrency
                        width="md"
                        name="used_amount"
                        label="已用额度"
                        disabled
                    />
                    <FormCurrency
                        width="md"
                        name="available_amount"
                        label="剩余额度"
                        disabled
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};
