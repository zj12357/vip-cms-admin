import React, { FC, useRef, useState } from 'react';
import { Row, Col, Button, Typography, AutoComplete, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormDigit,
} from '@ant-design/pro-components';
import { getCustomerList, customerCreate, getRoundList } from '@/api/scene';
import {
    GetCustomerListParams,
    ResCustomerList,
    CustomerCreateParams,
    GetRoundListParams,
    ResRoundList,
} from '@/types/api/scene';
import FormCurrency from '@/components/Currency/FormCurrency';
const { Title } = Typography;
const { Option } = AutoComplete;

type AddCustomerProps = {
    onSuccess: () => void;
};

const AddCustomer: FC<AddCustomerProps> = (props) => {
    const [roundList, setRoundList] = useState([]);
    const formRef = useRef<ProFormInstance>();
    const { fetchData: fetchCustomerList } = useHttp<
        GetCustomerListParams,
        ResCustomerList
    >(getCustomerList);
    const { fetchData: fetchCustomerCreate } = useHttp<
        CustomerCreateParams,
        null
    >(customerCreate);

    const { fetchData: fetchGetRoundList } = useHttp<
        GetRoundListParams,
        ResRoundList
    >(getRoundList);

    return (
        <ModalForm
            layout="horizontal"
            trigger={<Button type="primary">+新增客人</Button>}
            onFinish={async (values: any) => {
                console.log(values, 'values');
                const res = await fetchCustomerCreate({
                    ...values,
                    member_code: values.member_code.split('/')[0],
                });
                if (res.code === 10000) {
                    props.onSuccess();
                    message.success(res.msg);
                    return true;
                }
            }}
            formRef={formRef}
            title="新增客人"
            width={640}
            style={{
                maxHeight: '80vh',
                overflowY: 'auto',
            }}
            onFieldsChange={(changedFields: any, allFields) => {
                if (changedFields[0]?.name[0] === 'member_code') {
                    if (changedFields[0].value) {
                        formRef?.current?.setFieldsValue({
                            member_name: changedFields[0].value?.split('/')[1],
                            round: null,
                        });
                        // 请求场次编号
                        fetchGetRoundList({
                            member_code: changedFields[0].value?.split('/')[0],
                        }).then((res: any) => {
                            if (res.code === 10000) {
                                const rounfData = res.data.map((item: any) => {
                                    return {
                                        label: item.round,
                                        value: item.round,
                                    };
                                });
                                setRoundList(rounfData);
                            }
                        });
                    } else {
                        formRef?.current?.setFieldsValue({
                            member_name: null,
                            round: null,
                        });
                        setRoundList([]);
                    }
                }
            }}
        >
            <ProForm.Group>
                <ProFormSelect
                    name="member_code"
                    label="户口号"
                    placeholder="请输入户口号"
                    width="sm"
                    showSearch
                    debounceTime={500}
                    request={async ({ keyWords }) => {
                        if (!keyWords) {
                            return [];
                        }
                        const res: any = await fetchCustomerList({
                            member_code: keyWords,
                        });
                        return res.data.map(
                            (item: {
                                member_code: string;
                                member_name: string;
                            }) => {
                                return {
                                    label: item.member_code,
                                    value:
                                        item.member_code +
                                        '/' +
                                        item.member_name,
                                };
                            },
                        );
                    }}
                />
                <ProFormText
                    name="member_name"
                    width="sm"
                    label="户口名"
                    placeholder=""
                    disabled
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormSelect
                    // request={async () => [...roundList]}
                    options={roundList}
                    width="sm"
                    name="round"
                    label="场次号"
                    placeholder="请选择场次号"
                />
                <ProFormText
                    name="customer_name"
                    label="客户名"
                    width="sm"
                    placeholder="请输入客户名"
                />
            </ProForm.Group>
            <Title level={4}>本金：</Title>
            <Row>
                <Col span={12} offset={6}>
                    <ProForm.Group>
                        <FormCurrency
                            rules={[
                                { required: true },
                                {
                                    validator(rule, value) {
                                        if (!isNaN(value) && value <= 0) {
                                            return Promise.reject(
                                                '请输入正确的泥码',
                                            );
                                        } else {
                                            return Promise.resolve(true);
                                        }
                                    },
                                },
                            ]}
                            name="mud_chips"
                            label="泥码"
                            placeholder="请输入泥码"
                        />
                    </ProForm.Group>
                </Col>
            </Row>
            {/* <Row>
                <Col span={12} offset={6}>
                    <ProForm.Group>
                        <FormCurrency
                            name="cash_chips"
                            label="现金码"
                            placeholder="请输入现金码"
                        />
                    </ProForm.Group>
                </Col>
            </Row> */}
        </ModalForm>
    );
};

export default AddCustomer;
