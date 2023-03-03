import React, { FC, useState } from 'react';
import { Row, Col, Divider, Table, Typography } from 'antd';
import { useHttp } from '@/hooks';
import type { ProColumns } from '@ant-design/pro-components';
import { ModalForm, ProTable } from '@ant-design/pro-components';
import { getConsumDetailById } from '@/api/service';
import { GetConsumDetailParams } from '@/types/api/service';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList, selectHallList } from '@/store/common/commonSlice';
import { paymentType, consume_type } from '@/common/commonConstType';
import './index.scoped.scss';
import Currency from '@/components/Currency';
import { formatCurrency } from '@/utils/tools';

const { Paragraph } = Typography;
type ConsumDetailProps = {
    record: any;
    title?: string;
};
type DetailItem = {
    consume_type: number;
    item_name: string;
    item_count: number;
    item_price: number;
    item_subtotal: number;
    sub_order_status: number;
};
interface DataArr {
    label: string;
    value: number;
}

const ConsumDetail: FC<ConsumDetailProps> = (props) => {
    const { fetchData: fetchGetConsumDetailById } = useHttp<
        GetConsumDetailParams,
        any
    >(getConsumDetailById);
    const [orderInfo, setOrderInfo] = useState<any>({});
    const { record, title } = props;
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);
    const style: React.CSSProperties = { padding: '8px 0' };

    const [selectedKey, setSelectedKey] = useState<Array<any>>([]);
    const [consumItemList, setConsumItemList] = useState<any>([]);
    const columns: ProColumns<DetailItem>[] = [
        {
            dataIndex: 'consume_type',
            key: 'consume_type',
            title: '消费类型',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                return getLabel(record.consume_type, consume_type);
            },
        },
        {
            dataIndex: 'item_name',
            key: 'item_name',
            title: '项目',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'item_count',
            key: 'item_count',
            title: '数量',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'item_price',
            key: 'item_price',
            title: '单价',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => (
                <Currency value={record.item_price} decimal={6} />
            ),
        },
        {
            dataIndex: 'item_subtotal',
            key: 'item_subtotal',
            title: '小计',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => (
                <Currency value={record.item_subtotal} decimal={6} />
            ),
        },
    ];
    const getLabel = (value: number, dataArr: Array<DataArr>) => {
        return dataArr.find((item) => {
            return item.value === value;
        })?.label;
    };
    return (
        <ModalForm
            modalProps={{
                destroyOnClose: true,
            }}
            trigger={<div className="m-primary-font-color pointer">详情</div>}
            onFinish={async (values: any) => {
                return true;
                // message.success('提交成功');
            }}
            title={title ? title : '详情'}
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
        >
            <Row>
                <Col span={8}>
                    <div style={style}>
                        场馆：{getLabel(orderInfo.venue_type, hallList)}
                    </div>
                </Col>
                <Col span={8}>
                    <div style={style}>
                        消费币种：
                        {getLabel(orderInfo.currency_type, currencyList)}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <div style={style}>户口：{orderInfo.account}</div>
                </Col>
                <Col span={8}>
                    <div style={style}>名称：{orderInfo.account_name}</div>
                </Col>
                <Col span={8}>
                    <div style={style}>客户：{orderInfo.customer_name}</div>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <div style={style}>
                        结算方式：
                        {getLabel(orderInfo.payment_type, [
                            {
                                label: '所有',
                                value: 0,
                            },
                            ...paymentType,
                        ])}
                    </div>
                </Col>
            </Row>
            <Divider dashed />
            <ProTable<DetailItem>
                columns={columns}
                rowSelection={{
                    alwaysShowAlert: false,
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                    selectedRowKeys: selectedKey,
                    hideSelectAll:
                        consumItemList.findIndex(
                            (i: any) => i.sub_order_status === 4,
                        ) !== -1,
                }}
                tableAlertRender={false}
                rowClassName={(record) => {
                    return record.sub_order_status === 4 ? 'disabled-row' : '';
                }}
                request={async () => {
                    const res = await fetchGetConsumDetailById({
                        id: record.id,
                    });
                    let data = [];
                    if (res.code === 10000) {
                        setOrderInfo(res.data.order_info || {});
                        setConsumItemList(res.data.order_item_detail || {});
                        data = res.data.order_item_detail;
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
                    return Promise.resolve({
                        data,
                        success: true,
                    });
                }}
                rowKey="id"
                pagination={false}
                toolBarRender={false}
                search={false}
                bordered
                size="small"
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
                                <Table.Summary.Cell index={-1} />
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
                                <Table.Summary.Cell index={-1} />
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
                                        }${formatCurrency(cancelTotal, 6)}`}
                                    </span>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </>
                    );
                }}
            />

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
                    <span style={{ wordBreak: 'break-all' }}>备注：</span>
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                        {record.remark}
                    </span>
                </div>
            </div>
        </ModalForm>
    );
};

export default ConsumDetail;
