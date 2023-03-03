import React, { FC, useEffect, useRef, useState } from 'react';
import {
    Row,
    Col,
    Button,
    Tabs,
    Typography,
    message,
    Descriptions,
} from 'antd';
import { useParams } from 'react-router-dom';
import { useHttp } from '@/hooks';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormCheckbox } from '@ant-design/pro-components';
import {
    ModalForm,
    ProForm,
    ProFormTextArea,
} from '@ant-design/pro-components';
import ModalHead from '../components/modalHead';
import { createStorage, getStorageDetails } from '@/api/admission';
import {
    CreateStorageParams,
    getStorageDetailsParams,
} from '@/types/api/admission';
import { formatCurrency } from '@/utils/tools';
import FormCurrency from '@/components/Currency/FormCurrency';
import AuthButton from '@/components/AuthButton';
import usePrint from '@/hooks/usePrint';
import { OfficialDataProps } from '@/hooks/usePrint/print';
import { selectUserName } from '@/store/user/userSlice';
import { useAppSelector } from '@/store/hooks';

const { Title } = Typography;

type TemporaryStorageProps = { onSuccess: () => void };

const TemporaryStorage: FC<TemporaryStorageProps> = ({ onSuccess }) => {
    const userName = useAppSelector(selectUserName);
    const { RegisterPrint, handlePrint } =
        usePrint<OfficialDataProps>('Official');
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数
    const formRef = useRef<ProFormInstance>();
    const [storageNum, setStorageNum] = useState({
        total_temp_chips: 0,
        is_suspend_start_work: 2,
    });
    const paramsR = useParams();
    const { fetchData: fetchcreateCroupier } = useHttp<
        CreateStorageParams,
        null
    >(createStorage);
    const { fetchData: fetchgetStorageDetails } = useHttp<
        getStorageDetailsParams,
        any
    >(getStorageDetails);
    useEffect(() => {
        formRef?.current?.setFieldsValue({
            is_suspend_start_work:
                storageNum.is_suspend_start_work === 1
                    ? ['暂存后，暂停开工']
                    : '',
        });
    }, [storageNum.is_suspend_start_work]);

    const onFinish = async (values: any) => {
        const params = { ...values, round: paramsR.id || '' };
        if (
            values.is_suspend_start_work &&
            values.is_suspend_start_work.length > 0
        ) {
            params.is_suspend_start_work = 1;
        } else {
            params.is_suspend_start_work = 2;
        }
        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await fetchcreateCroupier(doubleParams);
        if (res.code === 10000) {
            message.success(res.msg);
            onSuccess();
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
            onSuccess();
            let { receipt } = res.data || ({} as any);
            handlePrint({
                name: receipt.member_name,
                account: receipt.member_code,
                type: '暂存',
                currency: receipt.currency_name,
                amountCapital: `${formatCurrency(receipt.amount) * 10000}`,
                amountCurrency: `${formatCurrency(receipt.amount)}万`,
                remark: receipt.remark,
                manager: userName,
                id: receipt.round,
            });
            return true;
        }
    };
    console.log(doubleParams);
    return (
        <ModalForm
            layout="horizontal"
            formRef={formRef}
            modalProps={{
                destroyOnClose: true,
            }}
            trigger={
                <AuthButton
                    normal="admissionDetail-TemporaryStorage"
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
                            <Descriptions.Item label="" span={24}>
                                请确认是否提交
                            </Descriptions.Item>
                            <Descriptions.Item label="当前暂存总额" span={12}>
                                {formatCurrency(
                                    storageNum.total_temp_chips + '',
                                )}
                                万
                            </Descriptions.Item>

                            <Descriptions.Item label="泥码数" span={12}>
                                {formatCurrency(doubleParams.mud_chips)}万
                            </Descriptions.Item>
                            <Descriptions.Item label="现金码数" span={12}>
                                {formatCurrency(doubleParams.cash_chips)}万
                            </Descriptions.Item>
                            {doubleParams.is_suspend_start_work === 1 ? (
                                <div>暂存后暂停开工</div>
                            ) : (
                                ''
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
            visible={isPass}
            onVisibleChange={(open) => {
                setIsPass(open);
                if (open) {
                    fetchgetStorageDetails({ round: paramsR.id || '' }).then(
                        (res) => {
                            setStorageNum(
                                res.data || {
                                    total_temp_chips: 0,
                                    is_suspend_start_work: 2,
                                },
                            );
                        },
                    );
                } else {
                    setStorageNum({
                        total_temp_chips: 0,
                        is_suspend_start_work: 2,
                    });
                }
            }}
            onFinish={onFinish}
            title="暂存"
            width={700}
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
        >
            <ModalHead />
            <ProForm.Group>
                <FormCurrency name="mud_chips" label="泥码数" />
            </ProForm.Group>
            <ProForm.Group>
                <FormCurrency name="cash_chips" label="现金码" />
            </ProForm.Group>
            <Row justify="space-between">
                <Col>
                    <ProForm.Group>
                        <ProFormCheckbox.Group
                            name="is_suspend_start_work"
                            options={['暂存后，暂停开工']}
                        />
                    </ProForm.Group>
                </Col>
                <Col>
                    <Title level={5}>
                        暂存总额：
                        {formatCurrency(storageNum.total_temp_chips + '')}万
                    </Title>
                </Col>
            </Row>
            <ProForm.Group>
                <ProFormTextArea width="xl" label="备注" name="remark" />
            </ProForm.Group>
            <RegisterPrint />
        </ModalForm>
    );
};

export default TemporaryStorage;
