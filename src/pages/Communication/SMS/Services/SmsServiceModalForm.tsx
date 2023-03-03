import React, { useCallback, useRef } from 'react';
import { FormInstance } from 'antd/es';
import {
    ModalForm,
    ProFormText,
    ProFormRadio,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { SmsServicesProps } from '@/types/api/communication';
import { smsLineTypes } from '@/common/commonConstType';
import { countries } from '@/common/countryPhone';
import { Col, message, Row } from 'antd';
import { useHttp } from '@/hooks';
import { smsServiceUpdate } from '@/api/communication';

interface SmsServiceModalFormProps {
    trigger: JSX.Element;
    entity?: SmsServicesProps;
    onOk?: () => void;
}

export const statusOptions = [
    {
        value: 1,
        label: '已启用',
    },
    {
        value: 2,
        label: '已禁用',
    },
];

type FormProps = SmsServicesProps & { support_region: string[] };

const SmsServiceModalForm: React.FC<SmsServiceModalFormProps> = ({
    trigger,
    entity,
    onOk,
}) => {
    const formRef = useRef<FormInstance>();
    const { fetchData: updateData } = useHttp(smsServiceUpdate);
    const title = '编辑渠道';

    const onFinish = useCallback(
        async (values: FormProps) => {
            const res = await updateData({
                ...values,
                support_region: values.support_region?.join(','),
                service_id: entity?.service_id,
            });
            if (res.code === 10000) {
                message.success('操作成功!');
                onOk?.();
                return true;
            }
            return Promise.reject(false);
        },
        [entity?.service_id, onOk, updateData],
    );

    return (
        <ModalForm<FormProps>
            trigger={trigger}
            title={title}
            formRef={formRef}
            onVisibleChange={() => formRef?.current?.resetFields()}
            onFinish={onFinish}
        >
            <Row gutter={[50, 0]}>
                <Col span={12}>
                    <ProFormText
                        name={'service_name'}
                        label={'渠道名称'}
                        initialValue={entity?.service_name}
                        rules={[
                            {
                                required: true,
                                message: '请输入渠道名称',
                            },
                        ]}
                        placeholder={'请输入渠道名称'}
                        fieldProps={{
                            maxLength: 15,
                        }}
                        disabled={!!entity?.service_id}
                    />
                </Col>
                <Col span={12}>
                    <ProFormRadio.Group
                        name={'service_status'}
                        label={'线路类型'}
                        options={smsLineTypes}
                        initialValue={entity?.service_status}
                        rules={[
                            {
                                required: true,
                                message: '请选择线路类型',
                            },
                        ]}
                        disabled={entity?.service_status === 1} // 主线不能切换为副线
                    />
                </Col>
                <Col span={12}>
                    <ProFormSelect
                        mode={'multiple'}
                        name={'support_region'}
                        label={'支持国家区号'}
                        options={countries.map((a) => ({
                            value: a.tel,
                            label: a.name,
                        }))}
                        initialValue={entity?.support_region?.split(',')}
                        rules={[
                            {
                                required: true,
                                message: '请选择支持国家',
                            },
                        ]}
                    />
                </Col>
                <Col span={12}>
                    <ProFormRadio.Group
                        name={'status'}
                        label={'是否启用'}
                        disabled={
                            entity?.service_status === 1 && entity?.status === 1
                        } // 主线不能切换为副线
                        options={statusOptions}
                        initialValue={entity?.status}
                        rules={[
                            {
                                required: true,
                                message: '请选择是否启用',
                            },
                        ]}
                    />
                </Col>
                <Col span={24}>
                    <ProFormTextArea
                        name={'remark'}
                        label={'备注'}
                        initialValue={entity?.remark}
                        placeholder={'请输入备注内容'}
                        fieldProps={{
                            rows: 6,
                            maxLength: 250,
                        }}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default SmsServiceModalForm;
