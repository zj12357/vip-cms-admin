import React, { FC, useState } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { updateCompanyAccount } from '@/api/account';
import { UpdateCompanyAccountParams } from '@/types/api/account';
import { useGetCompanyInfo } from '@/pages/AccountManagement/common';
import AuthButton from '@/components/AuthButton';
import _ from 'lodash';

type ModifyCompanyFormProps = {};

const ModifyCompanyForm: FC<ModifyCompanyFormProps> = (props) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const callback = useGetCompanyInfo();
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        remark: accountInfo.remark,
    }).current;

    const { fetchData: _fetchUpdateCompanyAccount } = useHttp<
        UpdateCompanyAccountParams,
        null
    >(updateCompanyAccount, ({ msg }) => {
        message.success(msg);
        callback();
    });

    const handleUpdateCompanyAccount = async (values: any) => {
        const params = {
            member_id: accountInfo.member_id,
            remark: values.remark,
        };
        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchUpdateCompanyAccount(doubleParams);
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
            onFinish={handleUpdateCompanyAccount}
            title="修改资料"
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
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
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="member_code"
                    label="户口"
                    disabled
                    fieldProps={{
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
                    disabled
                />
            </ProForm.Group>
            <ProFormTextArea
                name="remark"
                label="备注"
                width="md"
                placeholder="请输入备注"
                fieldProps={{
                    maxLength: 100,
                }}
            />
        </ModalForm>
    );
};

export default ModifyCompanyForm;
