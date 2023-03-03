import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Modal, Row } from 'antd';
import { ArchiveBetDetail, ArchiveProps } from '@/types/api/eBet';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import moment from 'moment';
import { Summary } from '@/pages/EBetManagement/Setup';
import { useHttp } from '@/hooks';
import { queryPlayerBetsList } from '@/api/eBet';
import { gameMods, gameTypes, gamingResult } from '@/common/commonConstType';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';

interface BetDetailModalProps {
    trigger: JSX.Element;
    entity: ArchiveProps;
    onCancel?: () => void;
    onVisibleChange?: (value: boolean) => void;
    clubList: Record<string, any>[];
}

const BetDetailModal: React.FC<BetDetailModalProps> = ({
    trigger,
    entity,
    onCancel,
    onVisibleChange,
    clubList,
}) => {
    const tableRef = useRef<ActionType>();
    const [visible, setVisible] = useState<boolean>(false);

    const { fetchData: fetchList } = useHttp(queryPlayerBetsList);
    const currency = useAppSelector(selectCurrencyList);

    useEffect(() => {
        onVisibleChange?.(visible);
    }, [onVisibleChange, visible]);

    const handleCancel = useCallback(() => {
        setVisible(false);
        onCancel?.();
    }, [onCancel]);

    const columns: ProColumns<ArchiveBetDetail>[] = useMemo(
        () => [
            {
                title: '会员号',
                dataIndex: 'player_account',
                align: 'center',
            },
            {
                title: '局号',
                dataIndex: 'game_no',
                align: 'center',
            },
            {
                title: '下注时间',
                dataIndex: 'created_at',
                valueType: 'dateTime',
                align: 'center',
            },
            {
                title: '贵宾厅',
                dataIndex: 'club_id',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: clubList,
                },
            },
            {
                title: '桌台',
                dataIndex: 'desk_no',
                align: 'center',
            },
            {
                title: '游戏类型',
                dataIndex: 'game_mod',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: gameMods,
                },
            },
            {
                title: '玩法',
                dataIndex: 'game_type',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: gameTypes,
                },
            },
            {
                title: '币种',
                dataIndex: 'currency',
                valueType: 'select',
                fieldProps: {
                    options: currency,
                },
                align: 'center',
            },
            {
                title: '金额',
                dataIndex: 'amount',
                align: 'center',
            },
            {
                title: '游戏结果',
                dataIndex: 'game_result',
                valueType: 'select',
                fieldProps: {
                    options: gamingResult,
                },
                align: 'center',
            },
            {
                title: '输赢',
                dataIndex: 'win_amount',
                align: 'center',
            },
            {
                title: '转码',
                dataIndex: 'commission',
                align: 'center',
            },
            {
                title: '结算时间',
                dataIndex: 'updated_at',
                valueType: 'dateTime',
                align: 'center',
            },
        ],
        [clubList, currency],
    );

    return (
        <>
            <div onClick={() => setVisible(true)}>{trigger}</div>
            <Modal
                title={'投注详情'}
                visible={visible}
                onCancel={handleCancel}
                footer={false}
                width={1200}
            >
                <Row style={{ marginBottom: 10 }}>
                    <div>
                        <span>会员号：</span>
                        <span>{entity.member_account}</span>
                    </div>
                    <div style={{ marginLeft: 50 }}>
                        <span>结算时间：</span>
                        <span>
                            <span>
                                {moment(entity.start_at).format(
                                    'YYYY-MM-DD HH:mm',
                                )}
                            </span>
                            <span style={{ margin: '0 6px' }}>至</span>
                            <span>
                                {moment(entity.ended_at).format(
                                    'YYYY-MM-DD HH:mm',
                                )}
                            </span>
                        </span>
                    </div>
                </Row>
                <ProTable<ArchiveBetDetail>
                    rowKey={(record) => `${record.id}`}
                    actionRef={tableRef}
                    columns={columns}
                    bordered
                    toolBarRender={false}
                    search={false}
                    params={{
                        start_at: entity.start_at,
                        end_at: entity.ended_at,
                        player_account: entity.member_account,
                    }}
                    request={async ({ current, pageSize, ...params }) => {
                        const res = await fetchList({
                            ...params,
                            page: current,
                            size: pageSize,
                        });
                        return {
                            data: res?.data?.list?.map((a, ai) => ({
                                ...a,
                                id: a.id || `${a.bet_no}_${ai}`,
                            })),
                            success: true,
                            total: res?.data?.total,
                        };
                    }}
                    summary={(pageData) => {
                        return Summary(
                            pageData as any[],
                            columns,
                            ['amount', 'win_amount', 'commission'],
                            { player_account: '总计' },
                        );
                    }}
                />
            </Modal>
        </>
    );
};

export default BetDetailModal;
