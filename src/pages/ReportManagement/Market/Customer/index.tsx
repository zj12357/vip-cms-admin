import React, { FC } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';

type Props = {};
type AccountOpeningProps = {
    coinType: string;
    all: string;
    cash: string;
    maker: string;
    chip: string;
    nima: string;
    cashChip: string;
};
const columns: ProColumns<AccountOpeningProps>[] = [
    {
        dataIndex: 'coinType',
        title: '开户日期',
        search: false,
    },
    {
        dataIndex: 'all',
        title: '开户场馆',
        search: false,
    },
    {
        dataIndex: 'cash',
        title: '户口号',
        search: false,
    },
    {
        dataIndex: 'maker',
        title: '户口名',
        search: false,
    },
    {
        dataIndex: 'chip',
        title: '户口类型',
        search: false,
    },
    {
        dataIndex: 'nima',
        title: '户口身份',
        search: false,
    },
    {
        dataIndex: 'cashChip',
        title: '上线',
        search: false,
    },
];

const AccountOpening: FC<Props> = (props) => {
    const expandedRowRender = () => {
        return (
            <div className="child-table">
                <ProTable
                    columns={columns}
                    headerTitle={false}
                    search={false}
                    options={false}
                    pagination={false}
                    cardBordered={{
                        table: true,
                    }}
                    dataSource={[
                        {
                            coinType: 'OKADA',
                            all: '1100',
                            cash: '212',
                            maker: '333',
                            chip: '222',
                            nima: '200',
                            cashChip: '200',
                        },
                        {
                            coinType: 'HANN',
                            all: '1100',
                            cash: '212',
                            maker: '333',
                            chip: '222',
                            nima: '200',
                            cashChip: '200',
                        },
                        {
                            coinType: 'COD',
                            all: '1100',
                            cash: '212',
                            maker: '333',
                            chip: '222',
                            nima: '200',
                            cashChip: '200',
                        },
                    ]}
                />
            </div>
        );
    };
    return (
        <div>
            <ProTable<AccountOpeningProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                dataSource={[
                    {
                        coinType: 'PHP',
                        all: '1100',
                        cash: '212',
                        maker: '333',
                        chip: '222',
                        nima: '200',
                        cashChip: '200',
                    },
                ]}
                // summary={() => {
                //     return Array.from({ length: 10 }, () => {
                //         return '111';
                //     });
                // }}
            />
        </div>
    );
};
export default AccountOpening;
