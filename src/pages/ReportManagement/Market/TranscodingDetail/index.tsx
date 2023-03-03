import React, { FC } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';

type Props = {};
type TranscodingDetailProps = {
    account: string;
    date1: string;
    accountName: string;
    AccountIdentity: string;
    venue: string;
    currency: string;
    admissionType: string;
    shareType: string;
    cashConvertChips: string;
    markerConvertChips: string;
    totalConvertChips: string;
    AdmissionTime: string;
    OffAdmissionTime: string;
};
const columns: ProColumns<TranscodingDetailProps>[] = [
    {
        dataIndex: 'account',
        title: '户口',
    },
    {
        dataIndex: 'accountName',
        title: '户名',
    },
    {
        dataIndex: 'AccountIdentity',
        title: '身份',
    },
    {
        dataIndex: 'venue',
        title: '场馆',
        search: false,
    },
    {
        dataIndex: 'currency',
        title: '币种',
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
    {
        dataIndex: 'AdmissionTime',
        title: '入场时间',
        search: false,
    },
    {
        dataIndex: 'OffAdmissionTime',
        title: '离场时间',
        search: false,
    },
];

const TranscodingDetail: FC<Props> = (props) => {
    return (
        <div>
            <ProTable<TranscodingDetailProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                dataSource={[
                    {
                        account: 'PHP',
                        date1: '1100',
                        accountName: '212',
                        AccountIdentity: '333',
                        venue: '222',
                        currency: '200',
                        admissionType: '200',
                        shareType: '200',
                        cashConvertChips: '200',
                        markerConvertChips: '200',
                        totalConvertChips: '200',
                        AdmissionTime: '200',
                        OffAdmissionTime: '200',
                    },
                ]}
            />
        </div>
    );
};
export default TranscodingDetail;
