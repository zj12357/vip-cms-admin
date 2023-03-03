import React, { FC } from 'react';
import {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message, Row, Col } from 'antd';
import { CompanyCardBalanceItem } from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import FormCurrency from '@/components/Currency/FormCurrency';

type FundingFormProps = {
    record: CompanyCardBalanceItem;
};

const FundingForm: FC<FundingFormProps> = ({ record }) => {
    const currencyList = useAppSelector(selectCurrencyList);
    return (
        <div>
            <ModalForm
                trigger={
                    <Button type="primary" size="small">
                        平账
                    </Button>
                }
                onFinish={async (values: any) => {
                    console.log(values);
                    message.success('提交成功');
                }}
                title="资金平账"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                initialValues={{
                    hall: record.hall_code,
                    // balance: record.currency_info
                }}
            >
                <Row wrap={false}>
                    <Col span={12}>
                        <ProFormText
                            width="md"
                            name="hall"
                            label="操作场馆"
                            disabled
                        />
                        <FormCurrency
                            width="md"
                            name="balance"
                            label="场馆余额"
                            disabled
                        />
                        <FormCurrency
                            width="md"
                            name="name"
                            label="转账金额"
                            placeholder="请输入转账金额"
                        />
                    </Col>
                    <Col span={12}>
                        <ProFormSelect
                            name="select"
                            label="平账选项"
                            width="md"
                            options={[
                                {
                                    label: '转入',
                                    value: 1,
                                },
                                {
                                    label: '转出',
                                    value: 2,
                                },
                            ]}
                            placeholder="请选择平账选项"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择平账选项',
                                },
                            ]}
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                            }}
                            showSearch
                        />
                        <ProFormSelect
                            name="select"
                            label="平账币种"
                            width="md"
                            options={currencyList}
                            placeholder="请选择平账币种"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择平账币种',
                                },
                            ]}
                            fieldProps={{
                                getPopupContainer: (triggerNode) =>
                                    triggerNode.parentNode,
                            }}
                            showSearch
                        />
                    </Col>
                </Row>
            </ModalForm>
        </div>
    );
};

export default FundingForm;
