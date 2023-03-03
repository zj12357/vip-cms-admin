import React, { FC } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import { MonthlyReportListParams } from '@/types/api/report';
import { monthlyReportList } from '@/api/report';
import { monthlyStatusType } from '@/common/commonConstType';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import moment from 'moment';
import DetailModal from './detailModal';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList, selectHallList } from '@/store/common/commonSlice';
import Currency from '@/components/Currency';
type Props = {};
type TranscodingProps = {
    settle_at: string;
    member_code: string;
    member_name: string;
    venue: string;
    currency: string;
    convertChips: string;
    totalCommission: string;
    realCommission: string;
    commissionStatus: string;
    remark: string;
    operator: string;
    createAt: string;
};

const Transcoding: FC<Props> = (props) => {
    const { toNewWindow } = useNewWindow();
    const { fetchData: fetchMonthlyReportList } = useHttp<
        MonthlyReportListParams,
        any
    >(monthlyReportList);

    const hallList = useAppSelector(selectHallList);
    const currencyList = useAppSelector(selectCurrencyList);
    const columns: ProColumns<TranscodingProps>[] = [
        {
            dataIndex: 'member',
            title: '',
            hideInTable: true,
            fieldProps: {
                placeholder: '输入户口名称/户口号',
            },
        },
        {
            dataIndex: 'c',
            title: '月结时间',
            search: false,
        },
        {
            dataIndex: 'member_code',
            title: '户口号',
            hideInTable: true,
        },
        {
            dataIndex: 'member_name',
            title: '户口名',
            hideInTable: true,
        },
        {
            dataIndex: 'time',
            title: '月结时间',
            hideInTable: true,
            valueType: 'dateRange',
            search: {
                transform: (value) => {
                    return {
                        start_time:
                            moment(new Date(value[0]))
                                .startOf('day')
                                .valueOf() / 1000,
                        end_time: Math.ceil(
                            moment(new Date(value[1])).endOf('day').valueOf() /
                                1000,
                        ),
                    };
                },
            },
        },
        {
            dataIndex: 'member_code',
            title: '户口号',
            search: false,
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
            dataIndex: 'club',
            title: '操作场馆',
            search: false,
            valueType: 'select',
            request: async () => [...hallList],
        },
        {
            dataIndex: 'currency',
            title: '币种',
            search: false,
            valueType: 'select',
            request: async () => [...currencyList],
        },
        {
            dataIndex: 'total_zhuan_ma',
            title: '总转码',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'total_yong_jin',
            title: '总佣金',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'zhuanma',
            title: '月结转码',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'yongjin',
            title: '月结佣金',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'status',
            title: '状态',
            valueType: 'select',
            request: async () => [...monthlyStatusType],
        },
        {
            dataIndex: 'remark',
            title: '备注',
            search: false,
        },
        {
            dataIndex: 'operator',
            title: '经手人',
            search: false,
        },
        {
            dataIndex: 'settle_at',
            title: '操作时间',
            search: false,
            render: (val: any) => {
                if (val) {
                    return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
                }
            },
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => {
                return [
                    <DetailModal
                        record={record}
                        key="detailModal"
                        triggerDom={
                            <div className="m-primary-font-color pointer">
                                查看详情
                            </div>
                        }
                    />,
                ];
            },
        },
    ];
    return (
        <div>
            <ProTable<TranscodingProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res: any = await fetchMonthlyReportList({
                        ...params,
                    });
                    return Promise.resolve({
                        data: res.data.data ?? [],
                        total: res.data.total ?? 0,
                        success: true,
                    });
                }}
            />
        </div>
    );
};
export default Transcoding;
