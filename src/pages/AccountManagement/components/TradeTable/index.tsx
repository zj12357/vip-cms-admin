import React, { FC, useRef, forwardRef } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getMemberBalanceList } from '@/api/account';
import { MemberBalanceListItem } from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { selectHallList } from '@/store/common/commonSlice';
import Currency from '@/components/Currency';
import { nanoid } from 'nanoid';

type TradeTableProps = {};

const TradeTable = forwardRef<ActionType, TradeTableProps>((props, ref) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const hallList = useAppSelector(selectHallList);

    const { fetchData: _fetchMemberBalanceList } = useHttp<
        string,
        MemberBalanceListItem[]
    >(getMemberBalanceList);

    const columns: ProColumns<MemberBalanceListItem>[] = [
        {
            dataIndex: 'currency_code',
            title: '币种类型',
            width: '25%',
        },
        {
            dataIndex: 'balance',
            title: '余额',
            width: '25%',
            render: (text, record, _, action) => {
                return <Currency value={record.balance.toString()}></Currency>;
            },
        },
        {
            dataIndex: 'available',
            title: '可用余额',
            width: '25%',
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.available.toString()}></Currency>
                );
            },
        },
        {
            dataIndex: 'frozen',
            title: '已冻结',
            width: '25%',
            render: (text, record, _, action) => {
                return <Currency value={record.frozen.toString()}></Currency>;
            },
        },
    ];

    const expandedRowRender = (record: MemberBalanceListItem) => {
        return (
            <ProTable
                columns={[
                    {
                        dataIndex: 'hall',
                        width: '25%',
                        valueType: 'select',
                        fieldProps: {
                            options: hallList,
                        },
                    },
                    {
                        dataIndex: 'balance',
                        width: '25%',
                        render: (text, record, _, action) => {
                            return (
                                <Currency
                                    value={record.balance.toString()}
                                ></Currency>
                            );
                        },
                    },
                    {
                        dataIndex: 'available',
                        width: '25%',
                        render: (text, record, _, action) => {
                            return (
                                <Currency
                                    value={record.available.toString()}
                                ></Currency>
                            );
                        },
                    },
                    {
                        dataIndex: 'frozen',
                        render: (text, record, _, action) => {
                            return (
                                <Currency
                                    value={record.frozen.toString()}
                                ></Currency>
                            );
                        },
                        width: '25%',
                    },
                ]}
                headerTitle={false}
                search={false}
                options={false}
                dataSource={record.hall_balance}
                pagination={false}
                showHeader={false}
                rowKey={() => nanoid()}
            />
        );
    };

    return (
        <ProTable<MemberBalanceListItem>
            columns={columns}
            request={async (params, sorter, filter) => {
                // 表单搜索项会从 params 传入，传递给后端接口。
                const res = await _fetchMemberBalanceList(
                    accountInfo.member_id,
                );
                return Promise.resolve({
                    data: res.data?.map((item, index) => ({
                        ...item,
                        key: index,
                    })),
                    success: true,
                });
            }}
            rowKey={(item) => item.key}
            pagination={{
                showQuickJumper: true,
            }}
            toolBarRender={false}
            search={false}
            expandable={{
                expandedRowRender,
                expandedRowClassName: () => 'expandedRow',
            }}
            scroll={{
                x: 500,
            }}
            actionRef={ref}
        />
    );
});

export default TradeTable;
