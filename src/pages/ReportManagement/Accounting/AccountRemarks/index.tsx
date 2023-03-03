import React, { FC } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import { MemberRemarksLogListParams } from '@/types/api/report';
import { memberRemarksLogList } from '@/api/report';
import { selectDepartmentList } from '@/store/common/commonSlice';
import { accountRemarkStatusType } from '@/common/commonConstType';
import { useAppSelector } from '@/store/hooks';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import moment from 'moment';

type Props = {};
type AccountRemarksProps = {
    created_at: number;
    member_code: string;
    member_name: string;
    member_id: string;
    content: string;
    operator2: string;
    operator: string;
    operateStatus: string;
};

const AccountRemarks: FC<Props> = (props) => {
    const { toNewWindow } = useNewWindow();
    const departmentList = useAppSelector(selectDepartmentList);
    const { fetchData: fetchMemberRemarksLogList } = useHttp<
        MemberRemarksLogListParams,
        any
    >(memberRemarksLogList);
    const columns: ProColumns<AccountRemarksProps>[] = [
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
            title: '操作时间',
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
            dataIndex: 'content',
            title: '备注内容',
            search: false,
        },
        {
            dataIndex: 'department',
            title: '添加部门',
            search: false,
            valueType: 'select',
            request: async () => [...departmentList],
        },
        {
            dataIndex: 'operator',
            title: '操作人',
            search: false,
        },
        {
            dataIndex: 'operate',
            title: '状态',
            search: false,
            valueType: 'select',
            request: async () => [...accountRemarkStatusType],
        },
    ];

    return (
        <div>
            <ProTable<AccountRemarksProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res: any = await fetchMemberRemarksLogList({
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
export default AccountRemarks;
