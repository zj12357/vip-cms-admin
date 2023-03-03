/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useRef, useState, useEffect, useCallback } from 'react';

import { useParams } from 'react-router-dom';
import Big from 'big.js';
import { useHttp } from '@/hooks';
import { Row, Col, Button, Radio, message, Descriptions } from 'antd';
import { ExclamationCircleFilled, PhoneOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import VerifierPassword from '@/pages/AccountManagement/components/VerifierPassword';
import type { RadioChangeEvent } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormTextArea,
    ProFormRadio,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { createCash } from '@/api/admission';
import { CreateCashParams } from '@/types/api/admission';
import { getCashBalance, getMarkerBalance } from '@/api/scene';
import { CashBalancePaeams } from '@/types/api/scene';
import FormCurrency from '@/components/Currency/FormCurrency';
import ModalHead from '../components/modalHead';
import './index.scoped.scss';
import { formatCurrency } from '@/utils/tools';
import AuthButton from '@/components/AuthButton';
import usePrint from '@/hooks/usePrint';
import { TicketDataProps, MarkerDataProps } from '@/hooks/usePrint/print';
import moment from 'moment';

interface Data {
    label: string;
    value: number;
}

interface BalanceItem {
    available: number;
    currency_id: number;
}

type LotteryPlusProps = {
    member_id: string;
    currency: number;
    frozenAmount: number;
    dataInfo: any;
    onSuccess: () => void;
};

const MarkerType = [
    {
        label: '股东',
        value: '1',
    },
    {
        label: '上线',
        value: '2',
    },
    {
        label: '公司',
        value: '3',
    },
    {
        label: '临时',
        value: '4',
    },
    {
        label: '股本',
        value: '5',
    },
    {
        label: '禁批额度',
        value: '6',
    },
];
const SIZE = 1000000;
const LotteryPlus: FC<LotteryPlusProps> = (props) => {
    const { RegisterPrint, handlePrint } = usePrint<
        TicketDataProps | MarkerDataProps
    >('Ticket');
    const { member_id, currency, frozenAmount, onSuccess, dataInfo } = props;
    const navigate = useNavigate();
    const paramsR = useParams();
    const formRef = useRef<ProFormInstance>();
    const [tab, setTab] = useState('C');
    const [showTip, setShowTip] = useState(true);
    const [balance, setBalance] = useState<Array<BalanceItem>>([]);
    const [markerBalance, setMarkerBalance] = useState<Array<any>>([]);
    const [multiple, setMultiple] = useState(0); // 台底倍数
    const [depositAddMax, setDepositAddMax] = useState(0); // 加彩最大数值
    const currencyList = useAppSelector(selectCurrencyList);
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数
    const { fetchData: fetchCreateCash } = useHttp<CreateCashParams, null>(
        createCash,
    );
    // 查询cash加彩余额
    const { fetchData: fetchCashBalance, loading: cashLoading } = useHttp<
        CashBalancePaeams,
        any
    >(getCashBalance);

    // 查询maker加彩余额
    const { fetchData: fetchMakerBalance, loading: markerLoading } = useHttp<
        CashBalancePaeams,
        any
    >(getMarkerBalance);
    // 查找某项值
    const getValue = (allFields: any, label: string) => {
        return (
            allFields?.find((item: any) => {
                return item.name[0] === label;
            })?.value || null
        );
    };

    const fetchCashBalanceReq = useCallback(() => {
        fetchCashBalance({ round: paramsR.id }).then((res) => {
            setBalance(res?.data || []);
        });
    }, [paramsR.id]);

    const fetchMakerBalanceReq = useCallback(() => {
        fetchMakerBalance({ round: paramsR.id }).then((res) => {
            const newArr = MarkerType.map((item) => {
                const resItem =
                    (res.data || []).find(
                        (i: any) => i.marker_type === +item.value,
                    ) || {};
                return {
                    ...resItem,
                    label: `${item.label}${formatCurrency(
                        resItem.available_amount,
                    )}w`,
                    value: +item.value,
                };
            });
            setMarkerBalance(newArr);
        });
    }, [paramsR.id]);

    useEffect(() => {
        fetchCashBalanceReq();
        fetchMakerBalanceReq();
    }, [paramsR.id]);

    // 通过加彩余额计算最大值
    useEffect(() => {
        if (balance.length) {
            const bal = balance.find((i) => i.currency_id === currency);
            setDepositAddMax(bal?.available || 0);
        }
    }, [balance, currency]);

    const toExchange = () => {
        navigate(`/account/customerAccountDetail/${member_id}`);
    };
    const getLabel = (data: Array<Data>, value: number) => {
        return data.find((item) => item.value === value)?.label;
    };

    const onFinish = async (values: any) => {
        if (
            values.verifier_pass === undefined &&
            values.phone_verifier_pass === undefined
        ) {
            message.error('请先验证');
            return;
        }
        if (!(values.verifier_pass || values.phone_verifier_pass)) {
            message.error('验证不通过，不能操作');
            return;
        }
        const params = {
            round: paramsR.id,
            ...values,
            marker_add_chips: values.marker_add_chips
                ? values.marker_add_chips
                : 0,
            cash_add_chips: values.cash_add_chips ? values.cash_add_chips : 0,
            table_bottom_multiple: +multiple || 0,
            frozen_share_deposit: values.frozen_share_deposit
                ? +values.frozen_share_deposit
                : 0,
            principal_type: tab,
            total_add_chips: Math.floor(values.total_add_chips),
            table_bottom_deposit: Math.floor(values.table_bottom_deposit),
        };
        setDoubleParams(params);
        setDoubleVisible(true);
    };
    const handleDoubleSuccess = async () => {
        const res = await fetchCreateCash(doubleParams);
        if (res.code === 10000) {
            message.success('加彩成功');
            fetchMakerBalanceReq();
            fetchCashBalanceReq();
            onSuccess();
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
            let { small_ticket, receipt } = res.data || ({} as any);
            if (small_ticket) {
                small_ticket.operation_type = '加彩';
                handlePrint(
                    {
                        items: [
                            { k: 'member_code', n: '客户户口' },
                            { k: 'operation_type', n: '操作类型' },
                            {
                                k: 'created_at',
                                n: '加彩时间',
                                type: 'Date',
                            },
                            { k: 'round', n: '场次编号' },
                            {
                                k: 'amount',
                                n: '加彩金额',
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
                                value: small_ticket[x.k]
                                    ? small_ticket[x.k]
                                    : '- -',
                            };
                        }),
                    },
                    'Ticket',
                    {
                        onAfterPrint: () => {
                            if (receipt) {
                                handlePrint(
                                    {
                                        borrower: receipt.member_name, // 借款人
                                        borrowAccount: receipt.member_code, // 借款户口
                                        currency: receipt.currency_name, // 币种
                                        amountCapital: `${
                                            formatCurrency(receipt.amount) *
                                            10000
                                        }`,
                                        amountCurrency: `${formatCurrency(
                                            receipt.amount,
                                        )}万`,
                                        repaymentDate: moment(
                                            new Date(receipt.expire_day * 1000),
                                        ).format('YYYY-MM-DD'), // 还款日期
                                        interest: receipt.rate * 100 + '%', // 违约利息
                                        remark: receipt.remark, // 备注
                                        id: receipt.round,
                                    },
                                    'Marker',
                                );
                            }
                        },
                    },
                );
            }
        }
    };
    const renderDescriptions = () => {
        let markerAmount = 0;
        if (tab === 'M') {
            markerAmount =
                markerBalance.find(
                    (i) =>
                        +i.marker_type === +doubleParams.marker_add_chips_type,
                )?.available_amount || 0;
        }

        return (
            <Descriptions column={24}>
                {tab === 'C' ? (
                    <>
                        <Descriptions.Item label="存卡加彩" span={12}>
                            {formatCurrency(
                                doubleParams.deposit_card_add_chips || 0,
                            )}
                            万
                        </Descriptions.Item>
                        <Descriptions.Item label="现金加彩" span={12}>
                            {formatCurrency(doubleParams.cash_add_chips || 0)}万
                        </Descriptions.Item>
                    </>
                ) : (
                    <>
                        <Descriptions.Item label="可用批额" span={12}>
                            {formatCurrency(markerAmount)}万
                        </Descriptions.Item>
                        <Descriptions.Item label="批额加彩" span={12}>
                            {formatCurrency(doubleParams.marker_add_chips || 0)}
                            万
                        </Descriptions.Item>
                    </>
                )}
                {dataInfo.start_work_type === 2 ? (
                    <>
                        <Descriptions.Item label="台底倍数" span={12}>
                            {doubleParams.table_bottom_multiple}
                        </Descriptions.Item>
                        <Descriptions.Item label="台底押金" span={12}>
                            {formatCurrency(
                                doubleParams.table_bottom_deposit || 0,
                            )}
                            万
                        </Descriptions.Item>
                    </>
                ) : (
                    ''
                )}
                <Descriptions.Item label="冻结占成保证金" span={18}>
                    {formatCurrency(doubleParams.frozen_share_deposit || 0)}万
                </Descriptions.Item>
            </Descriptions>
        );
    };
    return (
        <>
            <ModalForm
                disabled={cashLoading || markerLoading}
                layout="horizontal"
                modalProps={{
                    destroyOnClose: true,
                }}
                trigger={
                    <AuthButton
                        normal="admissionDetail-LotteryPlus"
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        buttonProps={{
                            type: 'primary',
                        }}
                        firstVisible={isPass}
                        isSecond={true}
                        secondDom={
                            <>
                                <h3 style={{ marginBottom: 10 }}>
                                    请确认是否加彩
                                </h3>
                                {renderDescriptions()}
                            </>
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
                onVisibleChange={(val) => {
                    setIsPass(val);
                }}
                onFinish={onFinish}
                title="加彩"
                width={700}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                formRef={formRef}
                onFieldsChange={(changedFields: any, allFields) => {
                    // C码  加彩总本金=存卡加彩+现金加彩
                    // M码  加彩总本金=批额加彩+现金加彩   m+m*5 = 600
                    const bonusSumPrincipal: any =
                        tab === 'C'
                            ? Number(
                                  new Big(
                                      +getValue(
                                          allFields,
                                          'deposit_card_add_chips',
                                      ) || 0,
                                  ).plus(
                                      +getValue(allFields, 'cash_add_chips') ||
                                          0,
                                  ),
                              )
                            : Number(
                                  new Big(
                                      +getValue(
                                          allFields,
                                          'marker_add_chips',
                                      ) || 0,
                                  ).plus(
                                      +getValue(allFields, 'cash_add_chips'),
                                  ),
                              );
                    // 台底押金=加彩总本金*台底倍数
                    const tabledeposit = Number(
                        new Big(bonusSumPrincipal).times(multiple).times(SIZE),
                    );
                    // 加彩总额=加彩总本金+台底押金
                    const add_chips = Number(
                        new Big(bonusSumPrincipal)
                            .times(SIZE)
                            .plus(tabledeposit),
                    );
                    if (changedFields[0]?.name[0] !== 'total_add_chips') {
                        // 正推
                        formRef?.current?.setFieldsValue({
                            total_add_chips: add_chips,
                            table_bottom_deposit: tabledeposit,
                        });
                    } else {
                        // 反推
                        let firstValue;
                        if (+getValue(allFields, 'cash_add_chips')) {
                            firstValue = Number(
                                new Big(+getValue(allFields, 'total_add_chips'))
                                    .div(multiple + 1)
                                    .minus(
                                        +getValue(
                                            allFields,
                                            'cash_add_chips',
                                        ) || 0,
                                    ),
                            );
                        } else {
                            firstValue = Number(
                                new Big(
                                    +getValue(allFields, 'total_add_chips'),
                                ).div(multiple + 1),
                            );
                        }

                        if (firstValue < 0) {
                            message.error('错误', 0.5, () => {
                                formRef?.current?.setFieldsValue({
                                    total_add_chips: add_chips,
                                    table_bottom_deposit: tabledeposit,
                                });
                            });

                            return false;
                        }
                        if (tab === 'C') {
                            formRef?.current?.setFieldsValue({
                                deposit_card_add_chips: firstValue,
                            });
                        } else {
                            formRef?.current?.setFieldsValue({
                                marker_add_chips: Number(
                                    new Big(firstValue).div(1000000),
                                ),
                            });
                        }
                        formRef?.current?.setFieldsValue({
                            cash_add_chips: getValue(
                                allFields,
                                'cash_add_chips',
                            ),
                            table_bottom_deposit: Number(
                                new Big(firstValue).times(multiple),
                            ),
                        });
                    }
                }}
            >
                <ModalHead
                    getTable_bottom_multiple={(multiple) => {
                        setMultiple(multiple || 0);
                        formRef?.current?.setFieldsValue({
                            table_bottom_multiple: `${multiple || 0}x`,
                        });
                    }}
                />
                <div className="l-modal-tab">
                    <Radio.Group
                        options={[
                            { label: 'C码', value: 'C' },
                            { label: 'M码', value: 'M' },
                        ]}
                        onChange={({ target: { value } }: RadioChangeEvent) => {
                            setTab(value);
                            formRef.current?.resetFields();
                            formRef?.current?.setFieldsValue({
                                table_bottom_multiple: `${multiple || 0}x`,
                            });
                        }}
                        value={tab}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </div>
                {tab === 'C' ? (
                    <div className="l-modal-tab-c">
                        <div className="currency-list">
                            <span>存卡余额：</span>
                            {balance.map((item, index) => (
                                <span key={index}>
                                    {getLabel(currencyList, item.currency_id)}：
                                    {formatCurrency(item.available + '')}w
                                </span>
                            ))}
                        </div>

                        <Button onClick={toExchange}>兑换</Button>
                    </div>
                ) : (
                    <ProFormRadio.Group
                        label="可用批额"
                        name="marker_add_chips_type"
                        options={markerBalance}
                        rules={[{ required: true, message: '请选择可用批额' }]}
                    />
                )}

                <ProForm.Group>
                    {tab === 'C' ? (
                        <FormCurrency
                            name="deposit_card_add_chips"
                            label="存卡加彩"
                            placeholder={'请输入金额'}
                            rules={[
                                {
                                    validator: (rule, val) => {
                                        if (+val < 0) {
                                            return Promise.reject(
                                                '存卡加彩不可为负数',
                                            );
                                        } else if (val * SIZE > depositAddMax) {
                                            return Promise.reject(
                                                '存卡加彩最大不可超过存款余额',
                                            );
                                        } else {
                                            return Promise.resolve(true);
                                        }
                                    },
                                },
                            ]}
                        />
                    ) : (
                        <FormCurrency
                            name="marker_add_chips"
                            label="批额加彩"
                            rules={[
                                {
                                    validator: (rule, val) => {
                                        if (+val < 0) {
                                            return Promise.reject(
                                                '批额加彩不可为负数',
                                            );
                                        } else {
                                            return Promise.resolve(true);
                                        }
                                    },
                                },
                            ]}
                        />
                    )}

                    {tab === 'C' ? (
                        <FormCurrency
                            name="cash_add_chips"
                            label="现金加彩"
                            placeholder={'请输入金额'}
                            rules={[
                                {
                                    validator: (rule, val) => {
                                        if (+val < 0) {
                                            return Promise.reject(
                                                '现金加彩不可为负数',
                                            );
                                        } else {
                                            return Promise.resolve(true);
                                        }
                                    },
                                },
                            ]}
                        />
                    ) : (
                        ''
                    )}
                </ProForm.Group>
                <ProForm.Group>
                    <FormCurrency
                        name="total_add_chips"
                        label="加彩总额"
                        placeholder={''}
                        disabled
                        addonAfter={
                            <>
                                <ExclamationCircleFilled
                                    onClick={() => {
                                        setShowTip(!showTip);
                                    }}
                                />
                                {showTip && (
                                    <span
                                        style={{
                                            marginLeft: '10px',
                                            color: '#ccc',
                                            fontSize: '12px',
                                        }}
                                    >
                                        包含台底押金
                                    </span>
                                )}
                            </>
                        }
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        name="table_bottom_multiple"
                        label="台底倍数"
                        placeholder=""
                        disabled
                        addonAfter={<span>倍</span>}
                    />
                    <FormCurrency
                        name="table_bottom_deposit"
                        label="台底押金"
                        placeholder=""
                        disabled
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <FormCurrency
                        name="frozen_share_deposit"
                        label="冻结占成保证金"
                        placeholder={'请输入金额'}
                        rules={[
                            {
                                validator: (rule, val) => {
                                    if (+val < 0) {
                                        return Promise.reject(
                                            '冻结占成保证金不可为负数',
                                        );
                                    } else {
                                        return Promise.resolve(true);
                                    }
                                },
                            },
                        ]}
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

                <VerifierPassword
                    formRef={formRef}
                    for="加彩"
                    identity_module={7}
                    member_id={member_id}
                ></VerifierPassword>

                <ProForm.Group>
                    <ProFormTextArea width="xl" label="备注" name="remark" />
                </ProForm.Group>
            </ModalForm>
            <RegisterPrint />
        </>
    );
};

export default LotteryPlus;
