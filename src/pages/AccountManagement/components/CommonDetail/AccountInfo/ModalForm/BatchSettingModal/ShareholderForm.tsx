import React, { FC, useState } from 'react';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { message, Button } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { backMarkerCredit } from '@/api/account';
import { MarkerAllCreditListItem } from '@/types/api/account';
import AuthButton from '@/components/AuthButton';
import FormCurrency from '@/components/Currency/FormCurrency';
import './index.scoped.scss';

type ShareholderFormProps = {
    record: MarkerAllCreditListItem;
    reloadData: () => void;
};
export const ShareholderForm: FC<ShareholderFormProps> = ({
    record,
    reloadData,
}) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        adjustType: '股东授信',
        interest: record.interest,
        expired_day: record.expired_day,
        total_amount: record.total_amount,
        used_amount: record.used_amount,
        available_amount: record.available_amount,
    }).current;

    const { fetchData: _fetchBackMarkerCredit } = useHttp<string, null>(
        backMarkerCredit,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

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
                <ProForm.Group>
                    <FormCurrency
                        width={230}
                        name="total_amount"
                        label="股东额度"
                        disabled
                        addonAfter={
                            <AuthButton
                                buttonProps={{
                                    type: 'primary',
                                }}
                                normal="customerAccount-batchSetting-return-quota"
                                isSecond={true}
                                secondDom={<div>请确定是否要归还额度</div>}
                                secondVerify={(val) => {
                                    if (val) {
                                        _fetchBackMarkerCredit(record.id);
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
                <div className="m-left-offset">
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="interest"
                            label="罚息率"
                            disabled
                        />
                    </ProForm.Group>
                </div>
            </ModalForm>
        </div>
    );
};
