/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect } from 'react';
import {
    ProTable,
    ModalForm,
    ProColumns,
    ProFormText,
    ProFormSelect,
} from '@ant-design/pro-components';
import { useHttp, useNewWindow } from '@/hooks';
import { MonthlyReportDetailParams } from '@/types/api/report';
import { monthlyReportDetail } from '@/api/report';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList, selectHallList } from '@/store/common/commonSlice';
import Currency from '@/components/Currency';
import Big from 'big.js';
type Props = {
    triggerDom: JSX.Element;
    record: any;
};
type DetailProps = {
    type_text: string;
    principal_type_text: string;
    shares_type_text: string;
    shares_rate: number;
    currency: number;
    yijie_zhuanma: number;
    yijie_yongjin: number;
    weijie_zhuanma: number;
    weijie_yongjin: number;
    commission_rate: string;
};
const DetailModal: FC<Props> = (props) => {
    const [visible, setVisible] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [summary, setSummary] = useState({
        total_zhuanma: 0,
        total_yijie_zhuanma: 0,
        total_yijie_yongjin: 0,
        total_weijie_zhuanma: 0,
        total_weijie_yongjin: 0,
    });
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);
    const { triggerDom, record } = props;
    const { toNewWindow } = useNewWindow();
    const { fetchData: fetchoutGoingReportDetail } = useHttp<
        MonthlyReportDetailParams,
        any
    >(monthlyReportDetail);
    const resetData = (data: any) => {
        const putongArr: any = [];
        const yingyunArr: any = [];
        let total_zhuanma = 0;
        let total_yijie_zhuanma = 0;
        let total_weijie_zhuanma = 0;
        let total_weijie_yongjin = 0;
        let total_yijie_yongjin = 0;
        (data?.putong || []).forEach((item: any, index: number) => {
            putongArr.push({
                ...item,
                type: 1,
                type_text: index === 0 ? '??????' : '',
                principal_type_text: item.principal_type,
                shares_type_text: item.shares_type,
            });
            total_zhuanma = Number(
                new Big(item.total_zhuanma).plus(total_zhuanma),
            );
            total_weijie_zhuanma = Number(
                new Big(item.weijie_zhuanma).plus(total_weijie_zhuanma),
            );

            total_yijie_zhuanma = Number(
                new Big(item.yijie_zhuanma).plus(total_yijie_zhuanma),
            );

            total_yijie_yongjin = Number(
                new Big(item.yijie_yongjin).plus(total_yijie_yongjin),
            );
            total_weijie_yongjin = Number(
                new Big(item.weijie_yongjin).plus(total_weijie_yongjin),
            );
        });
        (data?.yingyun || []).forEach((item: any, index: number) => {
            yingyunArr.push({
                ...item,
                type: 1,
                type_text: index === 0 ? '??????' : '',
                principal_type_text: item.principal_type,
                shares_type_text: item.shares_type,
            });
            total_zhuanma = Number(
                new Big(item.total_zhuanma).plus(total_zhuanma),
            );
            total_weijie_zhuanma = Number(
                new Big(item.weijie_zhuanma).plus(total_weijie_zhuanma),
            );

            total_yijie_zhuanma = Number(
                new Big(item.yijie_zhuanma).plus(total_yijie_zhuanma),
            );

            total_yijie_yongjin = Number(
                new Big(item.yijie_yongjin).plus(total_yijie_yongjin),
            );
            total_weijie_yongjin = Number(
                new Big(item.weijie_yongjin).plus(total_weijie_yongjin),
            );
        });
        setSummary({
            total_zhuanma,
            total_weijie_zhuanma,
            total_yijie_zhuanma,
            total_weijie_yongjin,
            total_yijie_yongjin,
        });
        return putongArr.concat(yingyunArr);
    };
    useEffect(() => {
        if (visible) {
            fetchoutGoingReportDetail({
                currency: record.currency,
                member_code: record.member_code,
                club: record.club,
                commissionStatus: record.status,
            }).then((res) => {
                const arr = resetData(res.data);
                setTableData(arr);
            });
        }
    }, [visible]);
    const columns: ProColumns<DetailProps>[] = [
        {
            dataIndex: 'type_text',
            title: '????????????',
            render: (val, record) => {
                return record.type_text ? record.type_text : '';
            },
        },

        {
            dataIndex: 'shares_type_text',
            title: '????????????',
            render: (val, record) => {
                return record.shares_type_text ? record.shares_type_text : '';
            },
        },
        {
            dataIndex: 'principal_type_text',
            title: '????????????',
            render: (val, record) => {
                return record.principal_type_text
                    ? record.principal_type_text
                    : '';
            },
        },
        {
            dataIndex: 'currency',
            title: '????????????',
            valueType: 'select',
            fieldProps: {
                options: currencyList,
            },
        },
        {
            dataIndex: 'shares_rate',
            title: '??????',
            render: (val, record) => {
                return record.shares_rate ? record.shares_rate + '%' : '';
            },
        },
        {
            dataIndex: 'total_zhuanma',
            title: '????????????',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'yijie_zhuanma',
            title: '????????????',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'weijie_zhuanma',
            title: '????????????',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'yijie_yongjin',
            title: '????????????',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'weijie_yongjin',
            title: '????????????',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'commission_rate',
            title: '?????????',
            render: (val, record) => {
                return record.commission_rate
                    ? record.commission_rate + '%'
                    : '';
            },
        },
        {
            dataIndex: 'operator',
            title: '?????????',
        },
    ];

    return (
        <ModalForm
            width={1000}
            trigger={triggerDom}
            title="??????????????????"
            grid
            onVisibleChange={(val) => {
                setVisible(val);
            }}
            layout={'horizontal'}
            readonly
            submitter={{
                searchConfig: {
                    resetText: '??????',
                },
                submitButtonProps: {
                    style: {
                        display: 'none',
                    },
                },
            }}
            initialValues={{
                member_code: record.member_code,
                member_name: record.member_name,
                club: record.club,
                currency: record.currency,
                c: record.c,
            }}
        >
            <ProFormText
                name="member_code"
                label="??????"
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProFormSelect
                name="club"
                label="??????"
                options={hallList}
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProFormText
                name="member_name"
                label="??????"
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProFormSelect
                name="currency"
                label="??????"
                options={currencyList}
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProFormText
                name="c"
                label="??????"
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProTable<DetailProps>
                style={{ width: '100%' }}
                columns={columns}
                search={false}
                pagination={false}
                dataSource={tableData}
                summary={(pageData) => {
                    return (
                        <ProTable.Summary.Row
                            style={{
                                background: 'rgb(250 250 250)',
                                fontWeight: 'bold',
                            }}
                        >
                            <ProTable.Summary.Cell
                                index={0}
                            ></ProTable.Summary.Cell>
                            <ProTable.Summary.Cell index={1}>
                                ??????
                            </ProTable.Summary.Cell>
                            <ProTable.Summary.Cell index={2} />
                            <ProTable.Summary.Cell index={3} />
                            <ProTable.Summary.Cell index={4} />
                            <ProTable.Summary.Cell index={5}>
                                <Currency value={summary.total_zhuanma + ''} />
                            </ProTable.Summary.Cell>
                            <ProTable.Summary.Cell index={6}>
                                <Currency
                                    value={summary.total_yijie_zhuanma + ''}
                                />
                            </ProTable.Summary.Cell>
                            <ProTable.Summary.Cell index={7}>
                                <Currency
                                    value={summary.total_weijie_zhuanma + ''}
                                />
                            </ProTable.Summary.Cell>
                            <ProTable.Summary.Cell index={8}>
                                <Currency
                                    value={summary.total_yijie_yongjin + ''}
                                />
                            </ProTable.Summary.Cell>
                            <ProTable.Summary.Cell index={9}>
                                <Currency
                                    value={summary.total_weijie_yongjin + ''}
                                />
                            </ProTable.Summary.Cell>
                            <ProTable.Summary.Cell index={10} />
                            <ProTable.Summary.Cell index={11} />
                        </ProTable.Summary.Row>
                    );
                }}
            />
        </ModalForm>
    );
};

export default DetailModal;
