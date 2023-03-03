import React, { FC, useEffect, useState, useCallback } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import SettleForm from './SettleForm';
import { useHttp } from '@/hooks';
import { getConsumeList } from '@/api/accountAction';
import {
    GetConsumeListParams,
    ConsumeListType,
    ConsumeListItem,
} from '@/types/api/accountAction';
import { useAppSelector } from '@/store/hooks';
import { selectHallList } from '@/store/common/commonSlice';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { paymentType, orderStatus } from '@/common/commonConstType';
import moment from 'moment';
import Currency from '@/components/Currency';

type ConsumptionListProps = {};

const ConsumptionList: FC<ConsumptionListProps> = (props) => {
    const hallList = useAppSelector(selectHallList);
    const accountInfo = useAppSelector(selectAccountInfo);
    const [consumptionId, setConsumptionId] = useState<string>();
    const { fetchData: _fetchConsumeList } = useHttp<
        GetConsumeListParams,
        ConsumeListType
    >(getConsumeList);

    const columns: ProColumns<ConsumeListItem, any>[] = [
        {
            dataIndex: 'create_time',
            valueType: 'milliDateTime',
            title: '时间',
            hideInSearch: true,
        },
        {
            dataIndex: 'create_time',
            valueType: 'dateTimeRange',
            title: '时间',
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        order_start_time: moment(new Date(value[0])).unix(),
                        order_end_time: moment(new Date(value[1])).unix(),
                    };
                },
            },
        },

        {
            dataIndex: 'venue_type',
            title: '消费场馆',
            valueType: 'select',
            fieldProps: {
                options: hallList,
            },
        },

        {
            dataIndex: 'payment_type',
            title: '结算方式',
            hideInSearch: true,
            valueType: 'select',
            fieldProps: {
                options: paymentType,
            },
        },
        {
            dataIndex: 'order_amount',
            title: '金额',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.order_amount.toString()}></Currency>
                );
            },
        },
        {
            dataIndex: 'creator',
            title: '跟进人',
            hideInSearch: true,
        },
        {
            dataIndex: 'operator',
            title: '经手人',
            hideInSearch: true,
        },
        {
            dataIndex: 'order_status',
            title: '状态',
            hideInSearch: true,
            valueType: 'select',
            fieldProps: {
                options: orderStatus,
            },
        },
        {
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <div key="detail">
                    <div
                        onClick={() => {
                            handleVisible(true);
                            setConsumptionId(record.id);
                        }}
                        className="m-primary-font-color pointer"
                    >
                        详情
                    </div>
                    {consumptionId === record.id && (
                        <SettleForm
                            visible={visible}
                            onCancel={() => handleVisible(false)}
                            record={record}
                        ></SettleForm>
                    )}
                </div>,
            ],
        },
    ];
    const [visible, setVisible] = useState(false);
    const handleVisible = useCallback((visible: boolean) => {
        setVisible(visible);
    }, []);

    return (
        <>
            <ProTable<ConsumeListItem>
                columns={columns}
                request={async (params, sorter, filter) => {
                    const res = await _fetchConsumeList({
                        page: params.current ?? 1,
                        size: params.pageSize ?? 20,
                        order_start_time: params.order_start_time,
                        order_end_time: params.order_end_time,
                        account: accountInfo.member_code,
                        venue_type: params.venue_type,
                    });
                    return Promise.resolve({
                        data: res.data?.list ?? [],
                        total: res.data?.total ?? 0,
                        success: true,
                    });
                }}
                rowKey={(item) => item.id}
                pagination={{
                    showQuickJumper: true,
                }}
                toolBarRender={false}
                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                }}
                scroll={{ x: 1000 }}
            />
        </>
    );
};

export default ConsumptionList;
