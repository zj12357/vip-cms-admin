import React, { useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable, ProCard } from '@ant-design/pro-components';
import { useParams } from 'react-router-dom';
import { useHttp } from '@/hooks';
import { GetMixListParams, GetMixListType } from '@/types/api/account';
import { getMixList } from '@/api/account';
import { Row, Col, Collapse, Divider } from 'antd';
import { nanoid } from 'nanoid';
import { tableListDataSource } from '@/pages/AccountManagement/CompanyInternalCard';
import { hideMiddleNumber } from '@/utils/tools';
import './index.scoped.scss';

const MixSearchList: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { Panel } = Collapse;
    const {
        fetchData: _fetchGetMixList,
        response,
        loading,
    } = useHttp<GetMixListParams, GetMixListType>(getMixList);

    const columnsMemberList: ProColumns<any>[] = [
        {
            dataIndex: 'member_name',
            title: '户口名',
        },
        {
            dataIndex: 'member_code',
            title: '户口号',
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
                                {record.telephone?.map(
                                    (item: any, index: any) => (
                                        <Col span={24} key={index}>
                                            {hideMiddleNumber(item) ?? '-'}
                                            <Divider dashed></Divider>
                                        </Col>
                                    ),
                                )}
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
                                {record.certificate_list?.map(
                                    (item: any, index: any) => (
                                        <Col span={24} key={index}>
                                            <div>
                                                证件名：
                                                <span>
                                                    {item.certificate_name}
                                                </span>
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
                                    ),
                                )}
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

    const columnsCompanyList: ProColumns<any>[] = [
        {
            dataIndex: 'member_name',
            title: '户口名',
        },
        {
            dataIndex: 'member_code',
            title: '户口号',
        },

        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => {
                return (
                    <a
                        className="m-primary-font-color pointer"
                        href={`/account/companyAccountDetail/${record.member_code}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        进入户口详情
                    </a>
                );
            },
        },
    ];

    const columnsCompanyCardList: ProColumns<any>[] = [
        {
            dataIndex: 'card_name',
            title: '卡名',
        },
        {
            dataIndex: 'card_number',
            title: '卡号',
        },

        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => {
                return (
                    <a
                        className="m-primary-font-color pointer"
                        href={`/account/mixSearchList/${record.member_code}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        进入内部卡详情
                    </a>
                );
            },
        },
    ];
    useEffect(() => {
        _fetchGetMixList({
            member_code: id ?? '',
        });
    }, [_fetchGetMixList, id]);

    return (
        <ProCard>
            <div className="search-content">
                <h1 className="search-title">客户户口</h1>
                <ProTable<any>
                    columns={columnsMemberList}
                    dataSource={response?.memberList ?? []}
                    rowKey={() => nanoid()}
                    pagination={{
                        showQuickJumper: true,
                    }}
                    toolBarRender={false}
                    search={false}
                    loading={loading}
                />
            </div>
            <div className="search-content">
                <h1 className="search-title">公司户口</h1>
                <ProTable<any>
                    columns={columnsCompanyList}
                    dataSource={response?.companyList ?? []}
                    rowKey={() => nanoid()}
                    pagination={{
                        showQuickJumper: true,
                    }}
                    toolBarRender={false}
                    search={false}
                    loading={loading}
                />
            </div>
            <div className="search-content">
                <h1 className="search-title">公司内部卡</h1>
                <ProTable<any>
                    columns={columnsCompanyCardList}
                    dataSource={
                        response?.companyCardList?.card_no
                            ? [
                                  {
                                      card_name: tableListDataSource.find(
                                          (item) =>
                                              item.cardNumber ===
                                              response?.companyCardList
                                                  ?.card_no,
                                      )?.cardName,
                                      card_number:
                                          response?.companyCardList?.card_no,
                                  },
                              ]
                            : []
                    }
                    rowKey={() => nanoid()}
                    pagination={{
                        showQuickJumper: true,
                    }}
                    toolBarRender={false}
                    search={false}
                    loading={loading}
                />
            </div>
        </ProCard>
    );
};

export default MixSearchList;
