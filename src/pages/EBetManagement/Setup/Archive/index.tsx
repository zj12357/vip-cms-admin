import React, { useMemo, useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { ArchiveProps } from '@/types/api/eBet';
import { useHttp } from '@/hooks';
import { queryArchiveList } from '@/api/eBet';
import { Button } from 'antd';
import BetDetailModal from '@/pages/EBetManagement/Setup/Archive/BetDetailModal';
import { useVipClub } from '@/pages/EBetManagement/common/hooks';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';

interface ArchivePageProps {}

const ArchivePage: React.FC<ArchivePageProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchList } = useHttp(queryArchiveList);

    const { clubOptions } = useVipClub();

    const currency = useAppSelector(selectCurrencyList);

    const columns = useMemo<ProColumns<ArchiveProps>[]>(
        () => [
            {
                title: '编号',
                dataIndex: 'id',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '会员',
                dataIndex: 'member_account',
                align: 'center',
            },
            {
                title: '币种',
                dataIndex: 'currency_code',
                valueType: 'select',
                fieldProps: {
                    options: currency,
                },
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '占成比',
                dataIndex: 'share_rate',
                align: 'center',
                renderText: (value) => {
                    return `${value}%`;
                },
                hideInSearch: true,
            },
            {
                title: '上下数',
                dataIndex: 'win_amount',
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
                title: '占成',
                dataIndex: 'share',
                align: 'center',
                renderText: (dom, entity) => {
                    return (
                        ((entity.share_rate ?? 0) *
                            ((entity.win_amount ?? 0) - (entity.tip ?? 0))) /
                        100
                    );
                },
                hideInSearch: true,
            },
            {
                title: '转码比',
                dataIndex: 'commission_rate',
                align: 'center',
                renderText: (value) => {
                    return `${value}%`;
                },
                hideInSearch: true,
            },
            {
                title: '转码量',
                dataIndex: 'commission',
                align: 'center',
                renderText: (value) =>
                    Number(value) ? `${(value ?? 0) / 10000}万` : value,
                hideInSearch: true,
            },
            {
                title: '码粮',
                dataIndex: 'commission_value',
                align: 'center',
                renderText: (dom, entity) => {
                    return (
                        ((entity.commission_rate ?? 0) *
                            (entity.commission ?? 0)) /
                        100
                    );
                },
                hideInSearch: true,
            },
            {
                title: '提案开始时间',
                dataIndex: 'start_at',
                align: 'center',
                valueType: 'dateTime',
                hideInSearch: true,
            },
            {
                title: '提案归档时间',
                dataIndex: 'ended_at',
                align: 'center',
                valueType: 'dateTime',
                hideInSearch: true,
            },
            {
                title: '归档时间',
                dataIndex: 'created_at',
                align: 'center',
                valueType: 'dateTimeRange',
                hideInTable: true,
                search: {
                    transform: (values: any) => {
                        return {
                            start_at: values?.[0],
                            end_at: values?.[1],
                        };
                    },
                },
                colSize: 2,
            },
            {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                hideInSearch: true,
                render: (dom, entity) => (
                    <BetDetailModal
                        trigger={<Button type={'primary'}>投注明细</Button>}
                        entity={entity}
                        clubList={clubOptions}
                    />
                ),
            },
        ],
        [currency, clubOptions],
    );
    return (
        <div>
            <ProTable<ArchiveProps>
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
                search={{
                    defaultCollapsed: false,
                }}
                scroll={{
                    x: 1200,
                }}
            />
        </div>
    );
};

export default ArchivePage;
