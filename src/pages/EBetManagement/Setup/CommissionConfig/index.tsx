import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    ActionType,
    ProColumns,
    EditableProTable,
} from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getCommissionConfig, saveCommissionConfig } from '@/api/eBet';
import { CommissionConfigProps } from '@/types/api/eBet';
import { Button } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';

interface CommissionConfigPageProps {}

const CommissionConfigPage: React.FC<CommissionConfigPageProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

    const { fetchData: fetchList } = useHttp(getCommissionConfig);
    const { fetchData: saveConfig } = useHttp(saveCommissionConfig);
    const currency = useAppSelector(selectCurrencyList);

    const columns = useMemo<ProColumns<CommissionConfigProps>[]>(
        () => [
            {
                title: '序号',
                dataIndex: 'id',
                align: 'center',
                readonly: true,
                render: (dom, entity, index) => index + 1,
            },
            {
                title: '币种',
                dataIndex: 'currency',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: currency,
                },
                readonly: true,
            },
            {
                title: '转码起算金额',
                dataIndex: 'amount',
                align: 'center',
                formItemProps: {
                    getValueFromEvent: (e) =>
                        e.target?.value?.replace(/[^0-9.]+/g, ''),
                },
                // valueType: {
                //     type: 'money',
                //     moneySymbol: false,
                //     showSymbol: false,
                // },
            },
            {
                title: '操作',
                valueType: 'option',
                align: 'center',
                render: (dom, entity, index, action) => (
                    <Button
                        type={'primary'}
                        onClick={() => {
                            if (entity.id) {
                                action?.startEditable?.(entity?.id);
                            }
                        }}
                        key={entity.id}
                    >
                        修改
                    </Button>
                ),
            },
        ],
        [currency],
    );

    const onCancel = useCallback(
        (key: any) => {
            const keys = editableKeys.filter((ek) => ek !== key);
            setEditableRowKeys(keys);
        },
        [editableKeys],
    );

    return (
        <div>
            <EditableProTable<CommissionConfigProps>
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                dateFormatter={'number'}
                rowKey={(record) => String(record.id)}
                search={false}
                recordCreatorProps={false}
                params={{
                    current: 1,
                    pageSize: 100,
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
                    };
                }}
                editable={{
                    type: 'single',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        if (String(data.amount) === String(row.amount)) {
                            return true;
                        }
                        const payload = {
                            id: data.id,
                            amount: +(data.amount ?? 0),
                        };
                        const res = await saveConfig(payload);
                        if (res.code === 10000) {
                            onCancel(rowKey);
                            tableRef.current?.reload();
                            return true;
                        }
                        return false;
                    },
                    onChange: setEditableRowKeys,
                    onCancel: async (key) => {
                        onCancel(key);
                    },
                    actionRender: (row, config) => [
                        <Button
                            key={`${row.id}_save`}
                            type={'primary'}
                            onClick={() => {
                                const values =
                                    config.form?.getFieldsValue?.()?.[
                                        row.id ?? -1
                                    ];
                                config.onSave?.(row.id ?? -1, values, row);
                            }}
                            // loading={submitting}
                        >
                            保存
                        </Button>,
                        <Button
                            key={`${row.id}_cancel`}
                            type={'primary'}
                            onClick={() => {
                                config.onCancel?.(row.id ?? -1, row, row);
                            }}
                        >
                            取消
                        </Button>,
                    ],
                }}
                scroll={{
                    x: 1200,
                }}
            />
        </div>
    );
};

export default CommissionConfigPage;
