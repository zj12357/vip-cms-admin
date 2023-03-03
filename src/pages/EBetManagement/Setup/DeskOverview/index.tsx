import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getDeskOverviewList } from '@/api/eBet';
import { deskStatus, gameMods } from '@/common/commonConstType';
import { BetterLog, DeskOverviewProps } from '@/types/api/eBet';
import { Pagination } from 'antd';

type DeskOverviewPageProps = {};

interface ColumnType extends DeskOverviewProps, BetterLog {
    rowSpan?: number;
}

const DeskOverviewPage: React.FC<DeskOverviewPageProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchList, response } = useHttp(getDeskOverviewList);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);

    const columns = useMemo<ProColumns<ColumnType>[]>(
        () => [
            {
                title: '桌台号',
                dataIndex: 'desk_no',
                align: 'center',
                onCell: (record, index) => {
                    return {
                        rowSpan: record.rowSpan,
                        style: {
                            verticalAlign: 'middle',
                        },
                    };
                },
            },
            {
                title: '桌台类型',
                dataIndex: 'game_mod',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: [
                        {
                            value: '',
                            label: '全部',
                        },
                        ...gameMods,
                    ],
                    defaultValue: '',
                    allowClear: false,
                },
                onCell: (record, index) => {
                    return {
                        rowSpan: record.rowSpan,
                        style: {
                            verticalAlign: 'middle',
                        },
                    };
                },
            },
            {
                title: '状态',
                dataIndex: 'desk_status',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: deskStatus,
                },
                hideInSearch: true,
                onCell: (record, index) => {
                    return {
                        rowSpan: record.rowSpan,
                        style: {
                            verticalAlign: 'middle',
                        },
                    };
                },
            },
            {
                title: '投手账号',
                dataIndex: 'account',
                align: 'center',
            },
            {
                title: '泥码',
                dataIndex: 'chips',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '现金码',
                dataIndex: 'cash_chips',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '转码量',
                dataIndex: 'zm_amount',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '投注量',
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
                render: (value) =>
                    Number(value) ? `${Number(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '投手开工时间',
                dataIndex: 'created_at',
                align: 'center',
                valueType: 'dateTime',
                hideInSearch: true,
            },
        ],
        [],
    );

    const onChange = useCallback((current: number, size: number) => {
        setPage(current);
    }, []);

    const onShowSizeChange = useCallback((current: number, size: number) => {
        setPageSize(size);
    }, []);

    return (
        <div>
            <ProTable<ColumnType>
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                dateFormatter={'number'}
                rowKey={(record) =>
                    `${record.id}_${record.desk_no}_${record.created_at}`
                }
                pagination={false}
                params={{
                    page: page,
                    size: pageSize,
                }}
                search={{
                    defaultCollapsed: false,
                }}
                scroll={{
                    x: 1200,
                }}
                request={async (params, sort, filter) => {
                    const res = await fetchList(params);
                    // 数据扁平化
                    const list = res?.data?.list ?? [];
                    const items = list.reduce<ColumnType[]>(
                        (result, current) => {
                            const list = [
                                ...result,
                                ...(current.better_logs ?? [current]).map(
                                    (bl, bli, arr) => ({
                                        ...current,
                                        ...bl,
                                        rowSpan: bli === 0 ? arr.length : 0,
                                    }),
                                ),
                            ];
                            return list;
                        },
                        [],
                    );
                    return {
                        data: items,
                        success: true,
                        total: res?.data?.total,
                    };
                }}
                bordered
            />
            <Pagination
                style={{ textAlign: 'right', marginTop: 10 }}
                onChange={onChange}
                onShowSizeChange={onShowSizeChange}
                current={page}
                pageSize={pageSize}
                total={response?.total}
                size={'small'}
                showSizeChanger
                showTotal={(total, range) =>
                    `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`
                }
            />
        </div>
    );
};

export default DeskOverviewPage;
