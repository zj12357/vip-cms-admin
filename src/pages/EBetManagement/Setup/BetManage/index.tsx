import React, { useMemo, useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getBetList } from '@/api/eBet';
import { BetProps } from '@/types/api/eBet';
import { gameMods, gameTypes, settleStatus } from '@/common/commonConstType';
import { useVipClub } from '@/pages/EBetManagement/common/hooks';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';

interface BetManagePageProps {}

const BetManage: React.FC<BetManagePageProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const currency = useAppSelector(selectCurrencyList);

    const { fetchData: fetchList } = useHttp(getBetList);

    const {
        clubOptions,
        deskOptions = [],
        setClubId,
        clubId,
        clubLoading,
        deskLoading,
    } = useVipClub();

    const columns = useMemo<ProColumns<BetProps>[]>(
        () => [
            {
                title: '注单编号',
                dataIndex: 'bet_no',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '账号',
                dataIndex: 'player_account',
                align: 'center',
                order: 6,
            },
            {
                title: '局号',
                dataIndex: 'game_no',
                align: 'center',
                order: 7,
            },
            {
                title: '下注时间',
                dataIndex: 'created_at',
                align: 'center',
                valueType: 'dateTime',
                order: 5,
                hideInSearch: true,
            },
            {
                title: '下注时间',
                dataIndex: 'created_at',
                align: 'center',
                valueType: 'dateTimeRange',
                order: 5,
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
                title: '贵宾厅',
                dataIndex: 'club_id',
                align: 'center',
                order: 9,
                valueType: 'select',
                fieldProps: {
                    options: [
                        {
                            value: '',
                            label: '全部',
                        },
                        ...clubOptions,
                    ],
                    defaultValue: '',
                    loading: clubLoading,
                },
                formItemProps: {
                    getValueFromEvent: (value) => {
                        setClubId(value);
                        return value;
                    },
                },
            },
            {
                title: '桌台',
                dataIndex: 'desk_id',
                align: 'center',
                order: 8,
                valueType: 'select',
                fieldProps: {
                    options: [
                        {
                            value: '',
                            label: '全部',
                        },
                        ...deskOptions,
                    ],
                    defaultValue: '',
                    loading: deskLoading,
                    // disabled: !clubId,
                },
                formItemProps: {
                    dependencies: ['club_id'],
                },
                render: (dom, entity) => {
                    return entity.desk_no;
                },
            },
            {
                title: '游戏类型',
                dataIndex: 'game_mod',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: gameMods,
                },
                hideInSearch: true,
            },
            {
                title: '玩法',
                dataIndex: 'game_type',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: gameTypes,
                },
                hideInSearch: true,
            },
            {
                title: '币种',
                dataIndex: 'currency',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: currency,
                },
                hideInSearch: true,
            },
            {
                title: '金额',
                dataIndex: 'amount',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '游戏结果',
                dataIndex: 'game_result_name',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '输赢',
                dataIndex: 'win_amount',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '转码',
                dataIndex: 'commission',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '结算状态',
                dataIndex: 'is_settle',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: settleStatus,
                },
                hideInSearch: true,
            },
            {
                title: '结算时间',
                dataIndex: 'updated_at',
                align: 'center',
                valueType: 'dateTime',
                hideInSearch: true,
                renderText: (text, record) =>
                    Number(record.is_settle) === 1 ? text : undefined,
            },
        ],
        [
            clubLoading,
            clubOptions,
            currency,
            deskLoading,
            deskOptions,
            setClubId,
        ],
    );
    return (
        <div>
            <ProTable<BetProps>
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                rowKey={(record) => String(record.bet_id)}
                dateFormatter={'number'}
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

export default BetManage;
