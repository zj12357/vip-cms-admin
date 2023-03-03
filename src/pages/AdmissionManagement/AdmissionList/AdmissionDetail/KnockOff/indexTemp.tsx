/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useRef, useEffect } from 'react';
import { Row, Col, Typography, message, Descriptions } from 'antd';
import { useParams } from 'react-router-dom';
import Big from 'big.js';
import { useHttp } from '@/hooks';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { getAccountDetail } from '@/api/admission';
import { GetAccountDetailParams, AccountDetails } from '@/types/api/admission';
import {
    getWorkDetailsNew,
    getWorkSettlementNew,
    stopWorkNew,
} from '@/api/admission';
import {
    GetWorkDetailsParams,
    StopWorkParams,
    GetWorkSettlementParams,
} from '@/types/api/admission';
import FormCurrency from '@/components/Currency/FormCurrency';
import AuthButton from '@/components/AuthButton';
import usePrint from '@/hooks/usePrint';
import { TicketDataProps } from '@/hooks/usePrint/print';
import './index.scoped.scss';
import { formatCurrency } from '@/utils/tools';
const { Title } = Typography;

type KnockOffProps = {
    onSuccess: () => void;
};
const SIZE = 1000000;
interface Details {
    customer_name: string;
    table_num: string;
    member_code: string;
    member_name: string;
    round: string;
    admission_type: number;
    currency: number;
    start_work_type: number;
    principal_type: string;
    shares_type: string;
    shares_rate: string;
    shares_bottom_rate?: string;
}

const KnockOff: FC<KnockOffProps> = ({ onSuccess }) => {
    const { RegisterPrint, handlePrint } = usePrint<TicketDataProps>('Ticket');
    const [step, setStep] = useState(1);
    const [offworkTableNum, setOffworkTableNum] = useState(0);
    const paramsR = useParams();
    const [stopParams, setStopParams] = useState<any>({});
    const [workDetails, setWorkDetails] = useState({
        total_temp_chips: 0,
        total_marker: 0,
    });
    const [workSettlement, setWorkSettlement] = useState<any>({});
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数
    const formRef = useRef<ProFormInstance>();
    // 收工详情
    const { fetchData: fetchGetWorkDetails } = useHttp<
        GetWorkDetailsParams,
        null
    >(getWorkDetailsNew);
    // 收工结算详情
    const { fetchData: fetchGetWorkSettlementNew } = useHttp<
        GetWorkSettlementParams,
        null
    >(getWorkSettlementNew);
    const { fetchData: fetchStopWork } = useHttp<StopWorkParams, null>(
        stopWorkNew,
    );
    const params = useParams();
    const [dataInfo, setDataInfo] = useState<Details>();
    const { fetchData: getAccountDetailData } = useHttp<
        GetAccountDetailParams,
        AccountDetails
    >(getAccountDetail);
    useEffect(() => {
        getAccountDetailData({ round: params.id || '' }).then((res: any) => {
            if (res.code === 10000) {
                console.log(res.data);
                setDataInfo(res.data);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getValue = (allFields: any, label: string) => {
        return (
            allFields?.find((item: any) => {
                return item.name[0] === label;
            })?.value || null
        );
    };

    useEffect(() => {
        setOffworkTableNum(0);
        // 查询收工详情
        if (isPass) {
            fetchGetWorkDetails({ round: paramsR.id || '' }).then(
                (res: any) => {
                    if (res.code === 10000) {
                        setWorkDetails({
                            ...res.data,
                        });
                        formRef?.current?.setFieldsValue({
                            ...res.data,
                        });
                    }
                },
            );
        }
    }, [isPass]);

    const renderWorkSettlement = () => {
        return (
            <>
                {workSettlement.table_up_delivery ? (
                    <div className="kock-item">
                        <Row className="kock-item-title">[台面]</Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                总本金：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {formatCurrency(
                                    workSettlement.table_up_delivery
                                        .total_principal,
                                )}
                            </Col>
                            <Col span={4} offset={3}>
                                万
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                离台数：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {formatCurrency(
                                    workSettlement.table_up_delivery
                                        .leave_table_chips,
                                )}
                            </Col>
                            <Col span={4} offset={3}>
                                万
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                上下数：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {formatCurrency(
                                    workSettlement.table_up_delivery
                                        .up_down_chips,
                                )}
                            </Col>
                            <Col span={4} offset={3}>
                                万
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                转码数：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {formatCurrency(
                                    workSettlement.table_up_delivery
                                        .total_convert_chips,
                                )}
                            </Col>
                            <Col span={4} offset={3}>
                                万
                            </Col>
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {workSettlement.shares_type_b_delivery_list ? (
                    <div className={`kock-item kock-item-green`}>
                        <Row className="kock-item-title">[B数交收]</Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                占成比：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {
                                    workSettlement.shares_type_b_delivery_list
                                        .share_rate
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                占成找数：
                            </Col>
                            <Col
                                className={`knock-item-center ${
                                    workSettlement.shares_type_b_delivery_list
                                        .share_value > 0
                                        ? 'green-text'
                                        : 'red-text'
                                }`}
                                span={3}
                                offset={3}
                            >
                                {
                                    workSettlement.shares_type_b_delivery_list
                                        .share_value
                                }
                            </Col>
                            <Col span={4} offset={3}>
                                万
                            </Col>
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {workSettlement.steal_food_delivery ? (
                    <div className="kock-item kock-item-blue">
                        <Row className="kock-item-title">[偷食交收]</Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                偷食占成比：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {
                                    workSettlement.steal_food_delivery
                                        .share_parent_number
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                占成找数：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {formatCurrency(
                                    workSettlement.steal_food_delivery
                                        .share_parent_deposit,
                                )}
                            </Col>
                            <Col span={4} offset={3}>
                                万
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                偷食佣金率：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {
                                    workSettlement.steal_food_delivery
                                        .commission_rate
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                佣金找数：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {formatCurrency(
                                    workSettlement.steal_food_delivery
                                        .commission_rate_value,
                                )}
                            </Col>
                            <Col span={9} offset={3}>
                                万
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                免佣占成比：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {
                                    workSettlement.steal_food_delivery
                                        .share_number_other
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                占成找数：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {formatCurrency(
                                    workSettlement.steal_food_delivery
                                        .share_number_other,
                                )}
                            </Col>
                            <Col span={4} offset={3}>
                                万
                            </Col>
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {workSettlement.operation_delivery ? (
                    <div className="kock-item kock-item-yellow">
                        <Row className="kock-item-title">[营运交收]</Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                台底倍数：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {
                                    workSettlement.operation_delivery
                                        .table_bottom_multiple
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                台底押金：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {formatCurrency(
                                    workSettlement.operation_delivery
                                        .table_bottom_deposit,
                                )}
                            </Col>
                            <Col span={4} offset={3}>
                                万
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                台底上下数：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {formatCurrency(
                                    workSettlement.operation_delivery
                                        .table_bottom_up_down_chips,
                                )}
                            </Col>
                            <Col span={4} offset={3}>
                                万
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                台底转码数：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {formatCurrency(
                                    workSettlement.operation_delivery
                                        .table_bottom_convert_chips,
                                )}
                            </Col>
                            <Col span={4} offset={3}>
                                万
                            </Col>
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {workSettlement.table_bottom_shares_type_b_delivery ? (
                    <div className="kock-item kock-item-yellowGrren">
                        <Row className="kock-item-title">[台底B数交收]</Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                台底占成比：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {
                                    workSettlement
                                        .table_bottom_shares_type_b_delivery
                                        .table_bottom_shares_rate
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={3}
                            >
                                台底占成找数：
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={3}
                            >
                                {formatCurrency(
                                    workSettlement
                                        .table_bottom_shares_type_b_delivery
                                        .table_bottom_shares_value,
                                )}
                            </Col>
                            <Col span={4} offset={3}>
                                万
                            </Col>
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {workSettlement.other_member_shares_b_delivery_list &&
                workSettlement.other_member_shares_b_delivery_list.length >
                    0 ? (
                    <div className="kock-item kock-item-red">
                        {workSettlement.other_member_shares_b_delivery_list.map(
                            (item: any) => {
                                return (
                                    <>
                                        <Row className="kock-item-title">
                                            [其他户口B数交收]
                                        </Row>
                                        <Row>
                                            <Col
                                                className="knock-item-right"
                                                span={3}
                                                offset={3}
                                            >
                                                台底占成比：
                                            </Col>
                                            <Col
                                                className="knock-item-center"
                                                span={3}
                                                offset={3}
                                            >
                                                {item.share_number}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col
                                                className="knock-item-right"
                                                span={3}
                                                offset={3}
                                            >
                                                台底占成找数：
                                            </Col>
                                            <Col
                                                className="knock-item-center"
                                                span={3}
                                                offset={3}
                                            >
                                                {formatCurrency(
                                                    item.share_deposit,
                                                )}
                                            </Col>
                                            <Col span={4} offset={3}>
                                                万
                                            </Col>
                                        </Row>
                                    </>
                                );
                            },
                        )}
                    </div>
                ) : (
                    ''
                )}
            </>
        );
    };

    const onFinish = async (values: any) => {
        if (step === 1) {
            const total_settlement = Number(
                new Big(
                    formRef.current?.getFieldValue('marker_settlement') || 0,
                )
                    .div(SIZE)
                    .plus(
                        formRef.current?.getFieldValue('cash_settlement') || 0,
                    )
                    .plus(
                        formRef.current?.getFieldValue(
                            'deposit_card_settlement',
                        ) || 0,
                    ),
            );

            if (+total_settlement === +offworkTableNum) {
                const params = {
                    round: paramsR.id || '',
                    ...values,
                };
                message.loading('');
                fetchGetWorkSettlementNew(params).then((res) => {
                    if (res.code === 10000) {
                        setStopParams(params);
                        message.destroy();
                        setWorkSettlement(res.data);
                        setStep(2);
                    }
                });
            } else {
                message.error('收工台面与结算合计不一致');
            }
        } else {
            setDoubleParams(stopParams);
            setDoubleVisible(true);
        }
    };

    const handleDoubleSuccess = async () => {
        const res = await fetchStopWork(stopParams);
        if (res.code === 10000) {
            onSuccess();
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
            message.success(res.msg);
            let { small_ticket } = res.data || ({} as any);
            small_ticket.operation_type = '收工';
            handlePrint({
                items: [
                    { k: 'member_code', n: '客户户口' },
                    { k: 'operation_type', n: '操作类型' },
                    {
                        k: 'created_at',
                        n: '收工时间',
                        type: 'Date',
                    },
                    { k: 'round', n: '场次编号' },
                    {
                        k: 'amount',
                        n: '收工金额',
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
            setDoubleParams(params);
            setDoubleVisible(true);
        }
    };
    return (
        <>
            <ModalForm
                layout="horizontal"
                modalProps={{
                    destroyOnClose: true,
                    okText: step === 1 ? '下一步' : '确认结算',
                    cancelText: step === 1 ? '取消' : '返回上一步',
                    onCancel: () => {
                        if (step === 2) {
                            setStep(1);
                        } else {
                            setIsPass(false);
                        }
                    },
                }}
                trigger={
                    <AuthButton
                        normal="admissionDetail-KnockOff"
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
                                <Descriptions.Item label="暂存总额" span={12}>
                                    {/* {formatCurrency(
                                        storageNum.total_temp_chips + '',
                                    )} */}
                                    万
                                </Descriptions.Item>

                                <Descriptions.Item label="取暂存" span={12}>
                                    {formatCurrency(
                                        doubleParams.take_temp_chips,
                                    )}
                                    万
                                </Descriptions.Item>
                                {doubleParams.is_suspend_start_work === 2 ? (
                                    <div>取暂存后继续开工</div>
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
                onVisibleChange={(visible) => {
                    if (visible) {
                        setIsPass(true);
                    } else {
                        if (step === 2) {
                            setStep(1);
                        }
                    }
                }}
                onFieldsChange={(changedFields: any, allFields) => {
                    const total = new Big(
                        +getValue(allFields, 'mud_chips') || 0,
                    )
                        .plus(+getValue(allFields, 'cash_chips') || 0)
                        .plus(
                            new Big(
                                +getValue(allFields, 'total_temp_chips') || 0,
                            ).div(SIZE),
                        );
                    // 收工台面
                    setOffworkTableNum(Number(total));
                    // 还M
                    const stop_work_marker_settlement =
                        workDetails.total_marker; // 已借M

                    formRef.current?.setFieldsValue({
                        marker_settlement:
                            Number(total.times(SIZE)) >
                            stop_work_marker_settlement
                                ? stop_work_marker_settlement
                                : Number(total.times(SIZE)),
                    });
                }}
                formRef={formRef}
                onFinish={onFinish}
                title={
                    <div className="knock-head">
                        <h3>{step === 1 ? '【收工】' : '【收工结算】'}</h3>
                        <div className="knock-head-item">
                            <div className="label">场次编号：</div>
                            <div className="value">{params.id}</div>
                        </div>
                        <div className="knock-head-item">
                            <div className="label">户口号：</div>
                            <div className="value">{dataInfo?.member_code}</div>
                        </div>
                        <div className="knock-head-item">
                            <div className="label">户口名：</div>
                            <div className="value">{dataInfo?.member_name}</div>
                        </div>
                    </div>
                }
                width={700}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
            >
                {step === 1 ? (
                    <>
                        <Col span={12} offset={6}>
                            <FormCurrency
                                name="total_temp_chips"
                                label="暂存数"
                                placeholder=""
                                disabled
                            />
                            <FormCurrency name="mud_chips" label="泥码数" />
                            <FormCurrency name="cash_chips" label="现金码" />
                            <Title level={5} style={{ textAlign: 'right' }}>
                                收工台面：
                                {offworkTableNum}万
                            </Title>
                            <Title level={4}>结算方式：</Title>

                            <FormCurrency
                                name="marker_settlement"
                                label="还M"
                                placeholder=""
                                disabled
                            />
                            <FormCurrency name="cash_settlement" label="现金" />
                            <FormCurrency
                                name="deposit_card_settlement"
                                label="存卡"
                            />
                        </Col>
                        <Col span={18} offset={2}>
                            <ProFormTextArea
                                label="备注"
                                name="remark"
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </>
                ) : (
                    renderWorkSettlement()
                )}
            </ModalForm>
            <RegisterPrint />
        </>
    );
};

export default KnockOff;
