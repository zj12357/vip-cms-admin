/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useRef, useEffect } from 'react';
import { Row, Col, Typography, message } from 'antd';
import { useParams } from 'react-router-dom';
import Big from 'big.js';
import { useHttp } from '@/hooks';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
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
    total_principal: number;
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

const KnockOff: FC<KnockOffProps> = ({ onSuccess, total_principal }) => {
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
    const [isPass, setIsPass] = useState(false); //?????????????????????
    const formRef = useRef<ProFormInstance>();
    // ????????????
    const { fetchData: fetchGetWorkDetails } = useHttp<
        GetWorkDetailsParams,
        null
    >(getWorkDetailsNew);
    // ??????????????????
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
        // ??????????????????
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
                        <Row className="kock-item-title">[??????]</Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
                            >
                                {formatCurrency(
                                    workSettlement.table_up_delivery
                                        .total_principal,
                                )}
                            </Col>
                            <Col span={4} offset={2}>
                                ???
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
                            >
                                {formatCurrency(
                                    workSettlement.table_up_delivery
                                        .leave_table_chips,
                                )}
                            </Col>
                            <Col span={9} offset={2}>
                                ???{' '}
                                {workSettlement.table_up_delivery.remark
                                    ? workSettlement.table_up_delivery.remark
                                    : ''}
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
                            >
                                {formatCurrency(
                                    workSettlement.table_up_delivery
                                        .up_down_chips,
                                )}
                            </Col>
                            <Col span={4} offset={2}>
                                ???
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
                            >
                                {formatCurrency(
                                    workSettlement.table_up_delivery
                                        .total_convert_chips,
                                )}
                            </Col>
                            <Col span={4} offset={2}>
                                ???
                            </Col>
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {workSettlement.shares_type_b_delivery_list ? (
                    <div className={`kock-item kock-item-green`}>
                        <Row className="kock-item-title">[B?????????]</Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
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
                                offset={2}
                            >
                                ???????????????
                            </Col>
                            <Col
                                className={`knock-item-center ${
                                    workSettlement.shares_type_b_delivery_list
                                        .share_value > 0
                                        ? 'green-text'
                                        : 'red-text'
                                }`}
                                span={3}
                                offset={2}
                            >
                                {
                                    workSettlement.shares_type_b_delivery_list
                                        .share_value
                                }
                            </Col>
                            <Col span={9} offset={2}>
                                ???{' '}
                                {workSettlement.shares_type_b_delivery_list
                                    .remark
                                    ? workSettlement.shares_type_b_delivery_list
                                          .remark
                                    : ''}
                            </Col>
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {workSettlement.steal_food_delivery ? (
                    <div className="kock-item kock-item-blue">
                        <Row className="kock-item-title">[????????????]</Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ??????????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
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
                                offset={2}
                            >
                                ???????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
                            >
                                {formatCurrency(
                                    workSettlement.steal_food_delivery
                                        .share_parent_deposit,
                                )}
                            </Col>
                            <Col span={9} offset={2}>
                                ???{' '}
                                {workSettlement.steal_food_delivery
                                    .share_parent_remark
                                    ? workSettlement.steal_food_delivery
                                          .share_parent_remark
                                    : ''}
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ??????????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
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
                                offset={2}
                            >
                                ???????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
                            >
                                {formatCurrency(
                                    workSettlement.steal_food_delivery
                                        .commission_rate_value,
                                )}
                            </Col>
                            <Col span={9} offset={2}>
                                ???{' '}
                                {workSettlement.steal_food_delivery
                                    .commission_remark
                                    ? workSettlement.steal_food_delivery
                                          .commission_remark
                                    : ''}
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ??????????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
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
                                offset={2}
                            >
                                ???????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
                            >
                                {formatCurrency(
                                    workSettlement.steal_food_delivery
                                        .share_number_other,
                                )}
                            </Col>
                            <Col span={9} offset={2}>
                                ???{' '}
                                {workSettlement.steal_food_delivery
                                    .share_other_remark
                                    ? workSettlement.steal_food_delivery
                                          .share_other_remark
                                    : ''}
                            </Col>
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {workSettlement.operation_delivery ? (
                    <div className="kock-item kock-item-yellow">
                        <Row className="kock-item-title">[????????????]</Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ???????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
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
                                offset={2}
                            >
                                ???????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
                            >
                                {formatCurrency(
                                    workSettlement.operation_delivery
                                        .table_bottom_deposit,
                                )}
                            </Col>
                            <Col span={4} offset={2}>
                                ???
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ??????????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
                            >
                                {formatCurrency(
                                    workSettlement.operation_delivery
                                        .table_bottom_up_down_chips,
                                )}
                            </Col>
                            <Col span={9} offset={2}>
                                ???{' '}
                                {workSettlement.operation_delivery.remark
                                    ? workSettlement.operation_delivery.remark
                                    : ''}
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ??????????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
                            >
                                {formatCurrency(
                                    workSettlement.operation_delivery
                                        .table_bottom_convert_chips,
                                )}
                            </Col>
                            <Col span={4} offset={2}>
                                ???
                            </Col>
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {workSettlement.table_bottom_shares_type_b_delivery ? (
                    <div className="kock-item kock-item-yellowGrren">
                        <Row className="kock-item-title">[??????B?????????]</Row>
                        <Row>
                            <Col
                                className="knock-item-right"
                                span={3}
                                offset={2}
                            >
                                ??????????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
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
                                offset={2}
                            >
                                ?????????????????????
                            </Col>
                            <Col
                                className="knock-item-center"
                                span={3}
                                offset={2}
                            >
                                {formatCurrency(
                                    workSettlement
                                        .table_bottom_shares_type_b_delivery
                                        .table_bottom_shares_value,
                                )}
                            </Col>
                            <Col span={4} offset={2}>
                                ???{' '}
                                {workSettlement
                                    .table_bottom_shares_type_b_delivery.remark
                                    ? workSettlement
                                          .table_bottom_shares_type_b_delivery
                                          .remark
                                    : ''}
                            </Col>
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {workSettlement.other_member_shares_b_delivery &&
                workSettlement.other_member_shares_b_delivery.length > 0 ? (
                    <div className="kock-item kock-item-red">
                        {workSettlement.other_member_shares_b_delivery.map(
                            (item: any) => {
                                return (
                                    <>
                                        <Row className="kock-item-title">
                                            [????????????B?????????]
                                        </Row>
                                        <Row>
                                            <Col
                                                className="knock-item-right"
                                                span={3}
                                                offset={2}
                                            >
                                                ??????????????????
                                            </Col>
                                            <Col
                                                className="knock-item-center"
                                                span={3}
                                                offset={2}
                                            >
                                                {item.share_number}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col
                                                className="knock-item-right"
                                                span={3}
                                                offset={2}
                                            >
                                                ?????????????????????
                                            </Col>
                                            <Col
                                                className="knock-item-center"
                                                span={3}
                                                offset={2}
                                            >
                                                {formatCurrency(
                                                    item.share_deposit,
                                                )}
                                            </Col>
                                            <Col span={9} offset={2}>
                                                ???{' '}
                                                {item.remark ? item.remark : ''}
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
    return (
        <>
            <ModalForm
                layout="horizontal"
                modalProps={{
                    destroyOnClose: true,
                    okText: step === 1 ? '?????????' : '????????????',
                    cancelText: step === 1 ? '??????' : '???????????????',
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
                    // ????????????
                    setOffworkTableNum(Number(total));
                    // ???M
                    const stop_work_marker_settlement =
                        workDetails.total_marker; // ??????M

                    formRef.current?.setFieldsValue({
                        marker_settlement:
                            Number(total.times(SIZE)) >
                            stop_work_marker_settlement
                                ? stop_work_marker_settlement
                                : Number(total.times(SIZE)),
                    });
                }}
                formRef={formRef}
                onFinish={async (values: any) => {
                    if (step === 1) {
                        const total_settlement = Number(
                            new Big(
                                formRef.current?.getFieldValue(
                                    'marker_settlement',
                                ) || 0,
                            )
                                .div(SIZE)
                                .plus(
                                    formRef.current?.getFieldValue(
                                        'cash_settlement',
                                    ) || 0,
                                )
                                .plus(
                                    formRef.current?.getFieldValue(
                                        'deposit_card_settlement',
                                    ) || 0,
                                ),
                        );

                        const mudChips = Number(
                            new Big(
                                formRef.current?.getFieldValue('mud_chips') ||
                                    0,
                            ).times(SIZE),
                        );
                        if (mudChips > total_principal) {
                            message.error('???????????????????????????????????????');
                            return;
                        }
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
                            message.error('????????????????????????????????????');
                        }
                    } else {
                        const res = await fetchStopWork(stopParams);
                        if (res.code === 10000) {
                            onSuccess();
                            message.success(res.msg);
                            setIsPass(false);
                            let { small_ticket } = res.data || ({} as any);
                            small_ticket.operation_type = '??????';
                            handlePrint({
                                items: [
                                    { k: 'member_code', n: '????????????' },
                                    { k: 'operation_type', n: '????????????' },
                                    {
                                        k: 'created_at',
                                        n: '????????????',
                                        type: 'Date',
                                    },
                                    { k: 'round', n: '????????????' },
                                    {
                                        k: 'amount',
                                        n: '????????????',
                                        type: 'Currency',
                                    },
                                    {
                                        k: 'convert_chips',
                                        n: '?????????',
                                        type: 'Currency',
                                    },
                                    {
                                        k: 'total_convert_chips',
                                        n: '?????????',
                                        type: 'Currency',
                                    },
                                ].map((x) => {
                                    return {
                                        type: x.type,
                                        label: x.n,
                                        value: small_ticket
                                            ? small_ticket[x.k]
                                            : '- -',
                                    };
                                }),
                            });

                            return true;
                        }
                    }
                }}
                title={
                    <div className="knock-head">
                        <h3>{step === 1 ? '????????????' : '??????????????????'}</h3>
                        <div className="knock-head-item">
                            <div className="label">???????????????</div>
                            <div className="value">{params.id}</div>
                        </div>
                        <div className="knock-head-item">
                            <div className="label">????????????</div>
                            <div className="value">{dataInfo?.member_code}</div>
                        </div>
                        <div className="knock-head-item">
                            <div className="label">????????????</div>
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
                                label="?????????"
                                placeholder=""
                                disabled
                            />
                            <FormCurrency name="mud_chips" label="?????????" />
                            <FormCurrency name="cash_chips" label="?????????" />
                            <Title level={5} style={{ textAlign: 'right' }}>
                                ???????????????
                                {offworkTableNum}???
                            </Title>
                            <Title level={4}>???????????????</Title>

                            <FormCurrency
                                name="marker_settlement"
                                label="???M"
                                placeholder=""
                                disabled
                            />
                            <FormCurrency name="cash_settlement" label="??????" />
                            <FormCurrency
                                name="deposit_card_settlement"
                                label="??????"
                            />
                        </Col>
                        <Col span={18} offset={2}>
                            <ProFormTextArea
                                label="??????"
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
