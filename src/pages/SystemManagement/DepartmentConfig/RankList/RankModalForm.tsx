import React, { FC, useState, useRef, useEffect } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTreeSelect,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Button, message, TreeSelect } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import _ from 'lodash';
import {
    createDepartLevel,
    getDepartList,
    updateDepartLevel,
    getMenuList,
} from '@/api/system';
import {
    CreateDepartLevelParams,
    GetDepartListParams,
    UpdateDepartLevelParams,
    DepartLevelListItem,
    DepartListItem,
    MenuListItem,
    GetMenuListParams,
} from '@/types/api/system';

type RankModalFormProps = {
    trigger: JSX.Element;
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: DepartLevelListItem;
};
const { SHOW_ALL } = TreeSelect;
const RankModalForm: FC<RankModalFormProps> = ({
    trigger,
    type,
    reloadData,
    record,
}) => {
    const deaprtLevelTitle: Record<string, string> = {
        add: ' 新增职级',
        edit: '编辑职级',
    };
    const [selectIds, setSelectIds] = useState<any[]>([]);
    const formRef = useRef<ProFormInstance>();
    const updatedValues = useLatest({
        department_id: record?.department_id,
        level_name: record?.department_level_name,
        menus: (record?.menu_ids ?? []).filter((v) => v !== 1),
    }).current;
    const [departInfo, setDepartInfo] = useState<DepartListItem>(
        {} as DepartListItem,
    );

    const { fetchData: _fetchDepartList } = useHttp<
        GetDepartListParams,
        DepartListItem[]
    >(getDepartList);
    const { fetchData: _fetchMenuList, response } = useHttp<
        GetMenuListParams,
        MenuListItem[]
    >(getMenuList);

    const { fetchData: _fetchCreateDepartLevel } = useHttp<
        CreateDepartLevelParams,
        null
    >(createDepartLevel, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const { fetchData: _fetchUpdateDepartLevel } = useHttp<
        UpdateDepartLevelParams,
        null
    >(updateDepartLevel, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const handleDepartLevel = async (values: any) => {
        //根目录的id是1
        const commonParams = {
            department_id: values.department_id,
            level_name: values.level_name,
            menus: _.uniq([1, ...values.menus]),
            menu_ids: selectIds.length ? selectIds : record?.menu_ids,
        };
        if (type === 'add') {
            return _fetchCreateDepartLevel({
                ...commonParams,
                department_name: departInfo.department_name,
            });
        } else if (type === 'edit') {
            return _fetchUpdateDepartLevel({
                ...commonParams,
                id: record?.id ?? 0,
                department_name: record?.copy_department_name ?? '',
            });
        }
    };

    const valueMap: any = {};
    function loops(list: any, parent?: any) {
        return (list || []).map(({ children, menu_id }: any) => {
            const node: any = (valueMap[menu_id] = {
                parent,
                menu_id,
            });
            node.children = loops(children, node);
            return node;
        });
    }

    loops(response);

    function getPath(value: any) {
        const path = [];
        let current = valueMap[value];
        while (current) {
            path.unshift(current.menu_id);
            current = current.parent;
        }
        return path;
    }

    const handleSelectId = (value: any, labelList: any, extra: any) => {
        if (value?.length) {
            const parent = getPath(extra.triggerValue);

            let allIds = _.uniq([...value, ...parent]);
            if (!extra.checked) {
                allIds = allIds.filter((v) => v !== extra.triggerValue);
            }
            setSelectIds(allIds.sort((a, b) => a - b));
        }
    };

    return (
        <div>
            <ModalForm
                trigger={trigger}
                onFinish={async (values: any) => {
                    const res = await handleDepartLevel(values);
                    if (res?.code === 10000) {
                        return true;
                    }
                }}
                title={deaprtLevelTitle[type]}
                style={{
                    maxHeight: '70vh',
                    minHeight: '300px',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                initialValues={updatedValues}
                formRef={formRef}
            >
                <ProForm.Group>
                    <ProFormSelect
                        width="md"
                        name="department_id"
                        label="部门名称"
                        placeholder="请选择部门名称"
                        rules={[
                            {
                                required: true,
                                message: '请选择部门名称',
                            },
                        ]}
                        request={async () => {
                            const res = await _fetchDepartList();
                            return res.data ?? [];
                        }}
                        fieldProps={{
                            fieldNames: {
                                label: 'department_name',
                                value: 'id',
                            },
                            onChange: (value, option: any) => {
                                setDepartInfo(option);
                            },
                        }}
                        disabled={type === 'edit'}
                    ></ProFormSelect>
                    <ProFormText
                        width="md"
                        name="level_name"
                        label="职级名称"
                        placeholder="请输入职级名称"
                        rules={[
                            {
                                required: true,
                                message: '请输入职级名称',
                            },
                        ]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormTreeSelect
                        label="菜单权限"
                        name="menus"
                        placeholder="请选择菜单权限"
                        allowClear
                        width={700}
                        request={async () => {
                            const res = await _fetchMenuList();
                            return res.data;
                        }}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            fieldNames: {
                                label: 'menu_name',
                                value: 'menu_id',
                            },
                            showCheckedStrategy: SHOW_ALL,
                            multiple: true,
                            treeCheckable: true,
                            showSearch: false,
                            treeDefaultExpandedKeys: (
                                record?.menu_ids ?? []
                            ).filter((v) => v !== 1),
                            onChange(value, labelList, extra) {
                                handleSelectId(value, labelList, extra);
                            },
                        }}
                        rules={[
                            {
                                required: true,
                                message: '请选择菜单权限',
                            },
                        ]}
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};

export default RankModalForm;
