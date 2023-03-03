import React, { FC, useRef } from 'react';
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import EditModal from './chipModal';
import { useHttp } from '@/hooks';
import { useAppDispatch } from '@/store/hooks';
import { ChipManageItem } from '@/types/api/silverHead';
import { getChipsManageList, delChip } from '@/api/silverHead';
import { chipsListAsync } from '@/store/common/commonSlice';

type Props = {};

const ChipManage: FC<Props> = (props) => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchGetChipsManageList } = useHttp<
        any,
        ChipManageItem[]
    >(getChipsManageList);
    const dispatch = useAppDispatch();
    const { fetchData: fetchDelChip } = useHttp<any, any>(delChip);

    const handleDelete = (record: ChipManageItem) => {
        fetchDelChip({ id: record.id }).then((res) => {
            if (res.code === 10000) {
                dispatch(chipsListAsync());
                message.success('移除成功');
                tableRef?.current?.reload();
            }
        });
    };
    const columns: ProColumns<ChipManageItem, any>[] = [
        {
            dataIndex: 'currency_code',
            title: '币种代码',
        },
        {
            dataIndex: 'chips_name',
            title: '筹码名称',
        },
        {
            dataIndex: 'created_at',
            title: '日期',
            valueType: 'milliDateTime',
        },
        {
            dataIndex: 'creator_name',
            title: '经手人',
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => {
                return [
                    <EditModal
                        onSuccess={() => {
                            tableRef?.current?.reload();
                            dispatch(chipsListAsync());
                        }}
                        record={record}
                        key="editModal"
                        type={1}
                    />,
                ];
            },
        },
    ];
    return (
        <div>
            <ProTable<ChipManageItem>
                columns={columns}
                request={async (params: any, sorter, filter) => {
                    const res = await fetchGetChipsManageList(params);
                    return Promise.resolve({
                        data: res.data || [],
                        success: true,
                    });
                }}
                actionRef={tableRef}
                rowKey="id"
                search={false}
                pagination={false}
                toolbar={{
                    actions: [
                        <EditModal
                            onSuccess={() => {
                                tableRef?.current?.reload();
                            }}
                        />,
                    ],
                }}
            />
        </div>
    );
};
export default ChipManage;
