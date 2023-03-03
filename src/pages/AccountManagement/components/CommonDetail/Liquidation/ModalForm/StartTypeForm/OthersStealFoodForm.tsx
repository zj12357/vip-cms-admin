import React, { FC, Fragment } from 'react';
import {
    ProFormText,
    ProFormSelect,
    ProForm,
    ProFormList,
} from '@ant-design/pro-components';
import { Row, Col, Divider } from 'antd';
import { isPositiveInteger } from '@/utils/validate';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import FormCurrency from '@/components/Currency/FormCurrency';
import { getMemberCodeList } from '@/api/account';
import { MemberCodeListItem, GetMemberCodeParams } from '@/types/api/account';
import { useHttp } from '@/hooks';

type OthersStealFoodFormProps = {};

const OthersStealFoodForm: FC<OthersStealFoodFormProps> = (props) => {
    const accountInfo = useAppSelector(selectAccountInfo);

    const { fetchData: _fetchMemberCodeList, response: memberList } = useHttp<
        GetMemberCodeParams,
        MemberCodeListItem[]
    >(getMemberCodeList);

    return (
        <Fragment>
            <ProFormList name="other_share" alwaysShowItemLabel>
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
                    <ProFormText
                        width="md"
                        name="share_number"
                        label="占成数"
                        placeholder="请输入占成数"
                        rules={[
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
                <FormCurrency
                    width="md"
                    name="share_deposit"
                    label="占成保证金"
                    placeholder="请输入占成保证金"
                />

                <Divider dashed></Divider>
            </ProFormList>
        </Fragment>
    );
};

export default OthersStealFoodForm;
