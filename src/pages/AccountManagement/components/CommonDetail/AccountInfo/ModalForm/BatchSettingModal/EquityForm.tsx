import React, { FC } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
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
import './index.scoped.scss';
import moment from 'moment';
import FormCurrency from '@/components/Currency/FormCurrency';

type EquityFormProps = {
    record: MarkerAllCreditListItem;
    reloadData: () => void;
};

export const EquityForm: FC<EquityFormProps> = ({ record, reloadData }) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        adjustType: '临时批额',
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
            marker_type: 4,
            amount: +values.amount,
            currency: record.currency,
            invalid_at: values.invalid_at,
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
                <ProForm.Group>
                    <ProFormDatePicker
                        name="invalid_at"
                        label="失效时间"
                        width={200}
                        fieldProps={{
                            getPopupContainer: (triggerNode) => triggerNode,
                        }}
                        placeholder="请选择失效时间"
                        rules={[
                            {
                                required: true,
                                message: '请选择失效时间',
                            },
                        ]}
                        transform={(val) => ({
                            invalid_at: moment(val).unix(),
                        })}
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};
