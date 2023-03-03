import React, { FC, useState, useRef, useCallback } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
    ProFormRadio,
    ProTable,
    EditableProTable,
} from '@ant-design/pro-components';
import type {
    ProColumns,
    ProFormInstance,
    ActionType,
} from '@ant-design/pro-components';
import {
    Button,
    message,
    Row,
    Col,
    Radio,
    RadioChangeEvent,
    Select,
    Descriptions,
} from 'antd';
import VerifierPassword from '@/pages/AccountManagement/components/VerifierPassword';
import { useAppSelector } from '@/store/hooks';
import {
    selectCurrencyList,
    selectCurrentHall,
    selectHallList,
} from '@/store/common/commonSlice';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { useHttp, useLatest } from '@/hooks';
import {
    getImmediatelyData,
    confirmImmediately,
    updateImmediatelyData,
} from '@/api/account';
import {
    ImmediatelyMonthDataType,
    GetImmediatelyComeOutDataParams,
    ImmediatelyMonthDataItem,
    ConfirmImmediatelyParams,
    UpdateImmediatelyDataParams,
} from '@/types/api/account';
import Big from 'big.js';
import { shareType, principalType, workType } from '@/common/commonConstType';
import { isPositiveNumber } from '@/utils/validate';
import Currency from '@/components/Currency';
import AuthButton from '@/components/AuthButton';
import usePrint from '@/hooks/usePrint';
import { OfficialDataProps } from '@/hooks/usePrint/print';
import { selectUserName } from '@/store/user/userSlice';
import { formatCurrency } from '@/utils/tools';

type ComeOutFormProps = {};

export type SettlementListItem = {
    key: string;
    commissionType: string;
    commissionAmount: number | React.ReactNode;
    commissionRateType: string;
    commissionRate: string;
    onlineAccount: string;
    onlineAccountName: string;
};

const ComeOutTable: FC<{
    currency: number;
    onlineType: number;
    hallType: number;
    handleCurrency: (val: number) => void;
    handleOnlineType: (val: number) => void;
    handleImmediateInfo: (val: any) => void;
    handleSettleList: (val: number[]) => void;
}> = ({
    currency,
    onlineType,
    hallType,
    handleCurrency,
    handleOnlineType,
    handleImmediateInfo,
    handleSettleList,
}) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const accountInfo = useAppSelector(selectAccountInfo);
    const currentHall = useAppSelector(selectCurrentHall);
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const tableRef = useRef<ActionType>();

    const {
        fetchData: _fetchImmediatelyData,
        response: immediatelyData,
        loading,
    } = useHttp<GetImmediatelyComeOutDataParams, ImmediatelyMonthDataType>(
        getImmediatelyData,
        ({ data }) => {
            handleImmediateInfo({
                advance: data?.advance_id ?? [],
                amount: data?.balance_commission ?? 0,
                parent_member_code: data.parent_member_code,
                parent_amount: new Big(data?.turn_over_c_commission ?? 0)
                    .plus(data?.turnover_m_commission ?? 0)
                    .toNumber(),
                steal_id: data?.steal_id,
                sum_un_settle_commission: data.sum_un_settle_commission,
            });

            handleSettleList((data?.data ?? []).map((v) => v.id));
        },
    );

    const { fetchData: _fetchUpdateImmediatelyData } = useHttp<
        UpdateImmediatelyDataParams,
        null
    >(updateImmediatelyData, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const columns: ProColumns<ImmediatelyMonthDataItem>[] = [
        {
            dataIndex: 'start_work_type',
            title: '开工类型',
            editable: false,
            valueType: 'select',
            fieldProps: {
                options: workType,
            },
        },
        {
            dataIndex: 'currency',
            title: '货币类型',
            editable: false,
            valueType: 'select',
            fieldProps: {
                options: currencyList,
            },
        },
        {
            dataIndex: 'shares_type',
            title: '本金类型',
            editable: false,
            valueType: 'select',
            fieldProps: {
                options: shareType,
            },
        },
        {
            dataIndex: 'principal_type',
            title: '出码类型',
            editable: false,
            valueType: 'select',
            fieldProps: {
                options: principalType,
            },
        },

        {
            dataIndex: 'un_settle_amount',
            title: '未结转码',
            editable: false,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record?.un_settle_amount?.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'un_settle_commission',
            title: '未出佣金',
            editable: false,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record?.un_settle_commission?.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'shares_rate',
            title: '占成上限',
            editable: false,
            render: (text, record, _, action) => {
                return (
                    <span>
                        {text?.toString() && text !== '-' ? `${text}%` : '-'}
                    </span>
                );
            },
        },
        {
            dataIndex: 'commission_rate',
            title: '佣金率',
            width: 150,
            formItemProps: {
                rules: [
                    {
                        pattern: isPositiveNumber,
                        message: '请输入数字',
                    },
                    {
                        validator: async (_, value) => {
                            if (+value > 100) {
                                return Promise.reject('输入的数字不能大于100');
                            }
                            return true;
                        },
                    },
                ],
            },
            render: (text, record, _, action) => {
                return (
                    <span>
                        {text?.toString() && text !== '-' ? `${text}%` : '-'}
                    </span>
                );
            },
        },
        {
            dataIndex: 'turn_over_commission',
            title: '上缴佣金',
            editable: false,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record?.turn_over_commission?.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'turn_over_commission_rate',
            title: '上缴佣金率',
            editable: false,
            render: (text, record, _, action) => {
                return (
                    <span>
                        {text?.toString() && text !== '-' ? `${text}%` : '-'}
                    </span>
                );
            },
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <div
                    key="editable"
                    className="m-primary-font-color pointer"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </div>,
            ],
        },
    ];

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    return (
        <>
            <Row
                align="middle"
                justify="space-between"
                style={{
                    marginBottom: '14px',
                }}
            >
                <Col>
                    <Radio.Group
                        options={[
                            { label: '线下', value: 1 },
                            { label: '线上', value: 2 },
                        ]}
                        value={onlineType}
                        onChange={({ target: { value } }: RadioChangeEvent) => {
                            handleOnlineType(+value);
                        }}
                    />
                </Col>
                <Col>
                    <Select
                        value={currency}
                        style={{ width: '100px', margin: '0 20px 10px 0' }}
                        onChange={(val) => {
                            handleCurrency(+val);
                        }}
                        options={currencyList}
                    ></Select>
                    {/* {+onlineType === 1 && (
                        <Button
                            type="primary"
                            style={{
                                marginRight: '10px',
                            }}
                        >
                            提案线上
                        </Button>
                    )} */}
                </Col>
            </Row>
            <EditableProTable<ImmediatelyMonthDataItem>
                columns={columns}
                request={async (params, sorter, filter) => {
                    const res = await _fetchImmediatelyData({
                        member_id: accountInfo.member_id,
                        currency_id: params.currency,
                        hall: params.hallType,
                    });
                    return Promise.resolve({
                        data: res.data.data ?? [],
                        success: true,
                    });
                }}
                params={{
                    currency: currency,
                    hallType: hallType,
                }}
                editable={{
                    type: 'single',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        _fetchUpdateImmediatelyData({
                            id: data.id,
                            commission_rate: data.commission_rate,
                        });
                    },
                    onChange: setEditableRowKeys,
                    actionRender: (row, config, dom) => [dom.save, dom.cancel],
                }}
                rowKey={(record) => record.id}
                recordCreatorProps={false}
                pagination={false}
                toolBarRender={false}
                search={false}
                style={{
                    margin: '10px 0 30px 0',
                }}
                actionRef={tableRef}
            />
            <Col span={24}>
                <SettlementTable
                    info={immediatelyData ?? ({} as ImmediatelyMonthDataType)}
                    loading={loading}
                ></SettlementTable>
            </Col>
        </>
    );
};

const SettlementTable: FC<{
    info: ImmediatelyMonthDataType;
    loading: boolean;
}> = ({ info, loading }) => {
    const columns: ProColumns<SettlementListItem>[] = [
        {
            dataIndex: 'commissionType',
            key: 'commissionType',
            render: (text, record, index) => {
                if (index === SettlementLsit.length - 1) {
                    return (
                        <div className="m-primary-font-color">
                            {record.commissionType ?? null}
                        </div>
                    );
                }
                return record.commissionType ?? null;
            },
        },
        {
            dataIndex: 'commissionAmount',
            key: 'commissionAmount',
            render: (text, record, index) => {
                if (index === SettlementLsit.length - 1) {
                    return (
                        <div className="m-primary-font-color">
                            {record.commissionAmount ?? null}
                        </div>
                    );
                }
                return record.commissionAmount ?? null;
            },
        },
        {
            dataIndex: 'commissionRateType',
            key: 'commissionRateType',
            render: (text, record) => {
                return record.commissionRateType ?? null;
            },
        },
        {
            dataIndex: 'commissionRate',
            key: 'commissionRate',
            render: (text, record) => {
                return record.commissionRate ?? null;
            },
        },
        {
            dataIndex: 'onlineAccount',
            key: 'onlineAccount',
            render: (text, record) => {
                return record.onlineAccount ?? null;
            },
        },
        {
            dataIndex: 'onlineAccountName',
            key: 'onlineAccountName',
            render: (text, record) => {
                return record.onlineAccountName ?? null;
            },
        },
    ];
    const SettlementLsit: SettlementListItem[] = [
        {
            key: '1',
            commissionType: '被偷食占成佣金',
            commissionAmount: (
                <Currency value={info?.setal_amount?.toString()}></Currency>
            ),
            commissionRateType: '',
            commissionRate: '',
            onlineAccount: '',
            onlineAccountName: '',
        },
        {
            key: '2',
            commissionType: '总佣金',
            commissionAmount: (
                <Currency
                    value={info?.sum_un_settle_commission?.toString()}
                ></Currency>
            ),
            commissionRateType: '',
            commissionRate: '',
            onlineAccount: '',
            onlineAccountName: '',
        },
        {
            key: '3',
            commissionType: '上缴C佣金',
            commissionAmount: (
                <Currency
                    value={info?.turn_over_c_commission?.toString()}
                ></Currency>
            ),
            commissionRateType: '上缴C佣金率',
            commissionRate: (info?.turnover_c_commission_rate ?? 0) + '%',
            onlineAccount: '上线户口',
            onlineAccountName: info.parent_member_code,
        },
        {
            key: '4',
            commissionType: '上缴M佣金',

            commissionAmount: (
                <Currency
                    value={info?.turnover_m_commission?.toString()}
                ></Currency>
            ),
            commissionRateType: '上缴M佣金率',
            commissionRate: (info?.turnover_m_commission_rate ?? 0) + '%',
            onlineAccount: '上线户名',
            onlineAccountName: info.parent_member_name,
        },
        {
            key: '5',
            commissionType: '结余佣金',

            commissionAmount: (
                <Currency
                    value={info?.balance_commission?.toString()}
                ></Currency>
            ),
            commissionRateType: '',
            commissionRate: '',
            onlineAccount: '',
            onlineAccountName: '',
        },
        {
            key: '6',
            commissionType: '待结算消费总额',

            commissionAmount: (
                <Currency
                    value={info?.total_consumption_to_be_settled?.toString()}
                ></Currency>
            ),
            commissionRateType: '',
            commissionRate: '',
            onlineAccount: '',
            onlineAccountName: '',
        },
        {
            key: '7',
            commissionType: '本次结算佣金',

            commissionAmount: (
                <Currency
                    value={info?.this_settlement_commission?.toString()}
                ></Currency>
            ),
            commissionRateType: '',
            commissionRate: '',
            onlineAccount: '',
            onlineAccountName: '',
        },
    ];

    return (
        <ProTable<SettlementListItem>
            columns={columns}
            dataSource={SettlementLsit}
            rowKey={(item) => item.key}
            pagination={false}
            toolBarRender={false}
            search={false}
            showHeader={false}
            style={{
                margin: '30px  0',
            }}
            bordered
            loading={loading}
        />
    );
};
const ComeOutForm: FC<ComeOutFormProps> = (props) => {
    const userName = useAppSelector(selectUserName);
    const { RegisterPrint, handlePrint } =
        usePrint<OfficialDataProps>('Official');

    const accountInfo = useAppSelector(selectAccountInfo);
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);

    const [currency, setCurrency] = useState(currencyList[0]?.value);
    const [onlineType, setOnlineType] = useState(1);
    const [hallType, setHallType] = useState(0);

    const [immediateInfo, setImmediateInfo] = useState({
        advance: [],
        amount: 0,
        parent_member_code: '',
        parent_amount: 0,
        steal_id: 0,
        sum_un_settle_commission: 0,
    });
    const [settleIdList, setSettleIdList] = useState<number[]>([]);
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const formRef = useRef<ProFormInstance>();
    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        hall: hallType,
    }).current;

    const { fetchData: _fetchConfirmImmediately } = useHttp<
        ConfirmImmediatelyParams,
        null
    >(confirmImmediately);

    const handleConfirmImmediately = async (values: any) => {
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
        if (immediateInfo.sum_un_settle_commission <= 0) {
            message.error('暂无记录');
            return;
        }
        const params = {
            member_code: accountInfo.member_code,
            settle_type: 1,
            settle_id: settleIdList,
            currency: currency,
            hall_id: hallType,
            advance_id: immediateInfo.advance,
            settlement_method: values.settlement_method,
            amount: immediateInfo.amount,
            remark: values.remark,
            parent_member_code: immediateInfo.parent_member_code,
            parent_amount: immediateInfo.parent_amount,
            steal_id: immediateInfo.steal_id,
        };

        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchConfirmImmediately(doubleParams);
        if (res.code === 10000) {
            let data: any = res.data;
            handlePrint({
                name: accountInfo.member_name,
                account: doubleParams.member_code,
                type: doubleParams.settlement_method === 1 ? '取款' : '存款',
                currency: currencyList.find(
                    (x) => x.value === doubleParams.currency,
                )?.label as string,
                amountCapital: `${formatCurrency(doubleParams.amount) * 10000}`,
                amountCurrency: `${formatCurrency(doubleParams.amount)}万`,
                remark: doubleParams.remark,
                manager: userName,
                id: data.id,
            });
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
            resetState();
        }
    };

    const resetState = () => {
        setCurrency(currencyList[0]?.value);
        setOnlineType(1);
        setImmediateInfo({
            advance: [],
            amount: 0,
            parent_member_code: '',
            parent_amount: 0,
            steal_id: 0,
            sum_un_settle_commission: 0,
        });
    };

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal="customerAccount-comeOut"
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
                                    {accountInfo.member_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="类型" span={12}>
                                    {[
                                        { label: '线下', value: 1 },
                                        { label: '线上', value: 2 },
                                    ].find(
                                        (item) => +item.value === +onlineType,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="币种" span={12}>
                                    {currencyList.find(
                                        (item) =>
                                            +item.value ===
                                            +doubleParams.currency,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="结算方式" span={12}>
                                    {[
                                        {
                                            label: '现金',
                                            value: 1,
                                        },
                                        {
                                            label: '存卡',
                                            value: 2,
                                        },
                                    ].find(
                                        (item) =>
                                            +item.value ===
                                            +doubleParams.settlement_method,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="结算佣金" span={12}>
                                    {formatCurrency(doubleParams.amount)}万
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
                onFinish={handleConfirmImmediately}
                title="即出"
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
                        resetState();
                    },
                }}
                width={1100}
                initialValues={updatedValues}
                visible={isPass}
                formRef={formRef}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_code"
                        label="户口"
                        disabled
                    />
                    <ProFormSelect
                        name="hall"
                        label="场馆"
                        width="md"
                        options={[{ label: 'ALL', value: 0 }, ...hallList]}
                        placeholder="请选择场馆"
                        rules={[
                            {
                                required: true,
                                message: '请选择场馆',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onChange: (val) => {
                                setHallType(val);
                            },
                        }}
                        showSearch
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_name"
                        label="户名"
                        disabled
                    />
                </ProForm.Group>
                <ComeOutTable
                    currency={currency}
                    onlineType={onlineType}
                    hallType={hallType}
                    handleCurrency={(val: number) => setCurrency(val)}
                    handleOnlineType={(val: number) => setOnlineType(val)}
                    handleImmediateInfo={(val) => {
                        setImmediateInfo((prev) => ({
                            ...prev,
                            ...val,
                        }));
                    }}
                    handleSettleList={(val: number[]) => {
                        setSettleIdList(val);
                    }}
                ></ComeOutTable>
                <ProForm.Group>
                    <ProFormRadio.Group
                        name="settlement_method"
                        layout="horizontal"
                        width="md"
                        label="结算方式"
                        options={[
                            {
                                label: '现金',
                                value: 1,
                            },
                            {
                                label: '存卡',
                                value: 2,
                            },
                        ]}
                        rules={[
                            {
                                required: true,
                                message: '请选择结算方式',
                            },
                        ]}
                    />
                </ProForm.Group>
                <VerifierPassword
                    formRef={formRef}
                    for="即出"
                    identity_module={4}
                ></VerifierPassword>
                <ProForm.Group>
                    <ProFormTextArea
                        width="md"
                        name="remark"
                        label="备注"
                        placeholder="请输入备注"
                        fieldProps={{
                            maxLength: 100,
                        }}
                    />
                </ProForm.Group>
            </ModalForm>
            <RegisterPrint />
        </div>
    );
};

export default ComeOutForm;
