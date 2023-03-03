import React, { FC } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useHttp, useNewWindow } from '@/hooks';
import AuthButton from '@/components/AuthButton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { ProColumns } from '@ant-design/pro-components';
import { ProCard, ProTable } from '@ant-design/pro-components';
import {
    setDetailPageInfo,
    selectCurrencyList,
    selectHallList,
} from '@/store/common/commonSlice';
import { admissionType, workType } from '@/common/commonConstType';
import { getAdmissionList } from '@/api/admission';
import {
    admissionHistoryListParams,
    resAdmissionHistoryList,
} from '@/types/api/admission';
import Currency from '@/components/Currency';

type AdmissionRecordProps = {};

type AdmissionRecordItem = {
    club: string;
    member_code: string;
    customer_name: string;
    round: string;
    admission_type: number;
    currency: string;
    start_work_type: number;
    startTime: number;
    table_num: string;
    total_principal_type: string;
    total_add_chips: number;
    total_return_chips: number;
    total_public_tip_chips: number;
    total_croupier_tip_chips: number;
    stop_work_table_chips: number;
    total_convert_chips: number;
    total_up_down_chips: string;
    stop_work_time: number;
    start_work_time: number;
};

const AdmissionRecord: FC<AdmissionRecordProps> = (props) => {
    const { toNewWindow } = useNewWindow();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currencyList = useAppSelector(selectCurrencyList);
    const clubs = useAppSelector(selectHallList);
    const { fetchData: admissionList } = useHttp<
        admissionHistoryListParams,
        resAdmissionHistoryList
    >(getAdmissionList);

    const columnsSearch: ProColumns<AdmissionRecordItem>[] = [
        {
            dataIndex: 'club',
            key: 'club',
            title: '场馆',
            valueType: 'select',
            request: async () => [...clubs],
            hideInTable: true,
        },
        {
            dataIndex: 'member_code',
            key: 'member_code',
            title: '户口号',
            hideInTable: true,
        },
        {
            dataIndex: 'customer_name',
            key: 'customer_name',
            title: '客户名',
            hideInTable: true,
        },
        {
            dataIndex: 'round',
            key: 'round',
            title: '场次编号',
            hideInTable: true,
        },
        {
            dataIndex: 'admission_type',
            key: 'admission_type',
            title: '入场类型',
            valueType: 'select',
            request: async () => [...admissionType],
            hideInTable: true,
        },
        {
            dataIndex: 'currency',
            key: 'currency',
            title: '开工币种',
            valueType: 'select',
            request: async () => [...currencyList],
            hideInTable: true,
        },
        {
            dataIndex: 'start_work_type',
            key: 'start_work_type',
            title: '开工类型',
            valueType: 'select',
            request: async () => [...workType],
            hideInTable: true,
        },
        {
            dataIndex: 'startTime',
            key: 'startTime',
            title: '开工时间',
            valueType: 'dateTimeRange',
            initialValue: [
                moment(new Date()).startOf('day'),
                moment(new Date()).endOf('day'),
            ],
            search: {
                transform: (value) => {
                    return {
                        start_work_start_time:
                            moment(new Date(value[0])).valueOf() / 1000,
                        start_work_end_time:
                            moment(new Date(value[1])).valueOf() / 1000,
                    };
                },
            },
            hideInTable: true,
        },
        {
            dataIndex: 'endTime',
            key: 'endTime',
            title: '收工时间',
            valueType: 'dateTimeRange',
            initialValue: [
                moment(new Date()).startOf('day'),
                moment(new Date()).endOf('day'),
            ],
            search: {
                transform: (value) => {
                    return {
                        stop_work_start_time:
                            moment(new Date(value[0])).valueOf() / 1000,
                        stop_work_end_time:
                            moment(new Date(value[1])).valueOf() / 1000,
                    };
                },
            },
            hideInTable: true,
        },
    ];
    const columnsTable: ProColumns<AdmissionRecordItem>[] = [
        {
            dataIndex: 'club',
            key: 'club',
            title: '场馆',
            valueType: 'select',
            request: async () => [...clubs],
            hideInSearch: true,
            align: 'center',
            fixed: true,
            width: 60,
        },
        {
            dataIndex: 'startWorkTime',
            key: 'startWorkTime',
            title: '开工时间',
            hideInSearch: true,
            align: 'center',
            fixed: true,
            width: 90,
            render: (_, record) => {
                if (record.start_work_time) {
                    return moment(record.start_work_time * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                    );
                }
            },
        },
        {
            dataIndex: 'round',
            key: 'round',
            title: '场次编号',
            hideInSearch: true,
            align: 'center',
            fixed: true,
            width: 120,
        },
        {
            dataIndex: 'table_num',
            key: 'table_num',
            title: '桌台号',
            hideInSearch: true,
            align: 'center',
            fixed: true,
            width: 90,
        },
        {
            dataIndex: 'customer_name',
            key: 'customer_name',
            title: '客户',
            hideInSearch: true,
            align: 'center',
            fixed: true,
            width: 80,
        },
        {
            dataIndex: 'member_code',
            key: 'member_code',
            title: '户口号',
            hideInSearch: true,
            align: 'center',
            fixed: true,
            width: 90,
            render: (_, record) => {
                return (
                    <span
                        className="m-primary-font-color pointer"
                        onClick={() =>
                            toNewWindow(
                                `/account/customerAccountDetail/${record.member_code}`,
                            )
                        }
                    >
                        {record.member_code}
                    </span>
                );
            },
        },
        {
            dataIndex: 'admission_type',
            key: 'admission_type',
            title: '入场类型',
            valueType: 'select',
            request: async () => [...admissionType],
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'currency',
            key: 'currency',
            title: '开工币种',
            valueType: 'select',
            request: async () => [...currencyList],
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'start_work_type',
            key: 'start_work_type',
            title: '开工类型',
            valueType: 'select',
            request: async () => [...workType],
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'total_principal_type',
            key: 'total_principal_type',
            title: '本金记录（万）',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'total_add_chips',
            key: 'total_add_chips',
            title: '中途加彩（万）',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'total_return_chips',
            key: 'total_return_chips',
            title: '中途回码（万）',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'total_public_tip_chips',
            key: 'total_public_tip_chips',
            title: '公水',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'total_croupier_tip_chips',
            key: 'total_croupier_tip_chips',
            title: '荷水',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'stop_work_table_chips',
            key: 'stop_work_table_chips',
            title: '收工台面',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'total_convert_chips',
            key: 'total_convert_chips',
            title: '转码数（万）',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'total_up_down_chips',
            key: 'total_up_down_chips',
            title: '上下数（万）',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'stopWorkTime',
            key: 'stopWorkTime',
            title: '收工时间',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                if (record.stop_work_time) {
                    return moment(record.stop_work_time * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                    );
                }
            },
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option2',
            align: 'center',
            render: (_, record) => [
                <AuthButton
                    normal={'record-detail'}
                    verify={(pass) => {
                        if (pass) {
                            toPage(record.round);
                        }
                    }}
                    trigger={
                        <div
                            className="m-primary-font-color pointer"
                            key="detail"
                        >
                            详情
                        </div>
                    }
                ></AuthButton>,
            ],
        },
    ];
    const columns = [...columnsSearch, ...columnsTable];
    const toPage = (type: string) => {
        dispatch(
            setDetailPageInfo({
                path: `/admission/list/admissionDetail/${type}`,
                backPath: '/admission/record',
                title: '返回入场记录',
            }),
        );
        navigate(`/admission/list/admissionDetail/${type}`);
    };
    return (
        <ProCard
            style={{
                height: 'calc(100vh - 200px)',
                overflowY: 'auto',
            }}
        >
            <ProTable<AdmissionRecordItem>
                columns={columns}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res: any = await admissionList({ ...params });
                    return Promise.resolve({
                        data: res.data.list || [],
                        total: res.data.total,
                        success: true,
                    });
                }}
                scroll={{ x: 1800 }}
                rowKey="round"
                pagination={{
                    showQuickJumper: true,
                }}
                toolBarRender={false}
                search={{
                    labelWidth: 80,
                    defaultCollapsed: false,
                }}
            />
        </ProCard>
    );
};

export default AdmissionRecord;
