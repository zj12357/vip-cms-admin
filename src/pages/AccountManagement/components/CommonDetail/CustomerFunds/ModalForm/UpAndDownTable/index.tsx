import React, {
    FC,
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
    ProTable,
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
} from '@ant-design/pro-components';
import { message, Select, Row, Space, Tabs, Col, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { ProFormInstance } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import {
    getSettlementPlanList,
    transferUpAndDownPoints,
    getMarkerCredit,
} from '@/api/account';
import {
    GetSettlementPlanListParams,
    SettlementPlanListItem,
    TransferUpAndDownPointsParams,
    GetMarkerCreditParams,
    MarkerCreditType,
} from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import { nanoid } from 'nanoid';
import { isInteger } from '@/utils/validate';
import FormCurrency from '@/components/Currency/FormCurrency';
import Currency from '@/components/Currency';
import { isPositiveNumber } from '@/utils/validate';
import Big from 'big.js';
import _ from 'lodash';
import { mCreditType } from '@/common/commonConstType';

type UpAndDownTableProps = {
    handleReloadData: () => void;
};

type UpAndDownModalFormProps = {
    trigger: JSX.Element;
    type: 'up' | 'down';
    record: SettlementPlanListItem;
    reloadData: () => void;
    handleReloadData: () => void;
};

interface MoptionsType {
    label: string;
    value: number;
}

const UpAndDownModalForm: FC<UpAndDownModalFormProps> = ({
    trigger,
    type,
    record,
    reloadData,
    handleReloadData,
}) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const currentHall = useAppSelector(selectCurrentHall);
    const formRef = useRef<ProFormInstance>();
    const [tabType, setTabType] = useState<string>('1');
    const currencyList = useAppSelector(selectCurrencyList);
    const [quotaCheckList, setQuotaCheckList] = useState<number[]>([]);

    const upAndDownTitle: Record<string, string> = {
        up: '上分',
        down: '下分',
    };
    const { fetchData: _fetchTransferUpAndDownPoints } = useHttp<
        TransferUpAndDownPointsParams,
        null
    >(transferUpAndDownPoints, ({ msg }) => {
        message.success(msg);
        reloadData();
        handleReloadData();
    });

    const { fetchData: _fetchMarkerCredit } = useHttp<
        GetMarkerCreditParams,
        MarkerCreditType
    >(getMarkerCredit);

    const handleTransferUpAndDownPoints = async (values: any) => {
        const params = {
            param_config_id: record.param_config_id,
            member_code: accountInfo.member_code,
            start_type: record.start_type,
            currency: record.currency,
            currency_code: record.currency_code,
            code_type: record.code_type,
            principal_type: record.principal_type,
            shares_rate: record.shares_rate,
            wallet_id: record.wallet_id,
            type: type === 'up' ? 1 : 2,
            amount: values.amount,
            hall: currentHall.id,
        };
        const res = await _fetchTransferUpAndDownPoints(params);
        if (res.code === 10000) {
            return true;
        }
    };

    const handleTabType = (type: string) => {
        setTabType(type);
        formRef.current?.resetFields();
    };

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

        if (tabType === '1') {
            const total = new Big(depositCodeValue).plus(cashOutValue);

            formRef.current?.setFieldsValue({
                total_code: Number(total),
            });
        } else if (tabType === '2') {
            formRef.current?.setFieldsValue({
                total_code: Number(mOutValue),
            });
        }
    }, [tabType]);

    const handleMarkerCredit = (type: number, currency: number) => {
        const params = {
            member_code: accountInfo.member_code,
            currency,
            marker_type: type,
        };
        return _fetchMarkerCredit(params);
    };

    const handleQuotaCheck = async (
        e: CheckboxChangeEvent,
        type: MoptionsType,
    ) => {
        const currency = formRef.current?.getFieldValue('currency');
        if (!currency) {
            message.error('请先选择开工币种!');
            return;
        }

        if (e.target.checked) {
            setQuotaCheckList(_.uniq([...quotaCheckList, type.value]));
            const { data } = await handleMarkerCredit(type.value, currency);
            formRef.current?.setFieldsValue({
                [`usable-${type.value}`]: data?.available_amount ?? 0,
            });
        } else {
            setQuotaCheckList(
                quotaCheckList.filter((item) => item !== type.value),
            );
            formRef.current?.setFieldsValue({
                [`codeOut-${type.value}`]: '',
            });
        }
        totalOutCode();
    };

    const UpForm = () => {
        return (
            <Row>
                <Col span={24}>
                    <ProFormSelect
                        name="currency"
                        label="币种"
                        width="md"
                        options={currencyList}
                        placeholder="请选择币种"
                        rules={[
                            {
                                required: true,
                                message: '请选择币种',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                        }}
                        showSearch
                    />
                </Col>
                <Col span={24}>
                    <Tabs
                        type="card"
                        activeKey={tabType}
                        onChange={(val) => handleTabType(val)}
                        destroyInactiveTabPane
                    >
                        <Tabs.TabPane tab="C" key="1">
                            <ProForm.Group>
                                <FormCurrency
                                    width="md"
                                    name="deposit_code"
                                    label="存卡上分"
                                    placeholder="请输入存卡上分"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入存卡上分',
                                        },
                                        {
                                            pattern: isPositiveNumber,
                                            message: '请输入数字',
                                        },
                                    ]}
                                    fieldProps={{
                                        onChange: () => {
                                            totalOutCode();
                                        },
                                    }}
                                />
                                <FormCurrency
                                    width="md"
                                    name="cash_out"
                                    label="现金上分"
                                    placeholder="请输入现金上分"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入现金上分',
                                        },
                                        {
                                            pattern: isPositiveNumber,
                                            message: '请输入数字',
                                        },
                                    ]}
                                    fieldProps={{
                                        onChange: () => {
                                            totalOutCode();
                                        },
                                    }}
                                />
                            </ProForm.Group>
                            <ProForm.Group>
                                <FormCurrency
                                    width="md"
                                    name="total_code"
                                    label="总出码"
                                    disabled
                                    convertValue={(val) => {
                                        return val;
                                    }}
                                />
                            </ProForm.Group>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="M" key="2">
                            <Row justify="start">
                                {mCreditType.map((item, index) => {
                                    return (
                                        <Col
                                            span={6}
                                            offset={1}
                                            key={item.value}
                                            style={{
                                                marginBottom: '20px',
                                            }}
                                        >
                                            <Checkbox
                                                onChange={(e) => {
                                                    handleQuotaCheck(e, item);
                                                }}
                                            >
                                                {item.label}
                                            </Checkbox>
                                            {quotaCheckList.includes(
                                                item.value,
                                            ) && (
                                                <>
                                                    <div
                                                        style={{
                                                            marginBottom: '8px',
                                                        }}
                                                    >
                                                        <span>
                                                            {item.label}
                                                            -可用额度
                                                        </span>

                                                        <FormCurrency
                                                            width="md"
                                                            name={`usable-${item.value}`}
                                                            disabled
                                                            placeholder={''}
                                                        />
                                                    </div>
                                                    <div
                                                        style={{
                                                            marginBottom: '8px',
                                                        }}
                                                    >
                                                        <span>
                                                            {item.label}
                                                            -出码额度
                                                        </span>

                                                        <FormCurrency
                                                            width="md"
                                                            name={`codeOut-${item.value}`}
                                                            placeholder={`请输入${item.label}出码额度`}
                                                            fieldProps={{
                                                                onChange: (
                                                                    e,
                                                                ) => {
                                                                    totalOutCode();
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </Col>
                                    );
                                })}
                                <ProForm.Group>
                                    <FormCurrency
                                        width="md"
                                        name="total_code"
                                        label="总出码"
                                        disabled
                                        convertValue={(val) => {
                                            return val;
                                        }}
                                    />
                                </ProForm.Group>
                            </Row>
                        </Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        );
    };

    const DownForm = () => {
        return (
            <FormCurrency
                width="md"
                name="amount"
                placeholder="请输入下分金额"
                rules={[
                    {
                        required: true,
                        message: '请输入下分金额',
                    },
                    {
                        pattern: isInteger,
                        message: '请输入数字',
                    },
                ]}
            />
        );
    };

    return (
        <div>
            <ModalForm
                trigger={trigger}
                onFinish={handleTransferUpAndDownPoints}
                title={upAndDownTitle[type]}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                width={600}
                formRef={formRef}
                initialValues={{
                    total_code: 0,
                }}
            >
                <ProForm.Group>
                    {type === 'up' && UpForm()}
                    {type === 'down' && DownForm()}
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};

const UpAndDownTable: FC<UpAndDownTableProps> = ({ handleReloadData }) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const [modalFormType, setModalFormType] = useState<'up' | 'down'>('up');
    const [currencyType, setCurrencyType] = useState(1);
    const tableRef = useRef<ActionType>();
    const currencyList = useAppSelector(selectCurrencyList);

    const { fetchData: _fetchMemberCodeList } = useHttp<
        GetSettlementPlanListParams,
        SettlementPlanListItem[]
    >(getSettlementPlanList);

    const columns: ProColumns<SettlementPlanListItem>[] = [
        {
            title: '货币类型',
            dataIndex: 'currency',
            valueType: 'select',
            fieldProps: {
                options: currencyList,
            },
        },
        {
            title: '开工类型',
            dataIndex: 'start_type',
            render: (text, record, index, action) => {
                const renderTitle = () => {
                    if (+record.start_type === 1) {
                        return <div>普通</div>;
                    }
                    if (+record.start_type === 2) {
                        return <div>营运</div>;
                    }
                };
                return renderTitle();
            },
        },
        {
            title: '出码类型',
            dataIndex: 'principal_type',
        },
        {
            title: '出码类型',
            dataIndex: 'code_type',
        },
        {
            title: '占成上限',
            dataIndex: 'shares_rate',
            render: (text, record, _, action) => {
                return (
                    <span>
                        {text?.toString() && text !== '-' ? `${text}%` : '-'}
                    </span>
                );
            },
        },
        {
            title: '钱包余额',
            dataIndex: 'balance',
            render: (text, record, _, action) => {
                return <Currency value={record.balance.toString()}></Currency>;
            },
        },

        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <UpAndDownModalForm
                    key="up"
                    type={modalFormType}
                    trigger={
                        <div
                            onClick={() => {
                                setModalFormType('up');
                            }}
                            className="m-primary-font-color pointer"
                        >
                            上分
                        </div>
                    }
                    record={record}
                    reloadData={reloadData}
                    handleReloadData={handleReloadData}
                ></UpAndDownModalForm>,
                <UpAndDownModalForm
                    key="down"
                    type={modalFormType}
                    trigger={
                        <div
                            onClick={() => {
                                setModalFormType('down');
                            }}
                            className="m-primary-font-color pointer"
                        >
                            下分
                        </div>
                    }
                    record={record}
                    reloadData={reloadData}
                    handleReloadData={handleReloadData}
                ></UpAndDownModalForm>,
            ],
        },
    ];

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    return (
        <div>
            <Row
                justify="end"
                align="middle"
                style={{
                    margin: '15px 0',
                }}
            >
                <span>币种：</span>
                <Space size="small">
                    <Select
                        value={currencyType}
                        style={{ width: '100px' }}
                        onChange={(val) => {
                            setCurrencyType(val);
                        }}
                        options={currencyList}
                    ></Select>
                </Space>
            </Row>

            <ProTable<SettlementPlanListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchMemberCodeList({
                        member_code: accountInfo.member_code,
                        currency: params.currency,
                    });
                    return {
                        data: res.data,
                        success: true,
                    };
                }}
                rowKey={() => nanoid()}
                search={false}
                toolBarRender={false}
                params={{
                    currency: currencyType,
                }}
                actionRef={tableRef}
            />
        </div>
    );
};

export default UpAndDownTable;
