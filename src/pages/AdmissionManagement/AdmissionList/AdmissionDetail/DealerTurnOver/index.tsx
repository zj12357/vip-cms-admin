import React, { FC, useState } from 'react';
import { Row, Col, Button, Typography, message, Descriptions } from 'antd';
import { useParams } from 'react-router-dom';
import { useHttp } from '@/hooks';
import {
    ModalForm,
    ProForm,
    ProFormTextArea,
    ProFormDigit,
} from '@ant-design/pro-components';
import ModalHead from '../components/modalHead';

import { createCroupier } from '@/api/admission';
import { CreateCroupierParams } from '@/types/api/admission';
import FormCurrency from '@/components/Currency/FormCurrency';
import AuthButton from '@/components/AuthButton';
import { formatCurrency } from '@/utils/tools';

const { Title } = Typography;

type DealerTurnOverProps = { onSuccess: () => void };

// 查找某项值
const getValue = (allFields: any, label: string) => {
    return (
        allFields?.find((item: any) => {
            return item.name[0] === label;
        })?.value || null
    );
};
const DealerTurnOver: FC<DealerTurnOverProps> = ({ onSuccess }) => {
    const paramsR = useParams();
    const { fetchData: fetchcreateCroupier } = useHttp<
        CreateCroupierParams,
        null
    >(createCroupier);
    const [total, setTotal] = useState(0);
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const onFinish = async (values: any) => {
        const params = {
            round: paramsR.id,
            ...values,
        };

        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await fetchcreateCroupier(doubleParams);

        if (res.code === 10000) {
            message.success(res.msg);
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
            onSuccess();
        }
    };
    return (
        <>
            <ModalForm
                layout="horizontal"
                modalProps={{
                    destroyOnClose: true,
                }}
                trigger={
                    <AuthButton
                        normal="admissionDetail-DealerTurnOver"
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
                                <Descriptions.Item label="泥码数" span={12}>
                                    {formatCurrency(doubleParams.mud_chips)}万
                                </Descriptions.Item>

                                <Descriptions.Item label="现金码数" span={12}>
                                    {formatCurrency(doubleParams.cash_chips)}万
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
                onVisibleChange={(val) => {
                    setIsPass(val);
                }}
                onFinish={onFinish}
                onFieldsChange={(changedFields: any, allFields) => {
                    const tableSum =
                        +getValue(allFields, 'mud_chips') +
                        +getValue(allFields, 'cash_chips');
                    setTotal(tableSum);
                }}
                visible={isPass}
                title="荷水"
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
                <Row justify="end">
                    <Col>
                        <Title level={5}>总数：{total}万</Title>
                    </Col>
                </Row>
                <ProForm.Group>
                    <ProFormTextArea width="xl" label="备注" name="remark" />
                </ProForm.Group>
            </ModalForm>
        </>
    );
};

export default DealerTurnOver;
