import React, { FC, useState } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import {
    createDepartTitle,
    getDepartList,
    updateDepartTitle,
} from '@/api/system';
import {
    CreateDepartTitleParams,
    GetDepartListParams,
    UpdateDepartTitleParams,
    DepartTitleListItem,
    DepartListItem,
} from '@/types/api/system';

type PositionModalFormProps = {
    trigger: JSX.Element;
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: DepartTitleListItem;
};

const PositionModalForm: FC<PositionModalFormProps> = ({
    trigger,
    type,
    reloadData,
    record,
}) => {
    const deaprtTitleTitle: Record<string, string> = {
        add: ' 新增职务',
        edit: '编辑职务',
    };
    const updatedValues = useLatest({
        department_id: record?.department_id,
        title_name: record?.department_title_name,
    }).current;

    const [departInfo, setDepartInfo] = useState<DepartListItem>(
        {} as DepartListItem,
    );

    const { fetchData: _fetchDepartList } = useHttp<
        GetDepartListParams,
        DepartListItem[]
    >(getDepartList);

    const { fetchData: _fetchCreateDepartTitle } = useHttp<
        CreateDepartTitleParams,
        null
    >(createDepartTitle, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const { fetchData: _fetchUpdateDepartTitle } = useHttp<
        UpdateDepartTitleParams,
        null
    >(updateDepartTitle, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const handleDepartTile = async (values: any) => {
        const commonParams = {
            department_id: values.department_id,
            title_name: values.title_name,
        };
        if (type === 'add') {
            return _fetchCreateDepartTitle({
                ...commonParams,
                department_name: departInfo.department_name,
            });
        } else if (type === 'edit') {
            return _fetchUpdateDepartTitle({
                ...commonParams,
                id: record?.id ?? 0,
                department_name: record?.copy_department_name ?? '',
            });
        }
    };

    return (
        <div>
            <ModalForm
                trigger={trigger}
                onFinish={async (values: any) => {
                    const res = await handleDepartTile(values);
                    if (res?.code === 10000) {
                        return true;
                    }
                }}
                title={deaprtTitleTitle[type]}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                initialValues={updatedValues}
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
                        name="title_name"
                        label="职务名称"
                        placeholder="请输入职务名称"
                        rules={[
                            {
                                required: true,
                                message: '请输入职务名称',
                            },
                        ]}
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};

export default PositionModalForm;
