/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { ProForm, ProFormText, ModalForm } from '@ant-design/pro-components';
import { Button, Spin } from 'antd';
import { getShiftHead, getMonthHead } from '@/api/silverHead';
import { useHttp } from '@/hooks';
import { ShiftHeadParams, MonthHeadParams } from '@/types/api/silverHead';
import SilverHeadTable from '../components/silverHeadTable';
import { selectCurrentHall } from '@/store/common/commonSlice';
import { useAppSelector } from '@/store/hooks';
import './index.scoped.scss';
import moment from 'moment';
import AuthButton from '@/components/AuthButton';

type Props = {
    record?: any;
    triggerDom: JSX.Element;
    type: number; // 1 交班 2 月结
};
const tableColumns = [
    {
        title: '银头总额',
        dataIndex: 'ledger_total',
        className: 'table-header',
    },
    {
        title: '现金数',
        dataIndex: 'cash',
    },
    {
        title: '已签M',
        dataIndex: 'marker',
    },
    {
        title: '',
        dataIndex: '',
        className: 'table-empty',
    },
    {
        title: '筹码总数',
        dataIndex: 'total_chips',
        className: 'table-title',
    },
];
const otherColumns = [
    {
        title: '',
        dataIndex: '',
        className: 'table-empty',
    },
    {
        title: '存款数',
        dataIndex: 'total_deposit',
    },
    {
        title: '外借银头',
        dataIndex: 'lend_ledger',
    },
    {
        title: '已结佣金',
        dataIndex: 'commission',
    },
];

const SilverHeadModal: FC<Props> = (props) => {
    const { triggerDom, record, type } = props;
    const [isPass, setIsPass] = useState(false);
    const currentHall = useAppSelector(selectCurrentHall);
    const [data, setData] = useState<any>([]);
    const [columns, setColumns] = useState<Array<any>>([]);
    const { fetchData: fetchGetShiftHead, loading: shiftLoading } = useHttp<
        ShiftHeadParams,
        any
    >(getShiftHead);
    const { fetchData: fetchGetMonthHead, loading: monthLoading } = useHttp<
        MonthHeadParams,
        any
    >(getMonthHead);
    useEffect(() => {
        if (isPass) {
            const api = type === 1 ? fetchGetShiftHead : fetchGetMonthHead;
            const params: any =
                type === 1
                    ? {
                          currency_id: record.currency_id,
                          order_no: record.round_no_record,
                      }
                    : {
                          currency_id: record.currency_id,
                          hall_id: currentHall.id,
                          mdate: record.mdate,
                      };
            api(params).then((res) => {
                const {
                    ledger_total,
                    commission,
                    total_deposit,
                    marker,
                    cash,
                    lend_ledger,
                    total_chips,
                    regular_chips_row = [],
                    regular_chips,
                    junkets_chips_row = [],
                    junkets_chips,
                } = res.data || {};
                const junketsColumns: any = [
                    {
                        title: '泥码总数',
                        dataIndex: 'junkets_total',
                        className: 'table-title',
                    },
                ];
                const junketsData: any = {
                    junkets_total: junkets_chips,
                };
                (junkets_chips_row || []).forEach((item: any) => {
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
                    regular_total: regular_chips,
                };
                (regular_chips_row || []).forEach((item: any) => {
                    regularColumns.push({
                        title: item.chips_name,
                        dataIndex: item.chips_name + item.chips_id + 'regular',
                    });

                    regularData[item.chips_name + item.chips_id + 'regular'] =
                        item.amount;
                });
                const columns1 = tableColumns
                    .concat(junketsColumns)
                    .concat(regularColumns)
                    .concat(otherColumns);
                setColumns(columns1);
                setData([
                    {
                        ...junketsData,
                        ...regularData,
                        total_chips,
                        commission,
                        ledger_total,
                        total_deposit,
                        lend_ledger,
                        marker,
                        cash,
                    },
                ]);
            });
        }
    }, [isPass]);
    return (
        <ModalForm
            readonly
            visible={isPass}
            title="银头详情"
            layout="horizontal"
            trigger={
                type === 1 ? (
                    triggerDom
                ) : (
                    <AuthButton
                        normal={'monthlyRecord-silverHead'}
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        buttonProps={{
                            type: 'primary',
                        }}
                        trigger={
                            <span className="m-primary-font-color pointer">
                                银头详情
                            </span>
                        }
                    ></AuthButton>
                )
            }
            initialValues={{
                hall_name: currentHall.hall_name,
                admin_name: record.admin_name,
                currency_code: record.currency_code,
                mdate: moment(data.created_at).format('YYYY/MM/DD  hh:mm:ss'),
                shift_desc: record.shift_desc_record,
            }}
            onVisibleChange={(val) => {
                setIsPass(val);
            }}
            grid
            style={{
                maxHeight: 600,
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
            submitter={{
                searchConfig: {
                    resetText: '关闭',
                },
                submitButtonProps: {
                    style: {
                        display: 'none',
                    },
                },
            }}
        >
            <Spin spinning={shiftLoading || monthLoading}>
                <ProFormText
                    name="hall_name"
                    label="场馆"
                    colProps={{
                        md: 12,
                        xl: 12,
                        xs: 12,
                    }}
                />
                {type === 1 && (
                    <ProFormText
                        name="shift_desc"
                        label="班次"
                        colProps={{
                            md: 12,
                            xl: 12,
                            xs: 12,
                        }}
                    />
                )}
                <ProFormText
                    name="currency_code"
                    label="币种"
                    colProps={{
                        md: 12,
                        xl: 12,
                        xs: 12,
                    }}
                />
                <ProFormText
                    name="mdate"
                    label="日期"
                    colProps={{
                        md: 12,
                        xl: 12,
                        xs: 12,
                    }}
                />
                <ProFormText
                    name="admin_name"
                    label="经手人"
                    colProps={{
                        md: 12,
                        xl: 12,
                        xs: 12,
                    }}
                />
                <SilverHeadTable columns={columns} data={data} />
            </Spin>
        </ModalForm>
    );
};

export default SilverHeadModal;
