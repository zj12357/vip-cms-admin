import React, { FC, useState, memo, useCallback, useRef } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import type { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { Button, message, Modal } from 'antd';
import Opcode from '@/components/Opcode';
import VerifierPassword from '@/pages/AccountManagement/components/VerifierPassword';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { useHttp, useLatest } from '@/hooks';
import { selectCurrentHall } from '@/store/common/commonSlice';

type SiteVerificationProps = {};

const SiteVerificationForm: FC<SiteVerificationProps> = (props) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const formRef = useRef<ProFormInstance>();
    const currentHall = useAppSelector(selectCurrentHall);

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        hall: currentHall.hall_name,
    }).current;
    return (
        <div>
            <ModalForm
                trigger={<Button type="primary">现场认证</Button>}
                onFinish={async (values: any) => {
                    message.success('提交成功');
                }}
                title="现场认证"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                initialValues={updatedValues}
                formRef={formRef}
                submitter={false}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_code"
                        label="户口"
                        disabled
                    />
                    <ProFormText width="md" name="hall" label="场馆" disabled />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_name"
                        label="户名"
                        disabled
                    />
                </ProForm.Group>

                <VerifierPassword
                    formRef={formRef}
                    for="现场认证"
                    identity_module={9}
                ></VerifierPassword>
            </ModalForm>
        </div>
    );
};

export default SiteVerificationForm;
