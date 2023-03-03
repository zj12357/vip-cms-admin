import React, { FC, useState, useRef, memo, useEffect } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTreeSelect,
    ProFormRadio,
    ProFormSwitch,
    ProFormCascader,
} from '@ant-design/pro-components';
import {
    Button,
    message,
    TreeSelect,
    Divider,
    RadioChangeEvent,
    Row,
    Col,
} from 'antd';
import { useHttp, useLatest } from '@/hooks';
import {
    createMenu,
    getMenuList,
    updateMenu,
    getDepartList,
    getDepartLevelList,
} from '@/api/system';
import {
    CreateMenuParams,
    MenuListItem,
    UpdateMenuParams,
    GetMenuListParams,
    GetDepartListParams,
    DepartListItem,
    GetDepartLevelListParams,
    DepartLevelListItem,
} from '@/types/api/system';
import { IconFont } from '@/config/icon';
import type { ProFormInstance } from '@ant-design/pro-components';
import { useAppSelector } from '@/store/hooks';
import { selectIconList } from '@/store/common/commonSlice';
import { transTableData } from '../common';

type MenuModalFormProps = {
    trigger: JSX.Element;
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: MenuListItem;
};
const { SHOW_PARENT } = TreeSelect;
const MenuModalForm: FC<MenuModalFormProps> = memo(
    ({ trigger, type, reloadData, record }) => {
        const menuTitle: Record<string, string> = {
            add: ' 新增菜单',
            edit: '编辑菜单',
        };
        const formRef = useRef<ProFormInstance>();
        const updatedValues = useLatest({
            parent_id: record?.parent_id,
            menu_name: record?.menu_name,
            menu_type: record?.menu_type,
            menu_location: record?.menu_location,
            path: record?.path,
            icon: record?.icon,
            normal: record?.normal,
            opcode: record?.opcode === 1 ? false : true,

            depart_ids: record?.depart_ids?.map((v) =>
                v.split(',').map((i) => +i),
            ),
        }).current;

        const [menuType, setMenuType] = useState<string>('');
        const [iconName, setIconName] = useState('');
        const iconList = useAppSelector(selectIconList);

        const { fetchData: _fetchCreateMenu } = useHttp<CreateMenuParams, null>(
            createMenu,
            ({ msg }) => {
                message.success(msg);
                reloadData();
            },
        );
        const { fetchData: _fetchMenuList } = useHttp<
            GetMenuListParams,
            MenuListItem[]
        >(getMenuList);

        const { fetchData: _fetchDepartLevelList } = useHttp<
            GetDepartLevelListParams,
            DepartLevelListItem[]
        >(getDepartLevelList);

        const { fetchData: _fetchUpdateMenu } = useHttp<UpdateMenuParams, null>(
            updateMenu,
            ({ msg }) => {
                message.success(msg);
                reloadData();
            },
        );

        const handleMenuType = (e: RadioChangeEvent) => {
            setMenuType(e.target.value);
        };

        const handleMenu = (values: any) => {
            const commonParams = {
                parent_id: values.parent_id,
                menu_name: values.menu_name,
                menu_type: values.menu_type,
                menu_location: values.menu_location,
                path: values.path,
                icon: values.icon,
                normal: values.normal,
                opcode: values.opcode,
                depart_ids: values?.depart_ids?.map((v: string[]) =>
                    v?.join(','),
                ),
            };
            if (type === 'add') {
                return _fetchCreateMenu(commonParams);
            } else if (type === 'edit') {
                return _fetchUpdateMenu({
                    ...commonParams,
                    menu_id: record?.menu_id ?? 0,
                });
            }
        };

        return (
            <div>
                <ModalForm
                    trigger={trigger}
                    onFinish={async (values: any) => {
                        const res = await handleMenu(values);
                        if (res?.code === 10000) {
                            return true;
                        }
                    }}
                    title={menuTitle[type]}
                    style={{
                        maxHeight: '70vh',
                        overflowY: 'auto',
                    }}
                    modalProps={{
                        destroyOnClose: true,
                    }}
                    formRef={formRef}
                    initialValues={updatedValues}
                    onVisibleChange={(visible) => {
                        if (!visible) {
                            setMenuType('');
                            setIconName('');
                        } else {
                            setMenuType(record?.menu_type ?? '');
                            setIconName(record?.icon ?? '');
                        }
                    }}
                >
                    <ProForm.Group>
                        <ProFormTreeSelect
                            label="上级菜单"
                            name="parent_id"
                            placeholder="请选择上级菜单"
                            allowClear
                            width="md"
                            request={async () => {
                                const res = await _fetchMenuList();
                                return res.data;
                            }}
                            fieldProps={{
                                fieldNames: {
                                    label: 'menu_name',
                                    value: 'menu_id',
                                },
                                multiple: false,
                                showCheckedStrategy: SHOW_PARENT,
                                showSearch: false,
                            }}
                        />

                        <ProFormRadio.Group
                            name="menu_type"
                            label="菜单类型"
                            options={[
                                {
                                    label: '菜单',
                                    value: 'M',
                                },
                                {
                                    label: '按钮(操作码)',
                                    value: 'B',
                                },
                            ]}
                            fieldProps={{
                                onChange: handleMenuType,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择菜单类型',
                                },
                            ]}
                        />
                    </ProForm.Group>

                    {menuType === 'M' && (
                        <>
                            <ProForm.Group>
                                <ProFormText
                                    width="md"
                                    name="menu_name"
                                    label="菜单标题"
                                    placeholder="请输入菜单标题"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入菜单标题',
                                        },
                                    ]}
                                />
                                <ProFormText
                                    width="md"
                                    name="path"
                                    label="组件路径"
                                    placeholder="请输入组件路径"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入组件路径',
                                        },
                                    ]}
                                />
                            </ProForm.Group>
                            <ProForm.Group>
                                <ProFormSelect
                                    width={300}
                                    name="icon"
                                    label="菜单图标"
                                    options={[
                                        {
                                            label: '无图标',
                                            value: '#',
                                        },
                                        ...iconList.map((item, index) => {
                                            return {
                                                label: item,
                                                value: item,
                                            };
                                        }),
                                    ]}
                                    placeholder="请输入菜单图标"
                                    showSearch
                                    fieldProps={{
                                        onChange: (val) => {
                                            setIconName(val);
                                        },
                                    }}
                                    addonAfter={
                                        <div
                                            style={{
                                                width: '20px',
                                            }}
                                        >
                                            <IconFont
                                                type={iconName}
                                            ></IconFont>
                                        </div>
                                    }
                                ></ProFormSelect>
                                <ProFormRadio.Group
                                    width="md"
                                    name="menu_location"
                                    label="菜单显示位置"
                                    options={[
                                        {
                                            label: '左边导航',
                                            value: 'L',
                                        },
                                        {
                                            label: '页面内',
                                            value: 'I',
                                        },
                                    ]}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择菜单显示位置',
                                        },
                                    ]}
                                />
                            </ProForm.Group>
                        </>
                    )}
                    {menuType === 'B' && (
                        <>
                            <ProForm.Group>
                                <ProFormText
                                    width="md"
                                    name="menu_name"
                                    label="按钮名称"
                                    placeholder="请输入菜单标题"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入菜单标题',
                                        },
                                    ]}
                                />

                                <ProFormText
                                    width="md"
                                    name="normal"
                                    label="按钮标识"
                                    placeholder="请输入按钮标识"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入按钮标识',
                                        },
                                    ]}
                                />
                            </ProForm.Group>
                            <ProForm.Group>
                                <ProFormText
                                    width="md"
                                    name="path"
                                    label="按钮路径"
                                    placeholder="请输入按钮路径"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入按钮路径',
                                        },
                                    ]}
                                />
                                {/* <ProFormSwitch
                                    width="md"
                                    name="opcode"
                                    label="操作码"
                                    transform={(value) => {
                                        return {
                                            opcode: value ? 2 : 1,
                                        };
                                    }}
                                ></ProFormSwitch> */}
                                {/* <ProForm.Item noStyle shouldUpdate>
                                    {(form) => {
                                        return (
                                            form.getFieldValue('opcode') && (
                                                <>
                                                    <ProFormCascader
                                                        width="md"
                                                        name="depart_ids"
                                                        label="职级"
                                                        placeholder="请先选择部门"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请选择职级',
                                                            },
                                                        ]}
                                                        fieldProps={{
                                                            fieldNames: {
                                                                label: 'department_name',
                                                                value: 'id',
                                                            },
                                                            multiple: true,
                                                            showCheckedStrategy:
                                                                'SHOW_CHILD',
                                                        }}
                                                        request={async (
                                                            params,
                                                        ) => {
                                                            const res =
                                                                await _fetchDepartLevelList();
                                                            return (
                                                                transTableData(
                                                                    res.data,
                                                                    'r',
                                                                    'department_level_name',
                                                                    false,
                                                                    'id',
                                                                ) ?? []
                                                            );
                                                        }}
                                                    ></ProFormCascader>
                                                </>
                                            )
                                        );
                                    }}
                                </ProForm.Item> */}
                                <ProFormCascader
                                    width="md"
                                    name="depart_ids"
                                    label="职级"
                                    placeholder="请先选择部门"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择职级',
                                        },
                                    ]}
                                    fieldProps={{
                                        fieldNames: {
                                            label: 'department_name',
                                            value: 'id',
                                        },
                                        multiple: true,
                                        showCheckedStrategy: 'SHOW_CHILD',
                                    }}
                                    request={async (params) => {
                                        const res =
                                            await _fetchDepartLevelList();
                                        return (
                                            transTableData(
                                                res.data,
                                                'r',
                                                'department_level_name',
                                                'id',
                                            ) ?? []
                                        );
                                    }}
                                ></ProFormCascader>
                            </ProForm.Group>
                        </>
                    )}
                </ModalForm>
            </div>
        );
    },
);

export default MenuModalForm;
