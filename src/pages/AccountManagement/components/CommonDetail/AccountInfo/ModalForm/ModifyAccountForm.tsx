import React, { FC, useState } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormRadio,
    ProFormList,
    ProFormDateRangePicker,
    ProFormDatePicker,
    ProFormCheckbox,
    ProFormSwitch,
    ProFormCascader,
} from '@ant-design/pro-components';
import { Button, message, Input, Row, Col, Divider, Descriptions } from 'antd';
import moment from 'moment';
import { countries } from '@/common/countryPhone';
import UpLoadImage from '@/components/UpLoadImage';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { updateAccount, getMemberIdentityList } from '@/api/account';
import {
    UpdateAccountParams,
    GetMemberIdentityListItem,
    GetMemberIdentityParams,
} from '@/types/api/account';
import { useHttp, useLatest } from '@/hooks';
import {
    certificateType,
    phoneLanguageType,
    phoneMethodType,
    genderType,
} from '@/common/commonConstType';
import { selectCurrentHall } from '@/store/common/commonSlice';
import { getMemberTypeList, getDepartMemberList } from '@/api/system';
import { MemberTypeListItem, DepartMemberListItem } from '@/types/api/system';
import { checkFormItemValue } from '@/common/commonHandle';
import { isInteger } from '@/utils/validate';
import { useGetAccountInfo } from '@/pages/AccountManagement/common';
import { transTableData } from '@/pages/AccountManagement/common';
import AuthButton from '@/components/AuthButton';
import _ from 'lodash';

type ModifyAccountFormProps = {};

const ModifyAccountForm: FC<ModifyAccountFormProps> = (props) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const [memberTypeName, setMemberTypeName] = useState<string>();
    const [identityTypeeName, setIdentityTypeName] = useState<string>();
    const currentHall = useAppSelector(selectCurrentHall);
    const callback = useGetAccountInfo();
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const { fetchData: _fetchUpdateAccount } = useHttp<
        UpdateAccountParams,
        null
    >(updateAccount, ({ msg }) => {
        message.success(msg);
        callback();
    });

    //获取户口类型
    const { fetchData: _fetchGetMemberTypeList } = useHttp<
        null,
        MemberTypeListItem[]
    >(getMemberTypeList);

    //获取户口身份
    const { fetchData: _fetchMemberIdentityList } = useHttp<
        GetMemberIdentityParams,
        GetMemberIdentityListItem[]
    >(getMemberIdentityList);

    //获取员工
    const { fetchData: _fetchDepartMemberList } = useHttp<
        null,
        DepartMemberListItem[]
    >(getDepartMemberList);

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        member_type: checkFormItemValue(accountInfo.member_type),
        name: accountInfo.name,
        gender: checkFormItemValue(accountInfo.gender),
        birthday: checkFormItemValue(accountInfo.birthday)
            ? moment.unix(accountInfo.birthday).valueOf()
            : undefined,
        country: checkFormItemValue(accountInfo.country),
        address: accountInfo.address,
        telephone_list: checkFormItemValue(
            accountInfo.telephone_list?.map((item) => {
                return {
                    area_code: item?.telephone?.split('-')?.[0],
                    telephone: item?.telephone?.split('-')?.[1],
                    sending_method: item?.sending_method
                        ?.split(',')
                        ?.map((t) => +t),
                    language: item?.language,
                    phone_id: item?.phone_id,
                };
            }) ?? [],
        ),
        parent_member_code: accountInfo.parent_member_code,
        parent_member_name: accountInfo.parent_member_name,
        identity: checkFormItemValue(accountInfo.identity),
        customer_assistant: checkFormItemValue(accountInfo.customer_assistant)
            ?.toString()
            ?.split('-'),
        grade_list: checkFormItemValue(
            accountInfo.grade_list?.map((item) => {
                return {
                    certificate_type: item?.certificate_type,
                    certificate_number: item?.certificate_number,
                    certificate_name: item?.certificate_name,
                    certificate_validity: item?.certificate_validity?.map((v) =>
                        moment.unix(+v).valueOf(),
                    ),
                    certificate_id: item?.certificate_id,
                };
            }) ?? [],
        ),
        photo_list: accountInfo.photo_list ?? [],
        online_transfer: accountInfo.online_transfer,
    }).current;

    const handleUpdateAccount = async (values: any) => {
        const params = {
            ...values,
            member_id: accountInfo.member_id,
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
            customer_assistant: values.customer_assistant?.join('-'),
            hall_id: currentHall.id,
            hall_name: currentHall.hall_name,
            member_type_name: memberTypeName,
            identity_name: identityTypeeName,
        };
        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchUpdateAccount(doubleParams);
        if (res.code === 10000) {
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
            _.delay(() => {
                window.location.reload();
            }, 300);
        }
    };

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        buttonProps={{
                            type: 'primary',
                        }}
                        normal="customerAccount-modifyData"
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        firstVisible={isPass}
                        isSecond={true}
                        secondDom="请确定是否要修改资料"
                        secondVerify={(val) => {
                            if (val) {
                                handleDoubleSuccess();
                            }
                        }}
                        secondVisible={doubleVisible}
                        secondOnClose={() => setDoubleVisible(false)}
                    ></AuthButton>
                }
                onFinish={handleUpdateAccount}
                title="修改资料"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    minWidth: '1100px',
                }}
                width={1200}
                initialValues={updatedValues}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setIsPass(false);
                        setDoubleVisible(false);
                        setDoubleParams({});
                    },
                }}
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
                        <ProFormSelect
                            name="member_type"
                            label="户口类型"
                            width="md"
                            placeholder="请选择户口类型"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择户口类型',
                                },
                            ]}
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                                fieldNames: {
                                    label: 'name',
                                    value: 'member_type_id',
                                },
                                onChange: (_, option: any) => {
                                    setMemberTypeName(option?.label);
                                },
                            }}
                            showSearch
                            request={async () => {
                                const res = await _fetchGetMemberTypeList();
                                return res.data;
                            }}
                        />
                        <ProFormText
                            width="md"
                            name="name"
                            label="姓名"
                            placeholder="请输入姓名"
                        />
                        <ProFormSelect
                            name="gender"
                            label="性别"
                            width="md"
                            options={genderType}
                            placeholder="请选择性别"
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                            }}
                            showSearch
                        />
                        <ProFormDatePicker
                            width="md"
                            name="birthday"
                            label="生日"
                            placeholder="请选择生日"
                            transform={(value) => {
                                return {
                                    birthday: moment(value).unix(),
                                };
                            }}
                        />
                        <ProFormSelect
                            name="country"
                            label="国籍"
                            width="md"
                            options={countries.map((item) => {
                                return {
                                    label: item.name,
                                    value: item.name,
                                };
                            })}
                            placeholder="请选择国籍"
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                            }}
                            showSearch
                        />
                        <ProFormText
                            width="md"
                            name="address"
                            label="地址"
                            placeholder="请输入地址"
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
                                <div
                                    style={{
                                        display: 'none',
                                    }}
                                >
                                    <ProFormText width="md" name="phone_id" />
                                </div>
                            </ProForm.Group>
                        </ProFormList>
                    </Col>
                    <Col span={9}>
                        <ProFormText
                            width="md"
                            name="parent_member_code"
                            label="上线户口"
                        />
                        <ProFormText
                            width="md"
                            name="parent_member_name"
                            label="上线户名"
                        />
                        <ProFormSelect
                            name="identity"
                            label="身份"
                            width="md"
                            placeholder="请选择身份"
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                                fieldNames: {
                                    label: 'name',
                                    value: 'member_identity_id',
                                },
                                onChange: (_, option: any) => {
                                    setIdentityTypeName(option?.label);
                                },
                            }}
                            request={async () => {
                                const res = await _fetchMemberIdentityList();
                                return res.data;
                            }}
                            showSearch
                        />
                        <ProFormCascader
                            name="customer_assistant"
                            label="客户助理"
                            width="md"
                            request={async () => {
                                const res = await _fetchDepartMemberList();
                                return transTableData(res.data, 'admins') ?? [];
                            }}
                            placeholder="请选择客户助理"
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                                fieldNames: {
                                    label: 'depart_name',
                                    value: 'depart_name',
                                },
                            }}
                        />
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
                                label="证件号"
                                placeholder="请输入证件号"
                            />
                            <ProFormText
                                width="md"
                                name="certificate_name"
                                label="证件名"
                                placeholder="请输入证件名"
                            />
                            <ProFormDateRangePicker
                                name="certificate_validity"
                                label="证件有效期"
                                width="md"
                                placeholder={['开始日期', '结束日期']}
                            />
                            <div
                                style={{
                                    display: 'none',
                                }}
                            >
                                <ProFormText width="md" name="certificate_id" />
                            </div>
                        </ProFormList>
                    </Col>
                    <Col span={6}>
                        <UpLoadImage
                            label="照片"
                            name="photo_list"
                            initialValue={accountInfo?.photo_list ?? []}
                            max={5}
                        ></UpLoadImage>
                        <ProFormSwitch
                            width="md"
                            name="online_transfer"
                            label="线上转账"
                            transform={(value) => {
                                return {
                                    online_transfer: value ? 1 : 0,
                                };
                            }}
                        ></ProFormSwitch>
                    </Col>
                </Row>
            </ModalForm>
        </div>
    );
};

export default ModifyAccountForm;
