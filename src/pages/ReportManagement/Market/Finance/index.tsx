import React, { FC } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import { WalletReportListParams } from '@/types/api/report';
import { walletReportList } from '@/api/report';
import { selectHallList, selectCurrencyList } from '@/store/common/commonSlice';
import { detailTradetype, shiftType } from '@/common/commonConstType';
import { useAppSelector } from '@/store/hooks';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import moment from 'moment';
import Currency from '@/components/Currency';

type Props = {};
type FinanceProps = {
    created_at: number;
    venue: string;
    member_code: string;
    member_name: string;
    currency: number;
    detail_type: number;
    amount: number;
    interval: number;
    created_name: string;
};

const Finance: FC<Props> = (props) => {
    const hallList = useAppSelector(selectHallList);
    const currencyList = useAppSelector(selectCurrencyList);
    const { toNewWindow } = useNewWindow();
    const { fetchData: fetchWalletReportList } = useHttp<
        WalletReportListParams,
        any
    >(walletReportList);
    const columns: ProColumns<FinanceProps>[] = [
        {
            dataIndex: 'time',
            title: '时间',
            hideInTable: true,
            valueType: 'dateTimeRange',
            initialValue: [
                moment(new Date()).startOf('day'),
                moment(new Date()).endOf('day'),
            ],
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
            title: '交易时间',
            search: false,
            align: 'center',
            render: (_, record) => {
                if (record.created_at) {
                    return moment(record.created_at * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                    );
                }
            },
        },
        {
            dataIndex: 'hall',
            title: '场馆',
            valueType: 'select',
            hideInTable: true,
            request: async () => [...hallList],
        },
        {
            dataIndex: 'hall_id',
            title: '场馆',
            valueType: 'select',
            search: false,
            request: async () => [...hallList],
        },
        {
            dataIndex: 'member_code',
            title: '户口号',
            render: (_, record) => {
                return (
                    <div
                        className="m-primary-font-color pointer"
                        key="detail"
                        onClick={() =>
                            toNewWindow(
                                `/account/customerAccountDetail/${record.member_code}`,
                            )
                        }
                    >
                        {record.member_code}
                    </div>
                );
            },
        },
        {
            dataIndex: 'member_name',
            title: '户口名',
            search: false,
        },
        {
            dataIndex: 'currency',
            title: '币种',
            valueType: 'select',
            hideInTable: true,
            request: async () => [...currencyList],
        },
        {
            dataIndex: 'currency_id',
            title: '币种',
            valueType: 'select',
            search: false,
            request: async () => [...currencyList],
        },
        {
            dataIndex: 'detail_type',
            title: '交易类型',
            valueType: 'select',
            request: async () => [...detailTradetype],
        },
        {
            dataIndex: 'amount',
            title: '金额',
            search: false,
            render: (val) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'after_amount',
            title: '账户余额',
            search: false,
            render: (val) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'remark',
            title: '备注',
            search: false,
        },
        {
            dataIndex: 'interval',
            title: '更次',
            valueType: 'select',
            request: async () => [...shiftType],
        },
        {
            dataIndex: 'created_name',
            title: '经手人',
            search: false,
        },
    ];

    return (
        <div>
            <ProTable<FinanceProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res: any = await fetchWalletReportList({
                        ...params,
                    });
                    return Promise.resolve({
                        data: res.data.list ?? [],
                        total: res.data.total ?? 0,
                        success: true,
                    });
                }}
            />
        </div>
    );
};
export default Finance;
