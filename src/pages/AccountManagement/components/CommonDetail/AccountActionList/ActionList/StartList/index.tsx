import React, { FC } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { useHttp, useNewWindow } from '@/hooks';
import { getStartWorkList } from '@/api/accountAction';
import {
    GetStartWorkListParams,
    StartWorkListType,
    StartWorkListItem,
} from '@/types/api/accountAction';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList, selectHallList } from '@/store/common/commonSlice';
import { selectAccountInfo } from '@/store/account/accountSlice';
import Currency from '@/components/Currency';
import { shareType, workType } from '@/common/commonConstType';

type StartListProps = {};

const StartList: FC<StartListProps> = (props) => {
    const { fetchData: _fetchStartWorkList } = useHttp<
        GetStartWorkListParams,
        StartWorkListType
    >(getStartWorkList);
    const { toNewWindow } = useNewWindow();
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);

    const accountInfo = useAppSelector(selectAccountInfo);

    const columns: ProColumns<StartWorkListItem>[] = [
        {
            title: '场次',
            dataIndex: 'round',
            hideInSearch: true,
        },
        {
            title: '开工场馆',
            dataIndex: 'club',
            valueType: 'select',
            fieldProps: {
                options: hallList,
            },
        },
        {
            title: '币种',
            dataIndex: 'currency',
            valueType: 'select',
            fieldProps: {
                options: currencyList,
            },
        },
        {
            title: '开工类型',
            dataIndex: 'start_work_type',
            valueType: 'select',
            fieldProps: {
                options: workType,
            },
        },
        {
            title: '开工时间',
            dataIndex: 'start_work_time',
            valueType: 'dateTime',
            hideInSearch: true,
        },
        {
            title: '收工时间',
            dataIndex: 'stop_work_time',
            valueType: 'dateTime',
            hideInSearch: true,
        },
        {
            title: '时间',
            dataIndex: 'startTime',
            valueType: 'dateTimeRange',
            search: {
                transform: (val) => {
                    return {
                        start_work_start_time: moment(val[0]).unix(),
                        start_work_end_time: moment(val[1]).unix(),
                    };
                },
            },
            hideInTable: true,
        },
        {
            title: '本金',
            dataIndex: 'total_principal',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <p style={{ width: '200px' }}>{record.total_principal}</p>
                );
            },
        },
        {
            title: '本金类型',
            dataIndex: 'principal_type',
            valueType: 'select',
            fieldProps: {
                options: shareType,
            },
        },
        {
            title: '上下数',
            dataIndex: 'total_up_down_chips',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.total_up_down_chips.toString()}
                    ></Currency>
                );
            },
        },

        {
            title: '转码数',
            dataIndex: 'total_convert_chips',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.total_convert_chips.toString()}
                    ></Currency>
                );
            },
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
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
        toNewWindow(`/admission/list/admissionDetail/${type}`);
    };
    return (
        <div>
            <ProTable<StartWorkListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchStartWorkList({
                        page: params.current ?? 1,
                        size: params.pageSize ?? 20,
                        currency: params.currency,
                        start_work_start_time: params.start_work_start_time,
                        start_work_end_time: params.start_work_end_time,
                        club: params.club,
                        start_work_type: params.start_work_type,
                        principal_type: params.principal_type,
                        member_code: accountInfo.member_code,
                    });
                    return {
                        data: (res.data.list ?? []).map((item) => {
                            return {
                                ...item,
                                start_work_time: moment
                                    .unix(item.start_work_time)
                                    .valueOf(),
                                stop_work_time: moment
                                    .unix(item.stop_work_time)
                                    .valueOf(),
                            };
                        }),
                        total: res.data?.total ?? 0,
                        success: true,
                    };
                }}
                rowKey={() => nanoid()}
                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                }}
                toolBarRender={false}
                scroll={{ x: 1200 }}
            />
        </div>
    );
};

export default StartList;
