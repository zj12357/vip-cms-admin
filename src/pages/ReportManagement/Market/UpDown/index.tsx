import React, { FC } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';

type Props = {};
type UpDownProps = {
    account: string;
    date1: string;
    accountName: string;
    accountType: string;
    accountIdentity: string;
    venue: string;
    admissionType: string;
    shareType: string;
    shareNum: string;
    upNum: string;
    downNum: string;
    upDownNum: string;
};
const columns: ProColumns<UpDownProps>[] = [
    {
        dataIndex: 'openAccountTime',
        title: '时间',
        valueType: 'dateRange',
        hideInTable: true,
    },
    {
        dataIndex: 'account',
        title: '户口',
    },
    {
        dataIndex: 'accountName',
        title: '户名',
    },
    {
        dataIndex: 'accountType',
        title: '户口类型',
    },
    {
        dataIndex: 'accountIdentity',
        title: '身份',
        search: false,
    },
    {
        dataIndex: 'venue',
        title: '场馆',
        valueType: 'select',
        valueEnum: {
            0: '全部',
            1: '代理',
            2: '玩家',
        },
    },
    {
        dataIndex: 'admissionType',
        title: '入场类型',
        valueType: 'select',
        valueEnum: {
            0: 'COD',
            1: 'OKADA',
            2: 'HANN',
        },
    },
    {
        dataIndex: 'admissionType',
        title: '币种',
        valueType: 'select',
        hideInTable: true,
        valueEnum: {
            0: 'PHP',
            1: 'HKD',
            2: 'KRW',
        },
    },
    {
        dataIndex: 'shareType',
        title: '类型',
        valueEnum: {
            0: 'A',
            1: 'B',
        },
    },
    {
        dataIndex: 'shareNum',
        title: '占成比',
        search: false,
    },
    {
        dataIndex: 'upNum',
        title: '上数',
        search: false,
    },
    {
        dataIndex: 'downNum',
        title: '下数',
        search: false,
    },
    {
        dataIndex: 'upDownNum',
        title: '输赢',
        search: false,
    },
];

const UpDown: FC<Props> = (props) => {
    return (
        <div>
            <ProTable<UpDownProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                dataSource={[
                    {
                        account: 'PHP',
                        date1: '1100',
                        accountName: '212',
                        accountType: '333',
                        accountIdentity: '222',
                        venue: '200',
                        admissionType: '200',
                        shareType: '200',
                        shareNum: '200',
                        upNum: '200',
                        downNum: '200',
                        upDownNum: '200',
                    },
                ]}
            />
        </div>
    );
};
export default UpDown;
