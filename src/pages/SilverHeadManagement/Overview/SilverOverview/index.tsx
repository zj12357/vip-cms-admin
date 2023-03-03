/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { Select, Row, Col, Spin, message } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import SilverHeadTable from '../../components/silverHeadTable';
import { shiftMap } from '@/common/commonConstType';
import ChipModal from './chipModal';
import { useHttp } from '@/hooks';
import { getChipsSummary, createShift, createMonth } from '@/api/silverHead';
import AuthButton from '@/components/AuthButton';
import './index.scoped.scss';
type Props = {};

const tableColumns = [
    {
        title: '银头总额',
        dataIndex: 'ledger_total',
        className: 'table-header',
    },
    {
        title: '现金数',
        dataIndex: 'cash_total',
    },
    {
        title: '已签M',
        dataIndex: 'marker_total',
    },
    {
        title: '',
        dataIndex: '',
        className: 'table-empty',
    },
    {
        title: '筹码总数',
        dataIndex: 'chips_total',
        className: 'table-title',
    },
];
const otherColumns = [
    {
        title: '存款数',
        dataIndex: 'total_member_balance',
    },
    {
        title: '外借银头',
        dataIndex: 'total_lend_ledger',
    },
    {
        title: '已结佣金',
        dataIndex: 'total_commission',
    },
];

const rollingColumns = [
    {
        title: '',
        dataIndex: 'chips_name',
        className: 'table-header',
    },
    {
        title: '上月泥码结余',
        dataIndex: 'last_month_junkets_balance',
    },
    {
        title: '本月买码',
        dataIndex: 'this_month_buy_junkets_balance',
    },
    {
        title: '本月转码',
        dataIndex: 'this_month_rolling_junkets_balance',
    },
    {
        title: '',
        dataIndex: '',
        className: 'table-empty',
    },
    {
        title: '上更泥码结余',
        dataIndex: 'last_shift_junkets_balance',
    },
    {
        title: '本更买码',
        dataIndex: 'this_shift_buy_junkets_balance',
    },
    {
        title: '本更转码',
        dataIndex: 'this_shift_rolling_junkets_balance',
    },
];
const Overview: FC<Props> = (props) => {
    const { fetchData: fetchGetChipsSummary, loading } = useHttp<any, any>(
        getChipsSummary,
    );
    const { fetchData: fetchCreateShift, loading: createShiftLoading } =
        useHttp<any, any>(createShift);
    const { fetchData: fetchCreateMonth, loading: createMonthLoading } =
        useHttp<any, any>(createMonth);
    const [shift, setShift] = useState(0);
    const [reloadCount, setReloadCount] = useState(0);
    const currencyList = useAppSelector(selectCurrencyList);
    const [currency, setCurrency] = useState<any>('');
    const [ledgerColumns, setLedgerColumns] = useState<any>([]);
    const [ledgerData, setLedgerData] = useState<any>([]);
    const [rollingData, setRollingData] = useState<any>([]);
    const [otherDataSource, setOtherDataSource] = useState<any>([]);

    useEffect(() => {
        if (currencyList.length) {
            setCurrency(currencyList[0].value);
        }
    }, [currencyList.length]);
    useEffect(() => {
        if (currency) {
            fetchGetChipsSummary({
                currency_id: currency,
            }).then((res) => {
                const {
                    shift: shiftRes,
                    ledger_summary = {},
                    other_data = {},
                    rolling_chips_row = [],
                } = res.data || {};
                // 银头总额
                const { chips_row = {}, ledger_count = {} } = ledger_summary;
                const { marker_total, cash_total, ledger_total } = ledger_count;
                const {
                    junkets_total,
                    junkets_chips = [],
                    chips_total,
                    regular_total,
                    regular_chips = [],
                } = chips_row;
                const junketsColumns: any = [
                    {
                        title: '泥码总数',
                        dataIndex: 'junkets_total',
                        className: 'table-title',
                    },
                ];
                const junketsData: any = {
                    junkets_total,
                };
                (junkets_chips || []).forEach((item: any) => {
                    junketsColumns.push({
                        title: item.chips_name,
                        dataIndex: item.chips_name + item.chips_id + 'junkets',
                    });

                    junketsData[item.chips_name + item.chips_id + 'junkets'] =
                        item.amount;
                });
                const regularColumns: any = [
                    {
                        title: '现金码总数',
                        dataIndex: 'regular_total',
                        className: 'table-title',
                    },
                ];
                const regularData: any = {
                    regular_total,
                };
                (regular_chips || []).forEach((item: any) => {
                    regularColumns.push({
                        title: item.chips_name,
                        dataIndex: item.chips_name + item.chips_id + 'regular',
                    });

                    regularData[item.chips_name + item.chips_id + 'regular'] =
                        item.amount;
                });
                const columns1 = tableColumns
                    .concat(junketsColumns)
                    .concat(regularColumns);
                setLedgerColumns(columns1);
                setLedgerData([
                    {
                        ...junketsData,
                        ...regularData,
                        chips_total,
                        marker_total,
                        cash_total,
                        ledger_total,
                    },
                ]);

                // 转码统计
                setRollingData(rolling_chips_row || []);
                // 其他数据

                const {
                    total_member_balance,
                    total_lend_ledger,
                    total_commission,
                } = other_data;

                const otherDataRes = {
                    total_member_balance,
                    total_lend_ledger,
                    total_commission,
                };
                setOtherDataSource([otherDataRes]);
                setShift(shiftRes);
            });
        }
    }, [currency, reloadCount]);

    const handleCreateShift = () => {
        fetchCreateShift().then((res) => {
            if (res.code === 10000) {
                message.success('交更成功');
                setReloadCount(reloadCount + 1);
            }
        });
    };

    const handleMonth = () => {
        fetchCreateMonth().then((res) => {
            if (res.code === 10000) {
                message.success('月结成功');
                setReloadCount(reloadCount + 1);
            }
        });
    };
    return (
        <Spin spinning={loading}>
            <div className="overview">
                <div className="current-shift">
                    当前更次：{shiftMap[shift] || '早更'}
                </div>
                <div className="header">
                    <Row justify={'space-between'}>
                        <Col span={5}>
                            <Row
                                justify={'center'}
                                align={'middle'}
                                wrap={false}
                            >
                                <span className="nowrap">币种：</span>
                                <Select
                                    value={currency}
                                    style={{ width: '80%' }}
                                    options={currencyList}
                                    onSelect={(val: any) => {
                                        setCurrency(val);
                                    }}
                                />
                            </Row>
                        </Col>
                        <Col span={8}></Col>
                        <Col span={2}>
                            <ChipModal
                                onSuccess={() =>
                                    setReloadCount(reloadCount + 1)
                                }
                                type={0}
                            />
                        </Col>
                        <Col span={2}>
                            <ChipModal
                                onSuccess={() =>
                                    setReloadCount(reloadCount + 1)
                                }
                                type={1}
                            />
                        </Col>
                        <Col span={2}>
                            <ChipModal
                                onSuccess={() =>
                                    setReloadCount(reloadCount + 1)
                                }
                                type={2}
                            />
                        </Col>
                        <Col span={1}></Col>
                        <Col span={2}>
                            <AuthButton
                                normal={'silverHeadOverview-monthly'}
                                buttonProps={{
                                    type: 'primary',
                                }}
                                isSecond={true}
                                secondDom={<div>请确认是否进行月结</div>}
                                secondVerify={(val) => {
                                    if (val) {
                                        handleMonth();
                                    }
                                }}
                            ></AuthButton>
                        </Col>
                        <Col span={2}>
                            <AuthButton
                                normal={'silverHeadOverview-shift'}
                                buttonProps={{
                                    type: 'primary',
                                }}
                                isSecond={true}
                                secondDom={<div>请确认是否进行交更</div>}
                                secondVerify={(val) => {
                                    if (val) {
                                        handleCreateShift();
                                    }
                                }}
                            ></AuthButton>
                        </Col>
                    </Row>
                </div>
                <div className="content">
                    <div className="content-left">
                        <Row>
                            <div className="content-title">
                                银头统计<span>（单位万）</span>
                            </div>
                            <SilverHeadTable
                                columns={ledgerColumns}
                                data={ledgerData}
                            />
                        </Row>
                    </div>
                    <div className="content-right">
                        <Row>
                            <div className="content-title">
                                转码统计<span>（单位万）</span>
                            </div>
                            <SilverHeadTable
                                columns={rollingColumns}
                                data={rollingData}
                            />
                            <div
                                className="content-title"
                                style={{ marginTop: 20 }}
                            >
                                其他数据<span>（单位万）</span>
                            </div>
                            <SilverHeadTable
                                columns={otherColumns}
                                data={otherDataSource}
                            />
                        </Row>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default Overview;
