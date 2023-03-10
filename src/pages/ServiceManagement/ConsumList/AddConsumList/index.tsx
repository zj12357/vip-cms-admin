import React, { FC, useState, useRef, useEffect } from 'react';
import {
    Statistic,
    Button,
    Table,
    InputNumber,
    Spin,
    message,
    Popover,
    Typography,
} from 'antd';
import { useHttp } from '@/hooks';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProCard } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
    ProFormRadio,
} from '@ant-design/pro-components';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList, selectHallList } from '@/store/common/commonSlice';
import './index.scoped.scss';
import AddConfig from '../AddConfig';
import { consume_type } from '@/common/commonConstType';
import {
    queryAccount,
    getConsumConfigList,
    addConsum,
    getDepartmentList,
    getDepartmentMember,
    getCompanyList,
    getCompanyBalance,
} from '@/api/service';
import {
    AddConsumParams,
    QueryAccountParams,
    GetConsumConfigListParams,
    GetCompanyBalanceParams,
} from '@/types/api/service';
import { formatCurrency } from '@/utils/tools';
import Currency from '@/components/Currency';
const { Text } = Typography;

type AddConsumListProps = {
    venueForProps: number;
    onSuccess: () => void;
};
interface DataType {
    name: string;
    num: number;
    item_price: number;
    item_subtotal: number;
}

type AccountInfo = {
    account: string;
    account_name: string;
    budget_commission: number;
    integral_balance: number;
    gifts_balance: number;
    expiring_integral: number;
};

const AddConsumList: FC<AddConsumListProps> = (props) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);
    const childRef: any = useRef();
    const formRef = useRef<ProFormInstance>();
    const { venueForProps, onSuccess } = props;
    const { Divider } = ProCard;
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAddform, setShowAddform] = useState(false);
    const [accountError, setAccountError] = useState<'' | 'error'>('');
    const [helpMessage, setHelpMessage] = useState('');
    const [payment_type, setpayment_type] = useState('1');
    const [total, setTotal] = useState(0);
    const [accountInfo, setAccountInfo] = useState<AccountInfo>({
        account: '',
        account_name: '',
        budget_commission: 0,
        integral_balance: 0,
        gifts_balance: 0,
        expiring_integral: 0,
    });
    const [currency, setCurrency] = useState(1);
    const [consumConfigList, setConsumConfigList] = useState([]);

    // ??????
    const [departmentList, setDepartmentList] = useState<any>([]);
    const [operatorList, setOperatorList] = useState<any>([]);
    const [companyList, setCompanyList] = useState<any>([]);
    const [companyBalance, setCompanyBalance] = useState<any>(0);
    const [tab, setTab] = useState(0);
    // ??????????????????
    const [consumItemList, setConsumItemList] = useState<any>([]);
    // ???????????????
    const [consumCount, setConsumCount] = useState(0);
    // ????????????
    const { fetchData: fetchQueryAccount } = useHttp<QueryAccountParams, any>(
        queryAccount,
    );
    // ??????????????????
    const { fetchData: fetchGetConsumConfigList } = useHttp<
        GetConsumConfigListParams,
        any
    >(getConsumConfigList);

    useEffect(() => {
        let nexTotal = 0;
        consumItemList.forEach((item: any) => {
            nexTotal = nexTotal + item.item_subtotal;
        });
        setTotal(nexTotal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [consumCount]);

    useEffect(() => {
        if (modalOpen) {
            setConsumItemList([]);
            setTotal(0);
        }
    }, [modalOpen]);
    useEffect(() => {
        if (modalOpen) {
            setLoading(true);
            fetchGetConsumConfigList({
                venue_type: venueForProps,
                currency_type: currency,
                consume_type: tab + 1,
                page: 1,
                size: 20,
            }).then((res) => {
                if (res.code === 10000) {
                    setConsumConfigList(res.data.list);
                    setLoading(false);
                }
            });
        }
    }, [
        modalOpen,
        tab,
        currency,
        venueForProps,
        fetchGetConsumConfigList,
        showAddform,
    ]);
    useEffect(() => {
        clearConsumItemList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency]);

    const resetListForSelect = (
        arr: Array<any>,
        key: string,
        valKey: string,
    ) => {
        return arr.map((i) => {
            return {
                ...i,
                label: i[key],
                value: i[valKey],
            };
        });
    };
    // ????????????
    const { fetchData: fetchGetDepartmentList } = useHttp<any, any>(
        getDepartmentList,
    );

    const fetchGetDepartmentListReq = () => {
        fetchGetDepartmentList().then((res) => {
            const list = resetListForSelect(
                res.data || [],
                'department_name',
                'department_name',
            );
            setDepartmentList(list);
        });
    };

    // ??????????????????
    const { fetchData: fetchGetDepartmentMember } = useHttp<any, any>(
        getDepartmentMember,
    );

    const fetchGetDepartmentMemberReq = (id: string) => {
        fetchGetDepartmentMember(id).then((res) => {
            const list = resetListForSelect(
                res.data || [],
                'user_name',
                'user_name',
            );
            setOperatorList(list);
        });
    };
    // ??????????????????
    const { fetchData: fetchGetCompanyList } = useHttp<any, any>(
        getCompanyList,
    );
    const fetchGetCompanyListReq = () => {
        fetchGetCompanyList().then((res) => {
            const list = resetListForSelect(
                res.data || [],
                'member_name',
                'member_code',
            );
            setCompanyList(list);
        });
    };
    // ????????????????????????
    const { fetchData: fetchGetCompanyBalance } = useHttp<
        GetCompanyBalanceParams,
        any
    >(getCompanyBalance);

    const fetchGetCompanyBalanceReq = (code: string) => {
        fetchGetCompanyBalance({
            hall: +venueForProps,
            member_code: code,
            currency_id: +formRef.current?.getFieldValue('currency_type'),
        }).then((res) => {
            setCompanyBalance(res.data?.available);
        });
    };

    useEffect(() => {
        // ????????????
        if (payment_type === '5' || payment_type === '6') {
            fetchGetDepartmentListReq();
            fetchGetCompanyListReq();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payment_type]);
    const columns: ColumnsType<DataType> = [
        {
            title: '????????????',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '??????',
            dataIndex: 'item_count',
            key: 'item_count',
        },
        {
            title: '??????',
            dataIndex: 'item_price',
            key: 'item_price',
            render: (_, record) => (
                <Currency value={record.item_price} decimal={6} />
            ),
        },
        {
            title: '??????',
            dataIndex: 'item_subtotal',
            key: 'item_subtotal',
            render: (_, record) => (
                <Currency value={record.item_subtotal} decimal={6} />
            ),
        },
        {
            title: '??????',
            dataIndex: 'item_name',
            key: 'item_name',
            render: (text, record) => (
                <div
                    className="m-primary-font-color pointer"
                    onClick={() => deleteConsumItem(record)}
                >
                    ??????
                </div>
            ),
        },
    ];

    // ????????????
    const checkAccount = async () => {
        const account = formRef.current?.getFieldValue('account');
        if (!account) {
            setAccountError('error');
            setHelpMessage('???????????????');
            return;
        }
        const res = await fetchQueryAccount({
            account,
            currency_type: currency,
        });
        if (res.code === 10000) {
            if (res.data) {
                setAccountInfo(res.data);
                formRef.current?.setFieldsValue({
                    account_name: res.data.account_name,
                });
            } else {
                setAccountError('error');
                setHelpMessage('?????????????????????????????????');
            }
        } else {
            setAccountError('error');
            setHelpMessage('?????????????????????????????????');
        }
    };

    useEffect(() => {
        if (
            currency &&
            accountInfo.account &&
            accountInfo.account.toLowerCase() ===
                (formRef.current?.getFieldValue('account') || '').toLowerCase()
        ) {
            checkAccount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency]);

    // ??????????????????
    const propsCreateNew = () => {
        childRef?.current?.createConsumConfig();
    };

    // ???????????????
    const changeItemNum = (item: any, type: number) => {
        let num = consumItemList.find(
            (ele: any) => ele.id === item.id,
        )?.item_count;
        if (type) {
            num ? (num += 1) : (num = 1);
        } else {
            num ? (num -= 1) : (num = 0);
        }
        itemListEditor(item, num);
    };

    // ??????????????????
    const itemListEditor = (item: any, value: any) => {
        let formatValue;
        if (value) {
            formatValue = parseInt(value);
        } else {
            formatValue = 0;
        }
        const newData: any = JSON.parse(JSON.stringify(consumItemList));
        const changeIndex = newData.findIndex((ele: any) => ele.id === item.id);
        if (formatValue) {
            if (changeIndex !== -1) {
                newData[changeIndex].item_count = formatValue;
                newData[changeIndex].item_subtotal =
                    formatValue * newData[changeIndex].item_price;
            } else {
                newData.push({
                    consume_config_id: item.id,
                    id: item.id,
                    item_name: item.item_name,
                    item_count: formatValue,
                    item_price: item.item_price,
                    item_subtotal: formatValue * item.item_price,
                    consume_type: tab + 1,
                });
            }
        } else {
            if (changeIndex !== -1) {
                newData.splice(changeIndex, 1);
            }
        }
        setConsumCount(consumCount + 1);
        setConsumItemList(newData);
    };
    // ?????????????????????
    const deleteConsumItem = (item: any) => {
        const newData: any = JSON.parse(JSON.stringify(consumItemList));
        const changeIndex = newData.findIndex((ele: any) => ele.id === item.id);
        newData.splice(changeIndex, 1);
        setConsumCount(consumCount + 1);
        setConsumItemList(newData);
    };
    // ??????????????????
    const clearConsumItemList = () => {
        setConsumCount(consumCount + 1);
        setConsumItemList([]);
    };
    return (
        <ModalForm
            layout="horizontal"
            modalProps={{
                destroyOnClose: true,
            }}
            onVisibleChange={(open) => {
                setModalOpen(open);
            }}
            initialValues={{
                payment_type: '1',
            }}
            formRef={formRef}
            trigger={<Button type="primary">??????</Button>}
            onFinish={async (values: any) => {
                if (helpMessage) {
                    message.error('????????????????????????');
                    return false;
                }
                if (values.account && !values.account_name) {
                    message.error('?????????????????????????????????');
                    return false;
                }
                if (
                    values.account.toLowerCase() !==
                    accountInfo.account.toLowerCase()
                ) {
                    message.error('????????????????????????');
                    return false;
                }

                if (consumItemList.length === 0) {
                    message.error('?????????????????????');
                    return false;
                }
                if (
                    values.payment_type === '3' &&
                    +total > +accountInfo.budget_commission
                ) {
                    message.error('?????????????????????');
                    return false;
                }

                if (
                    values.payment_type === '4' &&
                    +total > +accountInfo.integral_balance
                ) {
                    message.error('????????????');
                    return false;
                }
                // if (
                //     values.payment_type === '5' &&
                //     +total > +accountInfo.gifts_balance
                // ) {
                //     message.error('???????????????');
                //     return false;
                // }

                // if (values.payment_type === '6' && +total > +companyBalance) {
                //     message.error('?????????????????????');
                //     return false;
                // }

                const params: AddConsumParams = {
                    ...values,
                    venue_type: venueForProps,
                    payment_type: +values.payment_type,
                    consume_item_detail_list: consumItemList,
                    consume_item_total: total,
                };
                const res = await addConsum(params);

                if (res.code === 10000) {
                    onSuccess();
                    message.success('????????????');
                    return true;
                }
            }}
            title="????????????"
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
            onValuesChange={(changeValues, values) => {
                const key = Object.keys(changeValues)[0];
                if (key === 'account') {
                    if (changeValues['account'] === '') {
                        setAccountError('error');
                        setHelpMessage('???????????????');
                        setAccountInfo({
                            account: '',
                            account_name: '',
                            budget_commission: 0,
                            integral_balance: 0,
                            gifts_balance: 0,
                            expiring_integral: 0,
                        });
                        formRef.current?.setFieldsValue({
                            account_name: '',
                        });
                    } else {
                        setAccountError('');
                        setHelpMessage('');
                    }
                } else if (key === 'currency_type') {
                    setCurrency(changeValues['currency_type']);
                } else if (key === 'payment_type') {
                    if (payment_type === '5' || payment_type === '6') {
                        formRef.current?.setFieldsValue({
                            department: '',
                            operator: '',
                            company_account: '',
                        });
                        setOperatorList([]);
                    }
                    setpayment_type(changeValues[key]);
                } else if (key === 'department') {
                    const id = departmentList.find(
                        (i: any) => i.department_name === values.department,
                    )?.id;
                    fetchGetDepartmentMemberReq(id);
                    formRef.current?.setFieldsValue({
                        operator: '',
                    });
                } else if (key === 'company_account') {
                    fetchGetCompanyBalanceReq(changeValues[key]);
                }
            }}
        >
            <div className="a-top">
                <div className="a-venue-name">
                    <span>?????????</span>
                    <span>
                        {hallList.find(
                            (item: any) => item.value === venueForProps,
                        )?.label || ''}
                    </span>
                </div>
                <ProCard.Group direction={'row'} size="small">
                    <ProCard>
                        <Statistic
                            title="???????????????"
                            value={formatCurrency(
                                accountInfo.budget_commission,
                                6,
                            )}
                        />
                    </ProCard>
                    <Divider type={'vertical'} />
                    <ProCard>
                        <Statistic
                            title="??????"
                            value={formatCurrency(
                                accountInfo.integral_balance,
                                6,
                            )}
                        />
                    </ProCard>
                    <Divider type={'vertical'} />
                    <ProCard>
                        <Statistic
                            title="?????????"
                            value={formatCurrency(accountInfo.gifts_balance, 6)}
                            // precision={2}
                        />
                    </ProCard>
                    <Divider type={'vertical'} />
                </ProCard.Group>
            </div>
            {accountInfo.expiring_integral ? (
                <p style={{ textAlign: 'right' }}>
                    {formatCurrency(accountInfo.expiring_integral, 6)}
                    ??????????????????????????????
                </p>
            ) : null}

            <Divider type={'horizontal'} />
            <ProForm.Group>
                <ProFormText
                    width="sm"
                    labelAlign="right"
                    name="account"
                    label="??????"
                    validateStatus={accountError}
                    help={helpMessage}
                    placeholder="???????????????"
                    required
                    rules={[
                        {
                            max: 20,
                            message: '??????20?????????',
                        },
                    ]}
                />
                <Button type="primary" onClick={checkAccount}>
                    ??????
                </Button>
                <ProFormText
                    width="sm"
                    labelAlign="right"
                    name="account_name"
                    label="??????"
                    disabled
                    placeholder=""
                />
                <ProFormText
                    width="sm"
                    labelAlign="right"
                    name="customer_name"
                    label="?????????"
                    placeholder="??????????????????"
                    rules={[
                        {
                            required: true,
                        },
                        {
                            max: 20,
                            message: '??????????????????20?????????',
                        },
                    ]}
                />
                <ProFormSelect
                    // colProps={{ 12 }}
                    width="sm"
                    label="????????????"
                    name="currency_type"
                    request={async () => [...currencyList]}
                    initialValue={1}
                />
            </ProForm.Group>
            <div className="a-table">
                <div className="a-table-left">
                    {showAddform ? (
                        <>
                            <AddConfig
                                ref={childRef}
                                currency={currency}
                                venueForProps={venueForProps}
                                closeAddModal={() => {
                                    setShowAddform(false);
                                }}
                            />
                            <div className="a-table-footer">
                                <Button
                                    style={{ marginRight: '15px' }}
                                    size="small"
                                    type="default"
                                    onClick={() => {
                                        setShowAddform(false);
                                    }}
                                >
                                    ??????
                                </Button>
                                <Button
                                    style={{ marginRight: '15px' }}
                                    size="small"
                                    type="primary"
                                    onClick={propsCreateNew}
                                >
                                    ??????
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="a-table-left-tab">
                                {consume_type.map((item, index) => {
                                    return (
                                        <div
                                            key={item.value}
                                            className={
                                                tab === index
                                                    ? 'a-table-item a-table-item-selected'
                                                    : 'a-table-item'
                                            }
                                            onClick={() => {
                                                setTab(index);
                                            }}
                                        >
                                            {item.label}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="a-table-content">
                                <Spin spinning={loading}>
                                    {consumConfigList.map((item: any) => {
                                        return (
                                            <div
                                                className="a-table-config-item"
                                                key={item.id}
                                            >
                                                <Popover
                                                    content={item.item_name}
                                                    title={false}
                                                >
                                                    <Text ellipsis={true}>
                                                        {item.item_name}
                                                    </Text>
                                                </Popover>
                                                <div>
                                                    {formatCurrency(
                                                        item.item_price,
                                                        6,
                                                    )}
                                                </div>
                                                <div className="a-item-num">
                                                    <Button
                                                        size="small"
                                                        onClick={() => {
                                                            changeItemNum(
                                                                item,
                                                                0,
                                                            );
                                                        }}
                                                    >
                                                        -
                                                    </Button>

                                                    <InputNumber
                                                        maxLength={3}
                                                        size="small"
                                                        style={{
                                                            width: '40px',
                                                        }}
                                                        controls={false}
                                                        min={0}
                                                        precision={0}
                                                        onChange={(value) => {
                                                            itemListEditor(
                                                                item,
                                                                value,
                                                            );
                                                        }}
                                                        value={
                                                            consumItemList.find(
                                                                (ele: any) =>
                                                                    ele.id ===
                                                                    item.id,
                                                            )?.item_count
                                                        }
                                                    />
                                                    <Button
                                                        size="small"
                                                        onClick={() => {
                                                            changeItemNum(
                                                                item,
                                                                1,
                                                            );
                                                        }}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Spin>
                            </div>
                            <div className="a-table-footer">
                                <Button
                                    type="link"
                                    onClick={() => {
                                        setShowAddform(true);
                                    }}
                                >
                                    [????????????]
                                </Button>
                            </div>
                        </>
                    )}
                </div>
                <div className="a-table-right">
                    <div className="a-right-title">????????????</div>
                    <Table
                        className="a-right-tbcontent"
                        columns={columns}
                        dataSource={consumItemList}
                        scroll={{ y: 180 }}
                        size="small"
                        pagination={false}
                        rowKey="id"
                    />
                    <div className="a-right-footer">
                        <Button type="link" onClick={clearConsumItemList}>
                            [????????????]
                        </Button>
                    </div>
                </div>
            </div>
            <div className="a-money">
                <span>???????????????</span>
                <span className="m-primary-font-color">
                    {formatCurrency(total, 6)}
                </span>
            </div>
            <ProForm.Group>
                <ProFormRadio.Group
                    label="????????????"
                    name="payment_type"
                    options={[
                        { label: '??????', value: '1' },
                        { label: '??????', value: '2' },
                        { label: '??????', value: '3' },
                        { label: '??????', value: '4' },
                        { label: '???????????????', value: '5' },
                        { label: '????????????', value: '6' },
                    ]}
                />
            </ProForm.Group>
            {payment_type === '5' || payment_type === '6' ? (
                <ProForm.Group>
                    {payment_type === '6' ? (
                        <>
                            <ProFormSelect
                                width="sm"
                                label="????????????"
                                name="company_account"
                                options={companyList}
                                rules={[{ required: true }]}
                            />
                            <p className="gift-tip">
                                ??????????????????{formatCurrency(companyBalance, 6)}
                                ???
                            </p>
                        </>
                    ) : (
                        ''
                    )}
                    <ProFormSelect
                        key={payment_type + '1'}
                        width="sm"
                        label="??????"
                        name="department"
                        rules={[{ required: true }]}
                        options={departmentList}
                    />
                    <ProFormSelect
                        key={payment_type + '2'}
                        width="xs"
                        label="?????????"
                        name="operator"
                        rules={[{ required: true }]}
                        options={operatorList}
                    />
                </ProForm.Group>
            ) : (
                ''
            )}
            <ProForm.Group>
                <ProFormTextArea
                    width={'lg'}
                    fieldProps={{
                        showCount: true,
                        maxLength: 100,
                    }}
                    colProps={{ span: 24 }}
                    name="remark"
                    label="??????"
                />
            </ProForm.Group>
        </ModalForm>
    );
};

export default AddConsumList;
