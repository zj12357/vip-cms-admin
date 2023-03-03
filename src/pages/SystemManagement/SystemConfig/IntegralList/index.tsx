import React, { FC, useState, useCallback, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Switch, message } from 'antd';
import IntegralModalForm from './IntegralModalForm';
import { useHttp } from '@/hooks';
import { getIntegralList, updateIntegralState } from '@/api/system';
import {
    GetIntegralListItem,
    UpdateIntegralStateParams,
} from '@/types/api/system';
import { currencyIntegralType } from '@/common/commonConstType';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';

type IntegralListProps = {};

const IntegralList: FC<IntegralListProps> = (props) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const [modalFormType, setModalFormType] = useState<'add' | 'edit'>('add');
    const tableRef = useRef<ActionType>();
    const { fetchData: _fetchGetIntegralList } = useHttp<
        null,
        GetIntegralListItem[]
    >(getIntegralList);

    const { fetchData: _fetchUpdateIntegralState } = useHttp<
        UpdateIntegralStateParams,
        null
    >(updateIntegralState, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const columns: ProColumns<GetIntegralListItem, any>[] = [
        {
            title: '币种代码',
            dataIndex: 'currency_id',
            hideInSearch: true,
            valueType: 'select',
            fieldProps: {
                options: currencyList,
            },
        },
        {
            title: '积分结算/默认配置',
            dataIndex: 'type',
            hideInSearch: true,
            valueType: 'select',
            fieldProps: {
                options: currencyIntegralType,
            },
        },
        {
            title: '状态',
            dataIndex: 'state',
            hideInSearch: true,
            valueType: 'select',
            valueEnum: {
                0: { text: '关闭', status: 'Error' },
                1: { text: '启用', status: 'Success' },
            },
        },
        {
            title: '操作时间',
            dataIndex: 'updated_at',
            hideInSearch: true,
            valueType: 'milliDateTime',
        },
        {
            title: '操作人',
            dataIndex: 'updated_name',
            hideInSearch: true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <IntegralModalForm
                    key="adit"
                    type={modalFormType}
                    trigger={
                        <div
                            onClick={() => {
                                setModalFormType('edit');
                            }}
                            className="m-primary-font-color pointer"
                        >
                            编辑
                        </div>
                    }
                    reloadData={reloadData}
                    record={record}
                ></IntegralModalForm>,
                // <Switch
                //     checkedChildren="开启"
                //     unCheckedChildren="关闭"
                //     checked={record.state === 1 ? true : false}
                //     key="switch"
                //     onChange={(val) => handleOpen(val, record)}
                // />,
            ],
        },
    ];

    const handleOpen = (checked: boolean, record: GetIntegralListItem) => {
        _fetchUpdateIntegralState({
            id: record.id,
            state: checked ? 1 : 2,
        });
    };

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);
    return (
        <div>
            <ProTable<GetIntegralListItem>
                columns={columns}
                request={async () => {
                    let res = await _fetchGetIntegralList();
                    return {
                        data: res.data,
                        success: true,
                    };
                }}
                rowKey={(record) => record.id}
                // search={{
                //     labelWidth: 'auto',
                //     span: 6,
                //     defaultCollapsed: false,
                //     optionRender: (searchConfig, formProps, dom) => [
                //         <IntegralModalForm
                //             key="add"
                //             type={modalFormType}
                //             trigger={
                //                 <Button
                //                     type="primary"
                //                     onClick={() => {
                //                         setModalFormType('add');
                //                     }}
                //                 >
                //                     新增配置
                //                 </Button>
                //             }
                //             reloadData={reloadData}
                //         ></IntegralModalForm>,
                //     ],
                // }}
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

export default IntegralList;
