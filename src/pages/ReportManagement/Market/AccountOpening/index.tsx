import React, { FC } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { OpenAccountListParams } from '@/types/api/report';
import { openAccountList } from '@/api/report';
import { selectHallList } from '@/store/common/commonSlice';
import { getMemberTypeList } from '@/api/system';
import { MemberTypeListItem } from '@/types/api/system';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import moment from 'moment';

type Props = {};
type AccountOpeningProps = {
    created_at: number;
    hall: string;
    member_code: string;
    member_name: string;
    accountType: string;
    admissionIdentity: string;
    upAccount: string;
};

const AccountOpening: FC<Props> = (props) => {
    const { toNewWindow } = useNewWindow();
    const hallList = useAppSelector(selectHallList);
    const { fetchData: fetchOpenAccountList } = useHttp<
        OpenAccountListParams,
        any
    >(openAccountList);
    //获取户口类型
    const { fetchData: _fetchGetMemberTypeList } = useHttp<
        null,
        MemberTypeListItem[]
    >(getMemberTypeList);
    const columns: ProColumns<AccountOpeningProps>[] = [
        {
            dataIndex: 'member',
            title: '',
            hideInTable: true,
            fieldProps: {
                placeholder: '输入户口/上线户口',
            },
        },
        {
            dataIndex: 'created_at',
            title: '开户日期',
            hideInTable: true,
            valueType: 'dateTimeRange',
            initialValue: [
                moment(new Date()).startOf('day'),
                moment(new Date()).endOf('day'),
            ],
            search: {
                transform: (value) => {
                    return {
                        open_start_time:
                            moment(new Date(value[0])).valueOf() / 1000,
                        open_end_time:
                            moment(new Date(value[1])).valueOf() / 1000,
                    };
                },
            },
        },
        {
            dataIndex: 'created_at',
            title: '开户时间',
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
            dataIndex: 'hall',
            title: '开户场馆',
            valueType: 'select',
            request: async () => [...hallList],
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
            dataIndex: 'member_type',
            title: '户口类型',
            valueType: 'select',
            search: false,
            fieldProps: {
                fieldNames: {
                    label: 'name',
                    value: 'member_type_id',
                },
            },
            request: async () => {
                const { data } = await _fetchGetMemberTypeList();
                return data;
            },
        },
        {
            dataIndex: 'admissionIdentity',
            title: '户口身份',
            valueType: 'select',
            valueEnum: {
                0: '全部',
                1: '代理',
                2: '玩家',
            },
        },
        {
            dataIndex: 'parent_member_name',
            title: '上线',
            search: false,
        },
    ];
    return (
        <div>
            <ProTable<AccountOpeningProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res: any = await fetchOpenAccountList({
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
export default AccountOpening;
