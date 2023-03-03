import React, { FC, useState, useEffect, useRef } from 'react';
import {
    Row,
    Col,
    Table,
    Button,
    Popover,
    Typography,
    Tag,
    Input,
    Radio,
    message,
} from 'antd';
import type { InputRef } from 'antd';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { useHttp } from '@/hooks';
import { customerDetailUpdate } from '@/api/scene';
import { CustomerDetailUpdateParams } from '@/types/api/scene';
import LeaveModal from '../LeaveModal';
import '../../index.scoped.scss';
import { formatCurrency } from '@/utils/tools';

type MesaInfoProps = {
    fatherLoading: () => void;
    loading: boolean;
    round: string;
    resData: {
        circle_num: string;
        scene_status: number;
        scene_identity: number;
        table_num: string;
        seat_num: string;
        total_principal_type: string;
        leave_table_chips_str: string;
        total_up_down_chips: number;
        today_up_down_chips: number;
        total_convert_chips: number;
        bag_chips: number;
    };
};

const MesaInfo: FC<MesaInfoProps> = (props) => {
    const { fatherLoading, loading, round, resData } = props;
    const { fetchData: fetchCustomerDetailUpdate } = useHttp<
        CustomerDetailUpdateParams,
        any
    >(customerDetailUpdate);
    const [sceneStatus, setSceneStatus] = useState(0); //场面状态
    const [identity, setIdentity] = useState(0); //入场身份
    const [position, setPosition] = useState(''); //位置
    const [tableNum, setTableNum] = useState(''); //桌台号
    useEffect(() => {
        if (resData && resData.scene_status) {
            setSceneStatus(resData.scene_status);
        }
    }, [resData]);
    useEffect(() => {
        if (resData && resData.scene_identity) {
            setIdentity(resData.scene_identity);
        }
    }, [resData]);
    useEffect(() => {
        if (resData && resData.seat_num) {
            setPosition(resData.seat_num);
        }
    }, [resData]);
    useEffect(() => {
        if (resData && resData.table_num) {
            setTableNum(resData.table_num);
        }
    }, [resData]);
    // 修改场面状态
    const updateSceneStatus = async (value: number) => {
        const res = await fetchCustomerDetailUpdate({
            round,
            scene_status: value,
        });
        if (res.code === 10000) {
            message.success(res.msg);
            setSceneStatus(value);
        }
    };
    // 修改入场身份
    const updateIdentity = async (value: number) => {
        const res = await fetchCustomerDetailUpdate({
            round,
            scene_identity: value,
        });
        if (res.code === 10000) {
            message.success(res.msg);
            setIdentity(value);
        }
    };
    // 修改桌台号
    const updateTableNum = async () => {
        const res = await fetchCustomerDetailUpdate({
            round,
            table_num: tableNum,
        });
        if (res.code === 10000) {
            message.success(res.msg);
            setTableNum(tableNum);
        }
    };
    // 修改位置
    const updateSeat = async (seat_num: string) => {
        const res = await fetchCustomerDetailUpdate({
            round,
            seat_num,
        });
        if (res.code === 10000) {
            message.success(res.msg);
            setPosition(seat_num);
        }
    };
    const columns: any[] = [
        {
            title: '',
            dataIndex: 'title1',
            key: 'title1',
            onCell: (_: any, index: number) => {
                if (index === 6) {
                    return { colSpan: 0 };
                }
                return {};
            },
        },
        {
            title: '',
            dataIndex: 'value1',
            key: 'value1',
            onCell: (_: any, index: number) => {
                if (index === 3) {
                    return { colSpan: 3 };
                }
                if (index === 6) {
                    return { colSpan: 0 };
                }
                return {};
            },
            render: (_: any, record: any, index: number) => {
                if (index === 0) {
                    return record.value1.map((item: any) => {
                        if (item.value === 3) {
                            return (
                                <LeaveModal
                                    key={item}
                                    item={item}
                                    cutomerInfo={resData}
                                    onSuccess={fatherLoading}
                                />
                            );
                        }
                        return (
                            <Button
                                size="small"
                                style={{
                                    marginRight: '8px',
                                    color: item.color,
                                }}
                                key={item.label}
                                type={item.selected ? 'primary' : 'default'}
                                onClick={() => {
                                    updateSceneStatus(item.value);
                                }}
                            >
                                {item.label}
                            </Button>
                        );
                    });
                } else if (index === 1) {
                    return (
                        <Input
                            value={tableNum}
                            onChange={(e) => {
                                setTableNum(e.target.value);
                            }}
                            onBlur={updateTableNum}
                        />
                    );
                } else {
                    return record.value1;
                }
            },
        },
        {
            title: '',
            dataIndex: 'title2',
            key: 'title2',
            onCell: (_: any, index: number) => {
                if (index === 3) {
                    return { colSpan: 0 };
                }
                if (index === 6) {
                    return { colSpan: 0 };
                }
                return {};
            },
        },
        {
            title: '',
            dataIndex: 'value2',
            key: 'value2',
            onCell: (_: any, index: number) => {
                if (index === 3) {
                    return { colSpan: 0 };
                }
                if (index === 6) {
                    return { colSpan: 4 };
                }
                return {};
            },
            render: (_: any, record: any, index: number) => {
                if (index === 0) {
                    return (
                        <>
                            {record.value2.map((item: any) => {
                                return (
                                    <Button
                                        size="small"
                                        style={{
                                            marginRight: '8px',
                                            color: item.color,
                                        }}
                                        key={item.label}
                                        type={
                                            item.selected
                                                ? 'primary'
                                                : 'default'
                                        }
                                        onClick={() => {
                                            updateIdentity(item.value);
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            })}
                            <Button
                                size="small"
                                style={{ float: 'right' }}
                                type="link"
                                icon={<SyncOutlined spin={loading} />}
                                onClick={fatherLoading}
                            ></Button>
                        </>
                    );
                } else if (index === 1) {
                    return (
                        <Radio.Group
                            buttonStyle="solid"
                            size="small"
                            value={position}
                            onChange={(e) => updateSeat(e.target.value)}
                        >
                            {record.value2.map(
                                (item: string, index: number) => {
                                    return (
                                        <Radio.Button key={index} value={item}>
                                            {item}
                                        </Radio.Button>
                                    );
                                },
                            )}
                        </Radio.Group>
                    );
                } else if (index === 6) {
                    return (
                        <Button
                            size="small"
                            style={{ float: 'right' }}
                            type="primary"
                        >
                            发送短信
                        </Button>
                    );
                } else {
                    return record.value2;
                }
            },
        },
    ];
    const data: any[] = [
        {
            uid: '1',
            title1: '场面状态：',
            value1: [
                {
                    label: '入场',
                    selected: sceneStatus === 1,
                    value: 1,
                    color: '#1890ff',
                },
                {
                    label: '在场',
                    selected: sceneStatus === 2,
                    value: 2,
                    color: 'rgb(135, 208, 104)',
                },
                {
                    label: '离场',
                    value: 3,
                    selected: sceneStatus === 3,
                    color: '#ff4d4f',
                },
            ],
            title2: '入场身份：',
            value2: [
                {
                    label: '代理',
                    selected: identity === 1,
                    value: 1,
                    color: '#9254de',
                },
                {
                    label: '玩家',
                    selected: identity === 2,
                    value: 2,
                    color: '#5cdbd3',
                },
            ],
        },
        {
            uid: '2',
            title1: '桌台号：',
            value1: resData && resData.table_num,
            title2: '位置：',
            value2: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '企'],
        },
        {
            uid: '3',
            title1: '总本金：',
            value1: resData && resData.total_principal_type,
            title2: '后数：',
            value2: resData && resData.circle_num,
        },
        {
            uid: '4',
            title1: '离台数：',
            value1: resData && resData.leave_table_chips_str,
        },
        {
            uid: '5',
            title1: '总上下数：',
            value1: resData && formatCurrency(resData.total_up_down_chips),
            title2: '本日上下数：',
            value2: resData && formatCurrency(resData.today_up_down_chips),
        },
        {
            uid: '6',
            title1: '转码数：',
            value1: resData && formatCurrency(resData.total_convert_chips),
            title2: '袋码：',
            value2: resData && formatCurrency(resData.bag_chips),
        },
        { uid: '7' },
    ];
    return (
        <Table
            style={{ width: '100%', marginTop: '8px' }}
            size="small"
            rowKey={'uid'}
            bordered
            pagination={false}
            columns={columns}
            showHeader={false}
            dataSource={data}
        />
    );
};

export default MesaInfo;
