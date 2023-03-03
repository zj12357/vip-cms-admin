import React, { FC, useState } from 'react';
import {
    Row,
    Col,
    Table,
    Skeleton,
    Divider,
    Spin,
    Empty,
    message,
    Typography,
    Popover,
} from 'antd';
import VirtualList from 'rc-virtual-list';
import { ModalForm } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getGiftsDetail } from '@/api/service';
import { GiftsDetailParams } from '@/types/api/service';
import moment from 'moment';
import './index.scoped.scss';
import { formatCurrency } from '@/utils/tools';

type ConsumDetailProps = {
    record: any;
};
type DataType = {
    id: string;
    update_time: number;
    record_type: number;
    customer_name: string;
    department: string;
    amount: number;
    balance: number;
};

const GiftMoneyListDetail: FC<ConsumDetailProps> = (props) => {
    const { fetchData: fetchGetGiftsDetail } = useHttp<GiftsDetailParams, any>(
        getGiftsDetail,
    );
    const { record } = props;
    const style: React.CSSProperties = { padding: '8px 0' };
    const [data, setData] = useState<any>([]);
    const [isEnd, setIsEnd] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const types = [
        { label: '增加', value: 1 },
        { label: '消费', value: 2 },
        { label: '退款', value: 3 },
    ];
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        if (isEnd) {
            message.info('没有更多数据');
            return;
        }
        setLoading(true);
        fetchGetGiftsDetail({
            account: record.account,
            page: page,
            size: 10,
        })
            .then((res) => {
                if (res.code === 10000) {
                    const total = res.data.total;

                    let end = false;
                    if ((page - 1) * 10 + res.data.list.length >= total) {
                        end = true;
                    }
                    if (!end) {
                        setPage(page + 1);
                    }
                    setIsEnd(end);
                    setLoading(false);
                    setData([...data, ...res.data.list]);
                }
            })
            .catch(() => {
                setLoading(false);
            });
    };
    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 360) {
            loadMoreData();
        }
    };
    return (
        <ModalForm
            trigger={<div className="m-primary-font-color pointer">详情</div>}
            modalProps={{
                destroyOnClose: true,
            }}
            title="礼遇金消费详情"
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
            submitter={false}
            onVisibleChange={(open) => {
                if (open) {
                    loadMoreData();
                } else {
                    setIsEnd(false);
                    setData([]);
                    setPage(1);
                }
            }}
        >
            <Row>
                <Col span={8}>
                    <div style={style}>户口号：{record.account}</div>
                </Col>
                <Col span={8}>
                    <div style={style}>名称：{record.account_name}</div>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <div style={style}>
                        本月消费：{formatCurrency(record.this_month_consume)}万
                    </div>
                </Col>
            </Row>
            <Spin spinning={loading}>
                <div className="list-border">
                    <div className="list-head">
                        <span>时间</span>
                        <span>类型</span>
                        <span>客户名</span>
                        <span>赠送部门</span>
                        <span>消费（万）</span>
                        <span>余额（万）</span>
                    </div>
                    <div className="list-body">
                        {data.length > 0 ? (
                            <VirtualList
                                data={data}
                                height={360}
                                itemHeight={40}
                                itemKey="id"
                                onScroll={onScroll}
                            >
                                {(item: DataType) => (
                                    <div className="list-item" key={item.id}>
                                        <span>
                                            {moment(
                                                item.update_time * 1000,
                                            ).format('YYYY-MM-DD HH:mm:ss')}
                                        </span>
                                        <span>
                                            {
                                                types.find(
                                                    (ele) =>
                                                        ele.value ===
                                                        item.record_type,
                                                )?.label
                                            }
                                        </span>
                                        <span>
                                            <Popover
                                                content={item.customer_name}
                                                title={false}
                                                overlayStyle={{
                                                    maxWidth: 200,
                                                    wordBreak: 'break-all',
                                                }}
                                            >
                                                <Typography.Text
                                                    ellipsis={true}
                                                    style={{ maxWidth: 110 }}
                                                >
                                                    {item.customer_name}
                                                </Typography.Text>
                                            </Popover>
                                        </span>
                                        <span>{item.department}</span>
                                        <span
                                            className={
                                                item.record_type === 1 ||
                                                item.record_type === 3
                                                    ? 'm-primary-success-color'
                                                    : 'm-primary-error-color'
                                            }
                                        >
                                            {item.record_type === 1 ||
                                            item.record_type === 3
                                                ? '+'
                                                : '-'}
                                            {formatCurrency(item.amount)}
                                        </span>
                                        <span>
                                            {formatCurrency(item.balance)}
                                        </span>
                                    </div>
                                )}
                            </VirtualList>
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                    </div>
                </div>
            </Spin>
        </ModalForm>
    );
};

export default GiftMoneyListDetail;
