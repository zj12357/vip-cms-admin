import React, { FC, Fragment, useState } from 'react';
import {
    ProFormText,
    ProFormSelect,
    ProForm,
    ProFormList,
} from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { isPositiveInteger, isPositiveNumber } from '@/utils/validate';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import FormCurrency from '@/components/Currency/FormCurrency';
import { getMemberCodeList } from '@/api/account';
import { MemberCodeListItem, GetMemberCodeParams } from '@/types/api/account';
import _ from 'lodash';

type StealFoodFormProps = {};

const StealFoodForm: FC<StealFoodFormProps> = (props) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const [memberName, setMemberName] = useState('');
    const [submMemberName, setSubMemberName] = useState('');

    const { fetchData: _fetchMemberCodeList, response: memberList } = useHttp<
        GetMemberCodeParams,
        MemberCodeListItem[]
    >(getMemberCodeList);

    return (
        <Fragment>
            <ProForm.Group>
                <ProFormSelect
                    width="md"
                    name="share_member"
                    label="占成户口"
                    placeholder="请输入占成户口"
                    rules={[
                        {
                            validator: async (_, value) => {
                                if (value === accountInfo.member_code) {
                                    return Promise.reject(
                                        '输入的占成户口不能是自己',
                                    );
                                }
                                return true;
                            },
                        },
                    ]}
                    fieldProps={{
                        getPopupContainer: (triggerNode) =>
                            triggerNode.parentNode,
                        onSelect: (value: string) => {
                            const name = memberList?.find(
                                (item) => item.member_code === value,
                            )?.member_name;
                            setMemberName(name ?? '');
                        },
                        onClear: () => {
                            setMemberName('');
                        },
                    }}
                    request={async ({ keyWords }) => {
                        if (keyWords) {
                            const res = await _fetchMemberCodeList({
                                member_code: keyWords,
                            });
                            return res.data?.map((item) => {
                                return {
                                    label: item.member_code,
                                    value: item.member_code,
                                };
                            });
                        }

                        return [];
                    }}
                    debounceTime={500}
                    showSearch
                />
                {memberName && (
                    <ProFormText
                        width="md"
                        label="占成户口名"
                        placeholder="占成户口名"
                        disabled
                        fieldProps={{
                            value: memberName,
                        }}
                    />
                )}

                <ProFormText
                    width="md"
                    name="share_number"
                    label="占成数"
                    placeholder="请输入占成数"
                    rules={[
                        {
                            required: memberName ? true : false,
                            message: '请输入占成数',
                        },
                        {
                            pattern: isPositiveInteger,
                            message: '请输入整数',
                        },
                        {
                            validator: async (_, value) => {
                                if (+value > 80) {
                                    return Promise.reject(
                                        '输入的数字不能大于80',
                                    );
                                }
                                return true;
                            },
                        },
                    ]}
                    fieldProps={{
                        addonAfter: '%',
                    }}
                />
            </ProForm.Group>
            <ProForm.Group>
                <FormCurrency
                    width="md"
                    name="share_deposit"
                    label="占成保证金"
                    placeholder="请输入占成保证金"
                />
                <ProFormText
                    width="md"
                    name="commission_rate"
                    label="佣金率"
                    placeholder="请输入佣金率"
                    rules={[
                        {
                            required: memberName ? true : false,
                            message: '请输入佣金率',
                        },
                        {
                            pattern: isPositiveNumber,
                            message: '请输入数字',
                        },
                        {
                            validator: async (_, value) => {
                                if (+value > 100) {
                                    return Promise.reject(
                                        '输入的数字不能大于100',
                                    );
                                }
                                return true;
                            },
                        },
                    ]}
                    fieldProps={{
                        addonAfter: '%',
                    }}
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormSelect
                    width="md"
                    name="share_member_other"
                    label="占成户口"
                    placeholder="请输入占成户口"
                    rules={[
                        {
                            validator: async (_, value) => {
                                if (value === accountInfo.member_code) {
                                    return Promise.reject(
                                        '输入的占成户口不能是自己',
                                    );
                                }
                                return true;
                            },
                        },
                    ]}
                    fieldProps={{
                        getPopupContainer: (triggerNode) =>
                            triggerNode.parentNode,
                        onSelect: (value: string) => {
                            const name = memberList?.find(
                                (item) => item.member_code === value,
                            )?.member_name;
                            setSubMemberName(name ?? '');
                        },
                        onClear: () => {
                            setSubMemberName('');
                        },
                    }}
                    request={async ({ keyWords }) => {
                        if (keyWords) {
                            const res = await _fetchMemberCodeList({
                                member_code: keyWords,
                            });
                            return res.data?.map((item) => {
                                return {
                                    label: item.member_code,
                                    value: item.member_code,
                                };
                            });
                        }

                        return [];
                    }}
                    debounceTime={500}
                    showSearch
                />
                {submMemberName && (
                    <ProFormText
                        width="md"
                        label="占成户口名"
                        placeholder="占成户口名"
                        disabled
                        fieldProps={{
                            value: submMemberName,
                        }}
                    />
                )}
                <FormCurrency
                    width="md"
                    name="share_deposit_other"
                    label="占成保证金"
                    placeholder="请输入占成保证金"
                />
                <ProFormText
                    width="md"
                    name="share_number_other"
                    label="占成数"
                    placeholder="请输入占成数"
                    rules={[
                        {
                            required: submMemberName ? true : false,
                            message: '请输入占成数',
                        },
                        {
                            pattern: isPositiveInteger,
                            message: '请输入整数',
                        },
                        {
                            validator: async (_, value) => {
                                if (+value > 80) {
                                    return Promise.reject(
                                        '输入的数字不能大于80',
                                    );
                                }
                                return true;
                            },
                        },
                    ]}
                    fieldProps={{
                        addonAfter: '%',
                    }}
                />
            </ProForm.Group>
        </Fragment>
    );
};

export default StealFoodForm;
