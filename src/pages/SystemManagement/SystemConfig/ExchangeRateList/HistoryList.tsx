import React, { FC } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getRateRecordList } from '@/api/system';
import {
    GetRateRecordListParams,
    RateRecordListType,
    RateRecordListItem,
} from '@/types/api/system';
import moment from 'moment';

type HistoryListProps = {};

const HistoryList: FC<HistoryListProps> = (props) => {
    const columns: ProColumns<RateRecordListItem, any>[] = [
        {
            title: '修改时间',
            dataIndex: 'range_time',
            valueType: 'dateRange',
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        start_time: moment(value[0]).unix(),
                        end_time: moment(value[1]).unix(),
                    };
                },
            },
        },
        {
            title: '修改时间',
            dataIndex: 'created_at',
            valueType: 'milliDateTime',
            hideInSearch: true,
        },
        {
            title: '兑入货币',
            dataIndex: 'exchange_in',
            hideInSearch: true,
        },
        {
            title: '兑出货币',
            dataIndex: 'exchange_out',
            hideInSearch: true,
        },
        {
            title: '兑出汇率',
            dataIndex: 'exchange_rate',
            hideInSearch: true,
        },
        {
            title: '最后操作人',
            dataIndex: 'operation',
            hideInSearch: true,
        },
    ];

    const { fetchData: _fetchRateRecordList } = useHttp<
        GetRateRecordListParams,
        RateRecordListType
    >(getRateRecordList);
    return (
        <div>
            <ProTable<RateRecordListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchRateRecordList({
                        page: params.current ?? 1,
                        size: params.pageSize ?? 20,
                        start_time: params.start_time,
                        end_time: params.end_time,
                    });

                    return {
                        data: res.data?.list ?? [],
                        total: res.data?.total ?? 0,
                        success: true,
                    };
                }}
                rowKey={(record) => record.id}
                search={{
                    labelWidth: 'auto',
                    span: 8,
                    defaultCollapsed: false,
                }}
                toolBarRender={false}
                scroll={{
                    x: 1200,
                }}
            />
        </div>
    );
};

export default HistoryList;
