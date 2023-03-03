/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef, useState } from 'react';
import {
    ProFormText,
    ModalForm,
    ProFormSelect,
    ProFormTextArea,
    ProFormInstance,
} from '@ant-design/pro-components';
import { isFloatingPointNumber } from '@/utils/validate';
import { useAppSelector } from '@/store/hooks';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import { PayType } from '@/common/commonConstType';
import FormCurrency from '@/components/Currency/FormCurrency';
import {
    buyChip,
    refundChip,
    changeChip,
    getBuyChipsList,
} from '@/api/silverHead';
import {
    BuyChipParams,
    RefundParams,
    ChangeParams,
} from '@/types/api/silverHead';
import { useHttp } from '@/hooks';
import Big from 'big.js';
import './index.scoped.scss';
import AuthButton from '@/components/AuthButton';
import { Descriptions } from 'antd';
import { formatCurrency } from '@/utils/tools';

type Props = {
    type?: number; // 默认为大场买码 0-大场买码  1-大场退码 2-大场转码
    onSuccess: () => void;
};
const EditdModal: FC<Props> = (props) => {
    const { type, onSuccess } = props;
    const formRef = useRef<ProFormInstance>();
    const currencyList = useAppSelector(selectCurrencyList);
    const currentHall = useAppSelector(selectCurrentHall);
    const [chipsList, setChipsList] = useState<any>([]);
    const [allChipsList, setAllChipsList] = useState<any>([]);
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数
    const { fetchData: fetchBuyChip } = useHttp<BuyChipParams, any>(buyChip);
    const { fetchData: fetchRefundChip } = useHttp<RefundParams, any>(
        refundChip,
    );
    const { fetchData: fetchChangeChip } = useHttp<ChangeParams, any>(
        changeChip,
    );
    const { fetchData: fetchGetBuyChipsList, loading } = useHttp<any, any>(
        getBuyChipsList,
    );

    useEffect(() => {
        if (isPass) {
            fetchGetBuyChipsList().then((res) => {
                setAllChipsList(res?.data?.Currencys || []);
            });
        }
    }, [isPass]);
    const getLabel = (list: any[], id: number) => {
        return list.find((i) => i.value === id)?.label || '';
    };
    const onFinish = async (values: any) => {
        let params: any = {
            ...values,
            hall_id: currentHall.id,
            hall_name: currentHall.hall_name,
            chips_name:
                chipsList.find((item: any) => item.value === values.chips_id)
                    ?.label ?? '',
        };
        if (type === 0) {
            params = {
                ...params,
            } as BuyChipParams;
        } else if (type === 1) {
            params = {
                ...params,
            } as RefundParams;
        } else {
            params = {
                ...params,
            } as ChangeParams;
        }
        setDoubleParams(params);
        setDoubleVisible(true);

        return false;
    };
    const handleDoubleSuccess = async () => {
        const res = await (type === 0
            ? fetchBuyChip
            : type === 1
            ? fetchRefundChip
            : fetchChangeChip)(doubleParams);
        if (res.code === 10000) {
            setTimeout(() => {
                setIsPass(false);
                setDoubleVisible(false);
                setDoubleParams({});
                onSuccess();
            }, 1000);
        }
    };
    return (
        <ModalForm
            width={700}
            formRef={formRef}
            labelCol={{ span: 4 }}
            initialValues={{
                hall_name: currentHall.hall_name,
            }}
            wrapperCol={{ span: 18 }}
            trigger={
                <AuthButton
                    normal={`silverHeadOverview-${
                        type === 0 ? 'buy' : type === 1 ? 'return' : 'changed'
                    }`}
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
                            <Descriptions.Item label="场馆" span={12}>
                                {currentHall.hall_name}
                            </Descriptions.Item>
                            {type !== 2 ? (
                                <Descriptions.Item label="购买方式" span={12}>
                                    {getLabel(PayType, doubleParams.trade_kind)}
                                </Descriptions.Item>
                            ) : (
                                ''
                            )}
                            <Descriptions.Item label="币种" span={12}>
                                {getLabel(
                                    currencyList,
                                    doubleParams.currency_id,
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="筹码名称" span={12}>
                                {getLabel(chipsList, doubleParams.chips_id)}
                            </Descriptions.Item>
                            {type === 0 ? (
                                <Descriptions.Item label="购买泥码数" span={12}>
                                    {formatCurrency(doubleParams.amount)}万
                                </Descriptions.Item>
                            ) : type === 1 ? (
                                <>
                                    <Descriptions.Item
                                        label="退泥玛数"
                                        span={12}
                                    >
                                        {formatCurrency(
                                            doubleParams.junkets_amount,
                                        )}
                                        万
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                        label="退现金码数"
                                        span={12}
                                    >
                                        {formatCurrency(doubleParams.amount)}万
                                    </Descriptions.Item>
                                </>
                            ) : type === 2 ? (
                                <Descriptions.Item label="转码数量" span={12}>
                                    {formatCurrency(doubleParams.amount)}万
                                </Descriptions.Item>
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
            title={
                type === 0 ? '大场买码' : type === 1 ? '大场退码' : '大场转码'
            }
            modalProps={{
                destroyOnClose: true,
            }}
            layout="horizontal"
            onVisibleChange={(val) => setIsPass(val)}
            onValuesChange={(changedValue: any, allValues) => {
                const changedKey = Object.keys(changedValue)[0];
                const currencyId = allValues.currency_id;
                if (changedKey === 'currency_id') {
                    const chipsItem =
                        allChipsList.find(
                            (i: any) => i.currency_id === currencyId,
                        ) || {};
                    setChipsList(
                        (chipsItem?.Chips || []).map((i: any) => {
                            return {
                                ...i,
                                label: i.chips_name,
                                value: i.chips_id,
                            };
                        }),
                    );
                    formRef?.current?.setFieldsValue({
                        chips_id: '',
                        junkets_balance: '',
                        regular_balance: '',
                        amount: '',
                        junkets_amount: '',
                    });
                } else if (changedKey === 'chips_id') {
                    const chipsId = allValues.chips_id;
                    const chipItem =
                        chipsList.find((i: any) => i.chips_id === chipsId) ||
                        {};
                    formRef?.current?.setFieldsValue({
                        junkets_balance: chipItem.junkets_balance || '',
                        regular_balance: chipItem.regular_balance || '',
                        amount: '',
                        junkets_amount: '',
                    });
                }
            }}
            visible={isPass}
            onFinish={onFinish}
            grid
            submitter={{
                searchConfig: {
                    resetText: '关闭',
                    submitText: '确认',
                },
            }}
        >
            <ProFormText name="hall_name" label="场馆" disabled />
            <ProFormSelect
                name="currency_id"
                label="币种"
                options={currencyList}
                rules={[{ required: true }]}
            />
            {type !== 2 ? (
                <ProFormSelect
                    name="trade_kind"
                    label={type === 0 ? '购买方式' : '退款方式'}
                    options={PayType}
                    rules={[{ required: true }]}
                />
            ) : (
                ''
            )}

            <ProFormSelect
                name="chips_id"
                label="筹码名称"
                options={chipsList}
                rules={[{ required: true }]}
            />

            <FormCurrency name="junkets_balance" label="目前泥码" disabled />
            <FormCurrency name="regular_balance" label="目前现金码" disabled />
            {type === 0 ? (
                <FormCurrency
                    name="amount"
                    label="购买泥码数"
                    rules={[
                        {
                            validator: (rule, value) => {
                                if (
                                    value <= 0 &&
                                    isFloatingPointNumber.test(value)
                                ) {
                                    return Promise.reject('请输入正确的泥码数');
                                } else {
                                    return Promise.resolve(true);
                                }
                            },
                        },
                    ]}
                />
            ) : type === 1 ? (
                <>
                    <FormCurrency
                        name="junkets_amount"
                        label="退泥码数"
                        rules={[
                            {
                                validator: (rule, value) => {
                                    const junkets_balance = Number(
                                        new Big(
                                            +formRef?.current?.getFieldValue(
                                                'junkets_balance',
                                            ) || 0,
                                        ).div(1000000),
                                    );
                                    if (
                                        value <= 0 &&
                                        isFloatingPointNumber.test(value)
                                    ) {
                                        return Promise.reject(
                                            '请输入正确的退泥码数',
                                        );
                                    } else if (value > junkets_balance) {
                                        return Promise.reject(
                                            '退泥码数不能超过目前泥码',
                                        );
                                    } else {
                                        return Promise.resolve(true);
                                    }
                                },
                            },
                        ]}
                    />
                    <FormCurrency
                        name="amount"
                        label="退现金码数"
                        rules={[
                            {
                                validator: (rule, value) => {
                                    const regular_balance = Number(
                                        new Big(
                                            +formRef?.current?.getFieldValue(
                                                'regular_balance',
                                            ) || 0,
                                        ).div(1000000),
                                    );
                                    if (
                                        value <= 0 &&
                                        isFloatingPointNumber.test(value)
                                    ) {
                                        return Promise.reject(
                                            '请输入正确的退现金码数',
                                        );
                                    } else if (value > regular_balance) {
                                        return Promise.reject(
                                            '退现金码数不能超过目前现金码',
                                        );
                                    } else {
                                        return Promise.resolve(true);
                                    }
                                },
                            },
                        ]}
                    />
                </>
            ) : (
                <FormCurrency
                    name="amount"
                    label="转码数量"
                    rules={[
                        { required: true },
                        {
                            validator: (rule, value) => {
                                const regular_balance = Number(
                                    new Big(
                                        +formRef?.current?.getFieldValue(
                                            'regular_balance',
                                        ) || 0,
                                    ).div(1000000),
                                );
                                const junkets_balance = Number(
                                    new Big(
                                        +formRef?.current?.getFieldValue(
                                            'junkets_balance',
                                        ) || 0,
                                    ).div(1000000),
                                );
                                if (+value > 0 && +value > regular_balance) {
                                    return Promise.reject('现金码余额不足');
                                } else if (
                                    +value < 0 &&
                                    Math.abs(+value) > junkets_balance
                                ) {
                                    return Promise.reject('泥码余额不足');
                                } else {
                                    return Promise.resolve(true);
                                }
                            },
                        },
                    ]}
                />
            )}
            <ProFormTextArea name="remark" label="备注" />
            {/* </Spin> */}
        </ModalForm>
    );
};

export default EditdModal;
