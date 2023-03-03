import React, { FC } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getProposalList } from '@/api/accountAction';
import {
    GetProposalListParams,
    ProposalListItem,
} from '@/types/api/accountAction';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { selectCurrencyList } from '@/store/common/commonSlice';
import { markerActionType, markerType } from '@/common/commonConstType';
import Currency from '@/components/Currency';
import Print from '@/components/Print';
import { Button } from 'antd';
import { formatCurrency } from '@/utils/tools';

type BatchRecordListProps = {
    currencyType: number;
};

interface Data {
    label: string;
    value: number;
}
const BatchRecordList: FC<BatchRecordListProps> = ({ currencyType }) => {
    const accountInfo = useAppSelector(selectAccountInfo);

    const { fetchData: _fetchProposalList } = useHttp<
        GetProposalListParams,
        ProposalListItem[]
    >(getProposalList);
    const currencyList = useAppSelector(selectCurrencyList);
    const getLabel = (data: Array<Data>, value: number) => {
        return data.find((item) => item.value === value)?.label;
    };
    const columns: ProColumns<ProposalListItem, any>[] = [
        {
            dataIndex: 'created_at',
            valueType: 'milliDateTime',
            title: '操作时间',
        },
        {
            dataIndex: 'member_code',
            title: '操作户口',
        },
        {
            dataIndex: 'member_name',
            title: '操作户名',
        },
        {
            dataIndex: 'type',
            title: '操作类型',
            valueType: 'select',
            fieldProps: {
                options: markerActionType,
            },
        },
        {
            dataIndex: 'marker_type',
            title: '类型详细',
            valueType: 'select',
            fieldProps: {
                options: markerType,
            },
        },
        {
            dataIndex: 'proposal_amount',
            title: '操作额度',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.proposal_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'after_amount',
            title: '可用额度',
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.after_amount.toString()}></Currency>
                );
            },
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => (
                <Print
                    trigger={<Button type="link">补印</Button>}
                    visible={true}
                    templateType="Official"
                    getData={async () => {
                        return {
                            id: record.id, // 编号
                            name: record.member_name, // 姓名
                            account: record.member_code, // 户口
                            type:
                                getLabel(
                                    markerActionType,
                                    record.marker_type,
                                ) || '', // 类型
                            currency:
                                getLabel(currencyList, record.currency) ||
                                'PHP', // 币种
                            amountCapital: `${
                                formatCurrency(record.proposal_amount) * 10000
                            }`, // 金额
                            amountCurrency: `${formatCurrency(
                                record.proposal_amount,
                            )}万`, // 金额，万
                            remark: record.remark || '', // 备注
                            manager: record.operation || '', // 经办人签署
                        };
                    }}
                />
            ),
        },
    ];
    return (
        <div>
            <ProTable<ProposalListItem>
                columns={columns}
                request={async (params, sorter, filter) => {
                    const { data } = await _fetchProposalList({
                        currency: params.currency,
                        member_code: accountInfo.member_code,
                    });
                    return Promise.resolve({
                        data: data ?? [],
                        success: true,
                    });
                }}
                params={{
                    currency: currencyType,
                }}
                rowKey={(record) => record.id}
                pagination={{
                    showQuickJumper: true,
                }}
                toolBarRender={false}
                search={false}
                scroll={{ x: 1000 }}
            />
        </div>
    );
};

export default BatchRecordList;
