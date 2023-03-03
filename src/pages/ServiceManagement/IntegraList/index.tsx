import React, { FC, useState } from 'react';
import { Button } from 'antd';
import { useHttp, useNewWindow } from '@/hooks';
import type { ProColumns } from '@ant-design/pro-components';
import { ProCard, ProTable } from '@ant-design/pro-components';
import IntegraListDetail from './IntegraListDetail';
import { getIntegralList, getIntegralListExport } from '@/api/service';
import { IntegralListParams } from '@/types/api/service';
import { formatCurrency } from '@/utils/tools';
import ExportExcel from '@/components/ExportExcel';

type IntegraListProps = {};
type IntegraListItem = {
    account: string;
    account_name: string;
    last_month_integral: number;
    this_month_earn: number;
    this_month_consume: number;
    balance: number;
    expiring: number;
};

const IntegraList: FC<IntegraListProps> = (props) => {
    const { toNewWindow } = useNewWindow();
    const { fetchData: fetchGetIntegralList } = useHttp<
        IntegralListParams,
        any
    >(getIntegralList);
    const [paramsEx, setParamsEx] = useState<any>({});
    const columns: ProColumns<IntegraListItem>[] = [
        {
            dataIndex: 'account',
            key: 'account',
            title: '户口号',
            align: 'center',
            render: (_, record) => {
                return (
                    <span
                        className="m-primary-font-color pointer"
                        onClick={() =>
                            toNewWindow(
                                `/account/customerAccountDetail/${record.account}`,
                            )
                        }
                    >
                        {record.account}
                    </span>
                );
            },
        },
        {
            dataIndex: 'account_name',
            key: 'account_name',
            title: '户口名',
            align: 'center',
        },
        {
            dataIndex: 'last_month_integral',
            key: 'last_month_integral',
            title: '上月剩余积分（万）',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => formatCurrency(record.last_month_integral),
        },
        {
            dataIndex: 'this_month_earn',
            key: 'this_month_earn',
            title: '本月获得积分（万）',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => formatCurrency(record.this_month_earn),
        },
        {
            dataIndex: 'this_month_consume',
            key: 'this_month_consume',
            title: '本月消费积分（万）',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => formatCurrency(record.this_month_consume),
        },
        {
            dataIndex: 'balance',
            key: 'balance',
            title: '总积分余额（万）',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => formatCurrency(record.balance),
        },
        {
            dataIndex: 'expiring',
            key: 'expiring',
            title: '即将过期积分（万）',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => formatCurrency(record.expiring),
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            align: 'center',
            render: (text, record, _, action) => (
                <IntegraListDetail record={record} />
            ),
        },
    ];
    return (
        <ProCard
            style={{
                height: 'calc(100vh - 200px)',
                overflowY: 'auto',
            }}
        >
            <ProTable<IntegraListItem>
                columns={columns}
                id={'integra-table'}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    setParamsEx(params);
                    const res = await fetchGetIntegralList(params);
                    return Promise.resolve({
                        data: res.data.list ?? [],
                        total: res.data.total || 0,
                        success: true,
                    });
                }}
                size="small"
                rowKey="id"
                pagination={{
                    showQuickJumper: true,
                }}
                search={{
                    labelWidth: 80,
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <ExportExcel
                            fileName={'积分列表'}
                            params={paramsEx}
                            api={getIntegralListExport}
                        />,
                        ...dom.reverse(),
                    ],
                }}
                toolBarRender={false}
            />
        </ProCard>
    );
};

export default IntegraList;
