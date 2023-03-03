import React, { useEffect, useRef, useState } from 'react';
import { useHttp } from '@/hooks';
import { queryBetLimitUserList, queryTopAgentLimitList } from '@/api/eBet';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { TopAgentLimitProps } from '@/types/api/eBet';
import { Button } from 'antd';
import TopAgentLimitModalForm from '@/pages/EBetManagement/Setup/TopAgentLimit/ModalForm';

interface TopAgentLimitPageProps {}

const TopAgentLimitPage: React.FC<TopAgentLimitPageProps> = () => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchList } = useHttp(queryTopAgentLimitList);
    const { fetchData: getBetLimitUserList } = useHttp(queryBetLimitUserList);
    const [limitList, setLimitList] = useState<Record<string, any>[]>([]);

    useEffect(() => {
        getBetLimitUserList({
            page: 1,
            size: 2000,
            status: 1,
        }).then((res) => {
            const list = res.data?.list?.map((a) => {
                const data = a.limit_array?.find((b) => b.bet_type === 1);
                return {
                    value: a.id,
                    label: `${Number(
                        data?.min_amount ?? 0,
                    ).toLocaleString()} ~ ${Number(
                        data?.max_amount ?? 0,
                    ).toLocaleString()}`,
                    limit_array: a.limit_array,
                };
            });
            setLimitList(list);
        });
    }, [getBetLimitUserList]);

    const columns: ProColumns<TopAgentLimitProps>[] = [
        {
            title: '序号',
            dataIndex: 'member_id',
            align: 'center',
            hideInSearch: true,
            renderText: (text, record, index) => index + 1,
        },
        {
            title: '账户号',
            dataIndex: 'member_code',
            align: 'center',
        },
        {
            title: '当前个人限红',
            dataIndex: 'limit_id',
            align: 'center',
            renderText: (text) => {
                return text
                    ? limitList.find((a) => a.value === text)?.label
                    : '无限制';
            },
            hideInSearch: true,
        },
        {
            title: '个人限红',
            dataIndex: 'limit_id',
            align: 'center',
            valueType: 'select',
            fieldProps: {
                options: limitList,
            },
            hideInTable: true,
        },
        {
            title: '更新时间',
            dataIndex: 'updated_at',
            align: 'center',
            valueType: 'dateTime',
            hideInSearch: true,
        },
        {
            title: '更新人',
            dataIndex: 'updated_by',
            align: 'center',
            hideInSearch: true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            hideInSearch: true,
            render: (dom, entity) => (
                <TopAgentLimitModalForm
                    trigger={<Button type={'primary'}>修改</Button>}
                    limitList={limitList}
                    entity={entity}
                    onFinish={() => tableRef?.current?.reload()}
                />
            ),
        },
    ];

    return (
        <React.Fragment>
            <ProTable<TopAgentLimitProps>
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                rowKey={(record) => String(record.member_id)}
                request={async (
                    { current, pageSize, ...params },
                    sort,
                    filter,
                ) => {
                    const res = await fetchList({
                        ...params,
                        page: current,
                        size: pageSize,
                    });
                    return {
                        data: res?.data?.list,
                        success: true,
                        total: res?.data?.total,
                    };
                }}
                search={{
                    defaultCollapsed: false,
                }}
                scroll={{
                    x: 1200,
                }}
            />
        </React.Fragment>
    );
};

export default TopAgentLimitPage;
