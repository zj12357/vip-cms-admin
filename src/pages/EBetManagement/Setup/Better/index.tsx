import React, { ComponentProps, useMemo, useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import BetterModalForm, {
    statusOptions,
} from '@/pages/EBetManagement/Setup/Better/BetterModalForm';
import { Button, message, Modal, Row } from 'antd';
import { BetterProps } from '@/types/api/eBet';
import { useHttp } from '@/hooks';
import { betterDelete, getBetterList } from '@/api/eBet';

interface BetterPageProps extends ComponentProps<any> {}

const onLineStatus = [
    {
        value: 1,
        label: '离线',
    },
    {
        value: 2,
        label: '在线',
    },
];

const BetterPerson: React.FC<BetterPageProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchList } = useHttp(getBetterList);
    const { fetchData: deleteData } = useHttp(betterDelete);
    const columns = useMemo<ProColumns<BetterProps>[]>(
        () => [
            {
                title: '在线状态',
                dataIndex: 'online_status',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: [
                        {
                            value: '',
                            label: '全部',
                        },
                        ...onLineStatus,
                    ],
                    defaultValue: '',
                    allowClear: false,
                },
                render: (dom, entity) => {
                    return (
                        <span
                            style={{
                                color:
                                    entity.online_status === 1
                                        ? 'red'
                                        : 'green',
                            }}
                        >
                            {dom}
                        </span>
                    );
                },
            },
            {
                title: '所在桌台',
                dataIndex: 'desk_no',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '账号',
                dataIndex: 'account',
                align: 'center',
            },
            {
                title: '员工姓名',
                dataIndex: 'employee_name',
                align: 'center',
            },
            {
                title: '联系电话',
                dataIndex: 'mobile',
                align: 'center',
            },
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
                                color: entity.status === 1 ? 'red' : 'green',
                            }}
                        >
                            {dom}
                        </div>
                    );
                },
            },
            {
                title: '创建人',
                dataIndex: 'operation_name',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                align: 'center',
                valueType: 'dateTime',
                hideInSearch: true,
            },
            {
                title: '最后登录时间',
                dataIndex: 'last_login_time',
                align: 'center',
                valueType: 'dateTime',
                hideInSearch: true,
            },
            {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                hideInSearch: true,
                render: (dom, entity) => (
                    <Row justify={'center'} align={'middle'}>
                        <BetterModalForm
                            trigger={<Button type={'primary'}>修改</Button>}
                            entity={entity}
                            onFinish={() => {
                                tableRef?.current?.reload();
                            }}
                        />
                        <Button
                            type="primary"
                            style={{ margin: 5 }}
                            onClick={() => {
                                Modal.confirm({
                                    title: '请确定是否要删除当前电投手？',
                                    onOk: async () => {
                                        const res = await deleteData({
                                            id: entity.id,
                                        });
                                        if (res.code === 10000) {
                                            message.success('删除成功');
                                            tableRef?.current?.reload();
                                            return true;
                                        }
                                        return Promise.reject(false);
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
            <ProTable<BetterProps>
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
                        <BetterModalForm
                            key="add"
                            trigger={<Button type={'primary'}>新增</Button>}
                            onFinish={() => {
                                tableRef?.current?.reload();
                            }}
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

export default BetterPerson;
