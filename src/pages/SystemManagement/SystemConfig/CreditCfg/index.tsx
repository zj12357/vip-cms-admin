import React, { FC, useState, useCallback, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import CreditCfgModalForm from './CreditCfgModalForm';
import { useHttp } from '@/hooks';
import { getCreditCfg } from '@/api/system';
import { GetCreditCfgListItem } from '@/types/api/system';

type CreditCfgListProps = {};

const CreditCfgList: FC<CreditCfgListProps> = (props) => {
    const [modalFormType, setModalFormType] = useState<'add' | 'edit'>('add');
    const tableRef = useRef<ActionType>();
    const { fetchData: _fetchGetCreditCfg } = useHttp<
        null,
        GetCreditCfgListItem[]
    >(getCreditCfg);

    const columns: ProColumns<GetCreditCfgListItem, any>[] = [
        {
            title: '信贷类型',
            dataIndex: 'marker_type_name',
            hideInSearch: true,
        },
        {
            title: '过期天数(天)',
            dataIndex: 'expired_day',
            hideInSearch: true,
        },
        {
            title: '罚息率',
            dataIndex: 'rate',
            hideInSearch: true,
            render(v) {
                return (
                    parseFloat(parseFloat(`${Number(v) * 100}`).toFixed(4)) +
                    '%'
                );
            },
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (_, record) => [
                <CreditCfgModalForm
                    key="edit"
                    type={modalFormType}
                    trigger={
                        <div
                            onClick={() => {
                                setModalFormType('edit');
                            }}
                            className="m-primary-font-color pointer"
                        >
                            调整
                        </div>
                    }
                    reloadData={reloadData}
                    record={record}
                ></CreditCfgModalForm>,
            ],
        },
    ];

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);
    return (
        <div>
            <ProTable<GetCreditCfgListItem>
                columns={columns}
                request={async () => {
                    let res = await _fetchGetCreditCfg();
                    return {
                        data: res.data,
                        success: true,
                    };
                }}
                rowKey={(record) => record.id}
                search={false}
                toolBarRender={false}
                actionRef={tableRef}
                scroll={{
                    x: 1200,
                }}
            />
        </div>
    );
};

export default CreditCfgList;
