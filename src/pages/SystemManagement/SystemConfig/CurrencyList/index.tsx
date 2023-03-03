import React, { FC, useState, useRef, useCallback } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getCurrencyList, updateCurrency } from '@/api/system';
import { CurrencyListItem, UpdateCurrencyParams } from '@/types/api/system';
import { message } from 'antd';

type CurrencyListProps = {};

const CurrencyList: FC<CurrencyListProps> = (props) => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<CurrencyListItem[]>([]);
    const tableRef = useRef<ActionType>();

    const { fetchData: _fetchCurrencyList } = useHttp<null, CurrencyListItem[]>(
        getCurrencyList,
    );
    const { fetchData: _fetchUpdateCurrency } = useHttp<
        UpdateCurrencyParams,
        null
    >(updateCurrency, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const columns: ProColumns<CurrencyListItem>[] = [
        {
            title: '货币名',
            dataIndex: 'currency_name',
            editable: false,
        },
        {
            title: '代号',
            dataIndex: 'currency_code',
            editable: false,
        },
        {
            title: '权限',
            dataIndex: 'permission',
            valueType: 'checkbox',
            fieldProps: {
                options: [
                    {
                        label: '充值',
                        value: 1,
                    },
                    {
                        label: '开工',
                        value: 2,
                    },
                ],
            },
        },

        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <div
                    key="edit"
                    className="m-primary-font-color pointer"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    调整
                </div>,
            ],
        },
    ];

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    return (
        <div>
            <EditableProTable<CurrencyListItem>
                columns={columns}
                request={async () => {
                    const res = await _fetchCurrencyList();

                    return {
                        data: (res.data ?? []).map((item) => {
                            return {
                                ...item,
                                permission: item.permission
                                    ? item.permission.split(',').map((v) => +v)
                                    : [],
                            } as any;
                        }),
                        total: res.data?.length ?? 0,
                        success: true,
                    };
                }}
                rowKey={(record) => record.id}
                value={dataSource}
                onChange={setDataSource}
                editable={{
                    type: 'single',
                    editableKeys,
                    onSave: async (rowKey, data: any, row: any) => {
                        _fetchUpdateCurrency({
                            id: data.id,
                            permission: data.permission.join(','),
                        });
                    },
                    onChange: setEditableRowKeys,
                    actionRender: (row, config, dom) => [dom.save, dom.cancel],
                }}
                search={false}
                toolBarRender={false}
                scroll={{
                    x: 1200,
                }}
                recordCreatorProps={false}
                actionRef={tableRef}
            />
        </div>
    );
};

export default CurrencyList;
