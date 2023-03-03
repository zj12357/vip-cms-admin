import React, { FC, useState, useRef, useCallback } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Popconfirm } from 'antd';
import GiveMarkerForm from './GiveMarkerForm';
import { useHttp } from '@/hooks';
import { getSignedList } from '@/api/accountAction';
import {
    GetSignedListParams,
    SignedListItem,
    SignedListType,
} from '@/types/api/accountAction';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { selectCurrencyList } from '@/store/common/commonSlice';
import { markerType } from '@/common/commonConstType';
import Currency from '@/components/Currency';

type SignedMListProps = {};

const SignedMList: FC<SignedMListProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const accountInfo = useAppSelector(selectAccountInfo);
    const currencyList = useAppSelector(selectCurrencyList);

    const { fetchData: _fetchSignedList } = useHttp<
        GetSignedListParams,
        SignedListType
    >(getSignedList);

    const columns: ProColumns<SignedListItem, any>[] = [
        {
            title: '单号',
            dataIndex: 'round',
            hideInSearch: true,
        },
        {
            dataIndex: 'marker_type',
            title: '类型',
            valueType: 'select',
            fieldProps: {
                options: markerType,
            },
            hideInSearch: true,
        },
        {
            title: '户口号',
            dataIndex: 'member_code',
            hideInSearch: true,
        },
        {
            title: '户口名',
            dataIndex: 'member_name',
            hideInSearch: true,
        },
        {
            title: '已签(万)',
            dataIndex: 'marker_amount',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.marker_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            title: '币种',
            dataIndex: 'currency',
            valueType: 'select',
            fieldProps: {
                placeholder: '请选择币种',
                options: currencyList,
            },
        },
        {
            title: '欠M(万)',
            dataIndex: 'left_amount',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.left_amount.toString()}></Currency>
                );
            },
        },
        {
            title: '罚息(万)',
            dataIndex: 'left_interest',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.left_interest.toString()}
                    ></Currency>
                );
            },
        },
        {
            title: '签单时间',
            dataIndex: 'signed_at',
            valueType: 'milliDateTime',
            hideInSearch: true,
        },

        {
            title: '状态',
            dataIndex: 'marker_state',
            valueType: 'select',
            fieldProps: {
                options: [
                    {
                        label: '未还款',
                        value: 1,
                    },
                    {
                        label: '已还款',
                        value: 2,
                    },
                ],
                placeholder: '请选择状态',
            },
        },

        {
            title: '操作人',
            dataIndex: 'operation_name',
            hideInSearch: true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                record.marker_state === 1 && (
                    <GiveMarkerForm
                        key="repayment"
                        record={record}
                        reloadData={reloadData}
                    ></GiveMarkerForm>
                ),
                record.marker_state === 2 && (
                    <Popconfirm
                        key="top"
                        title="你确定要撤销吗?"
                        onConfirm={() => {}}
                        okText="确定"
                        cancelText="取消"
                        disabled
                    >
                        <div className="m-primary-font-color pointer">撤销</div>
                    </Popconfirm>
                ),
            ],
        },
    ];

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    return (
        <div>
            <ProTable<SignedListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchSignedList({
                        member_code: accountInfo.member_code,
                        currency: params.currency,
                        state: params.marker_state,
                        page: params.current ?? 1,
                        size: params.pageSize ?? 20,
                    });
                    return {
                        data: res.data?.list ?? [],
                        total: res.data?.total ?? 0,
                        success: true,
                    };
                }}
                rowKey={(item) => item.id}
                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                }}
                toolBarRender={false}
                scroll={{ x: 1200 }}
                actionRef={tableRef}
            />
        </div>
    );
};

export default SignedMList;
