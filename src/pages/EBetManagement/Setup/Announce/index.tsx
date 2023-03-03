import React, { useMemo, useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import AnnounceFormModal, {
    langOptions,
} from '@/pages/EBetManagement/Setup/Announce/AnnounceFormModal';
import { Button, message, Modal } from 'antd';
import { useHttp } from '@/hooks';
import { AnnouncementProps } from '@/types/api/eBet';
import { getAnnouncementList, announcementDelete } from '@/api/eBet';
import { announceTypes } from '@/common/commonConstType';

type AnnouncePageProps = {};

const AnnouncePage: React.FC<AnnouncePageProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchList } = useHttp(getAnnouncementList);
    const { fetchData: deleteData } = useHttp(announcementDelete);
    const columns = useMemo<ProColumns<AnnouncementProps>[]>(
        () => [
            {
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                hideInSearch: true,
                width: 80,
                render: (dom, entity, index) => index + 1,
            },
            {
                title: '标题',
                dataIndex: 'title',
                align: 'center',
                width: 150,
                render: (dom, entity) => {
                    return (
                        <div>
                            {langOptions.map((lang) => {
                                const content = entity.title?.[lang.value];
                                if (content) {
                                    return (
                                        <div key={lang.value}>
                                            <span>{lang.label}: </span>
                                            <span>{content}</span>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    );
                },
            },
            {
                title: '内容',
                dataIndex: 'content',
                align: 'center',
                render: (dom, entity) => {
                    return (
                        <div>
                            {langOptions.map((lang) => {
                                const content = entity.content?.[lang.value];
                                if (content) {
                                    return (
                                        <div key={lang.value}>
                                            <span>{lang.label}: </span>
                                            <span>{content}</span>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    );
                },
            },
            {
                title: '类型',
                dataIndex: 'type_array',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: announceTypes,
                    mode: 'multiple',
                },
                width: 120,
                hideInSearch: true,
            },
            {
                title: '类型',
                dataIndex: 'type',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: announceTypes,
                },
                order: 9,
                hideInTable: true,
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                align: 'center',
                valueType: 'dateTime',
                width: 160,
                hideInSearch: true,
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                align: 'center',
                valueType: 'dateTimeRange',
                hideInTable: true,
                colSize: 2,
                search: {
                    transform: (values: any) => {
                        return {
                            start_at: values?.[0],
                            end_at: values?.[1],
                        };
                    },
                },
            },
            {
                title: '发布人',
                dataIndex: 'created_by',
                align: 'center',
                width: 100,
                hideInSearch: true,
            },
            {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                valueType: 'option',
                hideInSearch: true,
                width: 250,
                render: (dom, entity) => (
                    <React.Fragment>
                        <AnnounceFormModal
                            trigger={
                                <Button type="primary" style={{ margin: 5 }}>
                                    查看
                                </Button>
                            }
                            entity={entity}
                            onFinish={() => {
                                tableRef?.current?.reload();
                            }}
                            type={'view'}
                        />
                        <AnnounceFormModal
                            trigger={
                                <Button type="primary" style={{ margin: 5 }}>
                                    修改
                                </Button>
                            }
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
                                    title: '请确定是否删除此条公告？',
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
                    </React.Fragment>
                ),
            },
        ],
        [deleteData],
    );
    return (
        <div>
            <ProTable<AnnouncementProps>
                rowKey={(record) => String(record.id)}
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                dateFormatter={'number'}
                search={{
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <AnnounceFormModal
                            key="add"
                            trigger={<Button type="primary">新增</Button>}
                            onFinish={() => {
                                tableRef?.current?.reload();
                            }}
                        />,
                        dom,
                    ],
                }}
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
                scroll={{
                    x: 1200,
                }}
            />
        </div>
    );
};

export default AnnouncePage;
