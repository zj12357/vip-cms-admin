import React, { useMemo, useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Row } from 'antd';
import { useHttp } from '@/hooks';
import { getGamingList } from '@/api/eBet';
import { GamingProps } from '@/types/api/eBet';
import { gameMods, settleStatus } from '@/common/commonConstType';
import GambleModalForm from '@/pages/EBetManagement/Setup/Gamble/GambleModalForm';
import { useVipClub } from '@/pages/EBetManagement/common/hooks';

type GamblePageProps = {};

const GamblePage: React.FC<GamblePageProps> = (props) => {
    const tableRef = useRef<ActionType>();

    const {
        clubOptions,
        deskOptions = [],
        setClubId,
        clubLoading,
        deskLoading,
    } = useVipClub();

    const { fetchData: fetchList } = useHttp(getGamingList);

    const columns = useMemo<ProColumns<GamingProps>[]>(
        () => [
            {
                title: '局号',
                dataIndex: 'game_no',
                align: 'center',
                order: 7,
            },
            {
                title: '开局时间',
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
                title: '开局时间',
                dataIndex: 'created_at',
                align: 'center',
                valueType: 'dateTime',
                hideInSearch: true,
            },
            {
                title: '结算时间',
                dataIndex: 'ended_at',
                align: 'center',
                valueType: 'dateTime',
                hideInSearch: true,
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
                    allowClear: false,
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
                    allowClear: false,
                    loading: deskLoading,
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
                title: '状态',
                dataIndex: 'is_settle',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: settleStatus,
                },
                hideInSearch: true,
            },
            {
                title: '游戏结果',
                dataIndex: 'result_msg',
                align: 'center',
                hideInSearch: true,
                renderText: (value, record) =>
                    Number(record.is_settle) === 1 ? value : undefined,
            },
            {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                hideInSearch: true,
                render: (dom, entity) => (
                    <Row justify={'center'}>
                        {entity.is_settle !== 1 && (
                            <>
                                <GambleModalForm
                                    entity={entity}
                                    modalType={'settlement'}
                                    onFinish={() => tableRef.current?.reload()}
                                    clubList={clubOptions}
                                    trigger={
                                        <Button
                                            type="primary"
                                            style={{ marginRight: 10 }}
                                        >
                                            手动结算
                                        </Button>
                                    }
                                />
                                <GambleModalForm
                                    entity={entity}
                                    modalType={'calibration'}
                                    onFinish={() => tableRef.current?.reload()}
                                    clubList={clubOptions}
                                    trigger={
                                        <Button type="primary">校对结果</Button>
                                    }
                                />
                            </>
                        )}
                    </Row>
                ),
            },
        ],
        [clubLoading, clubOptions, deskLoading, deskOptions, setClubId],
    );

    return (
        <div>
            <ProTable<GamingProps>
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

export default GamblePage;
