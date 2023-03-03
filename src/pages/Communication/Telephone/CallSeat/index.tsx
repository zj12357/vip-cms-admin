import React, {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { useHttp } from '@/hooks';
import { bindSeat, getSeatList, switchSeatDns } from '@/api/communication';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { SeatProps } from '@/types/api/communication';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    selectCurrentHall,
    selectDepartmentList,
    selectHallList,
} from '@/store/common/commonSlice';
import { seatBindStatus, seatStatus } from '@/pages/Communication/common';
import { Button, message, Switch } from 'antd';
import { selectUserName } from '@/store/user/userSlice';
import moment from 'moment';
import {
    getSeatListAsync,
    selectSeatList,
} from '@/store/communication/communicationSlice';
interface Props extends React.ComponentProps<any> {}

const CallSeat: React.FC<Props> = () => {
    const seatList = useAppSelector(selectSeatList);
    const { fetchData: fetchSeatList } = useHttp(getSeatList);
    const { fetchData: submitBind, loading: binding } = useHttp(bindSeat);
    const { fetchData: switchDns, loading: switching } = useHttp(switchSeatDns);
    const tableRef = useRef<ActionType>();
    const hallList = useAppSelector(selectHallList);
    const departmentList = useAppSelector(selectDepartmentList);
    const userName = useAppSelector(selectUserName);
    const dispatch = useAppDispatch();
    const currentHall = useAppSelector(selectCurrentHall);

    useEffect(() => {
        tableRef.current?.reload();
    }, [seatList]);

    const handleBind = useCallback(
        async (data: SeatProps, isBind = true) => {
            const opearte = isBind ? 'bind' : 'unbind'; // unbind 解绑  bind 绑定
            const res = await submitBind({
                id: data.id,
                user_name: userName,
                opearte,
            });
            if (res.code === 10000) {
                message.success('操作成功');
                tableRef.current?.reload();
                dispatch(
                    getSeatListAsync({
                        hall: currentHall.id,
                    }),
                );
            }
        },
        [currentHall.id, dispatch, submitBind, userName],
    );

    const handleSwitchStatus = useCallback(
        async (data: SeatProps) => {
            const res = await switchDns({
                id: data.id,
            });
            if (res.code === 10000) {
                message.success('操作成功');
                tableRef.current?.reload();
                dispatch(
                    getSeatListAsync({
                        hall: currentHall.id,
                    }),
                );
            }
        },
        [currentHall.id, dispatch, switchDns],
    );

    const columns = useMemo<ProColumns<SeatProps>[]>(() => {
        const actions = (dom: ReactNode, entity: SeatProps) => [
            [
                Number(entity.is_bind) !== 1 && (
                    <Button
                        type="primary"
                        onClick={() => handleBind(entity, true)}
                        loading={binding}
                    >
                        绑定
                    </Button>
                ),
                Number(entity.is_bind) === 1 && entity.binder === userName && (
                    <>
                        <Switch
                            checkedChildren="置忙"
                            unCheckedChildren="置闲"
                            checked={Number(entity.dnd_status) === 1}
                            style={{ marginRight: 8 }}
                            loading={switching}
                            onChange={() => handleSwitchStatus(entity)}
                        />
                        <Button
                            type="primary"
                            onClick={() => handleBind(entity, false)}
                            loading={binding}
                        >
                            解绑
                        </Button>
                    </>
                ),
            ],
        ];
        return [
            {
                title: '企业名称',
                dataIndex: 'aid_name',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '场馆',
                dataIndex: 'hall',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: hallList,
                },
            },
            {
                title: '部门',
                dataIndex: 'department',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: departmentList,
                },
            },
            {
                title: '技能组',
                dataIndex: 'group_id',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '主叫号码',
                dataIndex: 'caller',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '坐席号',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '坐席状态',
                dataIndex: 'status',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: seatStatus,
                },
            },
            {
                title: '绑定坐席',
                dataIndex: 'is_bind',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: seatBindStatus,
                },
            },
            {
                title: 'SIP地址',
                dataIndex: 'sip_address',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '同步时间',
                dataIndex: 'updated_at',
                align: 'center',
                hideInSearch: true,
                valueType: 'dateTime',
                render: (_, entity) =>
                    entity.updated_at
                        ? moment(entity.updated_at * 1000).format(
                              'YYYY-MM-DD HH:mm:ss',
                          )
                        : '-',
            },
            {
                title: '绑定人',
                dataIndex: 'binder',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '操作',
                dataIndex: 'option',
                align: 'center',
                hideInSearch: true,
                render: actions,
            },
        ];
    }, [
        binding,
        departmentList,
        hallList,
        handleBind,
        handleSwitchStatus,
        switching,
        userName,
    ]);
    return (
        <div>
            <ProTable<SeatProps>
                rowKey={(record) => String(record.id)}
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                dateFormatter={'number'}
                search={{
                    defaultCollapsed: false,
                }}
                pagination={false}
                request={async ({ current, pageSize, ...params }) => {
                    let res: any = await fetchSeatList(params as any);
                    return {
                        data: res.data?.list,
                        success: true,
                        total: res.data?.total,
                    };
                }}
            />
        </div>
    );
};

export default CallSeat;
