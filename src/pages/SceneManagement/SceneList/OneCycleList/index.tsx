import React, { FC, useState, useRef, useEffect } from 'react';
import { Row, Button, InputNumber, message, Modal } from 'antd';
import {
    ProColumns,
    ProFormDatePicker,
    ProFormSelect,
} from '@ant-design/pro-components';
import { ProCard, ProTable } from '@ant-design/pro-components';
import moment from 'moment';
import Big from 'big.js';
import { useHttp } from '@/hooks';
import { circleSettle } from '@/api/report';
import {
    circleList,
    circleListUpdate,
    exportCircleList,
    footerDate,
} from '@/api/scene';
import {
    CircleListParams,
    CircleListUpdateParams,
    FooterDateParams,
} from '@/types/api/scene';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import './index.scoped.scss';
import Currency from '@/components/Currency';
import { formatCurrency } from '@/utils/tools';
import { useLocation } from 'react-router-dom';
import { CircleSettleParams } from '@/types/api/report';
import ExportExcel from '@/components/ExportExcel';

type OneCycleListProps = {};

interface ConverType {
    currency: number;
    num: number;
}
enum Color {
    blue = 'm-primary-link-color',
    green = 'm-primary-success-color',
    red = 'm-primary-error-color',
}
interface OneCycleListItem {
    spectacles_circle_id: string;
    table_num: string;
    seat_num: string;
    member_code: string;
    member_name: string;
    customer_name: string;
    currency: number;
    today_amount: number;
    amount_type: string;
    today_up_down_chips: number;
    circle_num: number;
    merge?: boolean;
    mergeNum?: number;
}

const SIZE = 1000000;
const OneCycleList: FC<OneCycleListProps> = (props) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const defaultTime = Number(searchParams.get('created_at'));

    const actionRef = useRef<any>();
    const [canEditor, setCanEditor] = useState(false);
    const [dailyStatus, setDailyStatus] = useState(0);
    const currencyList = useAppSelector(selectCurrencyList);
    const { fetchData: fetchFooterDate } = useHttp<FooterDateParams, any>(
        footerDate,
    );
    // 查询围数
    const { fetchData: fetchCircleList, loading } = useHttp<
        CircleListParams,
        any
    >(circleList);
    // 更新围数
    const { fetchData: fetchCircleListUpdate } = useHttp<
        CircleListUpdateParams,
        any
    >(circleListUpdate);
    // 围数日结
    const { fetchData: fetchCircleSettle } = useHttp<CircleSettleParams, any>(
        circleSettle,
    );
    const [date, setDate] = useState<number>(moment(new Date()).valueOf());
    const [currency, setCurrency] = useState<number>(0);
    const [listData, setListData] = useState<Array<OneCycleListItem>>([]);
    const [updateCount, setUpdateCount] = useState(0);
    const [originalList, setOriginalList] = useState<Array<OneCycleListItem>>(
        [],
    );
    // 页脚日期

    const [footDate, setFootDate] = useState<number>(moment(new Date()).unix());
    // 页脚转吗数
    const [convertChips, setConvertChips] = useState<Array<ConverType>>([]);
    // 页脚上下数
    const [upDownChips, setUpDownChips] = useState<Array<ConverType>>([]);
    // 页脚上数
    const [upChips, setUpChips] = useState<Array<ConverType>>([]);
    // 页脚下数
    const [downChips, setDownChips] = useState<Array<ConverType>>([]);
    // 页脚当日客数
    const [custorNum, setCustorNum] = useState<any>({
        stop_work_num: '',
        total_num: '',
    });
    const footerInfor = (data: Array<ConverType>, color: Color) => {
        return (
            <span>
                {data
                    .sort((item, next) => {
                        return item.currency > next.currency ? 1 : -1;
                    })
                    .map((item, index) => {
                        return (
                            <>
                                <span className={color}>{`${
                                    item.currency !== 0
                                        ? currencyList.find(
                                              (ele) =>
                                                  ele.value === item.currency,
                                          )?.label
                                        : ''
                                } ${formatCurrency(item.num)}`}</span>
                                <span>
                                    {index !== data.length - 1 && ` | `}
                                </span>
                            </>
                        );
                    })}
            </span>
        );
    };

    const getCircleList = async (circle_date?: number) => {
        const params: any = {
            currency,
        };
        if (circle_date) {
            params.circle_date =
                moment(new Date(circle_date)).startOf('day').unix() +
                3 * 60 * 60;
        }

        const res = await fetchCircleList(params);

        if (res.code === 10000) {
            const newData = formatData(res.data.circle_list);
            setDailyStatus(res.data.circle_daily_status);
            setListData(newData);
            setOriginalList(JSON.parse(JSON.stringify(newData)));
            setTimeout(() => {
                setCanEditor(false);
            }, 100);
        } else {
            message.error(res.msg);
        }
        setUpdateCount(updateCount + 1);
    };
    useEffect(() => {
        fetchFooterDate({
            start_work_start_time:
                moment(new Date(date)).startOf('day').unix() + 3 * 60 * 60,
        }).then((res) => {
            if (res.code === 10000) {
                setConvertChips(res.data.footer_convert_chips);
                setUpDownChips(res.data.footer_up_down_chips);
                setUpChips(res.data.footer_up_chips);
                setDownChips(res.data.footer_down_chips);
                setFootDate(res.data.footer_date);
                const numStr = (res.data.footer_customer_num || '').split('/');
                setCustorNum({
                    stop_work_num: numStr[1] || 0,
                    total_num: numStr[0] || 0,
                });
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (date) {
            getCircleList(date);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, currency]);

    useEffect(() => {
        if (canEditor) {
            setOriginalList(JSON.parse(JSON.stringify(listData)));
        } else {
            setListData([...listData]);
            setUpdateCount(updateCount + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canEditor]);

    const dateUpdate = (circle_num: number, spectacles_circle_id: string) => {
        const updateItemIndex = listData.findIndex(
            (item) => item.spectacles_circle_id === spectacles_circle_id,
        );
        const newListData = [...listData];
        newListData[updateItemIndex].circle_num = Number(
            new Big(circle_num).times(SIZE),
        );
        newListData[updateItemIndex].today_up_down_chips = Number(
            new Big(circle_num)
                .times(SIZE)
                .minus(newListData[updateItemIndex].today_amount),
        );

        setListData(formatData(newListData));
        setUpdateCount(updateCount + 1);
    };

    // 保存围数
    const update = async () => {
        const updateArr = listData.filter((i, idx) => {
            if (i.circle_num !== originalList[idx].circle_num) {
                return true;
            }
            return false;
        });
        const params = updateArr.map((item) => {
            return {
                spectacles_circle_id: item.spectacles_circle_id,
                today_up_down_chips: item.today_up_down_chips,
                circle_num: item.circle_num,
            };
        });
        const res = await fetchCircleListUpdate({ param: params });
        if (res.code === 10000) {
            getCircleList(date);
        }
    };

    const columns: ProColumns<OneCycleListItem>[] = [
        {
            hideInTable: true,
            renderFormItem: (item, _, form) => {
                const rest = {
                    onChange: (value: any) => {
                        setDate(moment(new Date(value)).valueOf());
                    },
                };
                return (
                    <div className="defined-date">
                        <ProFormDatePicker
                            initialValue={
                                defaultTime
                                    ? moment(
                                          new Date(defaultTime * 1000),
                                      ).format('YYYY-MM-DD')
                                    : moment(new Date()).format('YYYY-MM-DD')
                            }
                            name="date"
                            label="围数日期"
                            {...rest}
                        />
                    </div>
                );
            },
        },
        {
            hideInTable: true,
            renderFormItem: (item, _, form) => {
                const rest = {
                    onChange: (value: any) => {
                        setCurrency(value);
                    },
                };
                return (
                    <div className="defined-date">
                        <ProFormSelect
                            name="currency"
                            label="币种"
                            {...rest}
                            options={currencyList}
                        />
                    </div>
                );
            },
        },
        {
            dataIndex: 'table_num',
            key: 'table_num',
            title: '桌号',
            hideInSearch: true,
            align: 'center',
            width: 120,
            onCell: (record, index) => {
                if (record.merge) {
                    return { rowSpan: record.mergeNum };
                }
                if (record.mergeNum === 0) {
                    return { rowSpan: 0 };
                }
                return {};
            },
            fixed: 'left',
        },
        {
            width: 120,
            dataIndex: 'seat_num',
            key: 'seat_num',
            title: '位置',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'member_code',
            key: 'member_code',
            title: '户口号',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'round',
            key: 'round',
            title: '场次',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'member_name',
            key: 'member_name',
            title: '户口名',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'customer_name',
            key: 'customer_name',
            title: '客户名',
            hideInSearch: true,
            align: 'center',
        },
        {
            width: 150,
            dataIndex: 'currency',
            key: 'currency',
            title: '开工币种',
            hideInSearch: true,
            align: 'center',
            valueType: 'select',
            request: async () => [...currencyList],
        },
        {
            dataIndex: 'today_amount_type',
            key: 'today_amount_type',
            title: '本金',
            hideInSearch: true,
            align: 'center',
        },
        {
            width: 200,
            dataIndex: 'today_up_down_chips',
            key: 'today_up_down_chips',
            title: '今日上下数',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            width: 150,
            dataIndex: 'circle_num',
            key: 'circle_num',
            title: '围数',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                if (canEditor) {
                    return (
                        <InputNumber
                            value={formatCurrency(record.circle_num)}
                            onChange={(value) => {
                                dateUpdate(value, record.spectacles_circle_id);
                            }}
                        />
                    );
                }
                return <Currency value={record.circle_num + ''} />;
            },
        },
    ];

    const formatData = (initData: Array<OneCycleListItem>) => {
        let tableNumArr = initData.map((item) => {
            return item.table_num;
        });
        tableNumArr = tableNumArr.filter(
            (item, index) => tableNumArr.indexOf(item) === index,
        );
        let newData: Array<OneCycleListItem> = [];
        tableNumArr.forEach((tabNum) => {
            let itemArr: Array<OneCycleListItem> = [];
            initData.forEach((item) => {
                if (item.table_num === tabNum) {
                    itemArr.push({ ...item, merge: false, mergeNum: 1 });
                }
            });
            if (itemArr.length > 1) {
                itemArr = itemArr.map((ele) => {
                    return { ...ele, mergeNum: 0 };
                });
                itemArr[0].merge = true;
                itemArr[0].mergeNum = itemArr.length;
            }
            newData = [...newData, ...itemArr];
        });
        return newData;
    };
    return (
        <div className="scene-cycle-box">
            <ProCard
                style={{
                    height: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                }}
            >
                <ProTable<OneCycleListItem>
                    actionRef={actionRef}
                    columns={columns}
                    dataSource={listData}
                    size="small"
                    manualRequest={true}
                    rowKey={'spectacles_circle_id'}
                    pagination={false}
                    toolBarRender={false}
                    scroll={{ x: '1200px' }}
                    search={{
                        optionRender: (searchConfig, formProps, dom) => [
                            <Row key={'editor'}>
                                <Button
                                    type="primary"
                                    style={{ margin: '0 10px' }}
                                    onClick={() => {
                                        exportCircleList({
                                            circle_date:
                                                moment(new Date(date))
                                                    .startOf('day')
                                                    .unix() +
                                                3 * 60 * 60,
                                            currency,
                                        });
                                    }}
                                >
                                    导出
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        if (dailyStatus) {
                                            message.error('今日已完成日结');
                                            return;
                                        }
                                        setCanEditor(true);
                                    }}
                                >
                                    重录
                                </Button>
                                <Button
                                    style={{ margin: '0 10px' }}
                                    onClick={() => {
                                        if (dailyStatus) {
                                            message.error('今日已完成日结');
                                            return;
                                        }
                                        Modal.confirm({
                                            title: '保存围数',
                                            content: '是否确认保存围数',
                                            onOk: () => {
                                                update();
                                            },
                                        });
                                    }}
                                >
                                    保存围数
                                </Button>

                                <Button
                                    type="primary"
                                    onClick={() => {
                                        if (dailyStatus) {
                                            message.error('今日已完成日结');
                                            return;
                                        }
                                        Modal.confirm({
                                            title: '日结',
                                            content: '是否确认日结',
                                            onOk: () => {
                                                fetchCircleSettle({
                                                    circle_date:
                                                        moment(new Date(date))
                                                            .startOf('day')
                                                            .unix() +
                                                        3 * 60 * 60,
                                                }).then((res) => {
                                                    if (res.code === 10000) {
                                                        message.success(
                                                            '日结成功',
                                                        );
                                                        const time =
                                                            moment(
                                                                new Date(date),
                                                            )
                                                                .startOf('day')
                                                                .unix() +
                                                            3 * 60 * 60;
                                                        getCircleList(time);
                                                    }
                                                });
                                            },
                                        });
                                    }}
                                    loading={loading}
                                >
                                    日结
                                </Button>
                            </Row>,
                        ],
                    }}
                    bordered
                />
            </ProCard>
            <div className="scene-footer">
                <div className="left-date">
                    <span>日期：</span>
                    <span>
                        {footDate &&
                            moment(Number(footDate) * 1000).format(
                                'YYYY-MM-DD',
                            )}
                    </span>
                </div>
                <div className="right-data">
                    <span className="right-item">
                        转码数(总)：
                        {footerInfor(convertChips, Color.blue)}
                    </span>
                    <span className="right-item">
                        上下数：
                        {footerInfor(upDownChips, Color.blue)}
                    </span>
                    <span className="right-item">
                        上：
                        {footerInfor(upChips, Color.green)}
                    </span>
                    <span className="right-item">
                        下：
                        {footerInfor(downChips, Color.red)}
                    </span>
                    <span className="right-item">
                        全日客数：（
                        <span className="m-primary-success-color">
                            {custorNum?.total_num}
                        </span>
                        /
                        <span className="m-primary-error-color">
                            {custorNum?.stop_work_num}
                        </span>
                        ）
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OneCycleList;
