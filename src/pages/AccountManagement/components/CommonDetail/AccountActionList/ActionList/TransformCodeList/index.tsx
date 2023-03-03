import React, { FC } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { useHttp } from '@/hooks';
import { getTranscodingDetailList } from '@/api/accountAction';
import {
    GetTranscodingDetailListParams,
    TranscodingDetailDataListItem,
} from '@/types/api/accountAction';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import { shareType, principalType, workType } from '@/common/commonConstType';
import Currency from '@/components/Currency';
import { nanoid } from 'nanoid';

type TransformCodeListProps = {};

type TransformTableProps = {
    type: number;
};

const TransformTable: FC<TransformTableProps> = ({ type }) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const { fetchData: _fetchTranscodingDetailList } = useHttp<
        GetTranscodingDetailListParams,
        TranscodingDetailDataListItem[]
    >(getTranscodingDetailList);
    const currencyList = useAppSelector(selectCurrencyList);
    const currentHall = useAppSelector(selectCurrentHall);

    const columns: ProColumns<TranscodingDetailDataListItem>[] = [
        {
            title: '开工类型',
            dataIndex: 'start_work_type',
            valueType: 'select',
            fieldProps: {
                options: workType,
            },
        },

        {
            title: '货币类型',
            dataIndex: 'currency',
            valueType: 'select',
            fieldProps: {
                options: [{ label: 'All', value: 0 }, ...currencyList],
                defaultValue: 0,
            },
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '请选择货币类型',
                    },
                ],
            },
        },
        {
            title: '本金类型',
            dataIndex: 'shares_type',
            valueType: 'select',
            fieldProps: {
                options: shareType,
            },
        },
        {
            title: '出码类型',
            dataIndex: 'principal_type',
            valueType: 'select',
            fieldProps: {
                options: principalType,
            },
        },
        {
            title: '占成上限',
            dataIndex: 'shares_rate',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <span>
                        {text?.toString() && text !== '-' ? `${text}%` : '-'}
                    </span>
                );
            },
        },
        {
            title: '转码数',
            dataIndex: 'amount',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return <Currency value={record.amount.toString()}></Currency>;
            },
        },
        {
            title: '已结转码',
            dataIndex: 'settle_amount',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.settle_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            title: '未结转码',
            dataIndex: 'un_settle_amount',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.un_settle_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            title: '已出佣金',
            dataIndex: 'settle_commission',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.settle_commission.toString()}
                    ></Currency>
                );
            },
        },

        {
            title: '未出佣金',
            dataIndex: 'un_settle_commission',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.un_settle_commission.toString()}
                    ></Currency>
                );
            },
        },

        {
            title: '佣金率',
            dataIndex: 'commission_rate',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <span>
                        {text?.toString() && text !== '-' ? `${text}%` : '-'}
                    </span>
                );
            },
        },
    ];

    return (
        <div>
            <ProTable<TranscodingDetailDataListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchTranscodingDetailList({
                        member_id: accountInfo.member_id,
                        currency: params.currency ?? 0,
                        shares_type: params.shares_type,
                        principal_type: params.principal_type,
                        start_work_type: params.start_work_type,
                        hall: currentHall.id,
                    });

                    return {
                        data: res?.data ?? [],
                        success: true,
                    };
                }}
                rowKey={() => nanoid()}
                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                }}
                toolBarRender={false}
                scroll={{ x: 1000 }}
            />
        </div>
    );
};

const TransformCodeList: FC<TransformCodeListProps> = (props) => {
    return (
        <div>
            {/* <Tabs defaultActiveKey="1" type="card" destroyInactiveTabPane>
                <Tabs.TabPane tab="线上" key="1">
                    <TransformTable type={1}></TransformTable>
                </Tabs.TabPane>
                <Tabs.TabPane tab="线下" key="2">
                    <TransformTable type={2}></TransformTable>
                </Tabs.TabPane>
            </Tabs> */}
            <TransformTable type={2}></TransformTable>
        </div>
    );
};

export default TransformCodeList;
