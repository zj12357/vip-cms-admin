import React, { FC, useState } from 'react';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { useHttp, useLatest } from '@/hooks';
import { message } from 'antd';
import { creditCptain } from '@/api/accountAction';
import {
    OnlineAndOfflineListItem,
    CreditCptainParams,
} from '@/types/api/accountAction';
import { isPositiveNumber } from '@/utils/validate';
import AuthButton from '@/components/AuthButton';

type DownTurnInFormProps = {
    record: OnlineAndOfflineListItem;
    currentAccountInfo: OnlineAndOfflineListItem;
    reloadData: () => void;
};

const DownTurnInForm: FC<DownTurnInFormProps> = ({
    record,
    currentAccountInfo,
    reloadData,
}) => {
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const updatedValues = useLatest({
        member_code: record.member_code,
        member_name: record.member_name,
        parent_member_code: record.parent_member_code,
        parent_member_name: record.parent_member_name,
        turn_over_c_commission_rate: record?.turn_over_c_commission,
        turn_over_m_commission_rate: record?.turn_over_m_commission,
    }).current;

    const { fetchData: _fetchCreditCptain } = useHttp<CreditCptainParams, null>(
        creditCptain,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const handleCreditCptain = async (values: any) => {
        const params = {
            member_code: record.member_code,
            member_name: record.member_name,
            parent_member_code: record.parent_member_code,
            parent_member_name: record.parent_member_name,
            turn_over_c_commission_rate: +values.turn_over_c_commission_rate,
            turn_over_m_commission_rate: +values.turn_over_m_commission_rate,
        };
        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchCreditCptain(doubleParams);
        if (res.code === 10000) {
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
        }
    };
    return (
        <ModalForm
            title="下线上缴设置"
            trigger={
                <AuthButton
                    normal="customerAccount-upAndDown-turnIn"
                    verify={(pass) => {
                        setIsPass(pass);
                    }}
                    buttonProps={{
                        type: 'link',
                    }}
                    firstVisible={isPass}
                    isSecond={true}
                    secondDom={<div>请确认是否上缴额度</div>}
                    secondVerify={(val) => {
                        if (val) {
                            handleDoubleSuccess();
                        }
                    }}
                    secondVisible={doubleVisible}
                    secondOnClose={() => setDoubleVisible(false)}
                ></AuthButton>
            }
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    setIsPass(false);
                    setDoubleVisible(false);
                    setDoubleParams({});
                },
            }}
            onFinish={handleCreditCptain}
            initialValues={updatedValues}
            visible={isPass}
        >
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="member_code"
                    label="下线户口"
                    disabled
                />
                <ProFormText
                    width="md"
                    name="parent_member_code"
                    label="上线户口"
                    disabled
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="member_name"
                    label="下线户名"
                    disabled
                />
                <ProFormText
                    width="md"
                    name="parent_member_name"
                    label="上线户名"
                    disabled
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="turn_over_c_commission_rate"
                    label="上缴C佣金率"
                    placeholder="请输入上缴C佣金率"
                    rules={[
                        {
                            required: true,
                            message: '请输入上缴C佣金率',
                        },
                        {
                            pattern: isPositiveNumber,
                            message: '请输入数字',
                        },
                    ]}
                />
                <ProFormText
                    width="md"
                    name="turn_over_m_commission_rate"
                    label="上缴M佣金率"
                    placeholder="请输入上缴M佣金率"
                    rules={[
                        {
                            required: true,
                            message: '请输入上缴M佣金率',
                        },
                        {
                            pattern: isPositiveNumber,
                            message: '请输入数字',
                        },
                    ]}
                />
            </ProForm.Group>
        </ModalForm>
    );
};

export default DownTurnInForm;
