import React, { FC } from 'react';
import { Descriptions, Row, Col, Divider } from 'antd';
import { ModalForm, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { OnlineAndOfflineListItem } from '@/types/api/accountAction';
import { useHttp } from '@/hooks';
import { getCreditDetailList } from '@/api/accountAction';
import {
    CreditDetailListItem,
    GetCreditDetailListParams,
} from '@/types/api/accountAction';
import { nanoid } from 'nanoid';
import Big from 'big.js';
import Currency from '@/components/Currency';

type UpDetailFormProps = {
    record: OnlineAndOfflineListItem;
};

const UpDetailList: FC<{ record: OnlineAndOfflineListItem }> = ({ record }) => {
    const batchTypeName: { [key: number]: string } = {
        1: '股东授信',
        2: '上线批额',
        3: '公司批额',
        4: '临时批额',
        5: '股本',
        6: '禁批额度',
    };
    const accountListColumns: ProColumns<CreditDetailListItem>[] = [
        {
            dataIndex: 'marker_type',
            title: '类型',
            render: (text, record, index, action) => {
                return <div>{batchTypeName[record.marker_type]}</div>;
            },
        },
        {
            title: '总额(万)',
            dataIndex: 'total_amount',
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.total_amount.toString()}></Currency>
                );
            },
        },
        {
            title: '已用额度(万)',
            dataIndex: 'used_amount',
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.used_amount.toString()}></Currency>
                );
            },
        },
        {
            title: '可用额度(万)',
            dataIndex: 'available_amount',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.available_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            title: '已签额度(万)',
            dataIndex: 'signed_amount',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.signed_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            title: '逾期金额(万)',
            dataIndex: 'overdue_amount',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.overdue_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            title: '未逾期金额(万)',
            render: (text, record, index, action) => {
                return (
                    <Currency
                        value={new Big(record.signed_amount ?? 0)
                            .sub(record.overdue_amount ?? 0)
                            .toNumber()}
                    ></Currency>
                );
            },
        },
    ];
    const { fetchData: _fetchMarkerAllCreditList } = useHttp<
        GetCreditDetailListParams,
        CreditDetailListItem[]
    >(getCreditDetailList);
    return (
        <div
            style={{
                marginBottom: '30px',
            }}
        >
            <ProTable<CreditDetailListItem>
                columns={accountListColumns}
                request={async (params) => {
                    const { data } = await _fetchMarkerAllCreditList({
                        member_code: record.member_code,
                        currency: record.currency,
                    });
                    return {
                        data: data,
                        success: true,
                    };
                }}
                rowKey={() => nanoid()}
                search={false}
                toolBarRender={false}
                pagination={false}
            />
        </div>
    );
};

const UpDetailForm: FC<UpDetailFormProps> = ({ record }) => {
    return (
        <ModalForm
            title="上线详情"
            trigger={<div className="m-primary-font-color pointer">详情</div>}
            modalProps={{
                destroyOnClose: true,
            }}
            width={1000}
            submitter={false}
        >
            <Descriptions>
                <Descriptions.Item label="户口">
                    {record.member_code}
                </Descriptions.Item>
                <Descriptions.Item label="上线户口">
                    {record.parent_member_code}
                </Descriptions.Item>
            </Descriptions>
            <Descriptions>
                <Descriptions.Item label="户名">
                    {record.member_name}
                </Descriptions.Item>
                <Descriptions.Item label="上线户名">
                    {record.parent_member_name}
                </Descriptions.Item>
            </Descriptions>

            <UpDetailList record={record}></UpDetailList>
        </ModalForm>
    );
};

export default UpDetailForm;
