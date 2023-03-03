import React, { FC, useState, useRef, useEffect } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Tabs, message, Descriptions } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { creditQuota, creditRecycle } from '@/api/accountAction';
import {
    OnlineAndOfflineListItem,
    CreditQuotaParams,
    CreditRecycleParams,
} from '@/types/api/accountAction';
import FormCurrency from '@/components/Currency/FormCurrency';
import AuthButton from '@/components/AuthButton';

const { TabPane } = Tabs;

type DownBatchFormProps = {
    record: OnlineAndOfflineListItem;
    currentAccountInfo: OnlineAndOfflineListItem;
    reloadData: () => void;
};

const DownBatchForm: FC<DownBatchFormProps> = ({
    record,
    currentAccountInfo,
    reloadData,
}) => {
    const formRef = useRef<ProFormInstance>();
    const [markerDownType, setMarkerDownType] = useState<string>('3');
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    //下线的禁批额度 >0，用公司额度，否则是用公司额度或者上线额度,
    const banAmount =
        record.member_marker_credit?.find((item) => item.marker_type === 6)
            ?.total_amount ?? 0;

    //下线的已批额度
    const signedAmount =
        record.member_marker_credit?.find((item) => item.marker_type === 2)
            ?.total_amount ?? 0;

    //户主公司额度
    const companyAmount =
        currentAccountInfo.member_marker_credit?.find(
            (item) => item.marker_type === 3,
        )?.available_amount ?? 0;

    //户主上线额度
    const lineAmount =
        currentAccountInfo.member_marker_credit?.find(
            (item) => item.marker_type === 2,
        )?.available_amount ?? 0;

    const updatedValues = useLatest({
        member_code: record.member_code,
        member_name: record.member_name,
        parent_member_code: record.parent_member_code,
        parent_member_name: record.parent_member_name,
        signed_amount: markerDownType === '3' ? signedAmount : banAmount, //下线的上线额度,上线额度就是自己的禁批额度
        available_amount: markerDownType === '3' ? companyAmount : lineAmount, //户主公司额度
    }).current;

    const { fetchData: _fetchCreditQuota } = useHttp<CreditQuotaParams, null>(
        creditQuota,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const { fetchData: _fetchCreditRecycle } = useHttp<
        CreditRecycleParams,
        null
    >(creditRecycle, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const handleCreditQuota = async (values: any) => {
        let params = {
            from_member: currentAccountInfo.member_code,
            to_member: record.member_code,
            amount: +values.amount,
            marker_type: +markerDownType,
            currency: record.currency,
        };
        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleCreditRecycle = () => {
        const params = {
            from_member: record.member_code,
            to_member: currentAccountInfo.member_code,
            marker_type: +markerDownType,
            currency: record.currency,
        };
        _fetchCreditRecycle(params);
    };
    const CommonFormItem = () => (
        <>
            <ProForm.Group>
                <FormCurrency
                    width="md"
                    name="available_amount"
                    label="总额度"
                    disabled
                />
                <FormCurrency
                    width={230}
                    name="signed_amount"
                    label="已批额度"
                    disabled
                    addonAfter={
                        <AuthButton
                            normal="customerAccount-upAndDown-recycle"
                            buttonProps={{
                                type: 'primary',
                            }}
                            firstVisible={isPass}
                            isSecond={true}
                            secondDom={<div>请确定是否要回收额度</div>}
                            secondVerify={(val) => {
                                if (val) {
                                    handleCreditRecycle();
                                }
                            }}
                        ></AuthButton>
                    }
                />
            </ProForm.Group>
            <ProForm.Group>
                <FormCurrency
                    width="md"
                    name="amount"
                    label="调整后额度"
                    placeholder="请输入调整后额度"
                    rules={[
                        {
                            required: true,
                            message: '请输入调整后额度',
                        },
                    ]}
                />
            </ProForm.Group>
        </>
    );

    const handleMarkerDownType = (val: string) => {
        setMarkerDownType(val);
        formRef.current?.setFieldsValue({
            amount: '',
        });
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchCreditQuota(doubleParams);
        if (res.code === 10000) {
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
        }
    };

    useEffect(() => {
        formRef.current?.setFieldsValue({
            signed_amount: markerDownType === '3' ? signedAmount : banAmount, //下线的上线额度
            available_amount:
                markerDownType === '3' ? companyAmount : lineAmount, //户主公司额度
        });
    }, [banAmount, companyAmount, lineAmount, markerDownType, signedAmount]);
    return (
        <ModalForm
            title="下线批额设置"
            trigger={
                <AuthButton
                    normal="customerAccount-upAndDown-batch"
                    verify={(pass) => {
                        setIsPass(pass);
                    }}
                    buttonProps={{
                        type: 'link',
                    }}
                    firstVisible={isPass}
                    isSecond={true}
                    secondDom={<div>请确认是否要下线批额</div>}
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
            initialValues={updatedValues}
            onFinish={handleCreditQuota}
            formRef={formRef}
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

            <Tabs
                activeKey={markerDownType}
                type="card"
                onChange={(val) => {
                    handleMarkerDownType(val);
                }}
                destroyInactiveTabPane
            >
                <TabPane tab="公司额度" key="3">
                    <CommonFormItem></CommonFormItem>
                </TabPane>
                <TabPane tab="上线额度" key="2">
                    <CommonFormItem></CommonFormItem>
                </TabPane>
            </Tabs>
        </ModalForm>
    );
};

export default DownBatchForm;
