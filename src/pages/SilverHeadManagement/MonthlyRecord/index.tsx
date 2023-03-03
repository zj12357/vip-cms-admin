import React, { FC } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import SilverHeadModal from './silverHead';
import { getMonthList } from '@/api/silverHead';
import { useHttp } from '@/hooks';
import { MonthListParams } from '@/types/api/silverHead';
import Transcoding from './transcoding';
import '../index.scoped.scss';
import moment from 'moment';
import Currency from '@/components/Currency';
import { selectCurrencyList } from '@/store/common/commonSlice';
import { useAppSelector } from '@/store/hooks';

type Props = {};
type RecordProps = {
    id: number;
    id_record: number;
    created_at: number;
    currency_id: number;
    ledger: number;
    total_chips_amount: number;
    marker: number;
    cash: number;
    commission: number;
    admin_name: string;
};

const SilverHead: FC<Props> = (props) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const { fetchData: fetchGetMonthList } = useHttp<MonthListParams, any>(
        getMonthList,
    );
    const columns: ProColumns<RecordProps, any>[] = [
        {
            dataIndex: 'id',
            title: '编号',
            search: false,
            render: (_, record) => record.id || '',
        },
        {
            dataIndex: 'created_at',
            title: '日期',
            valueType: 'dateTimeRange',
            initialValue: [
                moment(new Date()).startOf('month'),
                moment(new Date()).endOf('day'),
            ],
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        start_time: moment(new Date(value[0])).valueOf() / 1000,
                        end_time: moment(new Date(value[1])).valueOf() / 1000,
                    };
                },
            },
        },
        {
            dataIndex: 'created_at',
            search: false,
            title: '日期',
            render: (_, record) =>
                record.created_at
                    ? moment
                          .unix(record.created_at)
                          .format('YYYY-MM-DD HH:mm:ss')
                    : '',
        },
        {
            dataIndex: 'currency_id',
            title: '币种',
            hideInSearch: true,
            valueType: 'select',
            fieldProps: {
                options: currencyList,
            },
        },
        {
            dataIndex: 'ledger',
            title: '银头总额（万）',
            search: false,
            render: (_, record) => <Currency value={record.ledger} />,
        },
        {
            dataIndex: 'marker',
            title: '已签M（万）',
            search: false,
            render: (_, record) => <Currency value={record.marker} />,
        },
        {
            dataIndex: 'cash',
            title: '现金数',
            search: false,
            render: (_, record) => <Currency value={record.cash} />,
        },
        {
            dataIndex: 'total_chips_amount',
            title: '筹码总额（万）',
            search: false,
            render: (_, record) => (
                <Currency value={record.total_chips_amount} />
            ),
        },
        {
            dataIndex: 'commission',
            title: '已结佣金（万）',
            search: false,
            render: (_, record) => <Currency value={record.commission} />,
        },
        {
            dataIndex: 'admin_name',
            title: '经办人',
            formItemProps: {
                rules: [
                    {
                        required: true,
                    },
                ],
            },
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => {
                return [
                    <SilverHeadModal
                        type={2}
                        record={record}
                        key="silverHeadModal"
                        triggerDom={
                            <span className="m-primary-font-color pointer">
                                银头详情
                            </span>
                        }
                    />,
                    <Transcoding
                        type={2}
                        record={record}
                        key="transcoding"
                        triggerDom={
                            <span
                                key="view"
                                className="m-primary-font-color pointer"
                            >
                                转码详情
                            </span>
                        }
                    />,
                ];
            },
        },
    ];
    const resetData = (data: Array<any>) => {
        const arr: Array<any> = [];
        data.forEach((i) => {
            const { monthly_list_row = [], id, created_at, ...rest } = i;
            monthly_list_row &&
                monthly_list_row.forEach((itm: any, index: number) => {
                    const item =
                        index === 0
                            ? {
                                  id,
                                  created_at,
                              }
                            : {};
                    arr.push({
                        ...rest,
                        ...itm,
                        ...item,
                        id_record: id,
                    });
                });
        });
        return arr;
    };
    return (
        <div>
            <ProTable<RecordProps>
                columns={columns}
                rowKey={(i) => i.currency_id + i.id_record}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res = await fetchGetMonthList({ ...params });
                    const data = resetData(res.data ?? []);
                    return Promise.resolve({
                        data,
                        success: true,
                    });
                }}
                pagination={false}
                search={{
                    labelWidth: 'auto',
                }}
            />
        </div>
    );
};
export default SilverHead;
