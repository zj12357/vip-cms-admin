import React, { FC, useState, useRef, useEffect } from 'react';
import {
    Statistic,
    Button,
    Table,
    InputNumber,
    Typography,
    Spin,
    message,
    Popover,
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
import AddConfig from '../../../AddConfig';
import { consume_type } from '@/common/commonConstType';
import {
    queryAccount,
    getConsumConfigList,
    updateConsum,
    getConsumDetailById,
    cancelConsum,
    getDepartmentMember,
    getCompanyList,
    getCompanyBalance,
    getDepartmentList,
} from '@/api/service';
import {
    UpdateConsumParams,
    QueryAccountParams,
    GetConsumConfigListParams,
    GetConsumDetailParams,
    GetCompanyBalanceParams,
} from '@/types/api/service';
import { formatCurrency } from '@/utils/tools';
import Currency from '@/components/Currency';

const { Paragraph, Text } = Typography;

type EditConsumListProps = {
    record: any;
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

const EditConsumList: FC<EditConsumListProps> = (props) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);
    const childRef: any = useRef();
    const formRef = useRef<ProFormInstance>();
    const { onSuccess, record } = props;
    const { venue_type, id } = record;
    const { Divider } = ProCard;
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAddform, setShowAddform] = useState(false);
    const [payment_type, setpayment_type] = useState('1');
    const [orderInfo, setOrderInfo] = useState<any>({});
    const [modalVisit, setModalVisit] = useState(false);
    const [departmentList, setDepartmentList] = useState<any>([]);
    const [operatorList, setOperatorList] = useState<any>([]);
    const [companyList, setCompanyList] = useState<any>([]);
    const [companyBalance, setCompanyBalance] = useState<any>(0);
    const [accountInfo, setAccountInfo] = useState<AccountInfo>({
        account: '',
        account_name: '',
        budget_commission: 0,
        integral_balance: 0,
        gifts_balance: 0,
        expiring_integral: 0,
    });
    const [total, setTotal] = useState(0);
    const [currency, setCurrency] = useState(0);
    const [consumConfigList, setConsumConfigList] = useState([]);

    const [tab, setTab] = useState(0);
    // 消费数据明项
    const [consumItemList, setConsumItemList] = useState<any>([]);
    // 消费项变动
    const [consumCount, setConsumCount] = useState(0);
    const { fetchData: fetchGetConsumDetailById } = useHttp<
        GetConsumDetailParams,
        any
    >(getConsumDetailById);
    // 查询户口
    const { fetchData: fetchQueryAccount } = useHttp<QueryAccountParams, any>(
        queryAccount,
    );
    // 查询消费项目
    const { fetchData: fetchGetConsumConfigList } = useHttp<
        GetConsumConfigListParams,
        any
    >(getConsumConfigList);
    const { fetchData: fetchCancelConsum, loading: cancelLoading } = useHttp<
        string,
        any
    >(cancelConsum);
    // 查询部门人员
    const { fetchData: fetchGetDepartmentMember } = useHttp<any, any>(
        getDepartmentMember,
    );
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
    // 查询公司户口
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
    // 查询公司户口余额
    const { fetchData: fetchGetCompanyBalance } = useHttp<
        GetCompanyBalanceParams,
        any
    >(getCompanyBalance);
    // 查询部门
    const { fetchData: fetchGetDepartmentList } = useHttp<any, any>(
        getDepartmentList,
    );
    const fetchGetCompanyBalanceReq = (code: string) => {
        fetchGetCompanyBalance({
            hall: +venue_type,
            member_code: code,
            currency_id: +formRef.current?.getFieldValue('currency_type'),
        }).then((res) => {
            setCompanyBalance(res.data?.available);
        });
    };

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

    useEffect(() => {
        // 查询部门
        if (payment_type === '5' || payment_type === '6') {
            fetchGetDepartmentListReq();
            fetchGetCompanyListReq();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payment_type]);
    const cancelConsumReq = () => {
        fetchCancelConsum(orderInfo.id)
            .then((res) => {
                if (res.code === 10000) {
                    onSuccess();
                    setModalVisit(false);
                    setModalOpen(false);
                    message.success(res.msg);
                } else {
                    message.error(res.data);
                }
            })
            .then((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        if (modalOpen) {
            setModalVisit(true);
            fetchGetConsumDetailById({
                id: record.id,
            }).then((res) => {
                if (res.code === 10000) {
                    const { order_info = {} } = res.data || {};
                    formRef.current?.setFieldsValue({
                        customer_name: order_info.customer_name,
                        currency_type: order_info.currency_type,
                        payment_type: order_info.payment_type + '',
                        department: order_info.department,
                        operator: order_info.operator,
                        remark: order_info.remark,
                    });
                    setpayment_type(order_info.payment_type + '');
                    setCurrency(order_info.currency_type);
                    setOrderInfo(res.data.order_info || {});
                    setConsumItemList(res.data.order_item_detail);
                }
            });
        } else {
            setModalVisit(false);
        }
    }, [fetchGetConsumDetailById, modalOpen, record.id]);

    useEffect(() => {
        let nexTotal = 0;
        consumItemList.forEach((item: any) => {
            nexTotal = nexTotal + item.item_subtotal;
        });
        setTotal(nexTotal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [consumCount, consumItemList.length]);
    useEffect(() => {
        if (orderInfo.account && currency) {
            checkAccount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderInfo.account, currency]);
    // 查询户口
    const checkAccount = async () => {
        const res = await fetchQueryAccount({
            account: orderInfo.account,
            currency_type: currency,
        });
        if (res.code === 10000) {
            if (res.data) {
                setAccountInfo(res.data);
                formRef.current?.setFieldsValue({
                    account: res.data.account,
                    account_name: res.data.account_name,
                });
            } else {
                message.error('户口不存在');
            }
        } else {
            message.error('户口不存在');
        }
    };
    useEffect(() => {
        if (modalOpen && orderInfo.currency_type) {
            setLoading(true);
            fetchGetConsumConfigList({
                venue_type: venue_type,
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
        venue_type,
        fetchGetConsumConfigList,
        showAddform,
        orderInfo.currency_type,
    ]);
    useEffect(() => {
        clearConsumItemList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency]);
    const columns: ColumnsType<DataType> = [
        {
            title: '项目名称',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '数量',
            dataIndex: 'item_count',
            key: 'item_count',
        },
        {
            title: '单价',
            dataIndex: 'item_price',
            key: 'item_price',
            render: (_, record) => (
                <Currency value={record.item_price} decimal={6} />
            ),
        },
        {
            title: '小计',
            dataIndex: 'item_subtotal',
            key: 'item_subtotal',
            render: (_, record) => (
                <Currency value={record.item_subtotal} decimal={6} />
            ),
        },
        {
            title: '操作',
            dataIndex: 'item_name',
            key: 'item_name',
            render: (text, record) => (
                <div
                    className="m-primary-font-color pointer"
                    onClick={() => deleteConsumItem(record)}
                >
                    删除
                </div>
            ),
        },
    ];

    // 新增消费配置
    const propsCreateNew = () => {
        childRef?.current?.createConsumConfig();
    };

    // 消费项加减
    const changeItemNum = (item: any, type: number) => {
        let num = consumItemList.find(
            (ele: any) => ele.consume_config_id === item.id,
        )?.item_count;
        if (type) {
            num ? (num += 1) : (num = 1);
        } else {
            num ? (num -= 1) : (num = 0);
        }
        itemListEditor(item, num);
    };

    // 消费项目操作
    const itemListEditor = (item: any, value: any) => {
        let formatValue;
        if (value) {
            formatValue = parseInt(value);
        } else {
            formatValue = 0;
        }
        const newData: any = JSON.parse(JSON.stringify(consumItemList));
        const changeIndex = newData.findIndex(
            (ele: any) => ele.consume_config_id === item.id,
        );
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
        setConsumItemList(newData);
        setConsumCount(consumCount + 1);
    };

    // 删除某一项消费
    const deleteConsumItem = (item: any) => {
        const newData: any = JSON.parse(JSON.stringify(consumItemList));
        const changeIndex = newData.findIndex((ele: any) => ele.id === item.id);
        newData.splice(changeIndex, 1);
        setConsumCount(consumCount + 1);
        setConsumItemList(newData);
    };

    // 清空消费明细
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
            visible={modalVisit}
            formRef={formRef}
            trigger={<div className="m-primary-font-color pointer">详情</div>}
            onFinish={async (values: any) => {
                if (consumItemList.length === 0) {
                    message.error('请添加消费项目');
                    return false;
                }

                if (
                    values.payment_type === '3' &&
                    +total > +accountInfo.budget_commission
                ) {
                    message.error('可预支佣金不足');
                    return false;
                }

                if (
                    values.payment_type === '4' &&
                    +total > +accountInfo.integral_balance
                ) {
                    message.error('积分不足');
                    return false;
                }
                // if (
                //     (values.payment_type === '5' ||
                //         values.payment_type === '6') &&
                //     +total > +accountInfo.gifts_balance
                // ) {
                //     message.error('礼遇金不足');
                //     return false;
                // }

                const params: UpdateConsumParams = {
                    order_info: {
                        ...orderInfo,
                        ...values,
                        order_amount: total,
                        payment_type: +values.payment_type,
                    },
                    order_item_detail: consumItemList,
                };
                const res = await updateConsum(params);

                if (res.code === 10000) {
                    setModalVisit(false);
                    setModalOpen(false);
                    onSuccess();
                    message.success('提交成功');
                    return true;
                }
            }}
            submitter={{
                render: (props, defaultDoms) => {
                    return [
                        <Button
                            type={'primary'}
                            onClick={cancelConsumReq}
                            loading={cancelLoading}
                        >
                            取消订单
                        </Button>,
                        ...defaultDoms,
                    ];
                },
            }}
            title="待结算"
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
            onValuesChange={(changeValues, values) => {
                const key = Object.keys(changeValues)[0];
                if (key === 'currency_type') {
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
                    <span>场馆：</span>
                    <span>
                        {hallList.find((item) => item.value === venue_type)
                            ?.label || ''}
                    </span>
                </div>
                <ProCard.Group direction={'row'} size="small">
                    <ProCard>
                        <Statistic
                            title="可预支佣金"
                            value={formatCurrency(
                                accountInfo.budget_commission,
                                6,
                            )}
                        />
                    </ProCard>
                    <Divider type={'vertical'} />
                    <ProCard>
                        <Statistic
                            title="积分"
                            value={formatCurrency(
                                accountInfo.integral_balance,
                                6,
                            )}
                        />
                    </ProCard>
                    <Divider type={'vertical'} />
                    <ProCard>
                        <Statistic
                            title="礼遇金"
                            value={formatCurrency(accountInfo.gifts_balance, 6)}
                        />
                    </ProCard>
                    <Divider type={'vertical'} />
                </ProCard.Group>
            </div>
            {accountInfo.expiring_integral ? (
                <p style={{ textAlign: 'right' }}>
                    {formatCurrency(accountInfo.expiring_integral, 6)}
                    万积分将在本月底到期
                </p>
            ) : null}

            <Divider type={'horizontal'} />
            <ProForm.Group>
                <ProFormText
                    width="sm"
                    labelAlign="right"
                    name="account"
                    label="户口"
                    disabled
                />
                <ProFormText
                    width="sm"
                    labelAlign="right"
                    name="account_name"
                    label="户名"
                    disabled
                />
                <ProFormText
                    width="sm"
                    labelAlign="right"
                    name="customer_name"
                    label="客户名"
                    placeholder="请输入客户名"
                    disabled
                />
                <ProFormSelect
                    width="sm"
                    label="定价币种"
                    name="currency_type"
                    disabled
                    request={async () => [...currencyList]}
                />
            </ProForm.Group>
            <div className="a-table">
                <div className="a-table-left">
                    {showAddform ? (
                        <>
                            <AddConfig
                                ref={childRef}
                                currency={currency}
                                venueForProps={venue_type}
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
                                    取消
                                </Button>
                                <Button
                                    style={{ marginRight: '15px' }}
                                    size="small"
                                    type="primary"
                                    onClick={propsCreateNew}
                                >
                                    保存
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
                                                                    ele.consume_config_id ===
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
                                    [新增项目]
                                </Button>
                            </div>
                        </>
                    )}
                </div>
                <div className="a-table-right">
                    <div className="a-right-title">消费项目</div>
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
                            [清空全部]
                        </Button>
                    </div>
                </div>
            </div>
            <div className="a-money">
                <span>合计消费：</span>
                <span>{formatCurrency(total, 6)}</span>
            </div>
            <ProForm.Group>
                <ProFormRadio.Group
                    label="结算方式"
                    name="payment_type"
                    initialValue="现金"
                    options={[
                        { label: '现金', value: '1' },
                        { label: '存卡', value: '2' },
                        { label: '佣金', value: '3' },
                        { label: '积分', value: '4' },
                        { label: '礼遇金赠送', value: '5' },
                        { label: '部门赠送', value: '6' },
                    ]}
                />
            </ProForm.Group>
            {payment_type === '5' || payment_type === '6' ? (
                <ProForm.Group>
                    {payment_type === '6' ? (
                        <>
                            <ProFormSelect
                                width="sm"
                                label="公司户口"
                                name="company_account"
                                options={companyList}
                                rules={[{ required: true }]}
                            />
                            <p className="gift-tip">
                                可赠送余额：{formatCurrency(companyBalance, 6)}
                                万
                            </p>
                        </>
                    ) : (
                        ''
                    )}
                    <ProFormSelect
                        key={payment_type + '1'}
                        width="sm"
                        label="部门"
                        name="department"
                        rules={[{ required: true }]}
                        options={departmentList}
                    />
                    <ProFormSelect
                        key={payment_type + '2'}
                        width="xs"
                        label="经办人"
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
                    colProps={{ span: 24 }}
                    name="remark"
                    label="备注"
                    fieldProps={{
                        showCount: true,
                        maxLength: 100,
                    }}
                />
            </ProForm.Group>
            <div>
                <Paragraph copyable={{ text: orderInfo.order_number }}>
                    订单编号： {orderInfo.order_number}
                </Paragraph>
            </div>
        </ModalForm>
    );
};

export default EditConsumList;
