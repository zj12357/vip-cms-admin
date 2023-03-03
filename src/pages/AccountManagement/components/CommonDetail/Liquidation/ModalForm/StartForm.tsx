import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Collapse, message, Tabs, Descriptions } from 'antd';
import PrincipalForm from './StartTypeForm/PrincipalForm';
import CodeOutForm from './StartTypeForm/CodeOutForm';
import StealFoodForm from './StartTypeForm/StealFoodForm';
import OthersStealFoodForm from './StartTypeForm/OthersStealFoodForm';
import TableForm from './StartTypeForm/TableForm';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import {
    admissionType,
    shareType,
    principalType,
    mCreditType,
    workType,
} from '@/common/commonConstType';
import { useHttp, useLatest } from '@/hooks';
import {
    createMemberStartWork,
    getMemberCurrencyBalance,
    getAccountantList,
} from '@/api/account';
import {
    CreateMemberStartWorkParams,
    GetMemberCommissionParams,
    GetMemberCurrencyBalanceParams,
    MemberCurrencyBalanceType,
    GetAccountantListParams,
    GetAccountantListItem,
} from '@/types/api/account';
import Big from 'big.js';
import _ from 'lodash';
import VerifierPassword from '@/pages/AccountManagement/components/VerifierPassword';
import FormCurrency from '@/components/Currency/FormCurrency';
import AuthButton from '@/components/AuthButton';
import usePrint from '@/hooks/usePrint';
import { MarkerDataProps, TicketDataProps } from '@/hooks/usePrint/print';
import { formatCurrency } from '@/utils/tools';
import { isPositiveNumber } from '@/utils/validate';
import moment from 'moment';

type StartFormProps = {};
const { TabPane } = Tabs;
const { Panel } = Collapse;

const StartForm: FC<StartFormProps> = (props) => {
    const { RegisterPrint, handlePrint } = usePrint<
        TicketDataProps | MarkerDataProps
    >('Ticket');

    const formRef = useRef<ProFormInstance>();
    const accountInfo = useAppSelector(selectAccountInfo);
    const currentHall = useAppSelector(selectCurrentHall);
    const currencyList = useAppSelector(selectCurrencyList).filter((item) =>
        item?.permission?.includes('2'),
    );
    const [startType, setStartType] = useState({
        start_type: 1, //开工类型
        code_out: 'C', //本金类型
        principal_type: 'A', //出码类型
        chips_name: '',
        currency: currencyList?.[0]?.value, //币种
        admission_type: 1, //入场类型
    });

    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    //marker设置数据
    const [markerList, setMarkerList] = useState<number[]>([]);

    //出码名称
    const [chipsNameList, setChipsNameList] = useState<GetAccountantListItem[]>(
        [],
    );

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        hall: currentHall.hall_name,
        coder: accountInfo.member_name,
        currency: startType.currency,
        admission_type: 1,
        start_type: 1,
        principal_type: 'A',
        share_type: 'C',
    }).current;

    //计算总出码
    const totalOutCode = useCallback(() => {
        const getValue = (type: string) => {
            return _.isNaN(+formRef.current?.getFieldValue(type))
                ? 0
                : +formRef.current?.getFieldValue(type);
        };
        //存款出码
        const depositCodeValue = getValue('deposit_code');

        //现金出码
        const cashOutValue = getValue('cash_out');

        //M类型出码
        const mOutValue: number = mCreditType.reduce(
            (curr: number, next: any) => {
                return (curr += Number(
                    new Big(getValue(`codeOut-${next.value}`)),
                ));
            },
            0,
        );

        //台底倍率
        const magnification = getValue('table_bottom_magnification');

        if (startType.start_type === 2) {
            //台面出码
            const tableOutCode = new Big(depositCodeValue)
                .plus(cashOutValue)
                .plus(mOutValue)
                .times(1000000);

            //台底押金
            const tableBottomDeposit = new Big(tableOutCode).times(
                magnification,
            );
            //总出码
            const total = new Big(tableOutCode)
                .plus(tableBottomDeposit)
                .div(1000000);

            formRef.current?.setFieldsValue({
                table_up_code: Number(tableOutCode),
            });
            formRef.current?.setFieldsValue({
                table_bottom_deposit: Number(tableBottomDeposit),
            });

            formRef.current?.setFieldsValue({
                total_code: Number(total),
            });
        } else {
            if (startType.code_out === 'C') {
                const total = new Big(depositCodeValue).plus(cashOutValue);
                formRef.current?.setFieldsValue({
                    total_code: Number(total),
                });
            } else {
                formRef.current?.setFieldsValue({
                    total_code: Number(mOutValue),
                });
            }
        }
    }, [startType.code_out, startType.start_type]);

    const { fetchData: _fetchMemberCurrencyBalance } = useHttp<
        GetMemberCurrencyBalanceParams,
        MemberCurrencyBalanceType
    >(getMemberCurrencyBalance, ({ data }) => {
        formRef.current?.setFieldsValue({
            balance: data.balance ?? 0,
        });
    });

    const { fetchData: _fetchCreateMemberStartWork } = useHttp<
        CreateMemberStartWorkParams,
        null
    >(createMemberStartWork, ({ msg }) => {
        message.success(msg);
    });

    //获取出码名称
    const { fetchData: _fetchGetAccountantList } = useHttp<
        GetAccountantListParams,
        GetAccountantListItem[]
    >(getAccountantList);

    const handleCreateMemberStartWork = async (values: any) => {
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

        let params: CreateMemberStartWorkParams = {
            member_code: values.member_code,
            member_name: values.member_name,
            member_type: accountInfo.member_type,
            hall: currentHall.id,
            coder: values.coder,
            currency: values.currency,
            admission_type: values.admission_type,
            start_type: values.start_type,
            chips_id: values.chips_id,
            chips_name: startType.chips_name,
            share_type: values.share_type,
            principal_type: values.principal_type,

            deposit_code: values.deposit_code
                ? +values.deposit_code
                : undefined,
            cash_out: values.cash_out ? +values.cash_out : undefined,
            total_code: new Big(+values.total_code).times(1000000).toNumber(),
            table_up_code: values?.table_up_code
                ? +values?.table_up_code
                : undefined,
            table_bottom_magnification: values?.table_bottom_magnification
                ? +values?.table_bottom_magnification
                : undefined,
            table_bottom_deposit: values?.table_bottom_deposit
                ? +values?.table_bottom_deposit
                : undefined,
            share_number: values?.b_share_number
                ? +values?.b_share_number
                : undefined,
            share_down_number: values?.b_share_down_number
                ? +values?.b_share_down_number
                : undefined,
            share_deposit: values?.b_share_deposit
                ? +values?.b_share_deposit
                : undefined,
            describe: values?.describe,
        };

        if (values.share_member || values.share_number) {
            params.steal_food_share = {
                share_member: values.share_member,
                share_number: values.share_number
                    ? +values.share_number
                    : undefined,
                share_deposit: values.share_deposit
                    ? +values.share_deposit
                    : undefined,
                commission_rate: values.commission_rate,
                share_member_other: values.share_member_other,
                share_deposit_other: values.share_deposit_other
                    ? +values.share_deposit_other
                    : undefined,
                share_number_other: values.share_number_other
                    ? +values.share_number_other
                    : undefined,
            };
        }
        if (markerList.length > 0) {
            params.member_use_marker = markerList.map((item) => {
                return {
                    marker_type: item,
                    amount: Number(
                        new Big(
                            +formRef.current?.getFieldValue(`codeOut-${item}`),
                        ).times(1000000),
                    ),
                };
            });
        }
        if (values.other_share) {
            params.other_share = values?.other_share?.map((item: any) => {
                return {
                    share_member: item.share_member,
                    share_number: +item.share_number,
                    share_deposit: item.share_deposit
                        ? new Big(+item.share_deposit).times(1000000).toNumber()
                        : undefined,
                };
            });
        }

        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchCreateMemberStartWork(doubleParams);
        if (res.code === 10000) {
            let data = res.data as any;
            handlePrint(
                {
                    items: [
                        { k: 'member_code', n: '客户户口' },
                        { k: 'operation_type', n: '操作类型' },
                        { k: 'start_work_time', n: '开工时间', type: 'Date' },
                        { k: 'start_work_id', n: '场次编号' },
                        { k: 'balance', n: '开工金额', type: 'Currency' },
                        { k: 'convert_chips', n: '转码量', type: 'Currency' },
                        {
                            k: 'total_convert_chips',
                            n: '总转码',
                            type: 'Currency',
                        },
                    ].map((x) => {
                        return {
                            type: x.type,
                            label: x.n,
                            value: data ? data[x.k] : '',
                        };
                    }),
                },
                'Ticket',
                {
                    onAfterPrint: () => {
                        if (data.total_marker > 0) {
                            handlePrint(
                                {
                                    borrower: doubleParams.member_name, // 借款人
                                    borrowAccount: doubleParams.member_code, // 借款户口
                                    currency: currencyList.find(
                                        (x) =>
                                            x.value === doubleParams.currency,
                                    )?.label as string, // 币种
                                    amountCapital: `${
                                        formatCurrency(data.total_marker) *
                                        10000
                                    }`,
                                    amountCurrency: `${formatCurrency(
                                        data.total_marker,
                                    )}万`,
                                    repaymentDate: data.expire_day, // 还款日期
                                    interest: data.rate * 100 + '%', // 违约利息
                                    remark: doubleParams.describe || '', // 备注
                                    id: data.start_work_id,
                                },
                                'Marker',
                            );
                        }
                    },
                },
            );
            // TODO print + 打印借款单
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
        }
    };

    //重置出码C，M的计算
    const resetCodeOut = (type: string) => {
        if (type === 'C') {
            formRef.current?.setFieldsValue({
                deposit_code: 0,
                cash_out: 0,
            });
        } else {
            mCreditType.forEach((item) => {
                formRef.current?.setFieldsValue({
                    [`codeOut-${item.value}`]: 0,
                });
            });
        }
    };

    //获取余额
    useEffect(() => {
        if (startType.currency && isPass) {
            _fetchMemberCurrencyBalance({
                hall: currentHall.id,
                member_code: accountInfo.member_code,
                currency_id: startType.currency,
                currency_code:
                    currencyList.find(
                        (item) => +item.value === +startType.currency,
                    )?.label ?? '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        _fetchMemberCurrencyBalance,
        currentHall.id,
        accountInfo.member_code,
        startType.currency,
        isPass,
    ]);

    //获取出码名称
    useEffect(() => {
        if (isPass) {
            _fetchGetAccountantList({
                currency: startType.currency,
                hall: currentHall.id,
                start_type: startType.start_type,
                principal_type:
                    startType.start_type === 1
                        ? startType.principal_type
                        : startType.principal_type + '(台面)',
                type: startType.admission_type,
                share_type: startType.code_out,
            }).then((res) => {
                setChipsNameList(res.data);
                formRef.current?.setFieldsValue({
                    chips_id: res.data?.[0]?.id,
                });
                setStartType((prev) => ({
                    ...prev,
                    chips_name: res.data?.[0]?.chips_name,
                }));
            });
            totalOutCode();
        }
    }, [
        _fetchGetAccountantList,
        currentHall.id,
        startType.currency,
        isPass,
        startType.start_type,
        startType.principal_type,
        startType.admission_type,
        startType.code_out,
        totalOutCode,
    ]);

    useEffect(() => {
        if (!isPass) {
            setStartType({
                start_type: 1, //开工类型
                code_out: 'C', //本金类型
                principal_type: 'A', //出码类型
                chips_name: '',
                currency: currencyList?.[0]?.value, //币种
                admission_type: 1, //入场类型
            });

            setMarkerList([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPass]);

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal="customerAccount-start"
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
                                <Descriptions.Item label="户口" span={12}>
                                    {accountInfo?.member_code}
                                </Descriptions.Item>
                                <Descriptions.Item label="户名" span={12}>
                                    {accountInfo?.member_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="出码人" span={12}>
                                    {doubleParams?.coder}
                                </Descriptions.Item>
                                <Descriptions.Item label="币种" span={12}>
                                    {currencyList.find(
                                        (item) =>
                                            +item.value ===
                                            +doubleParams.currency,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="入场类型" span={12}>
                                    {admissionType.find(
                                        (item) =>
                                            +item.value ===
                                            +doubleParams.admission_type,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="开工类型" span={12}>
                                    {workType.find(
                                        (item) =>
                                            +item.value ===
                                            +doubleParams.start_type,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="出码类型" span={12}>
                                    {doubleParams?.principal_type}
                                </Descriptions.Item>
                                <Descriptions.Item label="本金类型" span={12}>
                                    {doubleParams?.share_type}
                                </Descriptions.Item>
                                <Descriptions.Item label="存款出码" span={12}>
                                    {formatCurrency(
                                        doubleParams?.deposit_code ?? 0,
                                    )}
                                    万
                                </Descriptions.Item>
                                <Descriptions.Item label="现金出码" span={12}>
                                    {formatCurrency(
                                        doubleParams?.cash_out ?? 0,
                                    )}
                                    万
                                </Descriptions.Item>
                                <Descriptions.Item label="可用余额" span={12}>
                                    {formatCurrency(
                                        formRef.current?.getFieldValue(
                                            'balance',
                                        ) ?? 0,
                                    )}
                                    万
                                </Descriptions.Item>
                                <Descriptions.Item label="总出码" span={12}>
                                    {formatCurrency(
                                        doubleParams?.total_code ?? 0,
                                    )}
                                    万
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
                onFinish={handleCreateMemberStartWork}
                title="开工"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setIsPass(false);
                        setDoubleVisible(false);
                        setDoubleParams({});
                    },
                }}
                width={1000}
                formRef={formRef}
                visible={isPass}
                //ProForm initialValues 更新了但是 UI 未更新问题的方法。
                initialValues={updatedValues}
                // params={updatedValues}
                // request={async (params) => {
                //     return Promise.resolve({
                //         data: params,
                //         success: true,
                //     });
                // }}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_code"
                        label="户口"
                        disabled
                    />
                    <ProFormText width="md" name="hall" label="场馆" disabled />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_name"
                        label="户名"
                        disabled
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="coder"
                        label="出码人名称"
                        placeholder="请输入出码人"
                        rules={[
                            {
                                required: true,
                                message: '请输入出码人',
                            },
                        ]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        name="currency"
                        label="开工币种"
                        width="md"
                        options={currencyList}
                        placeholder="请选择开工币种"
                        rules={[
                            {
                                required: true,
                                message: '请选择开工币种',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onChange: (val) => {
                                setStartType((prev) => ({
                                    ...prev,
                                    currency: +val,
                                }));
                            },
                        }}
                        showSearch
                    />
                    <ProFormSelect
                        name="admission_type"
                        label="入场类型"
                        width="md"
                        options={admissionType}
                        placeholder="请选择入场类型"
                        rules={[
                            {
                                required: true,
                                message: '请选择入场类型',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onChange: (val) => {
                                setStartType((prev) => ({
                                    ...prev,
                                    admission_type: val,
                                }));
                            },
                        }}
                        showSearch
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        name="start_type"
                        label="开工类型"
                        width="md"
                        placeholder="请选择开工类型"
                        rules={[
                            {
                                required: true,
                                message: '请选择开工类型',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onChange: (val) => {
                                setStartType((prev) => ({
                                    ...prev,
                                    start_type: val,
                                }));
                            },
                        }}
                        showSearch
                        options={workType}
                    />
                    <ProFormSelect
                        name="principal_type"
                        label="出码类型"
                        width="md"
                        options={principalType}
                        placeholder="请选择出码类型"
                        rules={[
                            {
                                required: true,
                                message: '请选择出码类型',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onChange: (val, option: any) => {
                                setStartType((prev) => ({
                                    ...prev,
                                    principal_type: val,
                                }));
                            },
                        }}
                        showSearch
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        name="share_type"
                        label="本金类型"
                        width="md"
                        options={shareType}
                        placeholder="请选择本金类型"
                        rules={[
                            {
                                required: true,
                                message: '请选择本金类型',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onChange: (val, option: any) => {
                                setStartType((prev) => ({
                                    ...prev,
                                    code_out: val,
                                }));
                                resetCodeOut(val);
                            },
                        }}
                        showSearch
                    />
                    <ProFormSelect
                        width="md"
                        name="chips_id"
                        label="筹码名称"
                        placeholder="请选择筹码名称"
                        rules={[
                            {
                                required: true,
                                message: '请选择筹码名称',
                            },
                        ]}
                        fieldProps={{
                            fieldNames: {
                                label: 'chips_name',
                                value: 'id',
                            },
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onChange: (val, option: any) => {
                                setStartType((prev) => ({
                                    ...prev,
                                    chips_name: option?.label,
                                }));
                            },
                        }}
                        options={chipsNameList as any}
                    />
                </ProForm.Group>
                {startType.code_out === 'C' && (
                    <ProForm.Group>
                        <FormCurrency
                            width="md"
                            name="deposit_code"
                            label="存款出码"
                            placeholder="请输入存款出码"
                            rules={[
                                {
                                    pattern: isPositiveNumber,
                                    message: '请输入正数',
                                },
                            ]}
                            fieldProps={{
                                onChange: () => {
                                    totalOutCode();
                                },
                                // value: form
                                //     .getFieldValue('deposit_code')
                                //     ?.replace(/[^\-?\d.]/g, ''),
                            }}
                        />
                        <FormCurrency
                            width="md"
                            name="cash_out"
                            label="现金出码"
                            placeholder="请输入现金出码"
                            rules={[
                                {
                                    pattern: isPositiveNumber,
                                    message: '请输入正数',
                                },
                            ]}
                            fieldProps={{
                                onChange: () => {
                                    totalOutCode();
                                },
                                // value: form
                                //     .getFieldValue('cash_out')
                                //     ?.replace(/[^\-?\d.]/g, ''),
                            }}
                        />
                    </ProForm.Group>
                )}

                {startType.code_out === 'M' && (
                    <PrincipalForm
                        formRef={formRef}
                        setMarkerList={(val) => setMarkerList(val)}
                        totalOutCode={totalOutCode}
                    ></PrincipalForm>
                )}
                {startType.start_type === 2 && (
                    <TableForm totalOutCode={totalOutCode}></TableForm>
                )}
                {startType.principal_type === 'B' && (
                    <CodeOutForm
                        commissionParams={{
                            member_id: accountInfo.member_id,
                            member_type: accountInfo.member_type,
                            currency: startType.currency,
                            start_type: startType.start_type,
                            principal_type: startType.principal_type,
                            code_type: startType.code_out,
                        }}
                        startType={startType.start_type}
                    ></CodeOutForm>
                )}
                <ProForm.Group>
                    <FormCurrency
                        width="md"
                        name="balance"
                        label="可用余额"
                        placeholder=""
                        disabled
                    />
                </ProForm.Group>

                {startType.start_type === 1 && (
                    <ProForm.Group>
                        <FormCurrency
                            width="md"
                            name="total_code"
                            label="总出码"
                            disabled
                            initialValue={0}
                            convertValue={(val) => {
                                return val;
                            }}
                            rules={[
                                {
                                    validateTrigger: 'onsubmit',
                                    validator: async (_, value) => {
                                        if (+value === 0) {
                                            return Promise.reject(
                                                '开工金额不能为0',
                                            );
                                        }
                                        return true;
                                    },
                                },
                            ]}
                        />
                    </ProForm.Group>
                )}

                {startType.start_type === 1 && (
                    <Collapse
                        style={{
                            marginBottom: '15px',
                        }}
                    >
                        <Panel header="偷食占成" key="1">
                            <Tabs defaultActiveKey="1" type="card">
                                <TabPane tab="添加偷食占成" key="1">
                                    <StealFoodForm></StealFoodForm>
                                </TabPane>
                                <TabPane tab="添加他人占成" key="2">
                                    <OthersStealFoodForm></OthersStealFoodForm>
                                </TabPane>
                            </Tabs>
                        </Panel>
                    </Collapse>
                )}

                <VerifierPassword
                    formRef={formRef}
                    for="开工"
                    identity_module={6}
                ></VerifierPassword>
                <ProForm.Group>
                    <ProFormTextArea
                        width="md"
                        name="describe"
                        label="备注"
                        placeholder="请输入名称"
                    />
                </ProForm.Group>
            </ModalForm>
            <RegisterPrint />
        </div>
    );
};

export default StartForm;
