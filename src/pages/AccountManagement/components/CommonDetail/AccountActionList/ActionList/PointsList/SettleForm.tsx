import React, { FC, memo, useEffect } from 'react';
import { Modal, Descriptions, Divider } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { CopyOutlined } from '@ant-design/icons';
import { handleClipboard } from '@/utils/clipboard';
import { useHttp } from '@/hooks';
import { getConsumeDetail } from '@/api/accountAction';
import {
    ConsumeDetailType,
    ConsumeListItem,
    OrderDetailItem,
} from '@/types/api/accountAction';
import { useAppSelector } from '@/store/hooks';
import { selectHallList, selectCurrencyList } from '@/store/common/commonSlice';
import { paymentType, consume_type } from '@/common/commonConstType';
import Currency from '@/components/Currency';

type SettleFormProps = {
    visible: boolean;
    onCancel: () => void;
    record: ConsumeListItem;
};

const SettleForm: FC<SettleFormProps> = memo(
    ({ visible, onCancel, record }) => {
        const hallList = useAppSelector(selectHallList);
        const currencyList = useAppSelector(selectCurrencyList);
        const {
            fetchData: _fetchConsumeDetail,
            response: consumeDetail,
            loading,
        } = useHttp<string, ConsumeDetailType>(getConsumeDetail);

        const columns: ProColumns<OrderDetailItem>[] = [
            {
                dataIndex: 'consume_type',
                title: '消费类型',
                valueType: 'select',
                fieldProps: {
                    options: consume_type,
                },
            },
            {
                dataIndex: 'item_name',
                title: '项目',
            },
            {
                dataIndex: 'item_count',
                title: '数量',
            },
            {
                dataIndex: 'item_price',
                title: '单价',
                render: (text, record, _, action) => {
                    return (
                        <Currency
                            value={record.item_price.toString()}
                        ></Currency>
                    );
                },
            },
            {
                dataIndex: 'item_subtotal',
                title: '小记',
                render: (text, record, _, action) => {
                    return (
                        <Currency
                            value={record.item_subtotal.toString()}
                        ></Currency>
                    );
                },
            },
        ];

        useEffect(() => {
            _fetchConsumeDetail(record.id);
        }, [_fetchConsumeDetail, record.id]);

        return (
            <Modal
                title="消费结算"
                width={800}
                visible={visible}
                onCancel={onCancel}
            >
                <div>
                    <Descriptions>
                        <Descriptions.Item label="场馆">
                            {
                                hallList.find(
                                    (item) =>
                                        item.value ===
                                        consumeDetail?.order_info.venue_type,
                                )?.label
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="消费币种">
                            {
                                currencyList.find(
                                    (item) =>
                                        item.value ===
                                        consumeDetail?.order_info.currency_type,
                                )?.label
                            }
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions>
                        <Descriptions.Item label="户口">
                            {consumeDetail?.order_info.account}
                        </Descriptions.Item>
                        <Descriptions.Item label="户名">
                            {consumeDetail?.order_info.account_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="客户">
                            {consumeDetail?.order_info.customer_name}
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions>
                        <Descriptions.Item label="结算方式">
                            {
                                paymentType.find(
                                    (item) =>
                                        item.value ===
                                        consumeDetail?.order_info.payment_type,
                                )?.label
                            }
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <Divider dashed></Divider>
                <ProTable<OrderDetailItem>
                    columns={columns}
                    dataSource={consumeDetail?.order_item_detail}
                    rowKey={(item) => item.id}
                    pagination={{
                        showQuickJumper: true,
                    }}
                    toolBarRender={false}
                    search={false}
                    loading={loading}
                />
                <div>
                    <Descriptions>
                        <Descriptions.Item label="订单编号" span={12}>
                            <span>
                                {consumeDetail?.order_info?.order_number}
                            </span>
                            <div
                                onClick={(e) =>
                                    handleClipboard(
                                        consumeDetail?.order_info
                                            ?.order_number ?? '',
                                        e,
                                    )
                                }
                                className="pointer"
                            >
                                <CopyOutlined
                                    style={{
                                        fontSize: '16px',
                                        marginLeft: '8px',
                                        pointerEvents: 'none',
                                    }}
                                />
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="经办人">
                            {consumeDetail?.order_info?.operator}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </Modal>
        );
    },
);

export default SettleForm;
