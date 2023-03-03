import React, { FC, useState, useRef } from 'react';
import moment from 'moment';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProCard, ProTable, ProFormSelect } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useHttp, useNewWindow } from '@/hooks';
import { getConsumList, getConsumOperator } from '@/api/service';
import { useAppSelector } from '@/store/hooks';
import {
    selectCurrencyList,
    selectHallList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import { ConsumListParams } from '@/types/api/service';
import { paymentType, orderStatus } from '@/common/commonConstType';
import AddConsumList from './AddConsumList';
import CancelConsum from './ConsumDetail/components/CancelConsum';
import ConsumDetail from './ConsumDetail';
import EditConsumList from './ConsumDetail/components/EditConsumList';
import './index.scoped.scss';
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
    order_status: number; // 订单状态,  0 待结算, 1 已结算, 2待退单, 3 已退单, 4 已取消
    orderTime: number; //订单时间
    orderNumber: string;
    order_amount: string; // 订单金额
};

const ConsumList: FC<ConsumListProps> = (props) => {
    const { toNewWindow } = useNewWindow();
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchGetConsumList } = useHttp<ConsumListParams, any>(
        getConsumList,
    );
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);
    const currentHall = useAppSelector(selectCurrentHall);
    const [venueForProps, setVenueForProps] = useState(currentHall.id);
    const columnsSearch: ProColumns<ConsumListItem>[] = [
        {
            hideInTable: true,
            renderFormItem: (item, _, form) => {
                const rest = {
                    onChange: (value: any) => {
                        setVenueForProps(value);
                    },
                };
                return (
                    <div className="consum-defined-search">
                        <ProFormSelect
                            initialValue={currentHall.id}
                            options={[...hallList]}
                            name="venue_type"
                            label="场馆"
                            {...rest}
                        />
                    </div>
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
            dataIndex: 'account',
            key: 'account',
            title: '户口号',
            hideInTable: true,
        },
        {
            dataIndex: 'customer_name',
            key: 'customer_name',
            title: '客户',
            hideInTable: true,
        },
        {
            dataIndex: 'payment_type',
            key: 'payment_type',
            title: '结算方式',
            request: async () => [...paymentType],
            hideInTable: true,
        },
        {
            dataIndex: 'operator',
            key: 'operator',
            title: '操作人',
            request: async () => {
                const res = await getConsumOperator();
                if (res.code === 10000) {
                    const arr = res.data.operator_list.map((item: any) => {
                        return {
                            label: item.name,
                            value: item.name,
                        };
                    });

                    return arr;
                } else {
                    return [];
                }
            },
            hideInTable: true,
        },
        {
            dataIndex: 'order_status',
            key: 'order_status',
            title: '订单状态',
            request: async () => [...orderStatus],
            hideInTable: true,
        },
        {
            dataIndex: 'orderTime',
            key: 'orderTime',
            title: '订单时间',
            valueType: 'dateTimeRange',
            search: {
                transform: (value) => {
                    return {
                        order_start_time:
                            moment(new Date(value[0])).valueOf() / 1000,
                        order_end_time:
                            moment(new Date(value[1])).valueOf() / 1000,
                    };
                },
            },
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
            render: (_, record: any) => {
                return hallList.find((item) => {
                    return item.value === record.venue_type;
                })?.label;
            },
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
            dataIndex: 'customer_name',
            key: 'customer_name',
            title: '客户',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'currency_type',
            key: 'currency_type',
            title: '币种',
            hideInSearch: true,
            align: 'center',
            render: (_, record: any) => {
                return currencyList.find((item) => {
                    return item.value === record.currency_type;
                })?.label;
            },
        },
        {
            dataIndex: 'payment_type',
            key: 'payment_type',
            title: '结算方式',
            hideInSearch: true,
            align: 'center',
            render: (_, record: any) => {
                return [
                    {
                        label: '所有',
                        value: 0,
                    },
                    ...paymentType,
                ].find((item) => {
                    return item.value === record.payment_type;
                })?.label;
            },
        },
        {
            dataIndex: 'order_amount',
            key: 'order_amount',
            title: '订单金额',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => (
                <Currency value={record.order_amount} decimal={6} />
            ),
        },
        {
            dataIndex: 'creator',
            key: 'creator',
            title: '操作人',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'order_status',
            key: 'order_status',
            title: '订单状态',
            hideInSearch: true,
            align: 'center',
            render: (_, record: any) => {
                return [
                    {
                        label: '所有',
                        value: 0,
                    },
                    ...orderStatus,
                ].find((item) => {
                    return item.value === record.order_status;
                })?.label;
            },
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            align: 'center',
            render: (text, record, _, action) =>
                record.order_status === 1 ? (
                    <EditConsumList
                        record={record}
                        onSuccess={() => {
                            tableRef.current?.reload();
                        }}
                    />
                ) : record.order_status === 2 ||
                  record.order_status === 3 ||
                  record.order_status === 4 ? (
                    <CancelConsum
                        orderStatus={record.order_status}
                        record={record}
                        onSuccess={() => {
                            tableRef.current?.reload();
                        }}
                    />
                ) : (
                    <ConsumDetail record={record} />
                ),
        },
    ];
    const columns = columnsSearch.concat(columnsData);
    return (
        <ProCard
            style={{
                height: 'calc(100vh - 200px)',
                overflowY: 'auto',
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
                        const res = await fetchGetConsumList(params);
                        return Promise.resolve({
                            data: res.data.list,
                            total: res.data.total,
                            success: true,
                        });
                    }}
                    onReset={() => {
                        setVenueForProps(currentHall.id);
                    }}
                    rowKey="id"
                    pagination={{
                        showQuickJumper: true,
                    }}
                    search={{
                        labelWidth: 80,
                        defaultCollapsed: false,
                        optionRender: (searchConfig, formProps, dom) => [
                            ...dom.reverse(),
                            venueForProps ? (
                                <AddConsumList
                                    onSuccess={() => {
                                        tableRef.current?.reload();
                                    }}
                                    key={'add_list'}
                                    venueForProps={venueForProps}
                                />
                            ) : (
                                <Button
                                    key={'empty_add_list'}
                                    type="primary"
                                    onClick={() => {
                                        message.error('请先选择场馆');
                                    }}
                                >
                                    新建
                                </Button>
                            ),
                        ],
                    }}
                    toolBarRender={false}
                />
            </div>
        </ProCard>
    );
};

export default ConsumList;
