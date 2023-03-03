import React, { FC, useEffect, useState, useRef } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProTable,
    ProFormDatePicker,
} from '@ant-design/pro-components';
import type {
    ProColumns,
    ActionType,
    ProFormInstance,
} from '@ant-design/pro-components';
import {
    Button,
    message,
    Tabs,
    Row,
    Col,
    Radio,
    RadioChangeEvent,
    Select,
} from 'antd';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useHttp, useLatest } from '@/hooks';
import {
    getAccountParamsList,
    updateParamConfig,
    updateAccountStatus,
    getIntegralConfigList,
    updateIntegralConfig,
} from '@/api/account';
import {
    GetAccountParamsParams,
    AccountParamsConfigListItem,
    UpdateParamConfigParams,
    UpdateAccountStatusParams,
    GetIntegralConfigListParams,
    IntegralConfigListItem,
    UpdateIntegralConfigParams,
} from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { selectCurrencyList } from '@/store/common/commonSlice';
import { useGetAccountInfo } from '@/pages/AccountManagement/common';
import { isPositiveNumber } from '@/utils/validate';
import { currencyIntegralType } from '@/common/commonConstType';
import AuthButton from '@/components/AuthButton';
import Loading from '@/components/Loading';

const { TabPane } = Tabs;

type AccountSettingFormProps = {};
type AccountSettingProps = {
    formRef: React.MutableRefObject<ProFormInstance<any> | undefined>;
    currencyTypeList: any[];
};

const AccountSettingTable: FC<AccountSettingProps> = ({
    formRef,
    currencyTypeList,
}) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const { id } = useParams<{ id: string }>();
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [currency, setCurrency] = useState(1);
    const [onlineType, setOnlineType] = useState(1);
    const tableRef = useRef<ActionType>();

    const { fetchData: _fetchAccountParamsList } = useHttp<
        GetAccountParamsParams,
        AccountParamsConfigListItem[]
    >(getAccountParamsList);

    const { fetchData: _fetchUpdateParamConfig } = useHttp<
        UpdateParamConfigParams,
        null
    >(updateParamConfig, ({ msg }) => {
        message.success(msg);
    });

    const disabledDate = (current: any) => {
        return current && current <= moment().endOf('day');
    };

    const columns: ProColumns<AccountParamsConfigListItem>[] = [
        {
            dataIndex: 'start_type',
            title: '开工类型',
            editable: false,
            render: (text, record, index, action) => {
                const renderTitle = () => {
                    if (record.start_type === 1) {
                        return <div>普通</div>;
                    }
                    if (record.start_type === 2) {
                        return <div>营运</div>;
                    }
                };
                return renderTitle();
            },
        },
        {
            dataIndex: 'currency',
            title: '货币类型',
            editable: false,
            valueType: 'select',
            fieldProps: {
                options: currencyTypeList,
            },
        },
        {
            dataIndex: 'code_type',
            title: '本金类型',
            editable: false,
        },
        {
            dataIndex: 'principal_type',
            title: '出码类型',
            editable: false,
        },
        {
            dataIndex: 'shares_rate',
            title: '占成上限',
            renderFormItem: (schema, config, form, action) => {
                if (config.record?.principal_type?.includes('A')) {
                    return (
                        <ProFormText
                            name="shares_rate"
                            disabled
                            fieldProps={{
                                value: '-',
                            }}
                        ></ProFormText>
                    );
                } else {
                    return (
                        <ProFormText
                            name="shares_rate"
                            rules={[
                                {
                                    pattern: isPositiveNumber,
                                    message: '请输入数字',
                                },
                                {
                                    validator: async (_, value) => {
                                        if (+value > 80) {
                                            return Promise.reject(
                                                '输入的数字不能大于80',
                                            );
                                        }
                                        return true;
                                    },
                                },
                            ]}
                        ></ProFormText>
                    );
                }
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
            dataIndex: 'commission_rate',
            title: '佣金率',
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
            dataIndex: 'point_rate',
            title: '积分率',
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
            valueType: 'option',
            render: (text, record, _, action) => [
                <div
                    key="editable"
                    className="m-primary-font-color pointer"
                    onClick={() => {
                        action?.startEditable?.(record.param_config_id);
                    }}
                >
                    调整
                </div>,
            ],
        },
    ];

    const handleUpdateParamConfig = (values: AccountParamsConfigListItem) => {
        formRef.current?.submit();
        const effectiveTime = formRef.current?.getFieldValue('effective_time');
        const memberStatus = formRef.current?.getFieldValue('member_status');
        if (!memberStatus) {
            return;
        }

        const params = {
            param_config_id: values.param_config_id,
            member_id: accountInfo.member_id,
            shares_rate: values.shares_rate,
            commission_rate: values.commission_rate,
            point_rate: values.point_rate,
            effective_time: effectiveTime
                ? moment(effectiveTime).unix()
                : undefined,
            member_status: memberStatus,
            currency: values.currency,
            is_online: onlineType,
        };

        _fetchUpdateParamConfig(params);
    };

    useEffect(() => {
        if (currencyTypeList.length > 0) {
            setCurrency(+currencyTypeList?.[0]?.value);
        }
    }, [currencyTypeList]);

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
                            setOnlineType(value);
                        }}
                    />
                </Col>
                <Col>
                    <span>币种：</span>
                    <Select
                        value={currency}
                        style={{ width: '100px' }}
                        onChange={(val) => {
                            setCurrency(val);
                        }}
                        options={currencyTypeList}
                    ></Select>
                </Col>
                {onlineType === 1 && (
                    <Col>
                        <ProFormDatePicker
                            name="effective_time"
                            label="新数据生效时间"
                            width="md"
                            placeholder="请选择新数据生效时间"
                            fieldProps={{
                                getPopupContainer: (triggerNode) => triggerNode,
                                disabledDate,
                                showToday: false,
                            }}
                        />
                    </Col>
                )}
            </Row>
            <ProTable<AccountParamsConfigListItem>
                columns={columns}
                request={async (params: any) => {
                    if (params.is_online && params.currency) {
                        const res = await _fetchAccountParamsList(params);
                        return {
                            data: res.data,
                            success: true,
                        };
                    } else {
                        return {
                            data: [],
                            success: true,
                        };
                    }
                }}
                rowKey={(item) => item.param_config_id}
                pagination={false}
                toolBarRender={false}
                search={false}
                params={{
                    member_id: id ?? '',
                    currency: currency,
                    is_online: onlineType,
                    member_type_id: accountInfo.member_type,
                }}
                editable={{
                    type: 'single',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        handleUpdateParamConfig(data);
                        //重新获取数据
                        // tableRef.current?.reload();
                    },
                    onChange: setEditableRowKeys,
                    actionRender: (row, config, dom) => [dom.save, dom.cancel],
                }}
                actionRef={tableRef}
                scroll={{
                    x: 800,
                }}
            />
        </>
    );
};

const IntegralConfig: FC<AccountSettingProps> = ({
    currencyTypeList,
    formRef,
}) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const {
        fetchData: _fetchAccountParamsList,
        response,
        loading,
    } = useHttp<GetIntegralConfigListParams, IntegralConfigListItem[]>(
        getIntegralConfigList,
    );

    const { fetchData: _fetchUpdateIntegralConfig } = useHttp<
        UpdateIntegralConfigParams,
        null
    >(updateIntegralConfig, ({ msg }) => {
        message.success(msg);
        _fetchAccountParamsList({
            member_id: accountInfo.member_id,
        });
    });

    useEffect(() => {
        _fetchAccountParamsList({
            member_id: accountInfo.member_id,
        });
    }, [_fetchAccountParamsList, accountInfo.member_id]);

    const handleUpdateIntegralConfig = (
        type: number,
        item: IntegralConfigListItem,
    ) => {
        const params = {
            member_id: accountInfo.member_id,
            integral_config_id: item.integral_config_id,
            member_status: formRef.current?.getFieldValue('member_status'),
            currency_integral_type: type,
            currency: item.currency,
        };
        _fetchUpdateIntegralConfig(params);
    };

    return (
        <>
            {loading ? (
                <Loading size="default"></Loading>
            ) : (
                <div>
                    {response?.map((item, index) => (
                        <Row
                            key={index}
                            style={{
                                margin: '10px 0',
                            }}
                        >
                            <Col>
                                {
                                    currencyTypeList.find(
                                        (i) => +i.value === item.currency,
                                    )?.label
                                }
                                积分设置
                            </Col>
                            <Col offset={1}>
                                <Radio.Group
                                    options={currencyIntegralType}
                                    defaultValue={item.currency_integral_type}
                                    onChange={(val) => {
                                        handleUpdateIntegralConfig(
                                            val.target.value,
                                            item,
                                        );
                                    }}
                                ></Radio.Group>
                            </Col>
                        </Row>
                    ))}
                </div>
            )}
        </>
    );
};

const AccountSettingForm: FC<AccountSettingFormProps> = (props) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const currencyList = useAppSelector(selectCurrencyList);
    const formRef = useRef<ProFormInstance>();
    const callback = useGetAccountInfo();
    const [isPass, setIsPass] = useState(false); //操作码是否通过

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        member_status: accountInfo.status,
    }).current;

    const { fetchData: _fetchUpdateAccountStatus } = useHttp<
        UpdateAccountStatusParams,
        null
    >(updateAccountStatus, ({ msg }) => {
        message.success(msg);
        callback();
    });

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal="customerAccount-accountSetting"
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        buttonProps={{
                            type: 'primary',
                        }}
                    ></AuthButton>
                }
                title="户口设置"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setIsPass(false);
                    },
                }}
                width={1100}
                initialValues={updatedValues}
                formRef={formRef}
                submitter={false}
                visible={isPass}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_code"
                        label="户口"
                        disabled
                    />
                    <ProFormSelect
                        name="member_status"
                        label="户口状态"
                        width="md"
                        options={[
                            {
                                label: '禁用',
                                value: 0,
                            },
                            {
                                label: '启用',
                                value: 1,
                            },
                        ]}
                        placeholder="请选择户口状态"
                        rules={[
                            {
                                required: true,
                                message: '请选择户口状态',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onChange: (value, option) => {
                                _fetchUpdateAccountStatus({
                                    status: value,
                                    member_id: accountInfo.member_id,
                                });
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
                <Tabs defaultActiveKey="1" type="card" destroyInactiveTabPane>
                    <TabPane tab="参数配置" key="1">
                        <AccountSettingTable
                            formRef={formRef}
                            currencyTypeList={currencyList}
                        ></AccountSettingTable>
                    </TabPane>
                    <TabPane tab="积分结算配置" key="2">
                        <IntegralConfig
                            currencyTypeList={currencyList}
                            formRef={formRef}
                        ></IntegralConfig>
                    </TabPane>
                </Tabs>
            </ModalForm>
        </div>
    );
};

export default AccountSettingForm;
