import React, { FC, useState, useEffect, useRef } from 'react';
import {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormTreeSelect,
    ProFormItem,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { message, Row, Col, Button, Input } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import {
    createAdminAccount,
    updateAdminAccount,
    getDepartList,
    getDepartTitleList,
    getDepartLevelList,
} from '@/api/system';
import {
    CreateAdminAccountParams,
    DepartListItem,
    UpdateAdminAccountParams,
    DepartTitleListItem,
    DepartLevelListItem,
    GetDepartListParams,
    GetDepartTitleListParams,
    GetDepartLevelListParams,
    AdminAccountListItem,
} from '@/types/api/system';
import { useAppSelector } from '@/store/hooks';
import { selectHallList } from '@/store/common/commonSlice';
import { transPosition } from '../common';
import { countries } from '@/common/countryPhone';
import { isInteger } from '@/utils/validate';
import AuthButton from '@/components/AuthButton';
import Opcode from './Opcode';

type AccountModalFormProps = {
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: AdminAccountListItem;
};

const AccountModalForm: FC<AccountModalFormProps> = ({
    type,
    record,
    reloadData,
}) => {
    const formRef = useRef<ProFormInstance>();
    const accountTitle: Record<string, string> = {
        add: ' 新增账号',
        edit: '编辑账号',
    };
    const [opcodeVisible, setOpcodeVisible] = useState(false);
    const [opcode, setOpcode] = useState('');
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const updatedValues = useLatest({
        hall_id: record?.hall_id,
        user_name: record?.user_name,
        login_name: record?.login_name,
        department_level_id: record?.department_level_id,
        state: record?.state,
        area_code: record?.tel?.split('-')?.[0],
        telephone: record?.tel?.split('-')?.[1],
        department_id: record?.department_id,
        department_title_id: record?.department_title_id,
    }).current;
    const [currentDepartmentId, setCurrentDepartmentId] = useState<number>();
    const [currentDepartmentName, setCurrentDepartmentName] =
        useState<string>();
    const [currentTitleName, setCurrentTitleName] = useState<string>();
    const [currentLevelName, setCurrentLevelName] = useState<string>();
    const hallList = [
        {
            label: '全部',
            value: 0,
        },
        ...useAppSelector(selectHallList),
    ];

    const { fetchData: _fetchDepartList } = useHttp<
        GetDepartListParams,
        DepartListItem[]
    >(getDepartList);

    const { fetchData: _fetchDepartTitleList } = useHttp<
        GetDepartTitleListParams,
        DepartTitleListItem[]
    >(getDepartTitleList);

    const { fetchData: _fetchDepartLevelList } = useHttp<
        GetDepartLevelListParams,
        DepartLevelListItem[]
    >(getDepartLevelList);

    const { fetchData: _fetchCreateAdminAccount } = useHttp<
        CreateAdminAccountParams,
        null | string
    >(createAdminAccount, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const { fetchData: _fetchUpdateAdminAccount } = useHttp<
        UpdateAdminAccountParams,
        null
    >(updateAdminAccount, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const handleAccount = async (values: any) => {
        const commonParams = {
            hall_id: values.hall_id,
            hall_name:
                hallList.find((item) => item.value === values.hall_id)?.label ??
                '',
            state: values.state,
            user_name: values.user_name,
            tel: values.area_code + '-' + values.telephone,
            login_name: values.login_name,
            department_id: values.department_id,
            department_title_id: values.department_title_id,
            department_level_id: values.department_level_id,
            department_level_name: currentLevelName ?? '',
            password: values.password,
        };

        if (type === 'add') {
            return _fetchCreateAdminAccount({
                ...commonParams,
                department_name: currentDepartmentName ?? '',
                department_title_name: currentTitleName ?? '',
                department_level_name: currentLevelName ?? '',
            }).then((res) => {
                setOpcode(res.data ?? '');
                setOpcodeVisible(true);
                return res;
            });
        } else if (type === 'edit') {
            return _fetchUpdateAdminAccount({
                ...commonParams,
                admin_id: record?.admin_id ?? 0,
                department_name:
                    currentDepartmentName ?? record?.department_name ?? '',
                department_title_name:
                    currentTitleName ?? record?.department_title_name ?? '',
                department_level_name:
                    currentLevelName ?? record?.department_level_name ?? '',
            });
        }
    };

    useEffect(() => {
        if (record?.department_name) {
            setCurrentDepartmentName(record?.department_name);
        }
        if (record?.department_id) {
            setCurrentDepartmentId(record?.department_id);
        }
    }, [record]);
    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal={type === 'add' ? 'account-add' : 'account-edit'}
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        buttonProps={{
                            type: type === 'add' ? 'primary' : 'link',
                        }}
                    ></AuthButton>
                }
                onFinish={async (values: any) => {
                    const res = await handleAccount(values);
                    if (res?.code === 10000) {
                        setIsPass(false);
                    }
                }}
                title={accountTitle[type]}
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
                width={1000}
                initialValues={updatedValues}
                formRef={formRef}
                visible={isPass}
            >
                <Row wrap={false}>
                    <Col span={12}>
                        <ProFormSelect
                            width="md"
                            name="hall_id"
                            label="场馆名称"
                            placeholder="请选择场馆名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择场馆名称',
                                },
                            ]}
                            fieldProps={{}}
                            options={hallList}
                        ></ProFormSelect>
                        <ProFormText
                            width="md"
                            name="user_name"
                            label="员工姓名"
                            placeholder="请输入员工姓名"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入员工姓名',
                                },
                            ]}
                        />
                        <ProFormText
                            width="md"
                            name="login_name"
                            label="账号名称"
                            placeholder="请输入账号名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入账号名称',
                                },
                            ]}
                            disabled={type === 'edit'}
                        />
                        <ProFormSelect
                            width="md"
                            name="department_level_id"
                            label="职级"
                            placeholder="请先选择部门"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择职级',
                                },
                            ]}
                            fieldProps={{
                                onChange: (_, option: any) => {
                                    setCurrentLevelName(option?.label);
                                },
                            }}
                            request={async (params) => {
                                if (!currentDepartmentId) {
                                    return [];
                                }
                                const res = await _fetchDepartLevelList({
                                    department_id: params.department_id,
                                });
                                return (
                                    transPosition(
                                        res.data,
                                        'department_level_name',
                                    ) ?? []
                                );
                            }}
                            params={{
                                department_id: currentDepartmentId,
                            }}
                        ></ProFormSelect>
                        <ProFormText.Password
                            width="md"
                            name="password"
                            label="登录密码"
                            placeholder="请输入登录密码"
                            rules={[
                                {
                                    required: type === 'add' ? true : false,
                                    message: '请输入登录密码',
                                },
                            ]}
                            fieldProps={{
                                visibilityToggle: false,
                            }}
                        />

                        {/* <ProFormText.Password
                            width="md"
                            name="g_code"
                            label="谷歌验证码"
                            placeholder="请输入谷歌验证码"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入谷歌验证码',
                                },
                            ]}
                        /> */}
                    </Col>
                    <Col span={12}>
                        <ProFormSelect
                            width="md"
                            name="state"
                            label="账号状态"
                            placeholder="请选择账号状态"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择账号状态',
                                },
                            ]}
                            options={[
                                {
                                    label: '可用',
                                    value: 1,
                                },
                                {
                                    label: '停用',
                                    value: 2,
                                },
                            ]}
                        ></ProFormSelect>
                        <ProFormItem label="手机号" name="tel" required>
                            <Input.Group compact>
                                <ProFormSelect
                                    name="area_code"
                                    width={100}
                                    options={countries.map((item) => {
                                        return {
                                            label: item.tel,
                                            value: item.tel,
                                        };
                                    })}
                                    fieldProps={{
                                        getPopupContainer: (triggerNode) =>
                                            triggerNode.parentNode,
                                    }}
                                    showSearch
                                    placeholder="国际区号"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择国际区号',
                                        },
                                    ]}
                                />
                                <ProFormText
                                    width={200}
                                    name="telephone"
                                    placeholder="请输入手机号码"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入手机号码',
                                        },
                                        {
                                            pattern: isInteger,
                                            message: '请输入数字',
                                        },
                                    ]}
                                />
                            </Input.Group>
                        </ProFormItem>

                        <ProFormSelect
                            width="md"
                            name="department_id"
                            label="部门"
                            placeholder="请选择部门"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择部门',
                                },
                            ]}
                            fieldProps={{
                                fieldNames: {
                                    label: 'department_name',
                                    value: 'id',
                                },
                                onChange: (_, option: any) => {
                                    setCurrentDepartmentId(+option.value);
                                    setCurrentDepartmentName(option?.label);
                                    formRef.current?.setFieldsValue({
                                        department_level_id: [],
                                        department_title_id: [],
                                    });
                                },
                            }}
                            request={async () => {
                                const res = await _fetchDepartList();
                                return res.data ?? [];
                            }}
                        ></ProFormSelect>
                        <ProFormSelect
                            width="md"
                            name="department_title_id"
                            label="职务"
                            placeholder="请先选择部门"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择职务',
                                },
                            ]}
                            fieldProps={{
                                onChange: (_, option: any) => {
                                    setCurrentTitleName(option?.label);
                                },
                            }}
                            request={async (params) => {
                                if (!currentDepartmentId) {
                                    return [];
                                }
                                const res = await _fetchDepartTitleList({
                                    department_id: params.department_id,
                                });
                                return (
                                    transPosition(
                                        res.data,
                                        'department_title_name',
                                    ) ?? []
                                );
                            }}
                            params={{
                                department_id: currentDepartmentId,
                            }}
                        ></ProFormSelect>
                    </Col>
                </Row>
            </ModalForm>
            <Opcode
                opcode={opcode}
                opcodeVisible={opcodeVisible}
                handleOpcodeVisible={(val) => setOpcodeVisible(val)}
            ></Opcode>
        </div>
    );
};

export default AccountModalForm;
