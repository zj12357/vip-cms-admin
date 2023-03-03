/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useRef, useState, useEffect } from 'react';
import { Row, Col, Typography, message, Spin } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { ModalForm, ProForm } from '@ant-design/pro-components';
import { customerLottery, customerLotteryInfo } from '@/api/scene';
import { CustomerLotteryParams } from '@/types/api/scene';
import FormCurrency from '@/components/Currency/FormCurrency';
const { Title } = Typography;

type AddCustomerProps = {
    onSuccess: () => void;
    customer_id: string;
    customer_name: string;
};

const AddCustomer: FC<AddCustomerProps> = (props) => {
    const { customer_id, customer_name } = props;
    const [visible, setVisible] = useState(false);
    const [customerData, setCustomerData] = useState<any>({});
    const formRef = useRef<ProFormInstance>();
    const { fetchData: fetchCustomerLottery } = useHttp<
        CustomerLotteryParams,
        null
    >(customerLottery);
    const { fetchData: fetchCustomerLotteryInfo, loading } = useHttp<
        { customer_id: string },
        null
    >(customerLotteryInfo);
    useEffect(() => {
        if (visible) {
            fetchCustomerLotteryInfo({
                customer_id,
            }).then((res) => {
                setCustomerData(res?.data || {});
            });
        }
    }, [visible]);
    return (
        <ModalForm
            layout="horizontal"
            trigger={
                <span className="m-primary-font-color pointer">
                    {customer_name}
                </span>
            }
            onVisibleChange={(val) => {
                setVisible(val);
            }}
            onFinish={async (values: any) => {
                const res = await fetchCustomerLottery({
                    ...values,
                    customer_id,
                    round: customerData.round,
                });
                if (res.code === 10000) {
                    props.onSuccess();
                    message.success(res.msg);
                    return true;
                }
            }}
            formRef={formRef}
            title="客人加彩"
            width={640}
            style={{
                maxHeight: '80vh',
                overflowY: 'auto',
            }}
        >
            <Spin spinning={loading}>
                <Row gutter={[24, 10]} style={{ marginBottom: 24 }}>
                    <Col span={12}>户口号：{customerData?.member_code}</Col>
                    <Col span={12}>户口名：{customerData?.member_name}</Col>
                    <Col span={12}>场次号：{customerData?.round}</Col>
                    <Col span={12}>客户名：{customer_name}</Col>
                </Row>

                <Title level={4}>加彩：</Title>
                <Row>
                    <Col span={12} offset={6}>
                        <ProForm.Group>
                            <FormCurrency
                                name="mud_chips"
                                label="泥码"
                                placeholder="请输入泥码"
                            />
                        </ProForm.Group>
                    </Col>
                </Row>
            </Spin>
        </ModalForm>
    );
};

export default AddCustomer;
