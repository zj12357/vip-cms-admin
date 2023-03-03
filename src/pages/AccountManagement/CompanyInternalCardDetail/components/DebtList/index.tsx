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
import Print, { formatChips } from '@/components/Print';
import { Button } from 'antd';

type DebtListProps = {
    trigger: JSX.Element;
    hall: number;
    currency: number;
    company_card: string;
};

const DebtList: FC<DebtListProps> = memo(
    ({ trigger, hall, currency, company_card }) => {
        const hallList = useAppSelector(selectHallList);
        const currencyList = useAppSelector(selectCurrencyList);

        const { fetchData: _fetchReportWalletProposal } = useHttp<
            ReportWalletProposalParams,
            ReportWalletProposalType
        >(reportWalletProposal);

        const columns: ProColumns<ReportWalletProposalItem, any>[] = [
            {
                dataIndex: 'currency_id',
                title: '币种',

                valueType: 'select',
                fieldProps: {
                    options: currencyList,
                },
            },

            {
                dataIndex: 'hall_id',
                title: '场馆',

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
                render: (text, record, _, action) => {
                    return (
                        <Currency value={record.amount.toString()}></Currency>
                    );
                },
            },
            {
                dataIndex: 'after_amount',
                title: '余额(万)',
                hideInSearch: true,
                render: (text, record, _, action) => {
                    return (
                        <Currency
                            value={record.after_amount.toString()}
                        ></Currency>
                    );
                },
            },
            {
                dataIndex: 'remark',
                title: '备注',
            },
            {
                dataIndex: 'interval',
                title: '更次',

                valueType: 'select',
                fieldProps: {
                    options: intervalType,
                },
            },
            {
                dataIndex: 'created_at',
                title: '时间',
                valueType: 'milliDateTime',
            },

            {
                dataIndex: 'created_name',
                title: '经手人',
            },
            {
                title: '操作',
                valueType: 'option',
                key: 'option',
                align: 'center',
                // render: (text, record, _, action) => (
                //     <Print
                //         trigger={<Button type="link">补印</Button>}
                //         visible={record.detail_type}
                //         templateType="Official"
                //         getData={async () => {
                //             return {

                //             }
                //             // const res = await printCovertChips({
                //             //     log_id: record.log_id,
                //             //     convert_chips_type: +record.convert_chips_type,
                //             // });
                //             // if (res.code === 10000) {
                //             //     const data = res.data;
                //             //     return formatChips(data);
                //             // }
                //         }}
                //     />
                // ),
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
                                page: params.current ?? 1,
                                size: params.pageSize ?? 20,
                                hall: hall,
                                currency: currency,
                                type: params.type,
                                detail_type: params.detail_type,
                                company_card: company_card,
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
                        search={false}
                        scroll={{ x: 1000 }}
                    />
                </ModalForm>
            </div>
        );
    },
);

export default DebtList;
