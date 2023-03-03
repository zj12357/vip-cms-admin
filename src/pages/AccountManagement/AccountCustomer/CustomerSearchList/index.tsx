import React from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable, ProCard } from '@ant-design/pro-components';
import { useParams } from 'react-router-dom';
import Opcode from '@/components/Opcode';
import { useHttp } from '@/hooks';
import { getAccountList } from '@/api/account';
import { AccountListItem, GetAccountParams } from '@/types/api/account';
import { Row, Col, Collapse, Divider } from 'antd';
import { nanoid } from 'nanoid';
import { hideMiddleNumber } from '@/utils/tools';

const CustomerSearchListList: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { Panel } = Collapse;
    const { fetchData: _fetchDataAccountList } = useHttp<
        GetAccountParams,
        AccountListItem[]
    >(getAccountList);

    const columns: ProColumns<AccountListItem>[] = [
        {
            dataIndex: 'member_name',
            title: '户口名称',
        },
        {
            dataIndex: 'member_code',
            title: '户口名',
        },
        {
            dataIndex: 'telephone',
            width: '20%',
            title: '手机号',
            render: (text, record, _, action) => {
                return (
                    <Collapse>
                        <Panel header="手机号" key="1">
                            <Row wrap={true}>
                                {record.telephone?.map((item, index) => (
                                    <Col span={24} key={index}>
                                        {hideMiddleNumber(item) ?? '-'}
                                        <Divider dashed></Divider>
                                    </Col>
                                ))}
                            </Row>
                        </Panel>
                    </Collapse>
                );
            },
        },
        {
            dataIndex: 'certificate_list',
            title: '证件信息',
            width: '20%',
            render: (text, record, _, action) => {
                return (
                    <Collapse>
                        <Panel header="证件信息" key="1">
                            <Row wrap={true}>
                                {record.certificate_list?.map((item, index) => (
                                    <Col span={24} key={index}>
                                        <div>
                                            证件名：
                                            <span>{item.certificate_name}</span>
                                        </div>
                                        <div>
                                            证件号码：
                                            <span>
                                                {hideMiddleNumber(
                                                    item.certificate_number,
                                                ) ?? '-'}
                                            </span>
                                        </div>
                                        <Divider dashed></Divider>
                                    </Col>
                                ))}
                            </Row>
                        </Panel>
                    </Collapse>
                );
            },
        },

        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => {
                return (
                    <a
                        className="m-primary-font-color pointer"
                        href={`/account/customerAccountDetail/${record.member_code}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        进入户口详情
                    </a>
                );
            },
        },
    ];

    return (
        <ProCard>
            <ProTable<AccountListItem>
                columns={columns}
                request={async () => {
                    const res = await _fetchDataAccountList({
                        member_code: id ?? '',
                    });
                    return {
                        data: res.data ?? [],
                        success: true,
                    };
                }}
                rowKey={() => nanoid()}
                pagination={{
                    showQuickJumper: true,
                }}
                toolBarRender={false}
                search={false}
            />
        </ProCard>
    );
};

export default CustomerSearchListList;
