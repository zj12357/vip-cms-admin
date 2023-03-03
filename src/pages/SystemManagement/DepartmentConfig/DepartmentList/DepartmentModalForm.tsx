import React, { FC, useState } from 'react';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { createDepart, updateDepart } from '@/api/system';
import {
    CreateDepartParams,
    DepartListItem,
    UpdateDepartParams,
} from '@/types/api/system';
import AuthButton from '@/components/AuthButton';

type DepartmentModalFormProps = {
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: DepartListItem;
};

const DepartmentModalForm: FC<DepartmentModalFormProps> = ({
    type,
    reloadData,
    record,
}) => {
    const deaprtTitle: Record<string, string> = {
        add: ' 新增部门',
        edit: '编辑部门',
    };
    const [isPass, setIsPass] = useState(false); //操作码是否通过

    const updatedValues = useLatest({
        department_name: record?.department_name,
    }).current;
    const { fetchData: _fetchCreateDepart } = useHttp<CreateDepartParams, null>(
        createDepart,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const { fetchData: _fetchUpdateDepart } = useHttp<UpdateDepartParams, null>(
        updateDepart,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const handleDepart = async (values: any) => {
        const commonParams = {
            department_name: values.department_name,
        };
        if (type === 'add') {
            return _fetchCreateDepart(commonParams);
        } else if (type === 'edit') {
            return _fetchUpdateDepart({
                ...commonParams,
                id: record?.id ?? 0,
            });
        }
    };

    return (
        <div>
            <ModalForm
                trigger={
                    type === 'add' ? (
                        <AuthButton
                            normal="department-add"
                            verify={(pass) => {
                                setIsPass(pass);
                            }}
                            buttonProps={{
                                type: 'primary',
                            }}
                        ></AuthButton>
                    ) : (
                        <Button
                            onClick={() => {
                                setIsPass(true);
                            }}
                            type="link"
                        >
                            编辑
                        </Button>
                    )
                }
                onFinish={async (values: any) => {
                    const res = await handleDepart(values);
                    if (res?.code === 10000) {
                        setIsPass(false);
                    }
                }}
                title={deaprtTitle[type]}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setIsPass(false);
                    },
                }}
                width={400}
                initialValues={updatedValues}
                visible={isPass}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="department_name"
                        label="部门名称"
                        placeholder="请输入部门名称"
                        rules={[
                            {
                                required: true,
                                message: '请输入部门名称',
                            },
                        ]}
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};

export default DepartmentModalForm;
