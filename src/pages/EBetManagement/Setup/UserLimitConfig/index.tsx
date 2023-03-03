import React, { ComponentProps, useMemo, useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { BetLimitUser } from '@/types/api/eBet';
import { betTypes } from '@/common/commonConstType';
import { useHttp } from '@/hooks';
import { deleteBetLimitUserList, queryBetLimitUserList } from '@/api/eBet';
import { Button, message, Modal, Row } from 'antd';
import UserLimitModalForm, {
    statusOptions,
} from '@/pages/EBetManagement/Setup/UserLimitConfig/UserLimitModalForm';

interface UserLimitConfigPageProps extends ComponentProps<any> {}

const UserLimitConfigPage: React.FC<UserLimitConfigPageProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchList } = useHttp(queryBetLimitUserList);
    const { fetchData: deleteData } = useHttp(deleteBetLimitUserList);
    const columns = useMemo<ProColumns<BetLimitUser>[]>(
        () => [
            {
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                hideInSearch: true,
                render: (dom, entity, index) => index + 1,
            },
            ...betTypes.map<ProColumns<BetLimitUser>>((bt) => ({
                title: bt.label,
                dataIndex: 'limit_array',
                align: 'center',
                hideInSearch: true,
                render: (value, entity) => {
                    const items = entity.limit_array;
                    const record = items?.find(
                        (item) => item.bet_type === bt.value,
                    );
                    if (record) {
                        return (
                            <span>{`${record.min_amount} ~ ${record.max_amount}`}</span>
                        );
                    }
                    return null;
                },
            })),
            {
                title: '状态',
                dataIndex: 'status',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: [
                        {
                            value: '',
                            label: '全部',
                        },
                        ...statusOptions,
                    ],
                    defaultValue: '',
                    allowClear: false,
                },
                render: (dom, entity) => {
                    return (
                        <div
                            style={{
                                color: entity.status === 2 ? 'red' : 'green',
                            }}
                        >
                            {dom}
                        </div>
                    );
                },
            },
            {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                hideInSearch: true,
                render: (dom, entity) => (
                    <Row justify={'center'} align={'middle'}>
                        <UserLimitModalForm
                            trigger={<Button type={'primary'}>修改</Button>}
                            onFinish={() => tableRef.current?.reload()}
                            entity={entity}
                        />
                        <Button
                            type="primary"
                            style={{ margin: 5 }}
                            onClick={() => {
                                Modal.confirm({
                                    title: '请确定是否要删除当前用户限红？',
                                    onOk: async () => {
                                        await deleteData({ id: entity.id });
                                        message.success('删除成功');
                                        tableRef?.current?.reload();
                                    },
                                });
                            }}
                        >
                            删除
                        </Button>
                    </Row>
                ),
            },
        ],
        [deleteData],
    );
    return (
        <div>
            <ProTable<BetLimitUser>
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                rowKey={(record) => String(record.id)}
                request={async ({ current, pageSize, ...params }) => {
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
                    optionRender: (searchConfig, formProps, dom) => [
                        <UserLimitModalForm
                            key="add"
                            trigger={<Button type={'primary'}>新增</Button>}
                            onFinish={() => tableRef.current?.reload()}
                        />,
                        dom,
                    ],
                }}
                scroll={{
                    x: 1200,
                }}
            />
        </div>
    );
};

export default UserLimitConfigPage;
