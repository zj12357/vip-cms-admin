import React, { FC } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import { MarkerProposalReportListParams } from '@/types/api/report';
import { markerProposalReportList } from '@/api/report';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import moment from 'moment';
import Currency from '@/components/Currency';
import { fromToMarkType, amountType } from '@/common/commonConstType';

type Props = {};
type BatchOperationProps = {
    member_code: string;
    member_code_t: string;
    created_at: number;
};

const BatchOperation: FC<Props> = (props) => {
    const { toNewWindow } = useNewWindow();
    const { fetchData: fetchMarkerProposalReportList } = useHttp<
        MarkerProposalReportListParams,
        any
    >(markerProposalReportList);
    const columns: ProColumns<BatchOperationProps>[] = [
        {
            dataIndex: 'member',
            title: '',
            hideInTable: true,
            fieldProps: {
                placeholder: '输入户口名称/户口号',
            },
        },
        {
            dataIndex: 'member_code',
            title: '批额户口',
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
            dataIndex: 'marker_type',
            title: '下批类型',
            search: false,
            valueType: 'select',
            request: async () => [...fromToMarkType],
        },
        {
            dataIndex: 'proposal_amount',
            title: '下批额度(万)',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'member_code_t',
            title: '受批户口',
            search: false,
            render: (_, record) => {
                return (
                    <div
                        className="m-primary-font-color pointer"
                        key="detail"
                        onClick={() =>
                            toNewWindow(
                                `/account/customerAccountDetail/${record.member_code_t}`,
                            )
                        }
                    >
                        {record.member_code_t}
                    </div>
                );
            },
        },
        {
            dataIndex: 'marker_type_t',
            title: '获得类型',
            search: false,
            valueType: 'select',
            request: async () => [...fromToMarkType],
        },
        {
            dataIndex: 'proposal_amount',
            title: '获得额度(万)',
            render: (val: any) => <Currency value={val + ''} />,
            search: false,
        },
        {
            dataIndex: 'type',
            title: '状态',
            valueType: 'select',
            request: async () => [...amountType],
        },
        {
            dataIndex: 'month',
            title: '时间',
            hideInTable: true,
            valueType: 'dateTimeRange',
            initialValue: [
                moment(new Date()).startOf('month'),
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
            title: '时间',
            search: false,
            hideInSearch: true,
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
            dataIndex: 'remark',
            title: '备注',
            search: false,
        },
        {
            dataIndex: 'operation',
            title: '经手人',
            search: false,
        },
    ];

    return (
        <div>
            <ProTable<BatchOperationProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res: any = await fetchMarkerProposalReportList({
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
export default BatchOperation;
