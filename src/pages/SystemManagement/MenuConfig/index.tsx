import React, { FC, useState, useRef, useCallback } from 'react';
import { ProCard, ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import MenuModalForm from './MenuModalForm';
import { useHttp } from '@/hooks';
import { getMenuList, deteleMenu } from '@/api/system';
import { MenuListItem, GetMenuListParams } from '@/types/api/system';
import { menuType } from '@/common/commonConstType';

type MenuConfigProps = {};

const MenuConfig: FC<MenuConfigProps> = (props) => {
    const [modalFormType, setModalFormType] = useState<'add' | 'edit'>('add');
    const tableRef = useRef<ActionType>();
    const { fetchData: _fetchMenuList } = useHttp<
        GetMenuListParams,
        MenuListItem[]
    >(getMenuList);

    const { fetchData: _fetchDeteleMenu } = useHttp<number, null>(
        deteleMenu,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const columns: ProColumns<MenuListItem, any>[] = [
        {
            title: '菜单名称',
            dataIndex: 'menu_name',
        },
        {
            title: '组件路径',
            dataIndex: 'path',
            hideInSearch: true,
        },
        {
            title: '按钮标识',
            dataIndex: 'normal',
            hideInSearch: true,
        },
        {
            title: '组件类型',
            dataIndex: 'menu_type',
            valueType: 'select',
            hideInSearch: true,
            fieldProps: {
                options: menuType,
            },
        },

        {
            title: '创建时间',
            dataIndex: 'created_at',
            valueType: 'milliDateTime',
            hideInSearch: true,
        },
        {
            title: '操作人',
            dataIndex: 'created_name',
            hideInSearch: true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                record.parent_id !== 0 && (
                    <MenuModalForm
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
                    ></MenuModalForm>
                ),
                record.parent_id !== 0 && (
                    <Popconfirm
                        key="detele"
                        title="你确定要删除它吗?"
                        onConfirm={() => handleDelete(record)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <div className="m-primary-font-color pointer">删除</div>
                    </Popconfirm>
                ),
            ],
        },
    ];
    const handleDelete = (record: MenuListItem) => {
        _fetchDeteleMenu(record.menu_id);
    };

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    return (
        <div>
            <ProTable<MenuListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchMenuList({
                        menu_name: params.menu_name,
                    });
                    return {
                        data: res.data,
                        success: true,
                        total: 0,
                    };
                }}
                rowKey={(record) => record.menu_id}
                search={{
                    labelWidth: 'auto',
                    span: 6,
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <MenuModalForm
                            key="add"
                            type={modalFormType}
                            trigger={
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setModalFormType('add');
                                    }}
                                >
                                    新增菜单
                                </Button>
                            }
                            reloadData={reloadData}
                        ></MenuModalForm>,
                        dom,
                    ],
                }}
                toolBarRender={false}
                actionRef={tableRef}
                expandable={{
                    //默认展开根目录
                    defaultExpandedRowKeys: [1],
                }}
                scroll={{
                    x: 1200,
                }}
            />
        </div>
    );
};

export default MenuConfig;
