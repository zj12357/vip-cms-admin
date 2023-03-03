import React, { useMemo, useRef } from 'react';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getCallLogList } from '@/api/communication';
import { TelephoneCallLog } from '@/types/api/communication';
import { Button, message, Modal } from 'antd';
import ModalDetail from '@/pages/Communication/Telephone/CallLogs/ModalDetail';
import {
    callTypes,
    numberTypes,
    callStatus,
    hwhoStatus,
} from '@/pages/Communication/common';
import { useAppSelector } from '@/store/hooks';
import {
    selectHallList,
    selectDepartmentList,
} from '@/store/common/commonSlice';
import { selectSeatList } from '@/store/communication/communicationSlice';
import moment from 'moment/moment';
import { usePhone } from '../CallModal/usePhone';

interface CallLogsPageProps {}

const CallLogsPage: React.FC<CallLogsPageProps> = () => {
    const clubs = useAppSelector(selectHallList);
    const departmentList = useAppSelector(selectDepartmentList);
    const seatList = useAppSelector(selectSeatList);
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchList } = useHttp(getCallLogList);
    const { onDial } = usePhone();

    const seats = useMemo(() => {
        return seatList?.map((x) => {
            return {
                value: x.id,
                label: x.id,
            };
        });
    }, [seatList]);

    const columns = useMemo<ProColumns<TelephoneCallLog>[]>(
        () => [
            {
                title: '呼叫类型',
                dataIndex: 'ct',
                align: 'center',
                valueType: 'select',
                order: 99,
                fieldProps: {
                    allowClear: false,
                    defaultValue: 'o',
                    options: callTypes,
                    placeholder: '请选择呼叫类型',
                },
            },
            {
                title: '号码类型',
                dataIndex: 'mobile_number_type',
                valueType: 'select',
                fieldProps: {
                    options: numberTypes,
                },
                align: 'center',
                order: 18,
                hideInSearch: true,
            },
            {
                title: '电话号码',
                dataIndex: 'mobile_number',
                align: 'center',
                order: 20,
            },
            {
                title: '场馆',
                dataIndex: 'hall',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: clubs,
                },
                order: 16,
            },
            {
                title: '部门',
                dataIndex: 'department',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: departmentList,
                },
                order: 14,
            },
            {
                title: '企业名称',
                dataIndex: 'aid_name',
                align: 'center',
                order: 12,
                hideInSearch: true,
            },
            {
                title: '坐席',
                dataIndex: 'aid',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: seats,
                },
                order: 10,
            },
            {
                title: '户口号',
                dataIndex: 'member_code',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '认证状态',
                dataIndex: 'verify_result',
                align: 'center',
                hideInSearch: true,
                render: (_, entity) =>
                    '-' || (entity.verify_result ? '成功' : '失败'),
            },
            {
                title: '会话状态',
                dataIndex: 'status',
                align: 'center',
                valueType: 'select',
                valueEnum: {
                    ...callStatus.reduce((p: any, x, _) => {
                        p[x.value] = {
                            text: x.label,
                            status: x.status,
                        };
                        return p;
                    }, {}),
                },
            },
            {
                title: '挂断',
                dataIndex: 'hwho', // 1＝主叫挂机，2＝被叫挂机
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: hwhoStatus,
                },
            },
            {
                title: '接听时间',
                dataIndex: 'connectime',
                align: 'center',
                valueType: 'dateTime',
                hideInSearch: true,
            },
            {
                title: '接听时间',
                dataIndex: 'connec_time',
                valueType: 'dateTimeRange',
                hideInTable: true,
            },
            {
                title: '通话时长',
                dataIndex: 'duration',
                align: 'center',
                hideInSearch: true,
                render: (_, entity) =>
                    moment
                        .utc(entity.duration * 1000)
                        .format('HH时mm分ss秒')
                        .replace(/00[\u4E00-\u9FCC]/g, ''),
            },
            {
                title: '操作人',
                dataIndex: 'Binder',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                hideInSearch: true,
                render: (_, entity) => (
                    <>
                        {entity.RecFilePath && (
                            <Button
                                type="link"
                                onClick={() => {
                                    Modal.info({
                                        title: '播放录音',
                                        content: (
                                            <audio
                                                src={entity.RecFilePath}
                                                controls
                                            ></audio>
                                        ),
                                        modalRender: (dom) => {
                                            return dom;
                                        },
                                    });
                                }}
                            >
                                播放
                            </Button>
                        )}
                        {entity.ct === 'i' && entity.status === 'NA' && (
                            <Button
                                type="link"
                                onClick={async () => {
                                    if (await onDial(entity.mobile_number)) {
                                        message.success('操作成功');
                                    } else {
                                        message.error('操作失败');
                                    }
                                }}
                            >
                                回拨
                            </Button>
                        )}
                    </>
                ),
            },
        ],
        [clubs, departmentList, onDial, seats],
    );
    return (
        <div>
            <ProTable<TelephoneCallLog>
                rowKey={(record) => String(record.id)}
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                dateFormatter={'number'}
                search={{
                    defaultCollapsed: false,
                }}
                request={async ({ current, pageSize, ...params }) => {
                    const res = await fetchList({
                        ...params,
                        ct: params.ct ?? 'o',
                        page: current ?? 1,
                        size: pageSize ?? 20,
                        connec_time: undefined,
                        start_time:
                            params.connec_time && params.connec_time[0]
                                ? Math.floor(params.connec_time[0] / 1000)
                                : undefined,
                        end_time:
                            params.connec_time && params.connec_time[1]
                                ? Math.floor(params.connec_time[1] / 1000)
                                : undefined,
                    });
                    let data: TelephoneCallLog[] = [];
                    if (res?.data?.list) {
                        data = res.data.list.map((x) => {
                            !callStatus.find((y) => y.value === x.status) &&
                                (x.status = 'Other');
                            return {
                                ...x,
                                ct: x.ct === 'i' ? 'i' : 'o',
                                hwho: !x.hwho ? undefined : x.hwho,
                            };
                        });
                    }

                    return {
                        data: data,
                        success: true,
                        total: res?.data?.total,
                    };
                }}
            />
            {/* <ModalDetail trigger={<Button type="link">播放</Button>} /> */}
        </div>
    );
};

export default CallLogsPage;
