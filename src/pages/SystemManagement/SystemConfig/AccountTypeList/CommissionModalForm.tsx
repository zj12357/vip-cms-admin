/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    FC,
    memo,
    useEffect,
    useState,
    useCallback,
    useRef,
} from 'react';
import { ModalForm } from '@ant-design/pro-components';
import {
    EditableProTable,
    ActionType,
    ProFormText,
} from '@ant-design/pro-components';
import {
    Button,
    Input,
    message,
    Row,
    Col,
    Radio,
    RadioChangeEvent,
    Select,
} from 'antd';
import type { ProFormInstance, ProColumns } from '@ant-design/pro-components';
import { useHttp, useLatest } from '@/hooks';
import { getCommission, updateCommission } from '@/api/system';
import {
    GetCommissionParams,
    MemberTypeListItem,
    CommissionListItem,
    UpdateCommissionParams,
    ParamConfigArrItem,
} from '@/types/api/system';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import { isPositiveNumber } from '@/utils/validate';
import AuthButton from '@/components/AuthButton';

type CommissionModalFormProps = {
    reloadData: () => void;
    record: MemberTypeListItem;
};

const CommissionModalForm: FC<CommissionModalFormProps> = memo(
    ({ record, reloadData }) => {
        const [isPass, setIsPass] = useState(false); //操作码是否通过

        const formRef = useRef<ProFormInstance>();
        const tableRef = useRef<ActionType>();
        const currencyList = useAppSelector(selectCurrencyList);
        const [currencyType, setCurrencyType] = useState<number>(
            currencyList?.[0]?.value,
        );
        const [onlineType, setOnlineType] = useState<number>(1);
        const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
        const [commissionList, setCommissionList] = useState<
            CommissionListItem[]
        >([]);

        const { fetchData: _fetchGetCommission, loading } = useHttp<
            GetCommissionParams,
            CommissionListItem[]
        >(getCommission);

        const { fetchData: _fetchUpdateCommission } = useHttp<
            UpdateCommissionParams,
            null
        >(updateCommission, ({ msg }) => {
            message.success(msg);
            reloadData();
            reloadDataList();
        });

        const columns: ProColumns<CommissionListItem>[] = [
            {
                title: '开工类型',
                dataIndex: 'start_type',
                editable: false,
                width: '12%',
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
                title: '货币类型',
                dataIndex: 'currency',
                editable: false,
                width: '12%',
                valueType: 'select',
                fieldProps: {
                    options: currencyList,
                },
            },
            {
                title: '出码类型',
                dataIndex: 'code_type',
                editable: false,
                width: '12%',
            },
            {
                title: '筹码类型',
                dataIndex: 'principal_type',
                editable: false,
                width: '12%',
            },
            {
                title: '占成上限',
                dataIndex: 'shares_rate',
                width: '12%',
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
                            {text?.toString() && text !== '-'
                                ? `${text}%`
                                : '-'}
                        </span>
                    );
                },
            },
            {
                title: '佣金率',
                dataIndex: 'commission_rate',
                formItemProps: {
                    rules: [
                        {
                            pattern: isPositiveNumber,
                            message: '请输入数字',
                        },
                        {
                            validator: async (_, value) => {
                                if (+value > 100) {
                                    return Promise.reject(
                                        '输入的数字不能大于100',
                                    );
                                }
                                return true;
                            },
                        },
                    ],
                },
                render: (text, record, _, action) => {
                    return (
                        <span>
                            {text?.toString() && text !== '-'
                                ? `${text}%`
                                : '-'}
                        </span>
                    );
                },
            },
            {
                title: '积分率',
                dataIndex: 'point_rate',
                formItemProps: {
                    rules: [
                        {
                            pattern: isPositiveNumber,
                            message: '请输入数字',
                        },
                        {
                            validator: async (_, value) => {
                                if (+value > 100) {
                                    return Promise.reject(
                                        '输入的数字不能大于100',
                                    );
                                }
                                return true;
                            },
                        },
                    ],
                },
                render: (text, record, _, action) => {
                    return (
                        <span>
                            {text?.toString() && text !== '-'
                                ? `${text}%`
                                : '-'}
                        </span>
                    );
                },
            },
            {
                title: '操作',
                valueType: 'option',
                width: '12%',
                render: (text, record, _, action) => [
                    <div
                        key="editable"
                        className="m-primary-font-color pointer"
                        onClick={() => {
                            action?.startEditable?.(record.param_config_id);
                        }}
                    >
                        编辑
                    </div>,
                ],
            },
        ];

        const handleSave = async (row: CommissionListItem) => {
            const params = {
                type: onlineType,
                param_id: row.param_config_id,
                point_rate: row.point_rate,
                commission_rate: row.commission_rate,
                shares_rate: row.shares_rate,
            };
            _fetchUpdateCommission(params);
        };

        const reloadDataList = useCallback(() => {
            //重新获取数据
            tableRef.current?.reload();
        }, []);

        useEffect(() => {
            if (isPass) {
                _fetchGetCommission({
                    type: onlineType ?? 1,
                    currency: currencyType,
                    member_type_id: record.member_type_id,
                }).then((res) => {
                    setCommissionList(res.data ?? []);
                });
            }
        }, [currencyType, onlineType, record.member_type_id, isPass]);

        return (
            <div>
                <ModalForm
                    formRef={formRef}
                    trigger={
                        <AuthButton
                            normal="acount-type-prate"
                            verify={(pass) => {
                                setIsPass(pass);
                            }}
                            buttonProps={{
                                type: 'link',
                                style: {
                                    padding: '4px',
                                },
                            }}
                        >
                            佣金/积分率
                        </AuthButton>
                    }
                    title="设置佣金/积分率"
                    style={{
                        maxHeight: '70vh',
                        overflowY: 'auto',
                    }}
                    modalProps={{
                        destroyOnClose: true,
                        onCancel: () => {
                            setIsPass(false);
                            setCurrencyType(currencyList?.[0]?.value);
                            setOnlineType(1);
                            setEditableRowKeys([]);
                            setCommissionList([]);
                        },
                    }}
                    visible={isPass}
                    width={1000}
                    submitter={false}
                >
                    <div
                        style={{
                            marginBottom: '20px',
                        }}
                    >
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
                                    onChange={({
                                        target: { value },
                                    }: RadioChangeEvent) => {
                                        setOnlineType(+value);
                                        setEditableRowKeys([]);
                                    }}
                                />
                            </Col>
                            <Col>
                                <Select
                                    value={currencyType}
                                    style={{
                                        width: '100px',
                                        margin: '0 20px 10px 0',
                                    }}
                                    onChange={(val) => {
                                        setCurrencyType(+val);
                                        setEditableRowKeys([]);
                                    }}
                                    options={currencyList}
                                ></Select>
                            </Col>
                        </Row>
                        <div>
                            <EditableProTable<CommissionListItem>
                                columns={columns}
                                value={commissionList}
                                onChange={setCommissionList}
                                rowKey={(item) => item.param_config_id}
                                pagination={false}
                                toolBarRender={false}
                                search={false}
                                loading={loading}
                                editable={{
                                    type: 'single',
                                    editableKeys,
                                    onSave: async (rowKey, data, row) => {
                                        handleSave(data);
                                    },
                                    onChange: setEditableRowKeys,
                                    actionRender: (row, config, dom) => [
                                        dom.save,
                                        dom.cancel,
                                    ],
                                }}
                                recordCreatorProps={false}
                                actionRef={tableRef}
                            />
                        </div>
                    </div>
                </ModalForm>
            </div>
        );
    },
);

export default CommissionModalForm;
