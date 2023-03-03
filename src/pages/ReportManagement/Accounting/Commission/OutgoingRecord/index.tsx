import React, { FC } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import { OutGoingReportListParams } from '@/types/api/report';
import { outGoingReportList } from '@/api/report';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import moment from 'moment';
import DetailModal from './detailModal';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList, selectHallList } from '@/store/common/commonSlice';
import Currency from '@/components/Currency';

type Props = {};
type TranscodingProps = {
    settle_at: number;
    member_code: string;
    member_name: string;
    venue: string;
    currency: string;
    convertChips: string;
    totalCommission: string;
    realCommission: string;
    remark: string;
    operator: string;
};

const Transcoding: FC<Props> = (props) => {
    const { toNewWindow } = useNewWindow();
    const { fetchData: fetchOutGoingReportList } = useHttp<
        OutGoingReportListParams,
        any
    >(outGoingReportList);

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
            dataIndex: 'settle_at',
            title: '时间',
            search: false,
            render: (_, record) => {
                if (record.settle_at) {
                    return moment(record.settle_at * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                    );
                }
            },
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
            title: '时间',
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
            render: (val, record) => {
                return record.member_name ? record.member_name : '';
            },
        },
        {
            dataIndex: 'club',
            title: '即出场馆',
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
            dataIndex: 'yijie_zhuanma',
            title: '即出转码',
            search: false,
            render: (val) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'yijie_yongjin',
            title: '即出佣金',
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
            dataIndex: 'operator',
            title: '经手人',
            search: false,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => {
                return [
                    <DetailModal
                        key="detailModal"
                        record={record}
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
                    const res: any = await fetchOutGoingReportList({
                        ...params,
                    });

                    return Promise.resolve({
                        data: res?.data?.list,
                        total: res?.data?.total,
                        success: true,
                    });
                }}
            />
        </div>
    );
};
export default Transcoding;
