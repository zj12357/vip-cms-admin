import React, { FC, useState, useRef } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Button, message, Descriptions } from 'antd';
import { useHttp } from '@/hooks';
import { createCompanyMember, getAccountIsExist } from '@/api/account';
import {
    CreateCompanyMemberParams,
    AccountIsExistParams,
} from '@/types/api/account';
import { isInteger } from '@/utils/validate';
import AuthButton from '@/components/AuthButton';
import _ from 'lodash';

type AddCompanyProps = {};

const AddCompany: FC<AddCompanyProps> = (props) => {
    const formRef = useRef<ProFormInstance>();
    const [isExistAccount, setIsExistAccount] = useState<boolean>(false);
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const { fetchData: _fetchCreateCompanyMember } = useHttp<
        CreateCompanyMemberParams,
        null
    >(createCompanyMember, ({ msg }) => {
        message.success(msg);
    });

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

    const handleCreateCompanyMember = async (values: any) => {
        const params = {
            member_code: 'OK' + values.member_code,
            member_name: values.member_name,
            remark: values.remark,
        };
        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchCreateCompanyMember(doubleParams);

        if (res.code === 10000) {
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
            resetState();
        }
    };
    const resetState = () => {
        setIsExistAccount(false);
    };

    return (
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
            onFinish={handleCreateCompanyMember}
            title="新增公司户口"
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
                    resetState();
                },
            }}
            visible={isPass}
            formRef={formRef}
        >
            <ProForm.Group>
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
                                    return Promise.reject('该账户已经存在！');
                                } else {
                                    return true;
                                }
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
                    label="户口类型"
                    name="member_type"
                    initialValue="公司户口"
                    disabled
                />
            </ProForm.Group>
            <ProForm.Group>
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
            </ProForm.Group>
            <ProFormTextArea
                name="remark"
                label="备注"
                width="md"
                placeholder="请输入备注"
            />
        </ModalForm>
    );
};

export default AddCompany;
