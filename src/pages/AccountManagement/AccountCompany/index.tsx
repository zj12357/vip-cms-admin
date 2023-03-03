import React, { FC } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import AddCompany from './AddCompany';
import { useHttp, useNewWindow } from '@/hooks';
import { useAppDispatch } from '@/store/hooks';
import { getCompanyMember } from '@/api/account';
import { GetCompanyMemberType } from '@/types/api/account';
import { setDetailPageInfo } from '@/store/common/commonSlice';
import { isObject } from '@/utils/tools';
import _ from 'lodash';
import './index.scoped.scss';

type AccountCompanyProps = {};

const AccountCompany: FC<AccountCompanyProps> = (props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { toNewWindow } = useNewWindow();
    const { fetchData: _fetchCompanyMember } = useHttp<
        string,
        GetCompanyMemberType & GetCompanyMemberType[]
    >(getCompanyMember);

    const onFinish = async (values: any) => {
        const { data } = await _fetchCompanyMember(values.member_code);

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
                path: '/account/companySearchList',
                backPath: '/account/company',
                title: '返回户口搜索',
            }),
        );
        navigate(`/account/companySearchList/${id}`);
    };

    const toDetailPage = (id: string) => {
        _.delay(() => {
            toNewWindow(`/account/companyAccountDetail/${id}`);
        }, 100);
    };

    return (
        <ProCard
            style={{
                height: 'calc(100vh - 200px)',
            }}
        >
            <div className="m-account-company-box">
                <div className="m-account-company-logo">
                    <img
                        src={
                            require('@/assets/images/icons/logo-large-icon.svg')
                                .default
                        }
                        alt=""
                        className="m-logo"
                    />
                </div>
                <div className="m-account-company-search">
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
                                    message: '请输入户口名进行查询',
                                },
                            ]}
                        >
                            <Input
                                placeholder="请输入户口名进行查询"
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
                    <AddCompany></AddCompany>
                </div>
            </div>
        </ProCard>
    );
};

export default AccountCompany;
