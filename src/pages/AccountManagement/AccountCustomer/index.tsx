import React, { FC } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { Form, Input, Button, message } from 'antd';
import AddCustomer from '../AccountCustomer/AddCustomer';
import { setDetailPageInfo } from '@/store/common/commonSlice';
import {
    GetAccountParams,
    AccountListItem,
    AccountSingle,
} from '@/types/api/account';
import { useHttp, useNewWindow } from '@/hooks';
import { getAccountList } from '@/api/account';
import { isObject } from '@/utils/tools';
import _ from 'lodash';
import './index.scoped.scss';

type AccountCustomerProps = {};

const AccountCustomer: FC<AccountCustomerProps> = (props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { toNewWindow } = useNewWindow();

    const onFinish = async (values: GetAccountParams) => {
        const { data } = await _fetchDataAccountList({
            member_code: values.member_code,
        });

        if (data?.length === 0 || !data) {
            message.info('没有搜到结果');
            return;
        }
        if (_.isArray(data) && data?.length > 1) {
            toSearchListPage(values.member_code);
        } else if (_.isArray(data) && data?.length === 1) {
            toDetailPage(data[0]?.member_code);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const toSearchListPage = (id: string) => {
        dispatch(
            setDetailPageInfo({
                path: `/account/customerSearchList/${id}`,
                backPath: '/account/customer',
                title: '返回户口搜索',
            }),
        );
        navigate(`/account/customerSearchList/${id}`);
    };

    const toDetailPage = (id: string) => {
        _.delay(() => {
            toNewWindow(`/account/customerAccountDetail/${id}`);
        }, 100);
    };

    const { fetchData: _fetchDataAccountList } = useHttp<
        GetAccountParams,
        AccountListItem[] & AccountSingle
    >(getAccountList);

    return (
        <ProCard
            style={{
                height: 'calc(100vh - 200px)',
            }}
        >
            <div className="m-account-customer-box">
                <div className="m-account-customer-logo">
                    <img
                        src={
                            require('@/assets/images/icons/logo-large-icon.svg')
                                .default
                        }
                        alt=""
                        className="m-logo"
                    />
                </div>
                <div className="m-account-customer-search">
                    <Form
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        style={{
                            display: 'flex',
                        }}
                    >
                        <Form.Item
                            name="member_code"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        '请输入户口名/户名/手机号/证件名进行查询',
                                },
                            ]}
                        >
                            <Input
                                placeholder="输入户口名/户名/手机号/证件名进行查询"
                                style={{ width: '500px' }}
                            />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="m-account-add">
                    <AddCustomer></AddCustomer>
                </div>
            </div>
        </ProCard>
    );
};

export default AccountCustomer;
