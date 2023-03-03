import React, { useCallback, useRef } from 'react';
import { FormInstance } from 'antd/es';
import {
    ModalForm,
    ProFormText,
    ProFormRadio,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { SmsTemplateProps } from '@/types/api/communication';
import { Col, message, Row } from 'antd';
import { useHttp } from '@/hooks';
import { SmsTemplateUpdate, SmsTemplateAdd } from '@/api/communication';
import {
    languages,
    statusOptions,
    templateTypes,
    TemplateNames,
    addTemplateTypes,
} from '@/pages/Communication/SMS/common';

interface SmsTemplateModalFormProps {
    trigger: JSX.Element;
    entity?: SmsTemplateProps;
    onOk?: () => void;
    type: 'add' | 'edit';
}

const SmsTemplateModalForm: React.FC<SmsTemplateModalFormProps> = ({
    trigger,
    entity,
    onOk,
    type,
}) => {
    const formRef = useRef<FormInstance>();
    const { fetchData: updateData } = useHttp(SmsTemplateUpdate);
    const { fetchData: addData } = useHttp(SmsTemplateAdd);
    const title = '编辑模板';

    const onFinish = useCallback(
        async (values: any) => {
            let res: any;
            if (type === 'add') {
                res = await addData({
                    ...values,
                });
            } else if (type === 'edit') {
                res = await updateData({
                    ...values,
                    template_id: entity?.template_id,
                });
            }
            if (res.code === 10000) {
                message.success('操作成功!');
                onOk?.();
                return true;
            }
            return Promise.reject(false);
        },
        [addData, entity?.template_id, onOk, type, updateData],
    );

    const templateNameDisabled = (template_type: string) => {
        if (template_type === 'market') {
            return false;
        }
        if (type === 'edit') {
            return true;
        }
        return false;
    };

    return (
        <ModalForm<SmsTemplateProps>
            trigger={trigger}
            title={title}
            formRef={formRef}
            onVisibleChange={() => formRef?.current?.resetFields()}
            onFinish={onFinish}
        >
            <Row gutter={[50, 0]}>
                <Col span={12}>
                    <ProFormSelect
                        name={'language'}
                        label={'所属语言'}
                        options={languages}
                        disabled={type === 'edit'}
                        initialValue={entity?.language}
                    />
                </Col>
                <Col span={12}>
                    <ProFormSelect
                        name={'template_name'}
                        label={'模版名称'}
                        initialValue={entity?.template_name}
                        options={TemplateNames}
                        disabled={templateNameDisabled(
                            entity?.template_type ?? '',
                        )}
                        fieldProps={{
                            maxLength: 15,
                        }}
                    />
                </Col>
                <Col span={12}>
                    <ProFormRadio.Group
                        name={'template_type'}
                        label={'模版类型'}
                        options={
                            type === 'add' ? addTemplateTypes : templateTypes
                        }
                        initialValue={
                            type === 'edit' ? entity?.template_type : 'market'
                        }
                        rules={[
                            {
                                required: true,
                                message: '请选择模版类型',
                            },
                        ]}
                        disabled={type === 'edit'}
                    />
                </Col>
                <Col span={12}>
                    <ProFormRadio.Group
                        name={'template_status'}
                        label={'是否启用'}
                        options={statusOptions}
                        initialValue={entity?.template_status}
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
                        name={'template_content'}
                        label={'模版内容'}
                        initialValue={entity?.template_content}
                        placeholder={'请输入模版内容'}
                        fieldProps={{
                            rows: 6,
                            maxLength: 500,
                        }}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default SmsTemplateModalForm;
