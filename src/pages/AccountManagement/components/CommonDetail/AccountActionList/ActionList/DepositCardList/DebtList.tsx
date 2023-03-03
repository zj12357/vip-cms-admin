import React, { FC, memo } from 'react';
import { ProTable, ModalForm } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { reportWalletProposal } from '@/api/accountAction';
import {
    ReportWalletProposalParams,
    ReportWalletProposalItem,
    ReportWalletProposalType,
} from '@/types/api/accountAction';
import { HallBalanceItem } from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { selectHallList, selectCurrencyList } from '@/store/common/commonSlice';
import {
    proposalType,
    proposalDetailType,
    intervalType,
} from '@/common/commonConstType';
import Currency from '@/components/Currency';
import Print from '@/components/Print';
import { Button } from 'antd';
import { formatCurrency } from '@/utils/tools';

type DebtListProps = {
    trigger: JSX.Element;
    hall: number;
    currency: number;
};
interface Data {
    label: string;
    value: number;
}
const DebtList: FC<DebtListProps> = memo(({ trigger, hall, currency }) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const hallList = useAppSelector(selectHallList);
    const currencyList = useAppSelector(selectCurrencyList);

    const { fetchData: _fetchReportWalletProposal } = useHttp<
        ReportWalletProposalParams,
        ReportWalletProposalType
    >(reportWalletProposal);
    const getLabel = (data: Array<Data>, value: number) => {
        return data.find((item) => item.value === value)?.label;
    };

    const columns: ProColumns<ReportWalletProposalItem, any>[] = [
        {
            dataIndex: 'currency_id',
            title: '币种',
            hideInSearch: true,
            valueType: 'select',
            fieldProps: {
                options: currencyList,
            },
        },

        {
            dataIndex: 'hall_id',
            title: '场馆',
            hideInSearch: true,
            valueType: 'select',
            fieldProps: {
                options: hallList,
            },
        },
        {
            dataIndex: 'type',
            title: '类型',
            valueType: 'select',
            fieldProps: {
                options: proposalType,
            },
        },
        {
            dataIndex: 'detail_type',
            title: '具体类型',
            valueType: 'select',
            fieldProps: {
                options: proposalDetailType,
            },
        },
        {
            dataIndex: 'amount',
            title: '金额(万)',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return <Currency value={record.amount.toString()}></Currency>;
            },
        },
        {
            dataIndex: 'after_amount',
            title: '余额(万)',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.after_amount.toString()}></Currency>
                );
            },
        },
        {
            dataIndex: 'remark',
            title: '备注',
            hideInSearch: true,
        },
        {
            dataIndex: 'interval',
            title: '更次',
            hideInSearch: true,
            valueType: 'select',
            fieldProps: {
                options: intervalType,
            },
        },
        {
            dataIndex: 'created_at',
            title: '时间',
            valueType: 'milliDateTime',
            hideInSearch: true,
        },

        {
            dataIndex: 'created_name',
            title: '经手人',
            hideInSearch: true,
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => (
                <Print
                    trigger={<Button type="link">补印</Button>}
                    visible={
                        record.detail_type === 1 ||
                        record.detail_type === 2 ||
                        record.detail_type === 1 ||
                        record.detail_type === 13
                    }
                    templateType="Official"
                    getData={async () => {
                        return {
                            id: record.id, // 编号
                            name: record.member_name, // 姓名
                            account: record.member_code, // 户口
                            type:
                                getLabel(
                                    proposalDetailType,
                                    record.detail_type,
                                ) || '', // 类型
                            currency:
                                getLabel(currencyList, record.currency_id) ||
                                'PHP', // 币种
                            amountCapital: `${
                                formatCurrency(record.amount) * 10000
                            }`, // 金额
                            amountCurrency: `${formatCurrency(
                                record.amount,
                            )}万`, // 金额，万
                            remark: record.remark, // 备注
                            manager: record.created_name, // 经办人签署
                        };
                    }}
                />
            ),
        },
    ];
    return (
        <div>
            <ModalForm
                trigger={trigger}
                title="账变明细"
                width={1000}
                modalProps={{
                    destroyOnClose: true,
                }}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                submitter={false}
            >
                <ProTable<ReportWalletProposalItem>
                    columns={columns}
                    request={async (params, sorter, filter) => {
                        const res = await _fetchReportWalletProposal({
                            member_code: accountInfo.member_code,
                            page: params.current ?? 1,
                            size: params.pageSize ?? 20,
                            hall: hall,
                            currency: currency,
                            type: params.type,
                            detail_type: params.detail_type,
                        });
                        return {
                            data: res.data?.list ?? [],
                            total: res.data?.total ?? 0,
                            success: true,
                        };
                    }}
                    rowKey={(item) => item.id}
                    pagination={{
                        showQuickJumper: true,
                    }}
                    toolBarRender={false}
                    search={{
                        labelWidth: 'auto',
                        span: 6,
                        defaultCollapsed: false,
                    }}
                    scroll={{ x: 1000 }}
                />
            </ModalForm>
        </div>
    );
});

export default DebtList;
