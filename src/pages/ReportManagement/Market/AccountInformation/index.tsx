import React, { FC } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import { AccountInfoListParams } from '@/types/api/report';
import { accountInfoList } from '@/api/report';
import { selectHallList } from '@/store/common/commonSlice';
import { useAppSelector } from '@/store/hooks';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import moment from 'moment';
import Currency from '@/components/Currency';
import { MemberTypeListItem } from '@/types/api/system';
import { getMemberTypeList } from '@/api/system';

type Props = {};
type AccountInformationProps = {
    created_at: number;
    hall: number;
    member_code: string;
    member_name: string;
    country: string;
    name: string;
    birthday: number;
    vip: string;
    pie: number;
    gu_ben: number;
    member_type: number;
    identity: number;
    upAccount: string;
    upAccountName: string;
    xin_dai: number;
    status: number;
    remark: string;
};

const AccountInformation: FC<Props> = (props) => {
    const hallList = useAppSelector(selectHallList);
    const { toNewWindow } = useNewWindow();
    const { fetchData: fetchAccountInfoList } = useHttp<
        AccountInfoListParams,
        any
    >(accountInfoList);
    //获取户口类型
    const { fetchData: _fetchGetMemberTypeList } = useHttp<
        null,
        MemberTypeListItem[]
    >(getMemberTypeList);
    const columns: ProColumns<AccountInformationProps>[] = [
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
            dataIndex: 'country',
            title: '国籍',
            search: false,
        },
        {
            dataIndex: 'name',
            title: '名称',
            search: false,
        },
        {
            dataIndex: 'birthday',
            title: '出生年月',
            search: false,
            render: (_, record) => {
                if (record.birthday) {
                    return moment(record.birthday * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                    );
                }
            },
        },
        {
            dataIndex: 'vip_grade',
            title: 'VIP',
            search: false,
        },
        {
            dataIndex: 'pie',
            title: '批额',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'gu_ben',
            title: '股本',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
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
            dataIndex: 'identity',
            title: '户口身份',
            valueType: 'select',
            valueEnum: {
                0: '全部',
                1: '代理',
                2: '玩家',
            },
        },
        {
            dataIndex: 'parent_member_code',
            title: '上线',
            search: false,
        },
        {
            dataIndex: 'parent_member_name',
            title: '上线户名',
            search: false,
        },
        {
            dataIndex: 'xin_dai',
            title: '信贷',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'status',
            title: '状态',
            search: false,
        },
        {
            dataIndex: 'remark',
            title: '备注',
            search: false,
        },
    ];
    return (
        <div>
            <ProTable<AccountInformationProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    if (params.identity) {
                        params.identity = Number(params.identity);
                    }
                    delete params.current;
                    delete params.pageSize;
                    const res: any = await fetchAccountInfoList({
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
export default AccountInformation;
