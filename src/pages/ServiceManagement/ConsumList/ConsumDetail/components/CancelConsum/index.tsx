import React, { FC, useState, useRef, useEffect } from 'react';
import { Button, Table, Typography, message } from 'antd';
import { useHttp } from '@/hooks';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProCard } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import { ModalForm } from '@ant-design/pro-components';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList, selectHallList } from '@/store/common/commonSlice';
import './index.scoped.scss';
import {
    getConsumDetailById,
    chargebackConsum,
    updateConsum,
} from '@/api/service';
import {
    ChargebackParams,
    GetConsumDetailParams,
    UpdateConsumParams,
} from '@/types/api/service';
import { paymentType } from '@/common/commonConstType';
import Currency from '@/components/Currency';
import { formatCurrency } from '@/utils/tools';
const { Paragraph } = Typography;

type AddConsumListProps = {
    record: any;
    orderStatus?: number;
    onSuccess: () => void;
};
interface DataType {
    sub_order_status: any;
    name: string;
    num: number;
    item_price: number;
    item_subtotal: number;
}
interface DataArr {
    label: string;
    value: number;
}
const AddConsumList: FC<AddConsumListProps> = (props) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);
    const formRef = useRef<ProFormInstance>();
    const { record, orderStatus, onSuccess } = props;
    const { Divider } = ProCard;
    const [modalOpen, setModalOpen] = useState(false);
    const [orderInfo, setOrderInfo] = useState<any>({});
    const [modalVisit, setModalVisit] = useState(false);
    const [selectedKey, setSelectedKey] = useState<Array<any>>([]);

    // 消费数据明项
    const [consumItemList, setConsumItemList] = useState<any>([]);
    const { fetchData: fetchGetConsumDetailById } = useHttp<
        GetConsumDetailParams,
        any
    >(getConsumDetailById);
    const { fetchData: fetchChargebackConsum } = useHttp<ChargebackParams, any>(
        chargebackConsum,
    );

    const { fetchData: fetchUpdateConsum, loading: updateLoading } = useHttp<
        UpdateConsumParams,
        any
    >(updateConsum);

    useEffect(() => {
        if (modalOpen) {
            fetchGetConsumDetailById({
                id: record.id,
            }).then((res) => {
                if (res.code === 10000) {
                    const { order_info = {} } = res.data || {};
                    setOrderInfo(order_info);
                    setConsumItemList(res.data.order_item_detail);
                    let defaultSel: any = [];
                    res.data.order_item_detail.forEach((item: any) => {
                        if (
                            item.sub_order_status === 3 ||
                            item.sub_order_status === 4
                        ) {
                            defaultSel.push(item.id);
                        }
                    });
                    setSelectedKey(defaultSel);
                }
            });
        }
    }, [modalOpen, fetchGetConsumDetailById, record.id]);
    useEffect(() => {
        if (modalOpen) {
            setModalVisit(true);
        } else {
            setModalVisit(false);
        }
    }, [modalOpen]);
    const getLabel = (value: number, dataArr: Array<DataArr>) => {
        return dataArr.find((item) => {
            return item.value === value;
        })?.label;
    };
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
    ];

    const editConsum = async (isCancelConsum?: boolean) => {
        let saveCount = 0;
        const newArr = consumItemList.map((item: any) => {
            const isCancel = selectedKey.includes(item.id);
            // 没退单的数量
            if (!isCancel) {
                saveCount = saveCount + 1;
            }
            return {
                ...item,
                sub_order_status: isCancel && !isCancelConsum ? 3 : 2,
            };
        });
        const params: UpdateConsumParams = {
            order_info: {
                ...orderInfo,
                order_status:
                    isCancelConsum || saveCount === consumItemList.length
                        ? 2
                        : 3,
            },
            order_item_detail: newArr,
        };
        const res = await fetchUpdateConsum(params);
        if (res.code === 10000) {
            setModalVisit(false);
            setModalOpen(false);
            onSuccess();
            message.success('提交成功');
            return true;
        }
    };
    return (
        <ModalForm
            layout="horizontal"
            modalProps={{
                destroyOnClose: true,
            }}
            visible={modalVisit}
            onVisibleChange={(open) => {
                setModalOpen(open);
            }}
            submitter={{
                render: (props, defaultDoms) => {
                    return [
                        orderStatus === 3 ? (
                            <Button
                                type={'ghost'}
                                onClick={() => editConsum(true)}
                                loading={updateLoading}
                            >
                                取消退单
                            </Button>
                        ) : (
                            ''
                        ),
                        ...defaultDoms,
                    ];
                },
                resetButtonProps: {
                    style: {
                        display: 'none',
                    },
                },
                submitButtonProps: {
                    style: {
                        display: orderStatus === 4 ? 'none' : '',
                    },
                },
                searchConfig: {
                    submitText: orderStatus === 3 ? '确认修改' : '确认退单',
                },
            }}
            formRef={formRef}
            trigger={
                <div className="m-primary-font-color pointer">
                    详情
                    {/* {orderStatus === 3
                        ? '待退单'
                        : orderStatus === 4
                        ? '已退单'
                        : '已结算'} */}
                </div>
            }
            onFinish={async () => {
                // eslint-disable-next-line array-callback-return
                if (orderStatus === 3) {
                    editConsum();
                } else {
                    if (selectedKey.length === 0) {
                        message.error('请至少选择一个订单');
                        return;
                    }
                    const newArr = selectedKey.filter(
                        (i) =>
                            consumItemList.find((item: any) => item.id === i)
                                .sub_order_status !== 4,
                    );

                    const res = await fetchChargebackConsum({
                        id: record.id,
                        refund_list: newArr,
                    });
                    if (res.code === 10000) {
                        onSuccess();
                        message.success('提交成功');
                        return true;
                    }
                }
            }}
            title={
                orderStatus === 3
                    ? '待退单'
                    : orderStatus === 4
                    ? '已退单'
                    : '已结算'
            }
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
        >
            <div className="a-top">
                <div className="a-label">
                    <span>场馆：</span>
                    <span>{getLabel(record.venue_type, hallList)}</span>
                </div>
                <div className="a-label">
                    <span>消费币种：</span>
                    <span>{getLabel(record.currency_type, currencyList)}</span>
                </div>
                <div className="a-label">
                    <span>户口：</span>
                    <span>{record.account}</span>
                </div>
                <div className="a-label">
                    <span>名称：</span>
                    <span>{record.account_name}</span>
                </div>
                <div className="a-label">
                    <span>客户：</span>
                    <span>{record.customer_name}</span>
                </div>
                <div className="a-label">
                    <span>结算方式：</span>
                    <span>{getLabel(record.payment_type, paymentType)}</span>
                </div>
            </div>

            <Divider type={'horizontal'} />

            <div className="a-table">
                <div className="a-table-right">
                    <div className="a-right-title">消费项目</div>
                    <Table
                        rowSelection={{
                            selections: [
                                Table.SELECTION_ALL,
                                Table.SELECTION_INVERT,
                            ],
                            onChange: (keys) => {
                                setSelectedKey(keys);
                            },
                            selectedRowKeys: selectedKey,
                            hideSelectAll:
                                consumItemList.findIndex(
                                    (i: any) => i.sub_order_status === 4,
                                ) !== -1,
                        }}
                        rowClassName={(record) => {
                            return record.sub_order_status === 4
                                ? 'disabled-row'
                                : '';
                        }}
                        className={
                            orderStatus === 4
                                ? 'a-right-tbcontent'
                                : 'a-right-tbcontent'
                        }
                        columns={columns}
                        dataSource={consumItemList}
                        scroll={{ y: 220 }}
                        size="small"
                        pagination={false}
                        rowKey="id"
                        summary={(pageData) => {
                            let total = 0;
                            let cancelTotal = 0;
                            pageData.forEach((item: any) => {
                                total = total + item.item_subtotal;
                                const next =
                                    item.sub_order_status === 4
                                        ? item.item_subtotal
                                        : 0;
                                cancelTotal = cancelTotal + next;
                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} />
                                        <Table.Summary.Cell index={1} />
                                        <Table.Summary.Cell index={2} />
                                        <Table.Summary.Cell index={3}>
                                            合计：
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={4}>
                                            {formatCurrency(total, 6)}
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} />
                                        <Table.Summary.Cell index={1} />
                                        <Table.Summary.Cell index={2} />
                                        <Table.Summary.Cell index={3}>
                                            已退金额：
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={4}>
                                            <span className="m-primary-error-color">
                                                {`${
                                                    cancelTotal ? '-' : ''
                                                }${formatCurrency(
                                                    cancelTotal,
                                                    6,
                                                )}`}
                                            </span>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            );
                        }}
                    />
                </div>
            </div>

            <div className="a-footer">
                <Paragraph copyable={{ text: record.order_number }}>
                    订单编号： {record.order_number}
                </Paragraph>
                {(record.payment_type === 5 || record.payment_type === 6) && (
                    <div className="a-label">
                        <span>经办人：</span>
                        <span>{record.operator}</span>
                    </div>
                )}
            </div>
            <div className="a-footer">
                <div>
                    <span>备注：</span>
                    <span style={{ wordBreak: 'break-all' }}>
                        {record.remark}
                    </span>
                </div>
            </div>
        </ModalForm>
    );
};

export default AddConsumList;
