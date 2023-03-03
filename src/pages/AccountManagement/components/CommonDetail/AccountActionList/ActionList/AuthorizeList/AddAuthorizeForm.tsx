import React, { FC, useState, useRef } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormCheckbox,
    ProFormDatePicker,
    ProFormDateRangePicker,
    ProFormList,
    ProFormRadio,
} from '@ant-design/pro-components';
import { Button, message, Row, Col, Input, Divider, Descriptions } from 'antd';
import UpLoadImage from '@/components/UpLoadImage';
import { countries } from '@/common/countryPhone';
import { useHttp, useLatest } from '@/hooks';
import { createAuthorizer, updateAuthorizer } from '@/api/accountAction';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
    CreateAuthorizerParams,
    AuthorizerListItem,
    UpdateAuthorizerParams,
} from '@/types/api/accountAction';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import {
    certificateType,
    authorizePermissionType,
    phoneLanguageType,
    phoneMethodType,
    genderType,
} from '@/common/commonConstType';
import moment from 'moment';
import { isInteger } from '@/utils/validate';
import VerifierPassword from '@/pages/AccountManagement/components/VerifierPassword';
import { checkFormItemValue } from '@/common/commonHandle';
import AuthButton from '@/components/AuthButton';

type AddAuthorizerFormProps = {
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: AuthorizerListItem;
};

const AddAuthorizerForm: FC<AddAuthorizerFormProps> = ({
    type,
    reloadData,
    record,
}) => {
    const formRef = useRef<ProFormInstance>();
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const accountInfo = useAppSelector(selectAccountInfo);
    const authorizerTitle: Record<string, string> = {
        add: '新增授权人',
        edit: '编辑授权人',
    };

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        authorizer_name: record?.authorizer_name,
        gender: checkFormItemValue(record?.gender ?? 0),
        birthday: checkFormItemValue(record?.birthday ?? 0),
        country: checkFormItemValue(record?.country ?? ''),
        address: record?.address,
        telephone_list: checkFormItemValue(record?.telephone_list ?? []),
        grade_list: checkFormItemValue(record?.grade_list ?? []),
        permission: record?.permission,
        other: record?.other,
        photo_list: checkFormItemValue(record?.photo_list ?? []),
    }).current;

    const { fetchData: _fetchCreateAuthorizer } = useHttp<
        CreateAuthorizerParams,
        null
    >(createAuthorizer, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const { fetchData: _fetchUpdateAuthorizer } = useHttp<
        UpdateAuthorizerParams,
        null
    >(updateAuthorizer, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const handleAuthorizer = async (values: any) => {
        const commonParams = {
            authorizer_name: values.authorizer_name,
            gender: values.gender,
            birthday: values.birthday,
            country: values.country,
            address: values.address,
            verify_name: values.verify_name,
            verify_password: values.verify_password,
            permission: values.permission,
            other: values.other,
            telephone_list: values?.telephone_list?.some(
                (item: any) => Object.values(item).length > 0,
            )
                ? values?.telephone_list?.map((item: any) => {
                      return {
                          telephone: item?.area_code + '-' + item?.telephone,
                          sending_method: item?.sending_method,
                          language: item?.language,
                          phone_id: item?.phone_id,
                      };
                  })
                : undefined,
            grade_list: values?.grade_list?.some(
                (item: any) => Object.values(item).length > 0,
            )
                ? values?.grade_list?.map((item: any) => {
                      return {
                          ...item,
                          certificate_validity: item?.certificate_validity
                              ? [
                                    moment(
                                        item?.certificate_validity?.[0],
                                    ).unix(),
                                    moment(
                                        item?.certificate_validity?.[1],
                                    ).unix(),
                                ]
                              : undefined,
                      };
                  })
                : undefined,
            photo_list: values?.photo_list?.some(
                (item: any) => Object.values(item).length > 0,
            )
                ? values?.photo_list?.map((item: any) => {
                      return {
                          photo: item.photo || (item?.response?.photo ?? ''),
                      };
                  })
                : undefined,
        };
        if (type === 'add') {
            setDoubleParams({
                member_id: accountInfo.member_id,
                ...commonParams,
            });
        } else if (type === 'edit') {
            setDoubleParams({
                authorizer_id: record?.authorizer_id ?? '',
                ...commonParams,
            });
        }

        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        let res: any;
        if (type === 'add') {
            res = await _fetchCreateAuthorizer(doubleParams);
        } else if (type === 'edit') {
            res = await _fetchUpdateAuthorizer(doubleParams);
        }

        if (res.code === 10000) {
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
        }
    };

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal={
                            type === 'add'
                                ? 'customerAccount-authorizer-add'
                                : 'customerAccount-authorizer-edit'
                        }
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        buttonProps={{
                            type: type === 'add' ? 'primary' : 'link',
                        }}
                        firstVisible={isPass}
                        isSecond={true}
                        secondDom={
                            <Descriptions column={24}>
                                <Descriptions.Item label="授权人姓名" span={12}>
                                    {doubleParams?.authorizer_name}
                                </Descriptions.Item>

                                {doubleParams?.telephone_list?.length && (
                                    <>
                                        <Descriptions.Item
                                            label="手机号"
                                            span={12}
                                        >
                                            <div>
                                                {doubleParams?.telephone_list?.map(
                                                    (
                                                        item: any,
                                                        index: number,
                                                    ) => (
                                                        <div key={index}>
                                                            {item?.telephone}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </Descriptions.Item>
                                    </>
                                )}
                                <Descriptions.Item label="授权人权限" span={12}>
                                    {authorizePermissionType
                                        .filter((item) =>
                                            doubleParams?.permission?.includes(
                                                item.value,
                                            ),
                                        )
                                        ?.map((v) => v.label)
                                        ?.join(',')}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        secondVerify={(val) => {
                            if (val) {
                                handleDoubleSuccess();
                            }
                        }}
                        secondVisible={doubleVisible}
                        secondOnClose={() => setDoubleVisible(false)}
                    ></AuthButton>
                }
                onFinish={handleAuthorizer}
                title={authorizerTitle[type]}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setIsPass(false);
                        setDoubleVisible(false);
                        setDoubleParams({});
                    },
                }}
                width={1200}
                initialValues={updatedValues}
                formRef={formRef}
                visible={isPass}
            >
                <Row wrap={false}>
                    <Col span={9}>
                        <ProFormText
                            width="md"
                            name="member_code"
                            label="户口"
                            disabled
                        />
                        <ProFormText
                            width="md"
                            name="member_name"
                            label="户名"
                            disabled
                        />
                        <ProFormText
                            width="md"
                            name="authorizer_name"
                            label="授权人姓名"
                            placeholder="请输入授权人姓名"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入授权人姓名',
                                },
                            ]}
                        />
                        <ProFormSelect
                            name="gender"
                            label="授权人性别"
                            width="md"
                            options={genderType}
                            placeholder="请选择授权人性别"
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                            }}
                            showSearch
                        />
                        <ProFormDatePicker
                            name="birthday"
                            label="授权人生日"
                            width="md"
                            placeholder="请选择授权人生日"
                            fieldProps={{
                                getPopupContainer: (triggerNode) => triggerNode,
                            }}
                            transform={(val) => {
                                return {
                                    birthday: moment(val).unix(),
                                };
                            }}
                        />
                        <ProFormSelect
                            name="country"
                            label="授权人国籍"
                            width="md"
                            options={countries.map((item) => {
                                return {
                                    label: item.name,
                                    value: item.name,
                                };
                            })}
                            placeholder="请选择授权人国籍"
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                            }}
                            showSearch
                        />
                        <ProFormText
                            width="md"
                            name="address"
                            label="授权人地址"
                            placeholder="请输入授权人地址"
                        />
                        <ProFormList
                            name="telephone_list"
                            label="联系方式"
                            style={{
                                width: '360px',
                            }}
                            alwaysShowItemLabel
                        >
                            <Divider dashed plain>
                                联系方式
                            </Divider>
                            <ProForm.Group>
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
                                        label="国际区号"
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
                                        label="手机号码"
                                    />
                                </Input.Group>
                                <ProFormCheckbox.Group
                                    name="sending_method"
                                    options={phoneMethodType}
                                    width="md"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择类型',
                                        },
                                    ]}
                                    label="类型"
                                />

                                <ProFormRadio.Group
                                    name="language"
                                    layout="horizontal"
                                    width="md"
                                    options={phoneLanguageType}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择语言',
                                        },
                                    ]}
                                    label="语言"
                                />
                            </ProForm.Group>
                        </ProFormList>
                    </Col>
                    <Col span={9}>
                        <ProFormList
                            name="grade_list"
                            style={{
                                width: '360px',
                            }}
                            alwaysShowItemLabel
                            label="证件信息"
                        >
                            <Divider dashed plain>
                                证件信息
                            </Divider>
                            <ProForm.Group>
                                <ProFormSelect
                                    name="certificate_type"
                                    label="证件类型"
                                    width="md"
                                    options={certificateType}
                                    placeholder="请选择证件类型"
                                    fieldProps={{
                                        getPopupContainer: (triggerNode) =>
                                            triggerNode.parentNode,
                                    }}
                                    showSearch
                                />
                                <ProFormText
                                    width="md"
                                    name="certificate_number"
                                    label="授权人证件号码"
                                    placeholder="请输入授权人证件号码"
                                />
                                <ProFormText
                                    width="md"
                                    name="certificate_name"
                                    label="授权人证件姓名"
                                    placeholder="请输入授权人证件姓名"
                                />
                                <ProFormDateRangePicker
                                    name="certificate_validity"
                                    label="授权人证件有效期"
                                    width="md"
                                    placeholder={['开始日期', '结束日期']}
                                />
                            </ProForm.Group>
                        </ProFormList>
                        <ProFormCheckbox.Group
                            name="permission"
                            layout="horizontal"
                            width="md"
                            label="授权人权限"
                            options={authorizePermissionType}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择授权人权限',
                                },
                            ]}
                        />
                        <ProFormText
                            width="md"
                            name="other"
                            label="授权人其他权限"
                            placeholder="请输入授权人其他权限"
                        />
                    </Col>
                    <Col span={6}>
                        <UpLoadImage
                            label="照片"
                            name="photo_list"
                            initialValue={record?.photo_list ?? []}
                            max={5}
                        ></UpLoadImage>
                    </Col>
                </Row>
            </ModalForm>
        </div>
    );
};

export default AddAuthorizerForm;
