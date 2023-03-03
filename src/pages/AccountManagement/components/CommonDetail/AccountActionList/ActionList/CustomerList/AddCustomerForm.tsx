import React, { FC, useState } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message, Row, Col, Input } from 'antd';
import { countries } from '@/common/countryPhone';
import UpLoadImage from '@/components/UpLoadImage';
import { useHttp, useLatest } from '@/hooks';
import { createClient, updateClient } from '@/api/accountAction';
import {
    CreateClientParams,
    ClientListItem,
    UpdateClientParams,
} from '@/types/api/accountAction';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { certificateType, genderType } from '@/common/commonConstType';
import { checkFormItemValue } from '@/common/commonHandle';
import AuthButton from '@/components/AuthButton';

type AddCustomerFormProps = {
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: ClientListItem;
};

const AddCustomerForm: FC<AddCustomerFormProps> = ({
    type,
    record,
    reloadData,
}) => {
    const customerTitle: Record<string, string> = {
        add: '新增客户',
        edit: '编辑客户',
        detail: '客户详情',
    };
    const accountInfo = useAppSelector(selectAccountInfo);
    const [isPass, setIsPass] = useState(false); //操作码是否通过

    const updatedValues = useLatest({
        client_name: record?.client_name,
        gender: checkFormItemValue(record?.gender ?? 0),
        areaCode: checkFormItemValue(record?.telephone?.split('-')?.[0] ?? 0),
        telephone: record?.telephone?.split('-')?.[1],
        certificate_type: checkFormItemValue(record?.certificate_type ?? 0),
        certificate_number: record?.certificate_number,
        remark: record?.remark,
        photo: record?.photo
            ? [
                  {
                      photo: record?.photo,
                  },
              ]
            : undefined,
    }).current;

    const { fetchData: _fetchCreateClient } = useHttp<CreateClientParams, null>(
        createClient,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const { fetchData: _fetchUpdateClient } = useHttp<UpdateClientParams, null>(
        updateClient,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const handleCustomer = (values: any) => {
        const commonParams = {
            client_name: values.client_name,
            gender: values.gender,
            telephone: values.areaCode + '-' + values.telephone,
            certificate_type: values.certificate_type,
            certificate_number: values.certificate_number,
            photo: values?.photo
                ? values?.photo[0]?.photo || values?.photo[0]?.response?.photo
                : undefined,
            remark: values.remark,
        };
        if (type === 'add') {
            return _fetchCreateClient({
                ...commonParams,
                member_id: accountInfo.member_id,
            });
        } else if (type === 'edit') {
            return _fetchUpdateClient({
                ...commonParams,
                id: record?.client_id ?? '',
            });
        }
    };
    return (
        <div>
            <ModalForm
                trigger={
                    type === 'add' ? (
                        <Button
                            onClick={() => {
                                setIsPass(true);
                            }}
                            type="primary"
                        >
                            新增
                        </Button>
                    ) : (
                        <AuthButton
                            normal="customerAccount-customer-edit"
                            verify={(pass) => {
                                setIsPass(pass);
                            }}
                            buttonProps={{
                                type: 'link',
                            }}
                        ></AuthButton>
                    )
                }
                onFinish={async (values: any) => {
                    const res = await handleCustomer(values);
                    if (res?.code === 10000) {
                        setIsPass(false);
                    }
                }}
                title={customerTitle[type]}
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
                <Row wrap={false}>
                    <Col span={12}>
                        <ProFormText
                            width="md"
                            name="client_name"
                            label="客户名"
                            placeholder="请输入客户名"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入客户名',
                                },
                            ]}
                        />
                        <ProFormSelect
                            name="gender"
                            label="客户性别"
                            width="md"
                            options={genderType}
                            placeholder="请选择客户性别"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择客户性别',
                                },
                            ]}
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                            }}
                            showSearch
                        />
                        <ProForm.Item label="联系方式" required>
                            <Input.Group compact>
                                <ProFormSelect
                                    name="areaCode"
                                    width={100}
                                    options={countries.map((item) => {
                                        return {
                                            label: item.tel,
                                            value: item.tel,
                                        };
                                    })}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择国际区号',
                                        },
                                    ]}
                                    fieldProps={{
                                        getPopupContainer: (triggerNode) =>
                                            triggerNode.parentNode,
                                    }}
                                    placeholder="国际区号"
                                    showSearch
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
                                    ]}
                                />
                            </Input.Group>
                        </ProForm.Item>
                        <ProFormSelect
                            name="certificate_type"
                            label="证件类型"
                            width="md"
                            options={certificateType}
                            placeholder="请选择证件类型"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择证件类型',
                                },
                            ]}
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                            }}
                            showSearch
                        />
                        <ProFormText
                            width="md"
                            name="certificate_number"
                            label="证件号"
                            placeholder="请输入证件号"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入证件号',
                                },
                            ]}
                        />
                        <ProFormTextArea
                            name="remark"
                            label="备注"
                            width="md"
                            placeholder="请输入备注"
                            fieldProps={{
                                maxLength: 100,
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <UpLoadImage
                            label="证件"
                            name="photo"
                            max={1}
                            initialValue={
                                record?.photo
                                    ? [
                                          {
                                              photo: record?.photo,
                                          },
                                      ]
                                    : undefined
                            }
                        ></UpLoadImage>
                    </Col>
                </Row>
            </ModalForm>
        </div>
    );
};

export default AddCustomerForm;
