import React, { FC, useState, useRef, useEffect } from 'react';
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
import type { ProFormInstance } from '@ant-design/pro-components';
import { Button, message, Input, Row, Col, Divider, Descriptions } from 'antd';
import { countries } from '@/common/countryPhone';
import { useHttp } from '@/hooks';
import UpLoadImage from '@/components/UpLoadImage';
import {
    createAccount,
    getAccountIsExist,
    getMemberByCode,
    getMemberIdentityList,
} from '@/api/account';
import {
    CreateAccountParams,
    AccountIsExistParams,
    MemberByCodeItem,
    GetMemberIdentityListItem,
    GetMemberIdentityParams,
} from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentHall } from '@/store/common/commonSlice';
import {
    certificateType,
    phoneLanguageType,
    phoneMethodType,
    genderType,
} from '@/common/commonConstType';
import { getMemberTypeList, getDepartMemberList } from '@/api/system';
import { MemberTypeListItem, DepartMemberListItem } from '@/types/api/system';
import moment from 'moment';
import _ from 'lodash';
import { isInteger } from '@/utils/validate';
import { transTableData } from '@/pages/AccountManagement/common';
import AuthButton from '@/components/AuthButton';

type AddCustomerProps = {};

const AddCustomer: FC<AddCustomerProps> = (props) => {
    const formRef = useRef<ProFormInstance>();
    const [isExistAccount, setIsExistAccount] = useState<boolean>(false);
    const [memberTypeName, setMemberTypeName] = useState<string>();
    const [identityTypeeName, setIdentityTypeName] = useState<string>();
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const { fetchData: _fetchCreateAccount } = useHttp<
        CreateAccountParams,
        null
    >(createAccount, ({ msg }) => {
        message.success(msg);
    });
    const currentHall = useAppSelector(selectCurrentHall);

    //获取户口类型
    const { fetchData: _fetchMemberTypeList } = useHttp<
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

    const { fetchData: _fetchGetMemberByCode, response: memberList } = useHttp<
        string,
        MemberByCodeItem[]
    >(getMemberByCode);

    const { fetchData: _fetchAccountList } = useHttp<
        AccountIsExistParams,
        boolean
    >(getAccountIsExist, ({ data }) => {
        setIsExistAccount(data);
        formRef.current?.validateFields(['member_code']);
    });

    //获取账户是否存在
    const fetchAccountList = (event: React.ChangeEvent<HTMLInputElement>) => {
        debounceSetText(event);
    };
    //搜索防抖
    const debounceSetText = _.debounce(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            _fetchAccountList({ member_code: 'OK' + event.target.value });
        },
        200,
    );

    const handleCreateAccount = async (values: any) => {
        const newValues = {
            ...values,
            member_code: 'OK' + values.member_code,
            telephone_list: values?.telephone_list
                ? values?.telephone_list?.map((item: any) => {
                      return {
                          telephone: item?.area_code + '-' + item?.telephone,
                          sending_method: item?.sending_method,
                          language: item?.language,
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
            photo_list: values?.photo_list
                ? values?.photo_list?.map((item: any) => {
                      return {
                          photo: item?.response?.photo ?? '',
                      };
                  })
                : undefined,
            customer_assistant: values.customer_assistant?.join('-'),
            hall_id: currentHall.id,
            hall_name: currentHall.hall_name,
            member_type_name: memberTypeName,
            identity_name: identityTypeeName,
        };

        setDoubleParams(newValues);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchCreateAccount(doubleParams);

        if (res.code === 10000) {
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
        }
    };

    useEffect(() => {
        if (!isPass) {
            setIsExistAccount(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPass]);
    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal="customer-add"
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        buttonProps={{
                            type: 'primary',
                        }}
                        firstVisible={isPass}
                        isSecond={true}
                        secondDom={
                            <Descriptions column={24}>
                                <Descriptions.Item label="户口号" span={12}>
                                    {doubleParams?.member_code}
                                </Descriptions.Item>
                                <Descriptions.Item label="户口名" span={12}>
                                    {doubleParams?.member_name}
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
                onFinish={handleCreateAccount}
                title="新增户口"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                width={1200}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setIsPass(false);
                        setDoubleVisible(false);
                        setDoubleParams({});
                    },
                }}
                formRef={formRef}
                visible={isPass}
            >
                <Row wrap={false}>
                    <Col span={9}>
                        <ProFormText
                            width="md"
                            name="member_code"
                            label="户口"
                            placeholder="请输入户口"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入户口',
                                },
                                {
                                    pattern: isInteger,
                                    message: '请输入数字',
                                },
                                {
                                    validator: async (rules, value) => {
                                        if (isExistAccount) {
                                            return Promise.reject(
                                                '该账户已经存在！',
                                            );
                                        }
                                        return true;
                                    },
                                },
                            ]}
                            fieldProps={{
                                onChange: fetchAccountList,
                                maxLength: 20,
                                addonBefore: 'OK',
                            }}
                        />
                        <ProFormText
                            width="md"
                            name="member_name"
                            label="户名"
                            placeholder="请输入户名"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入户名',
                                },
                            ]}
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
                                const res = await _fetchMemberTypeList();
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
                            </ProForm.Group>
                        </ProFormList>
                    </Col>
                    <Col span={9}>
                        <ProForm.Group>
                            <ProFormSelect
                                width="md"
                                name="parent_member_code"
                                label="上级户口"
                                placeholder="请输入上级户口"
                                showSearch
                                fieldProps={{
                                    getPopupContainer: (triggerNode) =>
                                        triggerNode.parentNode,
                                    onChange: (val: string, option: any) => {
                                        formRef.current?.setFieldsValue({
                                            parent_member_name:
                                                memberList?.find(
                                                    (item) =>
                                                        item.member_code ===
                                                        val,
                                                )?.member_name,
                                        });
                                    },
                                }}
                                request={async ({ keyWords }) => {
                                    if (keyWords) {
                                        const res = await _fetchGetMemberByCode(
                                            keyWords,
                                        );

                                        const memberList = (
                                            res.data ?? []
                                        )?.map((item) => {
                                            return {
                                                label: item.member_code,
                                                value: item.member_code,
                                            };
                                        });

                                        return memberList;
                                    } else {
                                        return [];
                                    }
                                }}
                                debounceTime={500}
                            />
                            <ProFormText
                                width="md"
                                name="parent_member_name"
                                label="上级户名"
                                placeholder=""
                                disabled
                            />
                        </ProForm.Group>
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
                            showSearch
                            request={async () => {
                                const res = await _fetchMemberIdentityList();
                                return res.data;
                            }}
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
                        </ProFormList>
                    </Col>
                    <Col span={6}>
                        <UpLoadImage
                            label="照片"
                            name="photo_list"
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

export default AddCustomer;
