import React, { FC } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import { CommissionReportListParams } from '@/types/api/report';
import { commissionReportList } from '@/api/report';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import moment from 'moment';
import DetailModal from './detailModal';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import Currency from '@/components/Currency';
import Big from 'big.js';

type Props = {};
type TranscodingProps = {
    c: string;
    member_name: string;
    member_code: string;
    currency: string;
    yijie: number;
    weijie: number;
    unsettledConvertChips: string;
    isFirst: boolean;
};

const Transcoding: FC<Props> = (props) => {
    const { toNewWindow } = useNewWindow();
    const { fetchData: fetchCommissionReportList } = useHttp<
        CommissionReportListParams,
        any
    >(commissionReportList);

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
            dataIndex: 'time',
            title: '时间',
            hideInTable: true,
            valueType: 'dateRange',
            initialValue: [
                moment(new Date()).startOf('month'),
                moment(new Date()).endOf('day'),
            ],
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
            dataIndex: 'c',
            title: '月份',
            search: false,
            render: (val, record) => {
                return record.c ? record.c : '';
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
            dataIndex: 'currency',
            title: '币种',
            search: false,
            valueType: 'select',
            fieldProps: {
                options: currencyList,
            },
        },
        {
            dataIndex: 'totalConvertChips',
            title: '总转码',
            search: false,
            render: (val: any, record) => {
                const total = Number(new Big(record.yijie).plus(record.weijie));
                return <Currency value={total + ''} />;
            },
        },
        {
            dataIndex: 'yijie',
            title: '已结转码',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'weijie',
            title: '未结转码',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
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

    const resetData = (data: any[]) => {
        const res: any[] = [];
        data.forEach((item, index) => {
            const isFirst =
                !data[index - 1]?.c || data[index - 1]?.c !== item.c
                    ? item.c
                    : '';
            res[index] = {
                ...item,
                c: isFirst ? item.c : '',

                isFirst,
            };
        });
        return res;
    };
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
                    const res: any = await fetchCommissionReportList({
                        ...params,
                    });
                    const resArr = resetData(res.data.list ?? []);
                    return Promise.resolve({
                        data: resArr,
                        success: true,
                    });
                }}
            />
        </div>
    );
};
export default Transcoding;
