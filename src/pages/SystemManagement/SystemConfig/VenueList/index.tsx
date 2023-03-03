import React, { FC, useState, useCallback, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Switch, Button, message } from 'antd';
import VenueModalForm from './VenueModalForm';
import { useHttp } from '@/hooks';
import { getHallList, switchHall } from '@/api/system';
import {
    GetHallListParams,
    HallListItem,
    SwitchHallParams,
} from '@/types/api/system';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';

type VenueListProps = {};

const VenueList: FC<VenueListProps> = (props) => {
    const [modalFormType, setModalFormType] = useState<'add' | 'edit'>('add');
    const currencyList = useAppSelector(selectCurrencyList);
    const tableRef = useRef<ActionType>();

    const { fetchData: _fetchHallList } = useHttp<
        GetHallListParams,
        HallListItem[]
    >(getHallList);

    const { fetchData: _fetchSwitchHall } = useHttp<SwitchHallParams, null>(
        switchHall,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const columns: ProColumns<HallListItem, any>[] = [
        {
            title: '场馆编号',
            dataIndex: 'id',
        },
        {
            title: '场馆名称',
            dataIndex: 'hall_name',
        },
        {
            title: '场馆地址',
            dataIndex: 'address',
        },
        {
            title: '场馆主货币',
            dataIndex: 'currency',

            valueType: 'select',
            fieldProps: {
                options: currencyList,
            },
        },
        {
            title: 'ip白名单',
            dataIndex: 'white_ips',
        },
        {
            title: '备注',
            dataIndex: 'remark',
        },
        {
            title: '修改时间',
            dataIndex: 'updated_at',

            valueType: 'milliDateTime',
        },
        {
            title: '操作人',
            dataIndex: 'updated_name',
        },

        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <VenueModalForm
                    key="edit"
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
                ></VenueModalForm>,

                // <Switch
                //     checkedChildren="开启"
                //     unCheckedChildren="关闭"
                //     checked={record.state === 1 ? true : false}
                //     key="switch"
                //     onChange={(val) => handleSwitchHall(val, record)}
                // />,
            ],
        },
    ];

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    const handleSwitchHall = (checked: boolean, record: HallListItem) => {
        _fetchSwitchHall({
            id: record.id,
            state: checked ? 1 : 2,
        });
    };
    return (
        <div>
            <ProTable<HallListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchHallList({
                        hall_name: params.hall_name,
                    });
                    return {
                        data: res.data ?? [],
                        success: true,
                    };
                }}
                rowKey={(record) => record.id}
                search={false}
                // search={{
                //     labelWidth: 'auto',
                //     span: 6,
                //     defaultCollapsed: false,
                //     optionRender: (searchConfig, formProps, dom) => [
                //         <VenueModalForm
                //             key="add"
                //             type={modalFormType}
                //             trigger={
                //                 <Button
                //                     type="primary"
                //                     onClick={() => {
                //                         setModalFormType('add');
                //                     }}
                //                 >
                //                     新增场馆
                //                 </Button>
                //             }
                //             reloadData={reloadData}
                //         ></VenueModalForm>,
                //         dom,
                //     ],
                // }}
                toolBarRender={false}
                scroll={{
                    x: 1200,
                }}
                actionRef={tableRef}
            />
        </div>
    );
};

export default VenueList;
