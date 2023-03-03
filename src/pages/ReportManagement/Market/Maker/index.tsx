import React, { FC } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import { MReportListParams } from '@/types/api/report';
import { MReportList } from '@/api/report';
import { selectHallList, selectCurrencyList } from '@/store/common/commonSlice';
import { useAppSelector } from '@/store/hooks';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import { markerReportType, markerReportState } from '@/common/commonConstType';
import moment from 'moment';
import Currency from '@/components/Currency';

type Props = {};
type MakerProps = {
    round: string;
    date1: string;
    member_code: string;
    member_name: string;
    hall_id: number;
    customerName: string;
    currency: string;
    marker_type: string;
    marker_amount: number;
    signed_at: number;
    arrearMarkerAmount: string;
    markerOverdueTime: string;
    repay_amount: number;
    markerPenalty: string;
    operation_name: string;
    marker_state: string;
};

const Maker: FC<Props> = (props) => {
    const hallList = useAppSelector(selectHallList);
    const currencyList = useAppSelector(selectCurrencyList);
    const { toNewWindow } = useNewWindow();
    const { fetchData: fetchMReportList } = useHttp<MReportListParams, any>(
        MReportList,
    );
    const columns: ProColumns<MakerProps>[] = [
        {
            dataIndex: 'round',
            title: 'M单号',
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
            title: '户名名',
        },
        {
            dataIndex: 'hall_id',
            title: '场馆',
            valueType: 'select',
            request: async () => [...hallList],
        },
        {
            dataIndex: 'customerName',
            title: '客户',
            search: false,
        },
        {
            dataIndex: 'currency',
            title: '币种',
            valueType: 'select',
            request: async () => [...currencyList],
        },
        {
            dataIndex: 'marker_type',
            title: 'M类型',
            valueType: 'select',
            request: async () => [...markerReportType],
        },
        {
            dataIndex: 'marker_amount',
            title: '签M金额',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'signed_at',
            title: '签M时间',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                if (record.signed_at) {
                    return moment(record.signed_at * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                    );
                }
            },
        },
        {
            dataIndex: 'left_amount',
            title: '欠M金额',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'expired_date',
            title: '逾期时间',
            hideInSearch: true,
        },
        {
            dataIndex: 'repay_amount',
            title: '已还M金额',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'interest',
            title: '罚息',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'operation_name',
            title: '经手人',
            search: false,
        },
        {
            dataIndex: 'marker_state',
            title: '状态',
            valueType: 'select',
            request: async () => [...markerReportState],
        },
    ];

    return (
        <div>
            <ProTable<MakerProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                pagination={{
                    pageSize: 5,
                }}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res: any = await fetchMReportList({
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
export default Maker;
