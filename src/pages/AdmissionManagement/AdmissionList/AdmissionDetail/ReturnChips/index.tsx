import React, { FC, useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '@/hooks';
import Big from 'big.js';
import { Row, Col, Typography, message, Descriptions } from 'antd';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import ModalHead from '../components/modalHead';
import { CreateReturnParams } from '@/types/api/admission';
import { createReturn } from '@/api/admission';
import FormCurrency from '@/components/Currency/FormCurrency';
import { formatCurrency } from '@/utils/tools';
import AuthButton from '@/components/AuthButton';
import usePrint from '@/hooks/usePrint';
import { TicketDataProps } from '@/hooks/usePrint/print';
const { Title } = Typography;

type ReturnChipsProps = {
    dataInfo: any;
    onSuccess: () => void;
    frozenAmount: number;
};

const SIZE = 1000000;
const ReturnChips: FC<ReturnChipsProps> = ({
    onSuccess,
    frozenAmount,
    dataInfo,
}) => {
    const { RegisterPrint, handlePrint } = usePrint<TicketDataProps>('Ticket');
    const paramsR = useParams();
    const formRef = useRef<ProFormInstance>();
    const [total, setTotal] = useState(0);
    const [tableSum, setTableSum] = useState(0);
    const [returnSUm, setReturnSum] = useState(0);
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数
    const { fetchData: fetchCreateReturn } = useHttp<CreateReturnParams, null>(
        createReturn,
    );

    useEffect(() => {
        if (isPass) {
            setTotal(0);
            setTableSum(0);
            setReturnSum(0);
        }
    }, [isPass]);

    const getValue = (allFields: any, label: string) => {
        return (
            allFields?.find((item: any) => {
                return item.name[0] === label;
            })?.value || null
        );
    };

    const onFinish = async (values: any) => {
        const params = {
            ...values,
            round: paramsR.id,
        };
        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await fetchCreateReturn(doubleParams);
        if (res.code === 10000) {
            message.success(res.msg);
            onSuccess();
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
            let { small_ticket } = res.data || ({} as any);
            small_ticket.operation_type = '回码';
            handlePrint({
                items: [
                    { k: 'member_code', n: '客户户口' },
                    { k: 'operation_type', n: '操作类型' },
                    {
                        k: 'created_at',
                        n: '回码时间',
                        type: 'Date',
                    },
                    { k: 'round', n: '场次编号' },
                    {
                        k: 'amount',
                        n: '回码金额',
                        type: 'Currency',
                    },
                    {
                        k: 'convert_chips',
                        n: '转码量',
                        type: 'Currency',
                    },
                    {
                        k: 'total_convert_chips',
                        n: '总转码',
                        type: 'Currency',
                    },
                ].map((x) => {
                    return {
                        type: x.type,
                        label: x.n,
                        value: small_ticket ? small_ticket[x.k] : '- -',
                    };
                }),
            });
            return true;
        }
    };

    const renderDescriptions = () => {
        return (
            <Descriptions column={24}>
                <Descriptions.Item label="" span={24}>
                    <h3 style={{ fontSize: 20, fontWeight: 500 }}>
                        请确认是否回码
                    </h3>
                </Descriptions.Item>
                {dataInfo.start_work_type === 1 ? (
                    <>
                        <Descriptions.Item label="" span={24}>
                            <h3 style={{ fontSize: 20, fontWeight: 500 }}>
                                台面
                            </h3>
                        </Descriptions.Item>
                        <Descriptions.Item label="泥码数" span={12}>
                            {formatCurrency(doubleParams.mud_chips)}万
                        </Descriptions.Item>
                        <Descriptions.Item label="现金码" span={12}>
                            {formatCurrency(doubleParams.cash_chips)}万
                        </Descriptions.Item>
                        <Descriptions.Item label="解冻占成保证金" span={24}>
                            {formatCurrency(
                                doubleParams.un_frozen_share_deposit,
                            )}
                            万
                        </Descriptions.Item>
                    </>
                ) : (
                    <>
                        <Descriptions.Item label="" span={24}>
                            <h3 style={{ fontSize: 20, fontWeight: 500 }}>
                                台面
                            </h3>
                        </Descriptions.Item>
                        <Descriptions.Item label="泥码数" span={12}>
                            {formatCurrency(doubleParams.mud_chips)}万
                        </Descriptions.Item>

                        <Descriptions.Item label="现金码数" span={12}>
                            {formatCurrency(doubleParams.cash_chips)}万
                        </Descriptions.Item>
                        <Descriptions.Item label="台底倍数" span={12}>
                            {doubleParams.table_bottom_multiple}
                        </Descriptions.Item>
                        <Descriptions.Item label="回码台底押金" span={12}>
                            {formatCurrency(doubleParams.table_bottom_deposit)}
                            万
                        </Descriptions.Item>
                        <Descriptions.Item label="解冻占成保证金" span={24}>
                            {formatCurrency(
                                doubleParams.un_frozen_share_deposit,
                            )}
                            万
                        </Descriptions.Item>
                    </>
                )}
                <Descriptions.Item label="" span={24}>
                    <h3 style={{ fontSize: 20, fontWeight: 500 }}>结算</h3>
                </Descriptions.Item>
                <Descriptions.Item label="现金" span={12}>
                    {formatCurrency(doubleParams.cash_settlement)}万
                </Descriptions.Item>
                <Descriptions.Item label="存卡" span={12}>
                    {formatCurrency(doubleParams.deposit_card_settlement)}万
                </Descriptions.Item>
                <Descriptions.Item label="还M" span={12}>
                    {formatCurrency(doubleParams.marker_settlement)}万
                </Descriptions.Item>
            </Descriptions>
        );
    };
    return (
        <>
            <ModalForm
                formRef={formRef}
                layout="horizontal"
                modalProps={{
                    destroyOnClose: true,
                }}
                trigger={
                    <AuthButton
                        normal="admissionDetail-ReturnChips"
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        buttonProps={{
                            type: 'primary',
                        }}
                        firstVisible={isPass}
                        isSecond={true}
                        secondDom={renderDescriptions()}
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
                onVisibleChange={(val) => {
                    setIsPass(val);
                }}
                onFinish={onFinish}
                title="回码"
                width={700}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                onFieldsChange={(changedFields: any, allFields) => {
                    const tableSum = Number(
                        new Big(+getValue(allFields, 'mud_chips') || 0).plus(
                            +getValue(allFields, 'cash_chips') || 0,
                        ),
                    );
                    const tableBottomDeposit = new Big(tableSum).times(
                        +getValue(allFields, 'table_bottom_multiple'),
                    );
                    const returnSUm = Number(tableBottomDeposit.plus(tableSum));
                    setTableSum(tableSum);
                    setReturnSum(returnSUm);
                    formRef?.current?.setFieldsValue({
                        table_bottom_deposit: Number(
                            tableBottomDeposit.times(SIZE),
                        ),
                    });
                    const totalNum = Number(
                        new Big(+getValue(allFields, 'cash_settlement') || 0)
                            .plus(
                                +getValue(
                                    allFields,
                                    'deposit_card_settlement',
                                ) || 0,
                            )
                            .plus(
                                +getValue(allFields, 'marker_settlement') || 0,
                            ),
                    );

                    setTotal(totalNum || 0);
                }}
            >
                <ModalHead
                    getTable_bottom_multiple={(multiple) => {
                        formRef?.current?.setFieldsValue({
                            table_bottom_multiple: multiple,
                        });
                    }}
                />
                <ProForm.Group>
                    <FormCurrency name="mud_chips" label="泥码数" />
                    <FormCurrency name="cash_chips" label="现金码" />
                </ProForm.Group>
                <Row justify="end">
                    <Col>
                        <Title level={5}>台面合计：{tableSum}万</Title>
                    </Col>
                </Row>
                <ProForm.Group>
                    <ProFormText
                        width={'xs'}
                        name="table_bottom_multiple"
                        label="台底倍数"
                        disabled
                        addonAfter={<span>倍</span>}
                    />
                    <FormCurrency
                        width={'xs'}
                        name="table_bottom_deposit"
                        label="回码台底押金"
                        placeholder=""
                        disabled
                    />
                </ProForm.Group>
                <Row justify="end">
                    <Col>
                        <Title level={5}>总回码：{returnSUm}万</Title>
                    </Col>
                </Row>
                <ProForm.Group>
                    <FormCurrency
                        name="un_frozen_share_deposit"
                        label="解冻占成保证金"
                        placeholder=""
                        addonAfter={
                            <>
                                <span
                                    style={{
                                        marginLeft: '10px',
                                        fontSize: '12px',
                                    }}
                                >
                                    已冻结：
                                    <span>
                                        {formatCurrency(frozenAmount)}万
                                    </span>
                                </span>
                            </>
                        }
                    />
                </ProForm.Group>
                <Title level={5}>结算方式：</Title>
                <ProForm.Group>
                    <FormCurrency name="cash_settlement" label="现金" />
                    <FormCurrency name="deposit_card_settlement" label="存卡" />
                    <FormCurrency name="marker_settlement" label="还M" />
                </ProForm.Group>
                <Row justify="end">
                    <Col>
                        <Title level={5}>
                            结算合计：
                            <span style={{ color: '#f5222d' }}>{total}万</span>
                        </Title>
                    </Col>
                </Row>
                <ProForm.Group>
                    <ProFormTextArea width="xl" label="备注" name="remark" />
                </ProForm.Group>
            </ModalForm>
            <RegisterPrint />
        </>
    );
};

export default ReturnChips;
