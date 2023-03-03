import React, { FC, useState, useRef } from 'react';
import moment from 'moment';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { message } from 'antd';
import { useHttp, useNewWindow } from '@/hooks';
import { getConsumList, consumApproval } from '@/api/service';
import { ConsumListParams, ConsumApprovalParams } from '@/types/api/service';
import ConsumDetail from '@/pages/ServiceManagement/ConsumList/ConsumDetail';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList, selectHallList } from '@/store/common/commonSlice';
import { paymentType, orderStatus } from '@/common/commonConstType';
import Currency from '@/components/Currency';

type ConsumListProps = {};

type ConsumListItem = {
    venue: string; //场馆
    account: string; //户口号
    customerName: string; //客户
    currency: number; //币种: 0 所有, 1 披索, 2 港币 , 3 美金, 4 人民币
    paymentMethod: number; //结算方式, 0 现金, 1 存卡, 2 佣金, 3 积分, 4 赠送, 5 经办人
    orderType: number; //订单类型，0 新增, 1 退单
    operator: string; //操作人
    orderStatus: number; // 订单状态,  0 已结算, 1 已结算, 2待退单, 3 已退单, 4 已取消
    orderTime: number; //订单时间
    orderNumber: string;
    order_amount: string; // 订单金额
    id: string;
};

const ConsumerService: FC<ConsumListProps> = (props) => {
    const { toNewWindow } = useNewWindow();
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchGetConsumList } = useHttp<ConsumListParams, any>(
        getConsumList,
    );
    // 订单审批
    const { fetchData: fetchConsumApproval } = useHttp<
        ConsumApprovalParams,
        any
    >(consumApproval);

    const itemOption = async ({ id, result }: ConsumApprovalParams) => {
        const res = await fetchConsumApproval({ id, result });
        tableRef?.current?.reload();
        if (res.code === 10000) {
            message.success(res.msg);
        }
    };
    const columnsSearch: ProColumns<ConsumListItem>[] = [
        {
            dataIndex: 'venue_type',
            key: 'venue_type',
            title: '场馆',
            request: async () => [...hallList],
            hideInTable: true,
        },
        {
            dataIndex: 'account',
            key: 'account',
            title: '户口号',
            hideInTable: true,
            render: (_, record) => {
                return (
                    <span
                        className="m-primary-font-color pointer"
                        onClick={() =>
                            toNewWindow(
                                `/account/customerAccountDetail/${record.account}`,
                            )
                        }
                    >
                        {record.account}
                    </span>
                );
            },
        },
        {
            dataIndex: 'currency_type',
            key: 'currency_type',
            title: '币种',
            request: async () => [...currencyList],
            hideInTable: true,
        },
        {
            dataIndex: 'order_status',
            key: 'order_status',
            title: '类型',
            request: async () => [{ label: '所有', value: '' }, ...orderStatus],
            hideInTable: true,
        },
        {
            dataIndex: 'order_number',
            key: 'order_number',
            title: '订单编号',
            hideInTable: true,
        },
    ];
    const columnsData: ProColumns<ConsumListItem>[] = [
        {
            dataIndex: 'venue_type',
            key: 'venue_type',
            title: '场馆',
            hideInSearch: true,
            align: 'center',
            request: async () => [...hallList],
            valueType: 'select',
        },
        {
            dataIndex: 'create_time',
            key: 'create_time',
            title: '订单时间',
            hideInSearch: true,
            align: 'center',
            render: (_, record: any) => {
                if (record.create_time) {
                    return moment(record.create_time * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                    );
                }
            },
        },
        {
            dataIndex: 'order_number',
            key: 'order_number',
            title: '订单编号',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'account',
            key: 'account',
            title: '户口号',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'customer_name',
            key: 'customer_name',
            title: '客户名',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'currency_type',
            key: 'currency_type',
            title: '币种',
            hideInSearch: true,
            align: 'center',
            request: async () => [...currencyList],
            valueType: 'select',
        },
        {
            dataIndex: 'order_status',
            key: 'order_status',
            title: '类型',
            hideInSearch: true,
            align: 'center',
            render: (_, record: any) => {
                return orderStatus.find((item) => {
                    return item.value === record.order_status;
                })?.label;
            },
        },
        {
            dataIndex: 'order_amount',
            key: 'order_amount',
            title: '金额',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => <Currency value={record.order_amount} />,
        },
        {
            title: '详情',
            key: 'detail',
            align: 'center',
            hideInSearch: true,
            render: (text, record, _, action) => (
                <ConsumDetail record={record} title="查看" />
            ),
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            align: 'center',
            render: (text, record, _, action) => (
                <div>
                    <span
                        className="m-primary-font-color pointer"
                        style={{ marginRight: '5px' }}
                        onClick={() => {
                            itemOption({ id: record.id, result: 1 });
                        }}
                    >
                        通过
                    </span>
                    <span
                        className="m-primary-error-color pointer"
                        onClick={() => {
                            itemOption({ id: record.id, result: 0 });
                        }}
                    >
                        拒绝
                    </span>
                </div>
            ),
        },
    ];
    const columns = columnsSearch.concat(columnsData);
    return (
        <ProCard
            style={{
                height: 'calc(100vh - 200px)',
            }}
        >
            <div className="protable-define">
                <ProTable<ConsumListItem>
                    actionRef={tableRef}
                    columns={columns}
                    request={async (params: any, sorter, filter) => {
                        params.page = params.current;
                        params.size = params.pageSize;
                        delete params.current;
                        delete params.pageSize;
                        const res = await fetchGetConsumList({
                            ...params,
                            approval_flag: true,
                        });
                        return Promise.resolve({
                            total: res.data.total || 0,
                            data: res.data.list,
                            success: true,
                        });
                    }}
                    rowKey="id"
                    pagination={{
                        showQuickJumper: true,
                    }}
                    search={{
                        labelWidth: 80,
                        defaultCollapsed: false,
                    }}
                    toolBarRender={false}
                />
            </div>
        </ProCard>
    );
};

export default ConsumerService;
