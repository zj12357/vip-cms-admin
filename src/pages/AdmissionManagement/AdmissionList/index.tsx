import React, { FC, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { nanoid } from 'nanoid';
import type { ProColumns } from '@ant-design/pro-components';
import Currency from '@/components/Currency';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    setDetailPageInfo,
    selectCurrencyList,
    selectHallList,
} from '@/store/common/commonSlice';
import { useHttp, useNewWindow } from '@/hooks';
import Transcoding from './Transcoding';
import { getWorkList } from '@/api/admission';
import { WorkListParams, resWorkList } from '@/types/api/admission';
import {
    admissionType,
    shareType,
    principalType,
    workType,
} from '@/common/commonConstType';
import AuthButton from '@/components/AuthButton';

type AdmissionListProps = {};
type AdmissionListItem = {
    club?: string;
    member_code?: string;
    member_name?: string;
    customer_name?: string;
    admission_type?: number;
    currency?: string;
    start_work_type?: number;
    principal_type?: string;
    start_work_time?: number;
    shares_type?: string;
    total_principal?: string;
    total_convert_chips?: number;
    round: string;
    admission_start_time?: number;
    admission_end_time?: number;
    convert_chips_customer_info_id: string;
    is_suspend_start_work?: number;
};

const AdmissionList: FC<AdmissionListProps> = (props) => {
    const { toNewWindow } = useNewWindow();
    const navigate = useNavigate();
    const actionRef = useRef<any>();
    const dispatch = useAppDispatch();

    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);

    const { fetchData: workListData } = useHttp<WorkListParams, resWorkList>(
        getWorkList,
    );

    const columns: ProColumns<AdmissionListItem>[] = [
        {
            dataIndex: 'club',
            title: '场馆',
            align: 'center',
            valueType: 'select',
            request: async () => [...hallList],
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            align: 'center',
            render: (_, record) =>
                record.is_suspend_start_work === 2 ? (
                    <Transcoding
                        onSuccess={() => {
                            actionRef.current?.reload();
                        }}
                        round={record.round}
                    />
                ) : (
                    <span className="m-primary-font-color not-allowed">
                        转码
                    </span>
                ),
        },
        {
            dataIndex: 'member_code',
            title: '户口号',
            align: 'center',
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
            dataIndex: 'member_name',
            title: '户口名',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'customer_name',
            title: '客户名',
            align: 'center',
            hideInSearch: true,
        },
        {
            dataIndex: 'round',
            title: '场次编号',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'start_work_time',
            title: '入场时间',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                if (record.start_work_time) {
                    return moment(record.start_work_time * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                    );
                }
            },
        },
        {
            dataIndex: 'admission_type',
            title: '入场类型',
            align: 'center',
            valueType: 'select',
            request: async () => [...admissionType],
        },
        {
            dataIndex: 'currency',
            title: '开工币种',
            valueType: 'select',
            align: 'center',
            fieldProps: {
                options: currencyList,
            },
        },
        {
            dataIndex: 'start_work_type',
            title: '开工类型',
            align: 'center',
            valueType: 'select',
            request: async () => {
                return workType;
            },
        },
        {
            dataIndex: 'shares_type',
            title: '出码类型',
            align: 'center',
            valueType: 'select',
            request: async () => [...principalType],
        },
        {
            dataIndex: 'principal_type',
            title: '本金类型',
            align: 'center',
            valueType: 'select',
            request: async () => [...shareType],
        },
        {
            dataIndex: 'round',
            title: '场次编号',
            align: 'center',
            hideInTable: true,
        },
        {
            dataIndex: 'start_work_time',
            title: '入场时间',
            hideInTable: true,
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
        },
        {
            dataIndex: 'total_principal',
            title: '本金（万）',
            align: 'center',
            hideInSearch: true,
            render: (val) => <div style={{ maxWidth: 150 }}>{val}</div>,
        },
        {
            dataIndex: 'total_convert_chips',
            title: '转码数（万）',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option2',
            align: 'center',
            render: (_, record) => [
                <div
                    className="m-primary-font-color pointer"
                    key="detail"
                    onClick={() => toPage(record.round)}
                >
                    详情
                </div>,
            ],
        },
    ];
    const toPage = (type: string) => {
        dispatch(
            setDetailPageInfo({
                path: `/admission/list/admissionDetail/${type}`,
                backPath: '/admission/list',
                title: '返回开工列表',
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
            <ProTable<AdmissionListItem>
                columns={columns}
                scroll={{
                    x: 1200,
                }}
                actionRef={actionRef}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res: any = await workListData({
                        ...params,
                        member_code: params.member_code
                            ? params.member_code.trim()
                            : '',
                    });
                    return Promise.resolve({
                        data: res.data.list,
                        total: res.data.total,
                        success: true,
                    });
                }}
                rowKey={() => nanoid()}
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

export default AdmissionList;
