import React, { ComponentProps, useCallback, useRef } from 'react';
import { ModalForm, ProForm, ProFormRadio } from '@ant-design/pro-components';
import { BetLimitUser } from '@/types/api/eBet';
import { betTypes } from '@/common/commonConstType';
import { Col, Input, message, Row } from 'antd';
import { useHttp } from '@/hooks';
import { addBetLimitUserList, updateBetLimitUserList } from '@/api/eBet';
import { FormInstance } from 'antd/es';

interface UserLimitModalFormProps extends ComponentProps<any> {
    trigger: JSX.Element;
    onFinish?: () => void;
    entity?: BetLimitUser;
}
interface RangeNumberInputProps {
    placeholder?: string[] | string;
    value?: string[];
    onChange?: (value: string[]) => void;
}
const RangeNumberInput: React.FC<RangeNumberInputProps> = ({
    placeholder,
    value,
    onChange,
}) => {
    const handleChange = useCallback(
        async (val: string, idx: number) => {
            const values: string[] = [...(value ?? [])];
            values[idx] = !val ? val : val?.replace(/[^0-9.]+/g, '');
            onChange?.(values);
        },
        [onChange, value],
    );

    return (
        <Row justify={'center'} align={'middle'}>
            <Col span={11}>
                <Input
                    placeholder={
                        Array.isArray(placeholder)
                            ? placeholder[0]
                            : placeholder
                    }
                    value={value?.[0]}
                    onChange={(e) => handleChange(e.target.value, 0)}
                />
            </Col>
            <Col span={2}>
                <Row justify={'center'}>~</Row>
            </Col>
            <Col span={11}>
                <Input
                    placeholder={
                        Array.isArray(placeholder)
                            ? placeholder[1]
                            : placeholder
                    }
                    value={value?.[1]}
                    onChange={(e) => handleChange(e.target.value, 1)}
                />
            </Col>
        </Row>
    );
};

export const statusOptions = [
    {
        value: 1,
        label: '启用',
    },
    {
        value: 2,
        label: '禁用',
    },
];

const UserLimitModalForm: React.FC<UserLimitModalFormProps> = ({
    trigger,
    onFinish,
    entity,
}) => {
    const formRef = useRef<FormInstance>();
    const title = entity?.id ? '修改用户限红' : '新增用户限红';
    const { fetchData: submit } = useHttp(
        entity?.id ? updateBetLimitUserList : addBetLimitUserList,
    );

    const handleFinish = async (values: any) => {
        const limit_array = betTypes.map((bt) => ({
            bet_type: bt.value,
            min_amount: +values[`limit_array$${bt.value}`]?.[0],
            max_amount: +values[`limit_array$${bt.value}`]?.[1],
        }));
        const payload = {
            limit_array,
            status: values.status,
            type: entity?.type || 1,
            id: entity?.id,
        };
        const res = await submit(payload);
        if (res.code === 10000) {
            message.success('操作成功');
            onFinish?.();
            return true;
        }
        return false;
    };

    return (
        <ModalForm
            key={JSON.stringify(entity)}
            formRef={formRef}
            title={title}
            trigger={trigger}
            layout={'horizontal'}
            labelCol={{ span: 2 }}
            onFinish={handleFinish}
            onVisibleChange={() => formRef.current?.resetFields()}
        >
            {betTypes.map((bt) => {
                const limit = entity?.limit_array?.find(
                    (la) => la.bet_type === bt.value,
                );
                const initialValue = limit
                    ? [limit?.min_amount, limit?.max_amount]
                    : undefined;
                return (
                    <ProForm.Item
                        key={bt.value}
                        name={`limit_array$${bt.value}`}
                        label={bt.label}
                        initialValue={initialValue}
                        rules={[
                            {
                                validator: async (_, value) => {
                                    console.log(value, 787878);
                                    if (
                                        !(value?.length >= 2) ||
                                        value[0] > value[1]
                                    ) {
                                        return Promise.reject(
                                            '请输入正确的数值范围',
                                        );
                                    }
                                    return true;
                                },
                            },
                        ]}
                    >
                        <RangeNumberInput placeholder={'请输入'} />
                    </ProForm.Item>
                );
            })}
            <ProFormRadio.Group
                label={'状态'}
                name={'status'}
                options={statusOptions}
                initialValue={entity?.status}
                rules={[
                    {
                        required: true,
                        message: '请选择状态',
                    },
                ]}
                required={false}
            />
        </ModalForm>
    );
};

export default UserLimitModalForm;
