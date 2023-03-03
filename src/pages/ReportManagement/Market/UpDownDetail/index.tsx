import React, { FC } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';

type Props = {};
type UpDownDetailProps = {
    account: string;
    date1: string;
    accountName: string;
    venue: string;
    customerName: string;
    chipsOperator: string;
    admissionType: string;
    startWorkType: string;
    date8: string;
    currency: string;
    shareType: string;
    shareNum: string;
    tablePrincipal: string;
    tableBottomMultiple: string;
    tableBottomDeposit: string;
    principal: string;
    date17: string;
    tableConvertChips: string;
    date19: string;
    tableBottomConvertChips: string;
    date21: string;
    totalUpDownChips: string;
    admissionTime: string;
    offAdmissionTime: string;
};
const columns: ProColumns<UpDownDetailProps>[] = [
    {
        dataIndex: 'account',
        title: '户口',
    },
    {
        dataIndex: 'accountName',
        title: '户名名',
    },
    {
        dataIndex: 'venue',
        title: '开工场馆',
    },
    {
        dataIndex: 'customerName',
        title: '客户',
        search: false,
    },
    {
        dataIndex: 'chipsOperator',
        title: '出码人',
        search: false,
    },
    {
        dataIndex: 'admissionType',
        title: '入场类型',
    },
    {
        dataIndex: 'startWorkType',
        title: '开工类型',
        search: false,
    },
    {
        dataIndex: 'currency',
        title: '币种',
        search: false,
    },
    {
        dataIndex: 'shareType',
        title: '类型',
        search: false,
    },
    {
        dataIndex: 'shareNum',
        title: '占成数',
        search: false,
    },
    {
        dataIndex: 'shareType',
        title: '本金类型',
        search: false,
    },
    {
        dataIndex: 'tablePrincipal',
        title: '台面本金',
        search: false,
    },
    {
        dataIndex: 'tableBottomMultiple',
        title: '台底倍数',
        search: false,
    },
    {
        dataIndex: 'tableBottomDeposit',
        title: '台底本金',
        search: false,
    },
    {
        dataIndex: 'principal',
        title: '总本金',
        search: false,
    },
    {
        dataIndex: 'date17',
        title: '台面输赢',
        search: false,
    },
    {
        dataIndex: 'tableConvertChips',
        title: '台面转码',
        search: false,
    },
    {
        dataIndex: 'date19',
        title: '台底输赢',
        search: false,
    },
    {
        dataIndex: 'tableBottomConvertChips',
        title: '台底转码',
        search: false,
    },
    {
        dataIndex: 'date21',
        title: '总输赢',
        search: false,
    },
    {
        dataIndex: 'totalUpDownChips',
        title: '总转码',
        search: false,
    },
    {
        dataIndex: 'admissionTime',
        title: '入场时间',
        search: false,
    },
    {
        dataIndex: 'offAdmissionTime',
        title: '离场时间',
        search: false,
    },
];

const UpDownDetail: FC<Props> = (props) => {
    return (
        <div>
            <ProTable<UpDownDetailProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                dataSource={[
                    {
                        account: 'PHP',
                        date1: '1100',
                        accountName: '212',
                        venue: '333',
                        customerName: '222',
                        chipsOperator: '200',
                        admissionType: '200',
                        startWorkType: '200',
                        date8: '200',
                        currency: '200',
                        shareType: '200',
                        shareNum: '200',
                        tablePrincipal: '200',
                        tableBottomMultiple: '200',
                        tableBottomDeposit: '200',
                        principal: '200',
                        date17: '200',
                        tableConvertChips: '200',
                        date19: '200',
                        tableBottomConvertChips: '200',
                        date21: '200',
                        totalUpDownChips: '200',
                        admissionTime: '200',
                        offAdmissionTime: '200',
                    },
                ]}
            />
        </div>
    );
};
export default UpDownDetail;
