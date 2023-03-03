import React, { FC } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getConsumeCourtesyList } from '@/api/accountAction';
import { ConsumeCourtesyListItem } from '@/types/api/accountAction';
import { nanoid } from 'nanoid';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import Currency from '@/components/Currency';

type PointsInfoListProps = {};

const PointsInfoList: FC<PointsInfoListProps> = (props) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const { fetchData: _fetchConsumeList } = useHttp<
        string,
        ConsumeCourtesyListItem[]
    >(getConsumeCourtesyList);

    const columns: ProColumns<ConsumeCourtesyListItem>[] = [
        {
            dataIndex: 'type',
            title: '类型',
            valueType: 'select',
            fieldProps: {
                options: [
                    {
                        label: '积分',
                        value: 1,
                    },
                    {
                        label: '礼遇金',
                        value: 2,
                    },
                ],
            },
        },

        {
            dataIndex: 'total',
            title: '总余额',
            render: (text, record, _, action) => {
                return <Currency value={record.total.toString()}></Currency>;
            },
        },
        {
            dataIndex: 'used',
            title: '已用',
            render: (text, record, _, action) => {
                return <Currency value={record.used.toString()}></Currency>;
            },
        },
        {
            dataIndex: 'balance',
            title: '剩余',
            render: (text, record, _, action) => {
                return <Currency value={record.balance.toString()}></Currency>;
            },
        },
        {
            dataIndex: 'expiring',
            title: '即将过期(本月)',
            render: (text, record, _, action) => {
                return <Currency value={record.expiring.toString()}></Currency>;
            },
        },
    ];
    return (
        <ProTable<ConsumeCourtesyListItem>
            columns={columns}
            request={async (params, sorter, filter) => {
                const { data } = await getConsumeCourtesyList(
                    accountInfo.member_code,
                );
                return Promise.resolve({
                    data: data ?? [],
                    success: true,
                });
            }}
            rowKey={() => nanoid()}
            pagination={{
                showQuickJumper: true,
            }}
            toolBarRender={false}
            search={false}
            scroll={{ x: 1000 }}
        />
    );
};

export default PointsInfoList;
