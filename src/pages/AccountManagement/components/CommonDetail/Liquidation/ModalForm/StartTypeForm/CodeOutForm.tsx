import React, { FC, Fragment, memo } from 'react';
import {
    ProFormText,
    ProFormSelect,
    ProForm,
    ProFormList,
} from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getMemberCommission } from '@/api/account';
import {
    GetMemberCommissionParams,
    MemberCommissionItem,
} from '@/types/api/account';
import FormCurrency from '@/components/Currency/FormCurrency';

type CodeOutFormProps = {
    commissionParams: GetMemberCommissionParams;
    startType: number;
};

const CodeOutForm: FC<CodeOutFormProps> = memo(
    ({ commissionParams, startType }) => {
        const { fetchData: _fetchGetMemberCommission } = useHttp<
            GetMemberCommissionParams,
            MemberCommissionItem[]
        >(getMemberCommission);

        return (
            <Fragment>
                <ProForm.Group>
                    <ProForm.Item noStyle shouldUpdate>
                        {(form) => {
                            return (
                                <ProFormSelect
                                    label={
                                        startType === 1
                                            ? '占成数'
                                            : '台面占成数'
                                    }
                                    name="b_share_number"
                                    width="md"
                                    placeholder="请选择占成数"
                                    fieldProps={{
                                        getPopupContainer: (triggerNode) =>
                                            triggerNode.parentNode,
                                    }}
                                    showSearch
                                    request={async (params) => {
                                        if (Object.keys(params).length < 5) {
                                            return [];
                                        }
                                        let res =
                                            await _fetchGetMemberCommission(
                                                params,
                                            );
                                        if (res.code === 10000) {
                                            form.resetFields([
                                                'b_share_number',
                                            ]);
                                        }
                                        if (startType === 1) {
                                            return (res.data ?? []).map(
                                                (item, index) => {
                                                    return {
                                                        label:
                                                            item.shares_rate +
                                                            '%',
                                                        value: +item.shares_rate,
                                                    };
                                                },
                                            );
                                        } else {
                                            return (res.data ?? [])
                                                .filter((item) =>
                                                    item.principal_type.includes(
                                                        '台面',
                                                    ),
                                                )
                                                .map((item, index) => {
                                                    return {
                                                        label:
                                                            item.shares_rate +
                                                            '%',
                                                        value: +item.shares_rate,
                                                    };
                                                });
                                        }
                                    }}
                                    params={commissionParams}
                                    tooltip="请先选择货币类型，开工类型，出码类型，筹码类型"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择占成数',
                                        },
                                    ]}
                                />
                            );
                        }}
                    </ProForm.Item>
                    {startType === 2 && (
                        <ProForm.Item noStyle shouldUpdate>
                            {(form) => {
                                return (
                                    <ProFormSelect
                                        label="台底占成数"
                                        name="b_share_down_number"
                                        width="md"
                                        placeholder="请选择占成数"
                                        fieldProps={{
                                            getPopupContainer: (triggerNode) =>
                                                triggerNode.parentNode,
                                        }}
                                        showSearch
                                        request={async (params) => {
                                            if (
                                                Object.keys(params).length < 5
                                            ) {
                                                return [];
                                            }
                                            let res =
                                                await _fetchGetMemberCommission(
                                                    params,
                                                );
                                            if (res.code === 10000) {
                                                form.resetFields([
                                                    'b_share_down_number',
                                                ]);
                                            }
                                            return (res.data ?? [])
                                                .filter((item) =>
                                                    item.principal_type.includes(
                                                        '台底',
                                                    ),
                                                )
                                                .map((item, index) => {
                                                    return {
                                                        label:
                                                            item.shares_rate +
                                                            '%',
                                                        value: +item.shares_rate,
                                                    };
                                                });
                                        }}
                                        params={commissionParams}
                                        tooltip="请先选择货币类型，开工类型，出码类型，筹码类型"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择占成数',
                                            },
                                        ]}
                                    />
                                );
                            }}
                        </ProForm.Item>
                    )}

                    <FormCurrency
                        width="md"
                        name="b_share_deposit"
                        label="占成保证金"
                        placeholder="请输入占成保证金"
                    />
                </ProForm.Group>
            </Fragment>
        );
    },
);

export default CodeOutForm;
