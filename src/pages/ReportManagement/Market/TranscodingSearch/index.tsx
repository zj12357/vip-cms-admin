import React, { FC } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';

type Props = {};
type TranscodingSearchProps = {
    account: string;
    date1: string;
    accountName: string;
    venue: string;
    currency: string;
    admissionType: string;
    shareType: string;
    cashConvertChips: string;
    markerConvertChips: string;
    totalConvertChips: string;
};
const columns: ProColumns<TranscodingSearchProps>[] = [
    {
        dataIndex: 'account',
        title: '户口',
        valueType: 'dateRange',
    },
    {
        dataIndex: 'accountName',
        title: '户名',
    },
    {
        dataIndex: 'currency',
        title: '币种',
        search: false,
    },
    {
        dataIndex: 'venue',
        title: '场馆',
        search: false,
    },
    {
        dataIndex: 'admissionType',
        title: '入场类型',
    },
    {
        dataIndex: 'shareType',
        title: '出码类型',
        search: false,
    },
    {
        dataIndex: 'cashConvertChips',
        title: 'C转码',
        search: false,
    },
    {
        dataIndex: 'markerConvertChips',
        title: 'M转码',
        search: false,
    },
    {
        dataIndex: 'totalConvertChips',
        title: '总转码',
        search: false,
    },
];

const TranscodingSearch: FC<Props> = (props) => {
    return (
        <div>
            <ProTable<TranscodingSearchProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                dataSource={[
                    {
                        account: 'PHP',
                        date1: '1100',
                        accountName: '212',
                        venue: '222',
                        currency: '200',
                        admissionType: '200',
                        shareType: '200',
                        cashConvertChips: '200',
                        markerConvertChips: '200',
                        totalConvertChips: '200',
                    },
                ]}
            />
        </div>
    );
};
export default TranscodingSearch;
