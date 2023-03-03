import React, {
    ComponentProps,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    ModalForm,
    ProFormRadio,
    ProFormText,
} from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { betterInsert, betterUpdate } from '@/api/eBet';
import { BetterProps } from '@/types/api/eBet';
import _ from 'lodash';
import MD5 from 'blueimp-md5';

interface BetterModalFormProps extends ComponentProps<any> {
    trigger: JSX.Element;
    entity?: BetterProps;
    onFinish?: () => void;
}

export const statusOptions = [
    {
        value: 2,
        label: '启用',
    },
    {
        value: 1,
        label: '禁用',
    },
];

const BetterModalForm: React.FC<BetterModalFormProps> = ({
    trigger,
    entity,
    onFinish,
}) => {
    const [refresh, setRefresh] = useState<boolean>(false);
    useEffect(() => {
        refresh && setRefresh(false);
    }, [refresh]);

    const formRef = useRef<any>();
    const { fetchData: submitForm } = useHttp(
        entity?.id ? betterUpdate : betterInsert,
    );

    const handleFinish = useCallback(
        async (values: BetterProps) => {
            const payload = {
                ..._.omit(values, ['confirm_password']),
                id: entity?.id,
                password: values?.password
                    ? MD5(
                          `${values?.account}${values?.password}EbetGameL`,
                      ).toString()
                    : values?.password,
            };
            const res = await submitForm(payload);
            if (res.code === 10000) {
                formRef?.current?.resetFields();
                onFinish?.();
                return true;
            }
            return false;
        },
        [entity?.id, onFinish, submitForm],
    );

    return (
        <div>
            <ModalForm
                formRef={formRef}
                trigger={trigger}
                layout={'horizontal'}
                labelCol={{ span: 3 }}
                onValuesChange={() => setRefresh(true)}
                onVisibleChange={() => {
                    formRef?.current?.resetFields();
                    setRefresh(true);
                }}
                onFinish={handleFinish}
            >
                <ProFormText
                    width="md"
                    name="account"
                    initialValue={entity?.account}
                    label="账号"
                    placeholder="请输入"
                    rules={[
                        {
                            required: true,
                            message: '请输入',
                        },
                    ]}
                    disabled={!!entity?.id}
                />
                <ProFormText.Password
                    width="md"
                    name="password"
                    initialValue={entity?.password}
                    label="密码"
                    placeholder="请输入"
                    getValueFromEvent={(e) =>
                        e.target.value?.replace(/\s+/g, '')
                    }
                    validateFirst
                    rules={[
                        {
                            required: !entity?.id,
                            message: '请输入',
                        },
                    ]}
                    fieldProps={{
                        visibilityToggle: false,
                    }}
                />
                <ProFormText.Password
                    width="md"
                    name="confirm_password"
                    initialValue={entity?.password}
                    label="确认密码"
                    placeholder="请输入"
                    validateFirst
                    dependencies={['password']}
                    getValueFromEvent={(e) =>
                        e.target.value?.replace(/\s+/g, '')
                    }
                    fieldProps={{
                        visibilityToggle: false,
                    }}
                    rules={[
                        {
                            required: !entity?.id,
                            message: '请输入',
                        },
                        {
                            validator: async (_, value) => {
                                const pwd =
                                    formRef?.current?.getFieldValue('password');
                                if (pwd !== value) {
                                    return Promise.reject('两次密码输入不一致');
                                }
                                return true;
                            },
                        },
                    ]}
                />
                <ProFormText
                    width="md"
                    name="employee_name"
                    initialValue={entity?.employee_name}
                    label="员工姓名"
                    placeholder="请输入"
                    rules={[
                        {
                            required: true,
                            message: '请输入',
                        },
                    ]}
                />
                <ProFormText
                    width="md"
                    name="mobile"
                    initialValue={entity?.mobile}
                    label="联系电话"
                    placeholder="请输入"
                    rules={[
                        {
                            required: true,
                            message: '请输入',
                        },
                    ]}
                />
                <ProFormRadio.Group
                    name="status"
                    initialValue={entity?.status}
                    label="账号状态"
                    options={statusOptions}
                    rules={[
                        {
                            required: true,
                            message: '请选择',
                        },
                    ]}
                />
            </ModalForm>
        </div>
    );
};

export default BetterModalForm;
