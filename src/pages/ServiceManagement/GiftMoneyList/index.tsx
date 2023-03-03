import React, { FC, useState } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import type { ProColumns } from '@ant-design/pro-components';
import { ProCard, ProTable } from '@ant-design/pro-components';
import GiftMoneyListDetail from './GiftMoneyListDetail';
import { GiftsListParams } from '@/types/api/service';
import { getGiftsList, getGiftsListExport } from '@/api/service';
import { formatCurrency } from '@/utils/tools';
import ExportExcel from '@/components/ExportExcel';

type GiftMoneyListProps = {};
type GiftMoneyListItem = {
    account: string;
    account_name: string;
    this_month_earn: number;
    total: number;
    this_month_consume: number;
    balance: number;
};

const GiftMoneyList: FC<GiftMoneyListProps> = (props) => {
    const { toNewWindow } = useNewWindow();
    const { fetchData: fetchGetGiftsList } = useHttp<GiftsListParams, any>(
        getGiftsList,
    );
    const [paramsEx, setParamsEx] = useState<any>({});
    const columns: ProColumns<GiftMoneyListItem>[] = [
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
            dataIndex: 'this_month_earn',
            key: 'this_month_earn',
            title: '本月获得礼遇金（万）',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => formatCurrency(record.this_month_earn),
        },
        {
            dataIndex: 'total',
            key: 'total',
            title: '礼遇金总额（万）',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => formatCurrency(record.total),
        },
        {
            dataIndex: 'this_month_consume',
            key: 'this_month_consume',
            title: '本月消费礼遇金（万）',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => formatCurrency(record.this_month_consume),
        },
        {
            dataIndex: 'balance',
            key: 'balance',
            title: '礼遇金余额（万）',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => formatCurrency(record.balance),
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            align: 'center',
            render: (text, record, _, action) => (
                <GiftMoneyListDetail record={record} />
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
            <ProTable<GiftMoneyListItem>
                columns={columns}
                id={'gift-table'}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    setParamsEx(params);
                    const res = await fetchGetGiftsList(params);
                    return Promise.resolve({
                        data: res.data.list ?? [],
                        total: res.data.total || 0,
                        success: true,
                    });
                }}
                rowKey="id"
                pagination={{
                    showQuickJumper: true,
                }}
                size="small"
                search={{
                    labelWidth: 80,
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <ExportExcel
                            fileName={'礼遇金列表'}
                            params={paramsEx}
                            api={getGiftsListExport}
                        />,
                        ...dom.reverse(),
                    ],
                }}
                toolBarRender={false}
            />
        </ProCard>
    );
};

export default GiftMoneyList;
