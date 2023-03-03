import React, { FC, useState, useCallback, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import PositionModalForm from './PositionModalForm';
import { useHttp } from '@/hooks';
import {
    getDepartTitleList,
    getDepartList,
    deleteDepartTitle,
} from '@/api/system';
import {
    GetDepartTitleListParams,
    DepartTitleListItem,
    GetDepartListParams,
    DepartListItem,
    DepartTitleRItem,
} from '@/types/api/system';
import { nanoid } from 'nanoid';

type PositionListProps = {};

const PositionList: FC<PositionListProps> = (props) => {
    const [modalFormType, setModalFormType] = useState<'add' | 'edit'>('add');
    const tableRef = useRef<ActionType>();

    const { fetchData: _fetchDeleteDepartTitle } = useHttp<number, null>(
        deleteDepartTitle,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const { fetchData: _fetchDepartTitleList } = useHttp<
        GetDepartTitleListParams,
        DepartTitleListItem[]
    >(getDepartTitleList);

    const { fetchData: _fetchDepartList } = useHttp<
        GetDepartListParams,
        DepartListItem[]
    >(getDepartList);

    const columns: ProColumns<DepartTitleListItem, any>[] = [
        {
            title: '部门',
            dataIndex: 'department_name',
            valueType: 'select',
            request: async () => {
                const res = await _fetchDepartList();
                return res.data ?? [];
            },
            fieldProps: {
                fieldNames: {
                    label: 'department_name',
                    value: 'id',
                },
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
            dataIndex: 'updated_name',
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                record?.department_title_name && (
                    <PositionModalForm
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
                    ></PositionModalForm>
                ),
                // record?.department_title_name && (
                //     <Popconfirm
                //         key="detele"
                //         title="你确定要删除它吗?"
                //         onConfirm={() => handleDelete(record)}
                //         okText="确定"
                //         cancelText="取消"
                //     >
                //         <div
                //             onClick={() => {
                //                 console.log(text, record, _, action);
                //             }}
                //             className="m-primary-font-color pointer"
                //         >
                //             删除
                //         </div>
                //     </Popconfirm>
                // ),
            ],
        },
    ];
    const handleDelete = (record: DepartTitleListItem) => {
        _fetchDeleteDepartTitle(record?.id ?? 0);
    };

    //处理嵌套表格，字段转换
    const transTableData = (list: Record<string, any>[], field: string) => {
        return list.reduce((res: any[], next: Record<string, any>) => {
            const haveChildren =
                Array.isArray(next[field]) && next[field].length > 0;
            let newItem: Record<string, any> = {
                ...next,
                id: nanoid(),
                children: haveChildren
                    ? next[field].map((item: DepartTitleRItem) => {
                          return {
                              ...item,
                              department_name: item.department_title_name,
                              copy_department_name: item.department_name,
                          };
                      })
                    : [],
            };

            res = res.concat(newItem);

            return res;
        }, []);
    };

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);
    return (
        <div>
            <ProTable<DepartTitleListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchDepartTitleList({
                        department_id: params.department_name,
                        updated_name: params.updated_name,
                    });

                    return {
                        data: transTableData(res.data ?? [], 'r'),
                        total: res.data?.length ?? 0,
                        success: true,
                    };
                }}
                rowKey={(record) => record.id ?? 0}
                search={{
                    labelWidth: 'auto',
                    span: 6,
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <PositionModalForm
                            key="add"
                            type={modalFormType}
                            trigger={
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setModalFormType('add');
                                    }}
                                >
                                    新增职务
                                </Button>
                            }
                            reloadData={reloadData}
                        ></PositionModalForm>,
                        dom,
                    ],
                }}
                toolBarRender={false}
                actionRef={tableRef}
                scroll={{
                    x: 1200,
                }}
            />
        </div>
    );
};

export default PositionList;
