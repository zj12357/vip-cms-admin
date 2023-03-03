import React, { FC, useState, useRef } from 'react';
import { Button, Popover, Tag, Typography } from 'antd';
import moment from 'moment';
import { useHttp, useNewWindow } from '@/hooks';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    setDetailPageInfo,
    selectCurrencyList,
    selectHallList,
} from '@/store/common/commonSlice';
import { getSpectacleList, footerDate } from '@/api/scene';
import {
    FooterDateParams,
    GetSpectacleListParams,
    ResGetSpectacleList,
    SpectacleListItem,
} from '@/types/api/scene';
import AddCustomer from './AddCustomer';
import CustomerLottery from './CustomerLottery';
import {
    sceneStatus,
    admissionType,
    accountStatus,
} from '@/common/commonConstType';
import './index.scoped.scss';
import { formatCurrency } from '@/utils/tools';

type SceneListProps = {};

interface ConverType {
    currency: number;
    num: number;
}
enum Color {
    blue = 'm-primary-link-color',
    green = 'm-primary-success-color',
    red = 'm-primary-error-color',
}
const { Paragraph, Text } = Typography;
const SceneList: FC<SceneListProps> = (props) => {
    const { toNewWindow } = useNewWindow();
    const tableRef = useRef<ActionType>();
    const navigate = useNavigate();
    const currencyList = useAppSelector(selectCurrencyList);
    const clubs = useAppSelector(selectHallList);
    const dispatch = useAppDispatch();
    const [tableParams, setTableParams] = useState<any>({});
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
    // 页脚日期
    const [date, setDate] = useState('');

    const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([]);
    const { fetchData: fetchGetSpectacleList } = useHttp<
        GetSpectacleListParams,
        ResGetSpectacleList
    >(getSpectacleList);
    const { fetchData: fetchFooterDate } = useHttp<FooterDateParams, any>(
        footerDate,
    );

    const columnsSearch: ProColumns<SpectacleListItem, any>[] = [
        {
            dataIndex: 'club',
            key: 'club',
            title: '场馆',
            valueType: 'select',
            request: async () => [...clubs],
            hideInTable: true,
        },
        {
            dataIndex: 'member_code',
            key: 'member_code',
            title: '户口号',
            hideInTable: true,
        },
        {
            dataIndex: 'member_name',
            key: 'member_name',
            title: '户口名',
            hideInTable: true,
        },
        {
            dataIndex: 'customer_name',
            key: 'customer_name',
            title: '客户名',
            hideInTable: true,
        },
        {
            dataIndex: 'scene_status',
            key: 'scene_status',
            title: '场面状态',
            request: async () => [...sceneStatus],
            hideInTable: true,
        },
        {
            dataIndex: 'currency',
            key: 'currency',
            title: '开工币种',
            request: async () => [...currencyList],
            hideInTable: true,
        },
        {
            dataIndex: 'admissionTime',
            key: 'admissionTime',
            title: '入场时间',
            valueType: 'dateTimeRange',
            initialValue: [
                moment(new Date()).startOf('day').add(3, 'hour').valueOf(),
                moment(new Date())
                    .add(1, 'day')
                    .startOf('day')
                    .add(3, 'hour')
                    .valueOf(),
            ],
            search: {
                transform: (value) => {
                    return {
                        start_work_start_time:
                            moment(new Date(value[0])).valueOf() / 1000,
                        start_work_end_time:
                            moment(new Date(value[1])).valueOf() / 1000,
                    };
                },
            },
            hideInTable: true,
        },
    ];
    const getLabel = (
        arr: Array<{ label: string; value: number }>,
        value: number,
    ) => {
        return arr.find((item) => item.value === value)?.label;
    };
    const columnsTable: ProColumns<SpectacleListItem, any>[] = [
        {
            dataIndex: 'club',
            key: 'club',
            title: (
                <div className="expand-container">
                    <button
                        className={`ant-table-row-expand-icon ${
                            expandedRowKeys.length === tableData.length
                                ? ' ant-table-row-expand-icon-expanded'
                                : ' ant-table-row-expand-icon-collapsed'
                        }`}
                        onClick={() => {
                            if (expandedRowKeys.length === tableData.length) {
                                setExpandedRowKeys([]);
                            } else {
                                const keys = tableData.map(
                                    (i: any) => i.round + i.customer_id,
                                );
                                setExpandedRowKeys(keys);
                            }
                        }}
                    ></button>
                    场馆
                </div>
            ),
            hideInSearch: true,
            align: 'center',
            width: 50,
            fixed: 'left',
            request: async () => [...clubs],
            valueType: 'select',
            render: (_, record) => {
                return getLabel(clubs, record.club);
            },
        },
        {
            dataIndex: 'customer_num',
            key: 'customer_num',
            title: '客数',
            hideInSearch: true,
            align: 'center',
            width: 30,
            fixed: 'left',
            render: (_, record) => record.customer_num,
        },
        {
            dataIndex: 'admission_type',
            key: 'admission_type',
            title: '入场类型',
            hideInSearch: true,
            valueType: 'select',
            request: async () => [...admissionType],
            align: 'center',
            width: 50,
            fixed: 'left',
            render: (_, record) => {
                return getLabel(admissionType, record.admission_type);
            },
        },
        {
            dataIndex: 'round',
            key: 'round',
            title: '场次',
            hideInSearch: true,
            align: 'center',
            width: 50,
            fixed: 'left',
            render: (_, record) => record.round,
        },
        {
            dataIndex: 'member_code',
            key: 'member_code',
            title: '户口号',
            hideInSearch: true,
            align: 'center',
            width: 50,
            fixed: 'left',
            render: (_, record) => {
                return (
                    <span
                        className="m-primary-font-color pointer"
                        onClick={() =>
                            toNewWindow(
                                `/account/customerAccountDetail/${record.member_code}`,
                            )
                        }
                    >
                        {record.member_code}
                    </span>
                );
            },
        },
        {
            dataIndex: 'member_name',
            key: 'member_name',
            title: '户口名',
            hideInSearch: true,
            align: 'center',
            width: 50,
            fixed: 'left',
            render: (_, record) => record.member_name,
        },
        {
            dataIndex: 'member_tag',
            key: 'member_tag',
            title: '标签',
            hideInSearch: true,
            align: 'center',
            width: 80,
            fixed: 'left',
            render: (_, record) => {
                const tagArr = (record.member_tag || '').split('|');
                return (
                    tagArr.length > 0 &&
                    tagArr.map((item: string, i: number) => {
                        if (item) {
                            return <Tag key={i}>{item}</Tag>;
                        }
                        return '';
                    })
                );
            },
        },
        {
            dataIndex: 'account_status',
            key: 'account_status',
            title: '账房状态',
            hideInSearch: true,
            align: 'center',
            valueType: 'select',
            request: async () => [...accountStatus],
            width: 50,
            fixed: 'left',
            render: (_, record) => {
                return getLabel(accountStatus, record.account_status);
            },
        },
        {
            dataIndex: 'scene_status',
            key: 'scene_status',
            title: '场面状态',
            hideInSearch: true,
            valueType: 'select',
            request: async () => [...sceneStatus],
            align: 'center',
            width: 50,
            render: (_, record) => {
                return getLabel(sceneStatus, record.scene_status);
            },
        },
        {
            dataIndex: 'customer_name',
            key: 'customer_name',
            title: '客户名',
            hideInSearch: true,
            align: 'center',
            width: 50,
            render: (_, record) => {
                return record.children ? (
                    <div
                        className="m-primary-font-color pointer"
                        key="detail"
                        onClick={() => toDetails(record.round)}
                    >
                        {record.customer_name}
                    </div>
                ) : (
                    <CustomerLottery
                        customer_id={record.customer_id}
                        customer_name={record.customer_name}
                        onSuccess={() => {
                            tableRef?.current?.reload();
                        }}
                    />
                );
            },
        },
        {
            dataIndex: 'currency',
            key: 'currency',
            title: '开工币种',
            hideInSearch: true,
            align: 'center',
            width: 50,
            render: (_, record) => {
                return getLabel(currencyList, record.currency);
            },
        },
        {
            dataIndex: 'table_num',
            key: 'table_num',
            title: '桌台号',
            hideInSearch: true,
            align: 'center',
            width: 50,
        },
        {
            dataIndex: 'start_work_time',
            key: 'start_work_time',
            title: '入场时间',
            hideInSearch: true,
            align: 'center',
            width: 50,
            render: (_, record) =>
                record.round ? (
                    <div key="detail">
                        {isNaN(record.start_work_time)
                            ? record.start_work_time
                            : moment(record.start_work_time * 1000).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )}
                    </div>
                ) : (
                    <span>
                        {isNaN(record.start_work_time)
                            ? record.start_work_time
                            : moment(record.start_work_time * 1000).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )}
                    </span>
                ),
        },
        {
            dataIndex: 'total_principal',
            key: 'total_principal',
            title: '本金（万）',
            hideInSearch: true,
            align: 'center',
            width: 80,
            render: (_, record) =>
                record.round ? (
                    <div key="detail">{record.total_principal}</div>
                ) : (
                    <span>{record.total_principal}</span>
                ),
        },
        {
            dataIndex: 'total_convert_chips',
            key: 'total_convert_chips',
            title: '转码数',
            hideInSearch: true,
            align: 'center',
            width: 50,
            render: (_, record) => (
                <div key="detail">
                    {formatCurrency(record.total_convert_chips)}
                </div>
            ),
        },
        {
            dataIndex: 'today_up_down_chips',
            key: 'today_up_down_chips',
            title: '今日上下数',
            hideInSearch: true,
            align: 'center',
            width: 60,
            render: (_, record) => (
                <div key="detail">
                    {formatCurrency(record.today_up_down_chips)}
                </div>
            ),
        },
        {
            dataIndex: 'leave_scene_time',
            key: 'leave_scene_time',
            title: '离场时间',
            hideInSearch: true,
            align: 'center',
            width: 50,
            render: (_, record) =>
                record.leave_scene_time ? (
                    <div key="detail">
                        {moment(record.leave_scene_time * 1000).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )}
                    </div>
                ) : (
                    ''
                ),
            valueType: 'milliDate',
        },
        {
            dataIndex: 'remark',
            key: 'remark',
            title: '备注',
            hideInSearch: true,
            align: 'center',
            width: 150,
            render: (_, record: any) => {
                return (
                    <Popover
                        content={record.remark}
                        title={false}
                        overlayInnerStyle={{
                            maxWidth: 300,
                            wordBreak: 'break-all',
                        }}
                    >
                        <Paragraph ellipsis={true}>{record.remark}</Paragraph>
                    </Popover>
                );
            },
        },
    ];
    const columns = columnsSearch.concat(columnsTable);

    const toPage = () => {
        dispatch(
            setDetailPageInfo({
                path: `/scene/list/oneCycleList`,
                backPath: '/scene/list',
                title: '返回入场列表',
            }),
        );
        navigate(`/scene/list/oneCycleList`);
    };

    const toDetails = (round: string) => {
        dispatch(
            setDetailPageInfo({
                path: `/scene/list/CustomerDetails/${round}`,
                backPath: '/scene/list',
                title: '返回入场列表',
            }),
        );
        navigate(
            `/scene/list/CustomerDetails/${round}?start=${tableParams.start_work_start_time}&end=${tableParams.start_work_end_time}`,
        );
    };

    const footerInfor = (data: Array<ConverType>, color: Color) => {
        return (
            <span>
                {(data || [])
                    .sort((item, next) => {
                        return item.currency > next.currency ? 1 : -1;
                    })
                    .map((item, index) => {
                        return (
                            <>
                                <span className={color}>{`${
                                    item.currency !== 0
                                        ? currencyList.find(
                                              (ele: any) =>
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
    return (
        <div className="scene-border-box">
            <ProCard
                style={{
                    height: 'calc(100vh - 265px)',
                    overflowY: 'auto',
                }}
            >
                <ProTable<SpectacleListItem>
                    columns={columns}
                    rowClassName={(record) =>
                        record.account_status === 2 && record.scene_status === 1
                            ? 'red-row'
                            : record.leave_scene_sms_color
                            ? 'blue-row'
                            : record.add_chips_color
                            ? 'yellow-row'
                            : ''
                    }
                    actionRef={tableRef}
                    expandedRowKeys={expandedRowKeys}
                    onExpandedRowsChange={(keys) => {
                        setExpandedRowKeys(keys);
                    }}
                    request={async (params: any) => {
                        params.page = params.current;
                        params.size = params.pageSize;
                        delete params.current;
                        delete params.pageSize;
                        setTableParams(params);
                        fetchFooterDate({
                            start_work_start_time: params.start_work_start_time,
                            start_work_end_time: params.start_work_end_time,
                        }).then((res) => {
                            if (res.code === 10000) {
                                setConvertChips(res.data.footer_convert_chips);
                                setUpDownChips(res.data.footer_up_down_chips);
                                setUpChips(res.data.footer_up_chips);
                                setDownChips(res.data.footer_down_chips);
                                setDate(res.data.footer_date);
                                const numStr = (
                                    res.data.footer_customer_num || ''
                                ).split('/');
                                setCustorNum({
                                    stop_work_num: numStr[1] || 0,
                                    total_num: numStr[0] || 0,
                                });
                            }
                        });
                        const res: any = await fetchGetSpectacleList({
                            ...params,
                            member_code: params.member_code
                                ? params.member_code.trim()
                                : '',
                            member_name: params.member_name
                                ? params.member_name.trim()
                                : '',
                            customer_name: params.customer_name
                                ? params.customer_name.trim()
                                : '',
                        });
                        const listData = [...(res.data.list || [])];
                        const newData: any = [];
                        listData.forEach((item) => {
                            newData.push(item);
                        });
                        setTableData(newData ?? []);
                        return Promise.resolve({
                            data: newData ?? [],
                            total: res.data.total || 0,
                            success: true,
                        });
                    }}
                    size="small"
                    rowKey={(record) => record.round + record.customer_id}
                    pagination={{
                        showQuickJumper: true,
                    }}
                    toolBarRender={false}
                    search={{
                        labelWidth: 80,
                        defaultCollapsed: false,
                        optionRender: (searchConfig, formProps, dom) => [
                            <AddCustomer
                                key={'addCustomer'}
                                onSuccess={() => {
                                    tableRef.current?.reload();
                                }}
                            />,
                            <Button key="weishu" onClick={toPage}>
                                围数
                            </Button>,
                            ...dom.reverse(),
                        ],
                    }}
                    bordered
                    scroll={{ x: 1800 }}
                />
            </ProCard>
            <div className="scene-footer">
                <div className="left-date">
                    <span>日期：</span>
                    <span>
                        {date &&
                            moment(Number(date) * 1000).format('YYYY-MM-DD')}
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

export default SceneList;
