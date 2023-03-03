import React, { useMemo, useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { queryBetterLogList } from '@/api/eBet';
import { BetterLog } from '@/types/api/eBet';
import { Summary } from '@/pages/EBetManagement/Setup';

type BetterReportProps = {};

const BetterReport: React.FC<BetterReportProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchList } = useHttp(queryBetterLogList);

    const columns = useMemo<ProColumns<BetterLog>[]>(
        () => [
            {
                title: '账号',
                dataIndex: 'account',
                align: 'center',
            },
            {
                title: '员工姓名',
                dataIndex: 'employee_name',
                align: 'center',
            },
            {
                title: '开工时间',
                dataIndex: 'created_at',
                align: 'center',
                valueType: 'dateTime',
                hideInSearch: true,
            },
            {
                title: '收工时间',
                dataIndex: 'ended_at',
                align: 'center',
                valueType: 'dateTime',
                hideInSearch: true,
            },
            {
                title: '收工时间',
                dataIndex: 'ended_at',
                align: 'center',
                valueType: 'dateTimeRange',
                search: {
                    transform: (values: any) => {
                        return {
                            start_at: values?.[0],
                            end_at: values?.[1],
                        };
                    },
                },
                colSize: 2,
                hideInTable: true,
            },
            {
                title: '入场泥码',
                dataIndex: 'chips_st',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '入场现金码',
                dataIndex: 'cash_chips_st',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '入场转码值',
                dataIndex: 'zm_amount_st',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '入场总投注',
                dataIndex: 'bet_total_st',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '离场泥码',
                dataIndex: 'chips',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '离场现金码',
                dataIndex: 'cash_chips',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '离场转码值',
                dataIndex: 'zm_amount',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '离场总投注',
                dataIndex: 'bet_total',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '小费',
                dataIndex: 'tip',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '净泥码',
                dataIndex: 'net_chips',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '净现金码',
                dataIndex: 'net_cash_chips',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '净转码值',
                dataIndex: 'net_zm_amount',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '净总投注',
                dataIndex: 'net_bet_total',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
        ],
        [],
    );
    return (
        <div>
            <ProTable<BetterLog>
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                dateFormatter={'number'}
                rowKey={(record) => String(record.id)}
                request={async ({ current, pageSize, ...params }) => {
                    const res = await fetchList({
                        ...params,
                        page: current,
                        size: pageSize,
                    });
                    return {
                        data: res?.data?.list,
                        success: true,
                        total: res?.data?.total,
                    };
                }}
                bordered
                summary={(pageData) => {
                    return Summary(
                        pageData as any[],
                        columns,
                        [
                            'tip',
                            'net_chips',
                            'net_cash_chips',
                            'net_zm_amount',
                            'net_bet_total',
                        ],
                        { account: '总计' },
                        (value, key, summaryKeys) => {
                            if (summaryKeys.includes(key)) {
                                return `${(value ?? 0) / 10000}万`;
                            }
                            return value;
                        },
                    );
                }}
                search={{
                    defaultCollapsed: false,
                }}
            />
        </div>
    );
};

export default BetterReport;
