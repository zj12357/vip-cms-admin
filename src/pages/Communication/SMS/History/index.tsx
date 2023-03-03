import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import {
    getSmsHistoryList,
    getSmsServiceList,
    smsResend,
    smsResendBatch,
} from '@/api/communication';
import { SmsHistoryProps, SmsServicesProps } from '@/types/api/communication';
import SmsHistoryModal, {
    messageTypes,
} from '@/pages/Communication/SMS/History/SmsHistoryModal';
import { Button, Dropdown, Menu, message } from 'antd';
import { TemplateNames, templateTypes } from '@/pages/Communication/SMS/common';

interface HistoryPageProps {}

const HistoryPage: React.FC<HistoryPageProps> = () => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchSmsServiceList } = useHttp(getSmsServiceList);
    const { fetchData: fetchList } = useHttp(getSmsHistoryList);
    const { fetchData: resendSms } = useHttp(smsResend);
    const { fetchData: resendSmsBatch } = useHttp(smsResendBatch);
    const [smsServiceList, setSmsServiceList] = useState<SmsServicesProps[]>(
        [],
    );
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        fetchSmsServiceList().then((res) => {
            if (res.code === 10000) {
                setSmsServiceList(res.data.list ?? []);
            }
        });
    }, [fetchSmsServiceList]);

    const serviceOptions = useMemo(() => {
        return smsServiceList.map((a) => ({
            value: a.service_name || '',
            label: a.service_name || '',
        }));
    }, [smsServiceList]);

    const columns: ProColumns<SmsHistoryProps, any>[] = useMemo(
        () => [
            {
                title: '发送渠道',
                dataIndex: 'service_name',
                align: 'center',
                width: 120,
                valueType: 'select',
                fieldProps: {
                    options: serviceOptions,
                    placeholder: '全部',
                },
            },
            {
                title: '模版类型',
                dataIndex: 'template_type',
                valueType: 'select',
                fieldProps: {
                    options: templateTypes,
                },
                align: 'center',
                width: 100,
            },
            {
                title: '业务类型',
                dataIndex: 'template_name',
                valueType: 'select',
                fieldProps: {
                    options: TemplateNames,
                },
                align: 'center',
                width: 100,
            },
            {
                title: '手机号码',
                dataIndex: 'mobile_number',
                align: 'center',
                width: 120,
            },
            {
                title: '发送内容',
                dataIndex: 'message_content',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '发送时间',
                dataIndex: 'created_at',
                valueType: 'dateTimeRange',
                hideInTable: true,
            },
            {
                title: '发送时间',
                dataIndex: 'created_at',
                valueType: 'milliDateTime',
                align: 'center',
                width: 160,
                hideInSearch: true,
            },
            {
                title: '发送状态',
                dataIndex: 'message_status',
                valueType: 'select',
                fieldProps: {
                    options: messageTypes,
                },
                align: 'center',
                width: 100,
            },
            {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                width: 150,
                hideInSearch: true,
                render: (_, entity) => (
                    <div>
                        {entity.message_status !== 1 && (
                            <Dropdown
                                trigger={['click']}
                                overlay={
                                    <Menu
                                        items={serviceOptions.map((a) => ({
                                            key: a.value,
                                            label: a.label,
                                        }))}
                                        onClick={async ({ key }) => {
                                            const res = await resendSms({
                                                uniquecode: entity.unique_code,
                                                servicename: key,
                                            });
                                            if (res.code === 10000) {
                                                message.success('操作成功');
                                                tableRef.current?.reload();
                                            }
                                        }}
                                    />
                                }
                            >
                                <Button type={'link'}>补发</Button>
                            </Dropdown>
                        )}
                        <SmsHistoryModal
                            trigger={<Button type={'link'}>详情</Button>}
                            entity={entity}
                        />
                    </div>
                ),
            },
        ],
        [resendSms, serviceOptions],
    );
    return (
        <div>
            <ProTable<SmsHistoryProps>
                rowKey={(record) => String(record.unique_code)}
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                dateFormatter={'number'}
                request={async ({ current, pageSize, ...params }) => {
                    const res = await fetchList({
                        ...params,
                        page: current,
                        size: pageSize,
                        created_at: params.created_at?.map((x: number) => {
                            return Math.floor(x / 1000);
                        }),
                    } as any);
                    return {
                        data: res?.data?.list,
                        success: true,
                        total: res?.data?.total,
                    };
                }}
                search={{
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <Dropdown
                            key="resend"
                            trigger={['click']}
                            overlay={
                                <Menu
                                    items={serviceOptions.map((a) => ({
                                        key: a.value,
                                        label: a.label,
                                    }))}
                                    onClick={async ({ key }) => {
                                        if (selectedRowKeys?.length <= 0) {
                                            message.error('请选择补发记录');
                                            return;
                                        }
                                        const payload = {
                                            unique_codes: selectedRowKeys,
                                            service_name: key,
                                        };
                                        const res = await resendSmsBatch(
                                            payload,
                                        );
                                        if (res.code === 10000) {
                                            message.success('操作成功');
                                            tableRef.current?.reload();
                                            setSelectedRowKeys([]);
                                        }
                                    }}
                                />
                            }
                        >
                            <Button type={'primary'}>批量补发</Button>
                        </Dropdown>,
                        dom,
                    ],
                }}
                rowSelection={{
                    type: 'checkbox',
                    getCheckboxProps: (record: SmsHistoryProps) => ({
                        disabled: record.message_status === 1,
                        name: record.unique_code,
                    }),
                    selectedRowKeys: selectedRowKeys,
                    onChange: (
                        selectedRowKeys: React.Key[],
                        selectedRows: SmsHistoryProps[],
                    ) => {
                        setSelectedRowKeys(selectedRowKeys);
                    },
                }}
            />
        </div>
    );
};

export default HistoryPage;
