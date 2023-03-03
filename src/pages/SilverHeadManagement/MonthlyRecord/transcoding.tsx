/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { ProForm, ProFormText, ModalForm } from '@ant-design/pro-components';
import { getShiftTranscoding, getMonthTranscoding } from '@/api/silverHead';
import { useHttp } from '@/hooks';
import {
    ShiftHeadParams,
    MonthHeadParams,
    ShiftTranscodingParams,
} from '@/types/api/silverHead';
import SilverHeadTable from '../components/silverHeadTable';
import { selectCurrentHall } from '@/store/common/commonSlice';
import { useAppSelector } from '@/store/hooks';
import './index.scoped.scss';
import moment from 'moment';
import { Spin } from 'antd';
import AuthButton from '@/components/AuthButton';

type Props = {
    record?: any;
    triggerDom: JSX.Element;
    type: number; // 1 交班 2 月结
};

const rollingShiftColumns = [
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

const rollingMonthColumns = [
    {
        title: '',
        dataIndex: 'chips_name',
        className: 'table-header',
    },
    {
        title: '上月结余',
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
];

const SilverHeadModal: FC<Props> = (props) => {
    const { triggerDom, record, type } = props;
    const [isPass, setIsPass] = useState(false);
    const currentHall = useAppSelector(selectCurrentHall);
    const [data, setData] = useState<any>([]);
    const { fetchData: fetchGetShiftTranscoding, loading: shiftLoading } =
        useHttp<ShiftTranscodingParams, any>(getShiftTranscoding);
    const { fetchData: fetchGetMonthTranscoding, loading: monthLoading } =
        useHttp<MonthHeadParams, any>(getMonthTranscoding);
    useEffect(() => {
        if (isPass) {
            const api =
                type === 1
                    ? fetchGetShiftTranscoding
                    : fetchGetMonthTranscoding;
            const params: any =
                type === 1
                    ? {
                          mdate: record.created_at_record,
                          order_no: record.round_no_record,
                          currency_id: record.currency_id,
                      }
                    : {
                          currency_id: record.currency_id,
                          hall_id: currentHall.id,
                          mdate: record.mdate,
                      };
            api(params).then((res) => {
                setData(
                    res.data[
                        type === 1
                            ? 'rolling_chips_row'
                            : 'monthly_rolling_chips_row'
                    ] ?? [],
                );
            });
        }
    }, [isPass]);
    return (
        <ModalForm
            visible={isPass}
            readonly
            title="转码详情"
            layout="horizontal"
            grid
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
                                转码详情
                            </span>
                        }
                    ></AuthButton>
                )
            }
            initialValues={{
                hall_name: currentHall.hall_name,
                admin_name: record.admin_name,
                currency_code: record.currency_code,
                mdate: moment(data.created_at).format('YYYY/MM/DD hh:mm:ss'),
                shift_desc: record.shift_desc_record,
            }}
            onVisibleChange={(val) => {
                setIsPass(val);
            }}
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
                <SilverHeadTable
                    columns={
                        type === 1 ? rollingShiftColumns : rollingMonthColumns
                    }
                    data={data}
                />
            </Spin>
        </ModalForm>
    );
};

export default SilverHeadModal;
