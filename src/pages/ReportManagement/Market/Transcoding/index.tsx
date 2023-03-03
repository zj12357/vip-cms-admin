import React, { FC } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';

type Props = {};
type TranscodingProps = {
    account: string;
    date1: string;
    accountName: string;
    currency: string;
    venue: string;
    admissionType: string;
    shareType: string;
    cashConvertChips: string;
    cashAccountConvertChips: string;
    subAccountCashConvertChips: string;
    markerConvertChips: string;
    markerAccountConvertChips: string;
    subAccountMarkerConvertChips: string;
    totalConvertChips: string;
};
const columns: ProColumns<TranscodingProps>[] = [
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
    },
    {
        dataIndex: 'venue',
        title: '场馆',
        search: false,
    },
    {
        dataIndex: 'admissionType',
        title: '入场类型',
        search: false,
    },
    {
        dataIndex: 'shareType',
        title: '出码类型',
    },
    {
        dataIndex: 'cashConvertChips',
        title: 'C转码',
        search: false,
    },
    {
        dataIndex: 'cashAccountConvertChips',
        title: '本户C转码',
        search: false,
    },
    {
        dataIndex: 'subAccountCashConvertChips',
        title: '下线C转码',
        search: false,
    },
    {
        dataIndex: 'markerConvertChips',
        title: 'M转码',
        search: false,
    },
    {
        dataIndex: 'markerAccountConvertChips',
        title: '本户M转码',
        search: false,
    },
    {
        dataIndex: 'subAccountMarkerConvertChips',
        title: '下线M转码',
        search: false,
    },
    {
        dataIndex: 'totalConvertChips',
        title: '总转码',
        search: false,
    },
];

const Transcoding: FC<Props> = (props) => {
    return (
        <div>
            <ProTable<TranscodingProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                dataSource={[
                    {
                        account: 'PHP',
                        date1: '1100',
                        accountName: '212',
                        currency: '333',
                        venue: '222',
                        admissionType: '200',
                        shareType: '200',
                        cashConvertChips: '200',
                        cashAccountConvertChips: '200',
                        subAccountCashConvertChips: '200',
                        markerConvertChips: '200',
                        markerAccountConvertChips: '200',
                        subAccountMarkerConvertChips: '200',
                        totalConvertChips: '200',
                    },
                ]}
            />
        </div>
    );
};
export default Transcoding;
