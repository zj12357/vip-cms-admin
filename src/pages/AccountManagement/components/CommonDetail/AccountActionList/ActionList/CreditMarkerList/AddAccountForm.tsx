import React, { FC, useState, memo, useRef } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, message, Row, Col, Modal, Form, Input, Tabs } from 'antd';
import { useHttp } from '@/hooks';
import { getMemberCodeList, getMemberIdentityList } from '@/api/account';
import {
    MemberCodeListItem,
    GetMemberCodeParams,
    GetMemberIdentityListItem,
    GetMemberIdentityParams,
} from '@/types/api/account';
import { getMemberTypeList } from '@/api/system';
import { MemberTypeListItem } from '@/types/api/system';

interface AddAccountFormProps {
    visible: boolean;
    onCancel: () => void;
    setAccountInfo: (params: MemberCodeListItem) => void;
}

const AddAccountForm: FC<AddAccountFormProps> = memo(
    ({ visible, onCancel, setAccountInfo }) => {
        const tableRef = useRef<ActionType>();

        const [searchValue, setSearchValue] = useState('');
        const [memberValue, setMemberValue] = useState<MemberCodeListItem>(
            {} as MemberCodeListItem,
        );

        const { fetchData: _fetchMemberCodeList } = useHttp<
            GetMemberCodeParams,
            MemberCodeListItem[]
        >(getMemberCodeList);

        //获取户口类型
        const { fetchData: _fetchGetMemberTypeList } = useHttp<
            null,
            MemberTypeListItem[]
        >(getMemberTypeList);

        //获取户口身份
        const { fetchData: _fetchMemberIdentityList } = useHttp<
            GetMemberIdentityParams,
            GetMemberIdentityListItem[]
        >(getMemberIdentityList);

        const SearchAccount = () => {
            const onFinish = (values: any) => {
                console.log('Success:', values);
                setSearchValue(values.search_value);
            };

            const onFinishFailed = (errorInfo: any) => {
                console.log('Failed:', errorInfo);
            };

            return (
                <Row>
                    <Col span={6}>添加户口</Col>
                    <Col>
                        <Form
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            style={{
                                display: 'flex',
                            }}
                        >
                            <Form.Item
                                name="search_value"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入户口号/户口名',
                                    },
                                ]}
                                initialValue={searchValue}
                            >
                                <Input
                                    placeholder="请先输入户口号/户口名进行查询"
                                    style={{ width: '300px' }}
                                />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                                <Row wrap={false}>
                                    <Col>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            搜索
                                        </Button>
                                    </Col>

                                    <Col offset={2}>
                                        <Button type="primary" htmlType="reset">
                                            重置
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            );
        };
        const columns: ProColumns<MemberCodeListItem>[] = [
            {
                dataIndex: 'member_code',
                title: '户口',
            },
            {
                dataIndex: 'member_name',
                title: '户名',
            },
            {
                dataIndex: 'member_type',
                title: '户口类型',
                valueType: 'select',
                fieldProps: {
                    fieldNames: {
                        label: 'name',
                        value: 'member_type_id',
                    },
                },
                request: async () => {
                    const { data } = await _fetchGetMemberTypeList();
                    return data;
                },
            },
            {
                dataIndex: 'identity',
                title: '身份',
                valueType: 'select',
                fieldProps: {
                    fieldNames: {
                        label: 'name',
                        value: 'member_identity_id',
                    },
                },
                request: async () => {
                    const res = await _fetchMemberIdentityList();
                    return res.data;
                },
            },
        ];

        const handleOk = () => {
            if (!searchValue) {
                message.error('请先输入户口号进行搜索');
                return;
            }
            onCancel();
            setAccountInfo(memberValue);
        };
        const handleCancel = () => {
            onCancel();
            setSearchValue('');
        };

        return (
            <Modal
                title={<SearchAccount></SearchAccount>}
                visible={visible}
                onCancel={handleCancel}
                width={800}
                onOk={handleOk}
                zIndex={1010}
                destroyOnClose
            >
                <div
                    style={{
                        maxHeight: '65vh',
                        overflowY: 'auto',
                    }}
                >
                    <ProTable
                        columns={columns}
                        headerTitle={false}
                        search={false}
                        options={false}
                        request={async (params: any) => {
                            if (!params.member_code) {
                                return {
                                    data: [],
                                };
                            }

                            const res = await _fetchMemberCodeList({
                                member_code: params.member_code,
                            });
                            return {
                                data: res.data,
                                success: true,
                            };
                        }}
                        params={{
                            member_code: searchValue,
                        }}
                        pagination={false}
                        rowSelection={{
                            alwaysShowAlert: false,
                            type: 'radio',
                            onSelect: (val) => {
                                setMemberValue(val);
                            },
                        }}
                        actionRef={tableRef}
                        rowKey={(record) => record.member_id}
                    />
                </div>
            </Modal>
        );
    },
);

export default AddAccountForm;
