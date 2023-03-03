import React, { FC } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import { getBuyRecordList } from '@/api/silverHead';
import { BuRecordParams } from '@/types/api/silverHead';
import { BuyRecordOperateType, BuyRecordType } from '@/common/commonConstType';
import '../index.scoped.scss';
import moment from 'moment';
import Currency from '@/components/Currency';

type Props = {};
type RecordProps = {
    order_no: string;
    created_at: number;
    currency_code: string;
    chips_name: string;
    trade_kind: string;
    balance: string;
    operation_kind: number;
    junkets_balance: string;
    regular_balance: string;
    transcoidng: string;
    remark: string;
    operator: string;
};

const BuyRecord: FC<Props> = (props) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const { fetchData: fetchGetBuyRecordList } = useHttp<BuRecordParams, any>(
        getBuyRecordList,
    );
    const columns: ProColumns<RecordProps, any>[] = [
        {
            dataIndex: 'order_no',
            title: '编号',
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
                        start_work_start_time:
                            moment(new Date(value[0])).valueOf() / 1000,
                        start_work_end_time:
                            moment(new Date(value[1])).valueOf() / 1000,
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
            valueType: 'select',
            align: 'center',
            fieldProps: {
                options: currencyList,
            },
        },
        {
            dataIndex: 'trade_kind',
            title: '购买方式',
            valueType: 'select',
            initialValue: 0,
            align: 'center',
            fieldProps: {
                options: [{ label: '全部', value: 0 }, ...BuyRecordType],
            },
        },
        {
            dataIndex: 'chips_name',
            title: '筹码名称',
            search: false,
        },
        {
            dataIndex: 'operation_kind',
            title: '操作类型',
            valueType: 'select',
            initialValue: 0,
            fieldProps: {
                options: [{ label: '全部', value: 0 }, ...BuyRecordOperateType],
            },
        },
        {
            dataIndex: 'junkets_balance',
            title: '泥码',
            search: false,
            render: (_, record) => <Currency value={record.junkets_balance} />,
        },
        {
            dataIndex: 'regular_balance',
            title: '现金码',
            search: false,
            render: (_, record) => <Currency value={record.regular_balance} />,
        },
        {
            dataIndex: 'balance',
            title: '总转码数',
            search: false,
            render: (_, record) => <Currency value={record.balance} />,
        },
        {
            dataIndex: 'remark',
            title: '备注',
            search: false,
            render: (_, record) => (
                <div style={{ maxWidth: 100, wordBreak: 'break-all' }}>
                    {record.remark}
                </div>
            ),
        },
        {
            dataIndex: 'creator_name',
            title: '经手人',
            search: false,
        },
    ];
    return (
        <div>
            <ProTable<RecordProps>
                columns={columns}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res = await fetchGetBuyRecordList({ ...params });
                    return Promise.resolve({
                        data: res.data.list ?? [],
                        total: res.data.total || 0,
                        success: true,
                    });
                }}
                search={{
                    labelWidth: 'auto',
                }}
            />
        </div>
    );
};
export default BuyRecord;
