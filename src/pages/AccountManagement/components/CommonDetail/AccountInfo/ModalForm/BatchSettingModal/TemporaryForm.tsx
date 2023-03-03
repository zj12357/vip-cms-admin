import React, { FC } from 'react';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { message, Button } from 'antd';
import { updateMarkerCredit } from '@/api/account';
import {
    MarkerAllCreditListItem,
    UpdateMarkerCreditParams,
} from '@/types/api/account';
import { useHttp, useLatest } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import FormCurrency from '@/components/Currency/FormCurrency';
import './index.scoped.scss';

type TemporaryFormProps = {
    record: MarkerAllCreditListItem;
    reloadData: () => void;
};

export const TemporaryForm: FC<TemporaryFormProps> = ({
    record,
    reloadData,
}) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        adjustType: '股本额度',
        total_amount: record.total_amount,
    }).current;

    const { fetchData: _fetchUpdateMarkerCredit } = useHttp<
        UpdateMarkerCreditParams,
        null
    >(updateMarkerCredit, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const handleUpdateMarkerCredit = async (values: any) => {
        const params = {
            id: record.id,
            marker_type: 5,
            amount: +values.amount,
            currency: record.currency,
        };
        const res = await _fetchUpdateMarkerCredit(params);
        if (res.code === 10000) {
            return true;
        }
    };
    return (
        <div>
            <ModalForm
                trigger={
                    <div className="m-primary-font-color pointer">调整</div>
                }
                onFinish={handleUpdateMarkerCredit}
                title="批额设置"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                initialValues={updatedValues}
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
                        name="total_amount"
                        label="现有股本"
                        disabled
                    />
                </ProForm.Group>

                <ProForm.Group>
                    <FormCurrency
                        width="md"
                        name="amount"
                        label="调整股本"
                        placeholder="请输入调整股本"
                        rules={[
                            {
                                required: true,
                                message: '请输入调整股本',
                            },
                        ]}
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};
