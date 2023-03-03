/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHttp, useNewWindow } from '@/hooks';
import { CircleListParams, CircleMonthListParams } from '@/types/api/report';
import { circleList, circleMonthList } from '@/api/report';
import { useAppSelector } from '@/store/hooks';
import { selectHallList } from '@/store/common/commonSlice';
import {
    Select,
    Row,
    Col,
    Spin,
    message,
    DatePicker,
    Button,
    Table,
} from 'antd';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import moment from 'moment';
import Currency from '@/components/Currency';
import './index.scoped.scss';

type Props = {};
type CircleProps = {
    created_at: number;
};

interface MonthTableData {
    id: string;
    total_month_convert_chips: number;
    total_month_up_down_chips: number;
    created_by: string;
}

const Circle: FC<Props> = (props) => {
    const navigate = useNavigate();
    const hallList = useAppSelector(selectHallList);
    const { fetchData: fetchCircleList, loading } = useHttp<
        CircleListParams,
        any
    >(circleList);
    const { fetchData: fetchCircleMonthList } = useHttp<
        CircleMonthListParams,
        any
    >(circleMonthList);
    const [currency, setCurrency] = useState();
    const [total, setTotal] = useState(0);
    const [hall, setHall] = useState();
    const [month, setMonth] = useState<any>();
    const [time, setTime] = useState<any>();
    const [tableData, setTableData] = useState([]);
    const [monthTableData, setMonthTableData] = useState<MonthTableData[]>([
        {
            id: '合计',
            total_month_convert_chips: 0,
            total_month_up_down_chips: 0,
            created_by: '',
        },
    ]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const columns: ProColumns<CircleProps>[] = [
        {
            dataIndex: 'club',
            title: '场馆',
            search: false,
            valueType: 'select',
            request: async () => [...hallList],
        },
        {
            dataIndex: 'created_at',
            title: '围数时间',
            search: false,
            render: (_, record) => {
                if (record.created_at) {
                    return moment(record.created_at * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                    );
                }
            },
        },
        {
            dataIndex: 'currency_names',
            title: '开工币种',
        },
        {
            dataIndex: 'today_up_down_chips',
            title: '转码量',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'today_convert_chips',
            title: '上下数',
            search: false,
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'operation',
            title: '经手人',
            search: false,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <span
                    className="m-primary-font-color pointer"
                    onClick={() => {
                        navigate(
                            `/scene/list/oneCycleList/?created_at=${record.created_at}`,
                        );
                    }}
                >
                    详情
                </span>,
            ],
        },
    ];

    const monthColumns = [
        {
            dataIndex: 'id',
            title: '',
        },
        {
            dataIndex: 'total_month_convert_chips',
            title: '转码量',
            render: (val: any) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'total_month_up_down_chips',
            title: '上下数',
            render: (val: any) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'created_by',
            title: '经手人',
        },
    ];

    const getCircleData = () => {
        let params: CircleListParams = {
            page,
            size: pageSize,
        };
        let paramsMonth: CircleMonthListParams = {};
        if (hall) {
            params.club = hall;
            paramsMonth.club = hall;
        }
        if (time && time[0]) {
            params = {
                ...params,
                start_time: Math.ceil(
                    moment(new Date(time[0])).valueOf() / 1000,
                ),
                end_time: Math.ceil(moment(new Date(time[1])).valueOf() / 1000),
            };
        }
        if (month) {
            paramsMonth = {
                ...paramsMonth,
                month_start_time: Math.ceil(
                    moment(new Date(month)).startOf('month').valueOf() / 1000,
                ),
                month_end_time: Math.ceil(
                    Math.ceil(
                        moment(new Date(month)).endOf('month').valueOf() / 1000,
                    ),
                ),
            };
            fetchCircleMonthList(paramsMonth).then((res) => {
                setMonthTableData([
                    res.data
                        ? {
                              ...res.data,
                              id: '合计',
                          }
                        : {},
                ]);
            });
        }
        fetchCircleList(params).then((res) => {
            setTableData(res.data?.list ?? []);
            setTotal(res.data?.total ?? 0);
        });
    };
    useEffect(() => {
        getCircleData();
    }, [page, pageSize]);
    return (
        <div className="container">
            <div className="header">
                <Row>
                    <Col span={5}>
                        <Row justify={'center'} align={'middle'} wrap={false}>
                            <div className="search-item">
                                <span className="nowrap">场馆：</span>
                                <Select
                                    allowClear
                                    value={currency}
                                    style={{ width: '80%' }}
                                    options={hallList}
                                    onSelect={(val: any) => {
                                        setHall(val);
                                    }}
                                />
                            </div>
                        </Row>
                    </Col>
                    <Col span={5}>
                        <div className="search-item">
                            <span className="nowrap">月份：</span>
                            <DatePicker
                                allowClear
                                value={month}
                                onChange={(val) => {
                                    setMonth(val);
                                    setTime(null);
                                }}
                                picker={'month'}
                            />
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="search-item">
                            <span className="nowrap">时间：</span>
                            <DatePicker.RangePicker
                                value={time}
                                allowClear
                                showTime
                                onChange={(val) => {
                                    setTime(val);
                                    setMonth(null);
                                }}
                            />
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className="buttonGroup">
                            <Button type="primary" onClick={getCircleData}>
                                搜素
                            </Button>
                            <Button
                                style={{
                                    background: 'red',
                                    borderColor: 'red',
                                }}
                                type="primary"
                            >
                                月结
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="month-table">
                <Table columns={monthColumns} dataSource={monthTableData} />
            </div>
            <ProTable<CircleProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                loading={loading}
                search={false}
                pagination={{
                    pageSize: 20,
                    total,
                    onChange: (pageNumber, pageSize) => {
                        setPage(pageNumber);
                        setPageSize(pageSize);
                    },
                }}
                dataSource={tableData}
            />
        </div>
    );
};
export default Circle;
