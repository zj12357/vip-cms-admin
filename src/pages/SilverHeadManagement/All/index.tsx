import React, { FC } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import { getAllList } from '@/api/silverHead';
import { useHttp } from '@/hooks';
import './index.scoped.scss';
import Currency from '@/components/Currency';

type Props = {};
type AllProps = {
    id: number;
    currency_code: string;
    total_ledger: string;
    cash: string;
    marker: string;
    total_chips: string;
    junkets_chips: string;
    regular_chips: string;
    deposit: string;
    lend_ledger: string;
    commission: string;
};
const columns: ProColumns<AllProps>[] = [
    {
        dataIndex: 'currency_code',
        title: '币种类型',
        width: '10%',
    },
    {
        dataIndex: 'total_ledger',
        title: '总银头',
        width: '10%',
        render: (_, record) => <Currency value={record.total_ledger} />,
    },
    {
        dataIndex: 'cash',
        title: '现金数',
        width: '10%',
        render: (_, record) => <Currency value={record.cash} />,
    },
    {
        dataIndex: 'marker',
        title: '已签M',
        width: '10%',
        render: (_, record) => <Currency value={record.marker} />,
    },
    {
        dataIndex: 'total_chips',
        title: '筹码总数',
        width: '10%',
        render: (_, record) => <Currency value={record.total_chips} />,
    },
    {
        dataIndex: 'junkets_chips',
        title: '泥码总数',
        width: '10%',
        render: (_, record) => <Currency value={record.junkets_chips} />,
    },
    {
        dataIndex: 'regular_chips',
        title: '现金码总数',
        search: false,
        width: '10%',
        render: (_, record) => <Currency value={record.regular_chips} />,
    },
    {
        dataIndex: 'deposit',
        title: '存款数',
        width: '10%',
        render: (_, record) => <Currency value={record.deposit} />,
    },
    {
        dataIndex: 'lend_ledger',
        title: '外借银头',
        width: '10%',
        render: (_, record) => <Currency value={record.lend_ledger} />,
    },
    {
        dataIndex: 'commission',
        title: '已结佣金',
        width: '10%',
        render: (_, record) => <Currency value={record.commission} />,
    },
];

const SilverHead: FC<Props> = (props) => {
    const { fetchData: fetchGetAllList } = useHttp<any, any>(getAllList);

    return (
        <div>
            <ProTable<AllProps>
                columns={columns}
                className={'all-table'}
                cardBordered={{
                    table: true,
                }}
                defaultExpandAllRows
                rowKey={(i) => (i.currency_code || '') + (i.id || '')}
                pagination={false}
                request={async () => {
                    const res = await fetchGetAllList();
                    return Promise.resolve({
                        data: res.data ?? [],
                        success: true,
                    });
                }}
                search={false}
            />
        </div>
    );
};
export default SilverHead;
