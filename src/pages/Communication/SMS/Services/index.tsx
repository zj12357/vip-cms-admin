import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { SmsServicesProps } from '@/types/api/communication';
import { useHttp } from '@/hooks';
import {
    getSmsServiceList,
    smsBalanceCheck,
    smsServiceUpdate,
} from '@/api/communication';
import { smsLineTypes } from '@/common/commonConstType';
import { countries } from '@/common/countryPhone';
import { Button, message, Spin } from 'antd';
import SmsServiceModalForm, {
    statusOptions,
} from '@/pages/Communication/SMS/Services/SmsServiceModalForm';

interface ServicesPageProps {}

const ServicesPage: React.FC<ServicesPageProps> = () => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchList, response } = useHttp(getSmsServiceList);
    const { fetchData: balanceCheck } = useHttp(smsBalanceCheck);
    const { fetchData: updateData } = useHttp(smsServiceUpdate);
    const [balanceMap, setBalanceMap] = useState<Record<string, string>>({});
    const [balanceLoading, setBalanceLoading] = useState<string[]>([]);
    const [updateLoading, setUpdateLoading] = useState<string[]>([]);

    const statusUpdate = useCallback(
        async (entity: SmsServicesProps) => {
            setUpdateLoading((data) => [...data, String(entity.service_name)]);
            const res = await updateData({
                service_id: entity.service_id,
                service_name: entity.service_name,
                support_region: entity.support_region,
                service_status: entity.service_status,
                status: entity.status === 1 ? 2 : 1,
                remark: entity.remark,
            }).finally(() => {
                setUpdateLoading((data) => [
                    ...data.filter((d) => d !== entity.service_name),
                ]);
            });
            if (res.code === 10000) {
                message.success('操作成功!');
                tableRef?.current?.reload();
            }
            return res;
        },
        [updateData],
    );

    const fetchBalance = useCallback(
        (service_name?: string) => {
            if (!service_name) return;
            setBalanceLoading((data) => [...data, service_name]);
            balanceCheck({
                servicename: service_name,
            })
                .then((res) => {
                    setBalanceMap((data) => ({
                        ...data,
                        [service_name]: res.data,
                    }));
                })
                .finally(() => {
                    setBalanceLoading((data) => [
                        ...data.filter((d) => d !== service_name),
                    ]);
                });
        },
        [balanceCheck],
    );

    useEffect(() => {
        // 跟产品及相关后端沟通，此处认为数据量不大，采取异步加载每个渠道商余额的方案
        response?.list?.forEach((item) => {
            if (item.service_name) {
                fetchBalance(item.service_name);
            }
        });
    }, [fetchBalance, response]);
    const columns: ProColumns<SmsServicesProps, any>[] = useMemo(
        () => [
            {
                title: '渠道名称',
                dataIndex: 'service_name',
                align: 'center',
                width: 100,
                hideInSearch: true,
            },
            {
                title: '线路类型',
                dataIndex: 'service_status',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: smsLineTypes,
                },
                width: 100,
                hideInSearch: true,
            },
            {
                title: '是否启用',
                dataIndex: 'status',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: statusOptions,
                },
                width: 100,
                hideInSearch: true,
            },
            {
                title: '余额',
                dataIndex: 'balance',
                align: 'center',
                renderText: (value, record) => {
                    return (
                        record.service_name && balanceMap[record.service_name]
                    );
                },
                render: (dom, entity) => (
                    <Spin
                        spinning={balanceLoading.includes(
                            String(entity.service_name),
                        )}
                    >
                        {dom}
                    </Spin>
                ),
                width: 180,
                hideInSearch: true,
            },
            {
                title: '支持国家',
                dataIndex: 'support_region',
                align: 'center',
                ellipsis: true,
                renderText: (value) => {
                    const keys: string[] = value?.split(',');
                    return keys
                        .map(
                            (tel) => countries.find((c) => c.tel === tel)?.name,
                        )
                        .join(',');
                },
                hideInSearch: true,
            },
            {
                title: '备注',
                dataIndex: 'remark',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '操作时间',
                dataIndex: 'updated_at',
                align: 'center',
                valueType: 'milliDateTime',
                width: 160,
                hideInSearch: true,
            },
            {
                title: '操作人',
                dataIndex: 'operator',
                align: 'center',
                width: 100,
                hideInSearch: true,
            },
            {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                width: 220,
                hideInSearch: true,
                render: (_, entity) => (
                    <div>
                        <Button
                            type={'link'}
                            loading={balanceLoading.includes(
                                String(entity.service_name),
                            )}
                            onClick={() => fetchBalance(entity.service_name)}
                        >
                            余额
                        </Button>
                        <Button
                            type={'link'}
                            loading={updateLoading.includes(
                                String(entity.service_name),
                            )}
                            onClick={() => statusUpdate(entity)}
                            disabled={entity.service_status === 1}
                        >
                            {entity.status === 1 ? '禁用' : '启用'}
                        </Button>
                        <SmsServiceModalForm
                            trigger={<Button type={'link'}>编辑</Button>}
                            entity={entity}
                            onOk={() => tableRef.current?.reload()}
                        />
                    </div>
                ),
            },
        ],
        [balanceLoading, balanceMap, fetchBalance, statusUpdate, updateLoading],
    );

    return (
        <div>
            <ProTable<SmsServicesProps>
                rowKey={(record) => String(record.service_id)}
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                dateFormatter={'number'}
                search={false}
                pagination={false}
                request={async () => {
                    const res = await fetchList();
                    return {
                        data: res?.data?.list,
                        success: true,
                    };
                }}
            />
        </div>
    );
};

export default ServicesPage;
