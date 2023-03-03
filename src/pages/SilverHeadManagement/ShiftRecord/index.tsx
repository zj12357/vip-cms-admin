import React, { FC, useState } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import SilverHeadModal from '../MonthlyRecord/silverHead';
import Transcoding from '../MonthlyRecord/transcoding';
import { useHttp } from '@/hooks';
import { getShiftList } from '@/api/silverHead';
import { ShiftListParams } from '@/types/api/silverHead';
import '../index.scoped.scss';
import moment from 'moment';
import Currency from '@/components/Currency';

type Props = {};
type RecordProps = {
    id: number;
    round_no_record: string;
    round_no: string;
    currency_code: string;
    created_at: number;
    shift_desc_record: string;
    ledger: string;
    marker: string;
    total_chips_amount: string;
    cash: number;
    chip: string;
    deposit: number;
    withdraw: number;
    operator: string;
};

const SilverHead: FC<Props> = (props) => {
    const { fetchData: fetchGetShiftList } = useHttp<ShiftListParams, any>(
        getShiftList,
    );
    const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
    const columns: ProColumns<RecordProps, any>[] = [
        {
            dataIndex: 'round_no',
            title: '编号',
            search: false,
            render: (_, record) => record.round_no || '',
        },
        {
            dataIndex: 'created_at',
            title: '日期',
            valueType: 'dateTimeRange',
            hideInTable: true,
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
            dataIndex: 'shift_desc_record',
            title: '班次',
            search: false,
        },
        {
            dataIndex: 'currency_code',
            title: '币种',
            search: false,
        },
        {
            dataIndex: 'ledger',
            title: '银头总额（万）',
            search: false,
            render: (_, record) => <Currency value={record.ledger} />,
        },
        {
            dataIndex: 'cash',
            title: '现金数',
            search: false,
            render: (_, record) => <Currency value={record.cash} />,
        },
        {
            dataIndex: 'marker',
            title: '已签M（万）',
            search: false,
            render: (_, record) => <Currency value={record.marker} />,
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
            dataIndex: 'deposit',
            title: '存款金额',
            search: false,
            render: (_, record) => <Currency value={record.deposit} />,
        },
        {
            dataIndex: 'withdraw',
            title: '取款金额）',
            search: false,
            render: (_, record) => <Currency value={record.withdraw} />,
        },
        {
            dataIndex: 'admin_name',
            title: '经手人',
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => {
                return [
                    <SilverHeadModal
                        type={1}
                        key="silverHeadModal"
                        record={record}
                        triggerDom={
                            <span className="m-primary-font-color pointer">
                                银头详情
                            </span>
                        }
                    />,
                    <Transcoding
                        type={1}
                        key="transcoding"
                        record={record}
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
        data.forEach((i, idx) => {
            const {
                shift_list_row = [],
                admin_id,
                admin_name,
                created_at,
                round_no,
                shift_desc,
                ...rest
            } = i;
            shift_list_row &&
                shift_list_row.forEach((itm: any, index: number) => {
                    const item =
                        index === 0
                            ? {
                                  admin_id,
                                  created_at,
                                  round_no,
                                  shift_desc,
                              }
                            : {};
                    const obj = {
                        ...rest,
                        ...itm,
                        ...item,
                        admin_name,
                        shift_desc: index === 0 ? itm.shift_desc : '',
                        shift_desc_record: itm.shift_desc,
                        created_at_record: created_at,
                        round_no_record: round_no,
                    };
                    if (index === 0) {
                        arr.push(obj);
                    } else {
                        if (index === 1) {
                            arr[idx].children = [obj];
                        } else {
                            arr[idx].children.push(obj);
                        }
                    }
                });
        });
        return arr;
    };
    return (
        <div>
            <ProTable<RecordProps>
                columns={columns}
                rowKey={(i) =>
                    (i.round_no_record || '') +
                    (i.currency_code || '') +
                    (i.shift_desc_record || '')
                }
                expandable={{
                    defaultExpandAllRows: true,
                    expandedRowKeys,
                    onExpandedRowsChange: (keys) => {
                        setExpandedRowKeys(keys);
                    },
                }}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res = await fetchGetShiftList({ ...params });
                    const data = resetData(res.data.list ?? []);
                    const defaultKeys = data.map((i) => {
                        return (
                            (i.round_no_record || '') +
                            (i.currency_code || '') +
                            (i.shift_desc_record || '')
                        );
                    });
                    setExpandedRowKeys(defaultKeys);
                    return Promise.resolve({
                        data: data,
                        total: res.data.total ?? 0,
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
export default SilverHead;
