import React, { FC, useState } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormCheckbox,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { createRemark, updateRemark } from '@/api/accountAction';
import {
    CreateRemarkParams,
    UpdateRemarkParams,
    RemarkListItem,
} from '@/types/api/accountAction';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { selectDepartmentList } from '@/store/common/commonSlice';
import { checkFormItemValue } from '@/common/commonHandle';
import AuthButton from '@/components/AuthButton';

type ActionModalFormProps = {
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: RemarkListItem;
};

const ActionModalForm: FC<ActionModalFormProps> = ({
    type,
    reloadData,
    record,
}) => {
    const remarkTitle: Record<string, string> = {
        add: '新增备注',
        edit: '编辑备注',
    };
    const accountInfo = useAppSelector(selectAccountInfo);
    const departmentList = useAppSelector(selectDepartmentList);
    const [isPass, setIsPass] = useState(false); //操作码是否通过

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        content: record?.content,
        department: checkFormItemValue(record?.department ?? 0),
        see_department: record?.see_department?.split(',').map((item) => +item),
    }).current;

    const { fetchData: _fetchCreateRemark } = useHttp<CreateRemarkParams, null>(
        createRemark,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const { fetchData: _fetchUpdateRemark } = useHttp<UpdateRemarkParams, null>(
        updateRemark,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const handleRemark = (values: any) => {
        const commonParams = {
            content: values.content,
            department: values.department,
            see_department: values.see_department,
        };
        if (type === 'add') {
            return _fetchCreateRemark({
                member_id: accountInfo.member_id,
                ...commonParams,
            });
        } else if (type === 'edit') {
            return _fetchUpdateRemark({
                id: record?.remarks_id ?? 0,
                ...commonParams,
            });
        }
    };

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal={
                            type === 'add'
                                ? 'customerAccount-remark-add'
                                : 'customerAccount-remark-edit'
                        }
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        buttonProps={{
                            type: type === 'add' ? 'primary' : 'link',
                        }}
                    ></AuthButton>
                }
                onFinish={async (values: any) => {
                    const res = await handleRemark(values);
                    if (res?.code === 10000) {
                        setIsPass(false);
                    }
                }}
                title={remarkTitle[type]}
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
                initialValues={updatedValues}
                visible={isPass}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_code"
                        label="户口"
                        disabled
                    />

                    <ProFormSelect
                        name="department"
                        label="部门"
                        width="md"
                        options={departmentList}
                        placeholder="请选择部门"
                        rules={[
                            {
                                required: true,
                                message: '请选择部门',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                        }}
                        showSearch
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_name"
                        label="户名"
                        disabled
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormCheckbox.Group
                        name="see_department"
                        layout="horizontal"
                        width="md"
                        label="可见部门"
                        options={departmentList}
                        rules={[
                            {
                                required: true,
                                message: '请选择可见部门',
                            },
                        ]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormTextArea
                        width="md"
                        name="content"
                        label="备注"
                        placeholder="请输入备注"
                        rules={[
                            {
                                required: true,
                                message: '请输入备注',
                            },
                        ]}
                        fieldProps={{
                            maxLength: 100,
                        }}
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};

export default ActionModalForm;
