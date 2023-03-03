import React, { FC } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormDatePicker,
} from '@ant-design/pro-components';
import { message, Button } from 'antd';
import { updateMarkerCredit, recoverMarkerCredit } from '@/api/account';
import {
    MarkerAllCreditListItem,
    UpdateMarkerCreditParams,
} from '@/types/api/account';
import { useHttp, useLatest } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import AuthButton from '@/components/AuthButton';
import FormCurrency from '@/components/Currency/FormCurrency';
import './index.scoped.scss';

export type CompanyFormProps = {
    record: MarkerAllCreditListItem;
    reloadData: () => void;
};
export const CompanyForm: FC<CompanyFormProps> = ({ record, reloadData }) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        adjustType: '公司批额',
        interest: record.interest,
        expired_day: record.expired_day,
        total_amount: record.total_amount,
        used_amount: record.used_amount,
        available_amount: record.available_amount,
    }).current;

    const { fetchData: _fetchUpdateMarkerCredit } = useHttp<
        UpdateMarkerCreditParams,
        null
    >(updateMarkerCredit, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const { fetchData: _fetchRecoverMarkerCredit } = useHttp<string, null>(
        recoverMarkerCredit,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const handleUpdateMarkerCredit = async (values: any) => {
        const params = {
            id: record.id,
            marker_type: 3,
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
                request={async () => {
                    return {
                        memberCode: 'OK1995',
                        memberName: '世界首富',
                    };
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
                <ProForm.Group>
                    <FormCurrency
                        width={230}
                        name="total_amount"
                        label="现有额度"
                        disabled
                        addonAfter={
                            <AuthButton
                                buttonProps={{
                                    type: 'primary',
                                }}
                                normal="customerAccount-batchSetting-recycle-quota"
                                isSecond={true}
                                secondDom={<div>请确定是否要回收额度</div>}
                                secondVerify={(val) => {
                                    if (val) {
                                        _fetchRecoverMarkerCredit(record.id);
                                    }
                                }}
                            ></AuthButton>
                        }
                    />
                    <ProFormText
                        width="md"
                        name="expired_day"
                        label="过期天数"
                        disabled
                    />
                </ProForm.Group>

                <ProForm.Group>
                    <FormCurrency
                        width="md"
                        name="amount"
                        label="调整额度"
                        placeholder="请输入调整额度"
                        rules={[
                            {
                                required: true,
                                message: '请输入调整额度',
                            },
                        ]}
                    />
                    <ProFormText
                        width="md"
                        name="interest"
                        label="罚息率"
                        disabled
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};
