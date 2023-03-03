import React, { FC, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getCreditDetailList } from '@/api/accountAction';
import {
    GetCreditDetailListParams,
    CreditDetailListItem,
} from '@/types/api/accountAction';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
    selectAccountInfo,
    setCreditDetailList,
} from '@/store/account/accountSlice';
import { markerType } from '@/common/commonConstType';
import Currency from '@/components/Currency';

type CreditOverviewListProps = {
    currencyType: number;
};

const CreditOverviewList: FC<CreditOverviewListProps> = ({ currencyType }) => {
    const dispatch = useAppDispatch();
    const accountInfo = useAppSelector(selectAccountInfo);

    const { fetchData: _fetchCreditDetailList } = useHttp<
        GetCreditDetailListParams,
        CreditDetailListItem[]
    >(getCreditDetailList);

    const columns: ProColumns<CreditDetailListItem>[] = [
        {
            dataIndex: 'marker_type',
            title: '类型',
            valueType: 'select',
            fieldProps: {
                options: markerType,
            },
        },

        {
            dataIndex: 'total_amount',
            title: '总额(万)',

            render: (text, record, _, action) => {
                return (
                    <Currency value={record.total_amount.toString()}></Currency>
                );
            },
        },
        {
            dataIndex: 'available_amount',
            title: '可用额度(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.available_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'used_amount',
            title: '已用额度(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.used_amount.toString()}></Currency>
                );
            },
        },
        {
            dataIndex: 'approve_amount',
            title: '下批额度(万)',

            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.approve_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'signed_amount',
            title: '已签额度(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.signed_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'overdue_amount',
            title: '逾期金额(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.overdue_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'penalty',
            title: '罚息',
            render: (text, record, _, action) => {
                return <Currency value={record.penalty.toString()}></Currency>;
            },
        },
        {
            dataIndex: 'count',
            title: '逾期次数',
        },
    ];

    return (
        <div>
            <ProTable<CreditDetailListItem>
                columns={columns}
                request={async (params, sorter, filter) => {
                    const { data } = await _fetchCreditDetailList({
                        currency: params.currency,
                        member_code: accountInfo.member_code,
                    });
                    dispatch(setCreditDetailList(data ?? []));
                    return Promise.resolve({
                        data: data ?? [],
                        success: true,
                    });
                }}
                params={{
                    currency: currencyType,
                }}
                rowKey={(item) => item.marker_type}
                pagination={false}
                toolBarRender={false}
                search={false}
                scroll={{ x: 800 }}
            />
        </div>
    );
};

export default CreditOverviewList;
