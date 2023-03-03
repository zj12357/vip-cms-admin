import React, { FC, useRef } from 'react';
import { message, Popconfirm } from 'antd';
import { useHttp } from '@/hooks';
import { ProCard, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import AddOrUpdateConsumConfig from './AddConsumConfig';
import { consume_type } from '@/common/commonConstType';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList, selectHallList } from '@/store/common/commonSlice';
import {
    queryKeyword,
    getConsumConfigList,
    deleteConfigItem,
} from '@/api/service';
import {
    GetConsumConfigListParams,
    DeleteConfigItemParams,
} from '@/types/api/service';
import Currency from '@/components/Currency';

type ConsumConfigProps = {};

type ConsumConfigItem = {
    venue_type: number; //场馆
    consume_type: number; //消费类型: 0 所有, 1 酒店, 2 订车, 3餐饮, 4 娱乐, 5 其他
    consume_keyword: string;
    currency_type: number; // 币种: 0 所有, 1 披索, 2 港币 , 3 美金, 4 人民币
    itemName: string;
    item_price: number;
    remark: string;
    id: string;
};

const ConsumConfig: FC<ConsumConfigProps> = (props) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);
    const actionRef = useRef<any>();
    const { fetchData: fetchQueryKeyword } = useHttp<null, any>(queryKeyword);
    // 查询消费项目
    const { fetchData: fetchGetConsumConfigList } = useHttp<
        GetConsumConfigListParams,
        any
    >(getConsumConfigList);
    const { fetchData: fetchDeleteConfigItem } = useHttp<
        DeleteConfigItemParams,
        any
    >(deleteConfigItem);
    // 删除
    const deleteItem = (id: string) => {
        fetchDeleteConfigItem({ id }).then((res) => {
            if (res.code === 10000) {
                message.success('删除成功');
                refreshData();
            }
        });
    };
    // 更新
    const refreshData = () => {
        actionRef.current.reload();
    };
    const columnsSearch: ProColumns<ConsumConfigItem>[] = [
        {
            dataIndex: 'venue_type',
            key: 'venue_type',
            title: '场馆',
            request: async () => [...hallList],
            hideInTable: true,
        },
        {
            dataIndex: 'consume_type',
            key: 'consume_type',
            title: '消费类型',
            request: async () => [...consume_type],
            hideInTable: true,
        },
        {
            dataIndex: 'consume_keyword',
            key: 'consume_keyword',
            title: '分类关键字',
            request: async () => {
                const res = await fetchQueryKeyword();
                if (res.code === 10000) {
                    const dataArr = res.data.consume_keyword_list.map(
                        (item: any) => {
                            return { label: item.name, value: item.name };
                        },
                    );
                    return [...dataArr];
                } else {
                    return [];
                }
            },
            hideInTable: true,
        },
        {
            dataIndex: 'currency_type',
            key: 'currency_type',
            title: '定价币种',
            request: async () => [...currencyList],
            hideInTable: true,
        },
    ];
    const columnsData: ProColumns<ConsumConfigItem>[] = [
        {
            dataIndex: 'venue_type',
            key: 'venue_type',
            title: '场馆',
            hideInSearch: true,
            align: 'center',
            request: async () => [...hallList],
            valueType: 'select',
        },
        {
            dataIndex: 'consume_type',
            key: 'consume_type',
            title: '消费类型',
            hideInSearch: true,
            align: 'center',
            request: async () => [...consume_type],
            valueType: 'select',
        },
        {
            dataIndex: 'consume_keyword',
            key: 'consume_keyword',
            title: '分类关键字',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'item_name',
            key: 'item_name',
            title: '项目名称',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'currency_type',
            key: 'currency_type',
            title: '定价币种',
            hideInSearch: true,
            align: 'center',
            request: async () => [...currencyList],
            valueType: 'select',
        },
        {
            dataIndex: 'item_price',
            key: 'item_price',
            title: '单价(万)',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => (
                <Currency value={record.item_price} decimal={6} />
            ),
        },
        {
            dataIndex: 'remark',
            key: 'remark',
            title: '备注',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                return <div style={{ maxWidth: 100 }}>{record.remark}</div>;
            },
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            align: 'center',
            render: (text, record: any, _, action) => [
                <AddOrUpdateConsumConfig
                    key={'update'}
                    type={'update'}
                    record={record}
                    refreshData={refreshData}
                />,
                <Popconfirm
                    title="确定删除此项数据？"
                    onConfirm={() => {
                        deleteItem(record.id);
                    }}
                    okText="确定"
                    cancelText="取消"
                    key="delete"
                >
                    <span
                        className="m-primary-error-color pointer"
                        onClick={() => {
                            console.log('修改');
                        }}
                    >
                        删除
                    </span>
                </Popconfirm>,
            ],
        },
    ];
    const columns = columnsSearch.concat(columnsData);
    return (
        <ProCard
            style={{
                height: 'calc(100vh - 200px)',
                overflowY: 'auto',
            }}
        >
            <ProTable<ConsumConfigItem>
                actionRef={actionRef}
                columns={columns}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res = await fetchGetConsumConfigList(params);
                    return Promise.resolve({
                        data: res.data.list,
                        total: res.data.total,
                        success: true,
                    });
                }}
                rowKey="id"
                pagination={{
                    showQuickJumper: true,
                }}
                search={{
                    labelWidth: 80,
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        ...dom.reverse(),
                        <AddOrUpdateConsumConfig
                            key={'add'}
                            type={'add'}
                            refreshData={refreshData}
                        />,
                    ],
                }}
                toolBarRender={false}
            />
        </ProCard>
    );
};

export default ConsumConfig;
