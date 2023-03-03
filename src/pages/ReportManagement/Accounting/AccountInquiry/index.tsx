import React, { FC } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import { MemberIdentityRecordParams } from '@/types/api/report';
import { memberIdentityRecordList } from '@/api/report';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import {
    identityModule,
    memberIdentityType,
    identityStatus,
    identityWay,
} from '@/common/commonConstType';
import moment from 'moment';
import DetailModal from './detailModal';

type Props = {};
type UpDownProps = {
    id: number;
    member_code: string;
    member_name: string;
    member_identity: number;
    identity_module: number;
    identity_way: number;
    identity_status: number;
    created_at: number;
    operator: string;
};

const UpDown: FC<Props> = (props) => {
    const { toNewWindow } = useNewWindow();
    const { fetchData: fetchMarkerProposalReportList } = useHttp<
        MemberIdentityRecordParams,
        any
    >(memberIdentityRecordList);
    const columns: ProColumns<UpDownProps>[] = [
        {
            dataIndex: 'member',
            title: '',
            hideInTable: true,
            fieldProps: {
                placeholder: '输入户口名称/户口号',
            },
        },
        {
            dataIndex: 'month',
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
            dataIndex: 'id',
            title: '验证编号',
            search: false,
        },
        {
            dataIndex: 'member_code',
            title: '户口号',
            search: false,
            render: (_, record) => {
                return (
                    <span
                        className="m-primary-font-color pointer"
                        onClick={() =>
                            toNewWindow(
                                `/account/customerAccountDetail/${record.member_code}`,
                            )
                        }
                    >
                        {record.member_code}
                    </span>
                );
            },
        },
        {
            dataIndex: 'member_name',
            title: '户口名',
            search: false,
        },
        {
            dataIndex: 'member_identity',
            title: '身份',
            search: false,
            valueType: 'select',
            request: async () => [...memberIdentityType],
        },
        {
            dataIndex: 'identity_module',
            title: '验证模块',
            search: false,
            valueType: 'select',
            request: async () => [...identityModule],
        },
        {
            dataIndex: 'identity_way',
            title: '验证方式',
            valueType: 'select',
            request: async () => [...identityWay],
        },
        {
            dataIndex: 'identity_status',
            title: '验证状态',
            search: false,
            valueType: 'select',
            request: async () => [...identityStatus],
        },
        {
            dataIndex: 'created_at',
            title: '验证时间',
            search: false,
            render: (_, record) => {
                if (record.created_at) {
                    return moment(record.created_at * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                    );
                }
            },
        },
        {
            dataIndex: 'dealer',
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
                        record={record}
                        key="detailModal"
                        triggerDom={
                            <div className="m-primary-font-color pointer">
                                详情
                            </div>
                        }
                    />,
                ];
            },
        },
    ];
    return (
        <div>
            <ProTable<UpDownProps>
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
export default UpDown;
