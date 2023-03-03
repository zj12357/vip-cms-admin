import React, { FC, useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { useHttp } from '@/hooks';
import { Row, Col, Input, Button, Collapse, Select } from 'antd';
import Currency from '@/components/Currency';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { nanoid } from 'nanoid';
import {
    getChipsList,
    getPrintConvertChips,
    getStorageList,
} from '@/api/admission';
import {
    ChipsListParams,
    resChipsList,
    StorageListParams,
} from '@/types/api/admission';
import { chipType, fundsTypes, covertTypes } from '@/common/commonConstType';
import './index.scoped.scss';
import Print, { formatChips } from '@/components/Print';
import { formatCurrency } from '@/utils/tools';
import { useAppSelector } from '@/store/hooks';
import { selectUserName } from '@/store/user/userSlice';
import usePrint from '@/hooks/usePrint';
import { OfficialDataProps } from '@/hooks/usePrint/print';

const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;

interface Data {
    label: string;
    value: number;
}
type RecordListDataProps = {
    refresh?: boolean;
    refreshClose?: () => void;
    storageRefresh?: boolean;
    storageRefreshClose?: () => void;
    fundRefresh?: boolean;
    fundRefreshClose?: () => void;
};

type DetailItem = {
    created_at: number;
    convert_chips_type: string;
    shares_name: string;
    convert_chips: number;
    remark: string;
    created_by: string;
    outUserNo: string;
    log_id: string;
};

interface DataItem {
    created_at: number;
    convert_chips_type_name: string;
    convert_chips: number;
    total_convert_chips: number;
    remark: string;
    remarker: string;
    convert_chips_record_id: number;
    log_id: string;
    convert_chips_type: number;
}

const RecordListData: FC<RecordListDataProps> = ({
    refresh,
    refreshClose,
    storageRefresh,
    storageRefreshClose,
    fundRefresh,
    fundRefreshClose,
}) => {
    const userName = useAppSelector(selectUserName);
    const { RegisterPrint, handlePrint } =
        usePrint<OfficialDataProps>('Official');
    const actionCovert = useRef<any>();
    const actionRef = useRef<any>();
    const actionRefFund = useRef<any>();
    const paramsR = useParams();
    const [covertType, setCovertType] = useState(0);
    const [chipTypeValue, setChipTypeValue] = useState(0);
    const [fundsTypeValue, setFundsTypeValue] = useState(0);
    // 转码打印数据
    const { fetchData: printCovertChips } = useHttp(getPrintConvertChips);

    useEffect(() => {
        if (refresh) {
            actionRef?.current?.reload();
        }
    }, [refresh]);

    useEffect(() => {
        if (storageRefresh) {
            actionCovert.current.reload();
        }
    }, [storageRefresh]);

    useEffect(() => {
        if (fundRefresh) {
            actionRefFund.current.reload();
        }
    }, [fundRefresh]);
    useEffect(() => {
        actionCovert.current.reload();
    }, [covertType]);

    useEffect(() => {
        actionRef?.current?.reload();
    }, [chipTypeValue]);

    useEffect(() => {
        actionRefFund?.current?.reload();
    }, [fundsTypeValue]);
    // 暂存列表查询
    const { fetchData: storageList } = useHttp<StorageListParams, any>(
        getStorageList,
    );
    // 转码列表查询
    const { fetchData: chipsList } = useHttp<ChipsListParams, resChipsList>(
        getChipsList,
    );

    const getLabel = (data: Array<Data>, value: number) => {
        return data.find((item) => item.value === value)?.label;
    };
    // 暂存记录
    const columnsCovert: ProColumns<DetailItem>[] = [
        {
            dataIndex: 'created_at',
            key: 'created_at',
            title: '时间',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                return moment(record.created_at * 1000).format(
                    'YYYY-MM-DD HH:mm:ss',
                );
            },
        },
        {
            dataIndex: 'convert_chips_type',
            key: 'convert_chips_type',
            title: '类型',
            hideInSearch: true,
            align: 'center',
            valueType: 'select',
            request: async () => [
                {
                    label: '全部',
                    value: 0,
                },
                ...covertTypes,
            ],
        },
        {
            dataIndex: 'total_amount',
            key: 'total_amount',
            title: '总额',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'cash_chips',
            key: 'cash_chips',
            title: '现金码',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'mud_chips',
            key: 'mud_chips',
            title: '泥码',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'remark',
            key: 'remark',
            title: '备注内容',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'created_by',
            key: 'created_by',
            title: '备注人',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            align: 'center',
            render: (text, record, _, action) =>
                !!record.log_id && (
                    <Button
                        type="link"
                        onClick={async () => {
                            const res = await printCovertChips({
                                log_id: record.log_id,
                                convert_chips_type: +record.convert_chips_type,
                            });
                            if (res.code === 10000) {
                                const receipt: any = res.data;
                                // amount: 300000000
                                // convert_chips_type: 7
                                // created_at: 1673337344
                                // currency_name: "PHP"
                                // member_code: "OK9005"
                                // member_name: "蓝凯"
                                // remark: "300"
                                // round: "KG1673324304756"
                                return handlePrint({
                                    name: receipt.member_name,
                                    account: receipt.member_code,
                                    type:
                                        receipt.convert_chips_type === 7
                                            ? '暂存'
                                            : '取暂存',
                                    currency: receipt.currency_name,
                                    amountCapital: `${
                                        formatCurrency(receipt.amount) * 10000
                                    }`,
                                    amountCurrency: `${formatCurrency(
                                        receipt.amount,
                                    )}万`,
                                    remark: receipt.remark,
                                    manager: userName,
                                    id: receipt.round,
                                });
                            }
                        }}
                    >
                        补印
                    </Button>
                ),
        },
    ];
    // 资金记录
    const columns: ProColumns<DetailItem>[] = [
        {
            dataIndex: 'created_at',
            key: 'created_at',
            title: '时间',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                return moment(record.created_at * 1000).format(
                    'YYYY-MM-DD HH:mm:ss',
                );
            },
        },
        {
            dataIndex: 'convert_chips_type',
            key: 'convert_chips_type',
            title: '类型',
            hideInSearch: true,
            align: 'center',
            valueType: 'select',
            fieldProps: {
                options: [
                    {
                        label: '全部',
                        value: 0,
                    },
                    ...chipType,
                ],
            },
        },
        {
            dataIndex: 'principal_type',
            key: 'principal_type',
            title: '出码',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'amount',
            key: 'amount',
            title: '金额(万)',
            hideInSearch: true,
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'remark',
            key: 'remark',
            title: '备注内容',
            hideInSearch: true,
            align: 'center',
        },
        {
            dataIndex: 'created_by',
            key: 'created_by',
            title: '备注人',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            align: 'center',
            render: (text, record, _, action) => (
                <Print
                    trigger={<Button type="link">补印</Button>}
                    visible={!!record.log_id}
                    templateType="Official"
                    getData={async () => {
                        const res = await printCovertChips({
                            log_id: record.log_id,
                            convert_chips_type: +record.convert_chips_type,
                        });
                        if (res.code === 10000) {
                            const data = res.data;
                            return formatChips(data);
                        }
                    }}
                />
            ),
        },
    ];

    const columns2: ProColumns<DataItem>[] = [
        {
            dataIndex: 'created_at',
            key: 'created_at',
            title: '时间',
            align: 'center',
            render: (_, record) => {
                return moment(record.created_at * 1000).format(
                    'YYYY-MM-DD HH:mm:ss',
                );
            },
        },
        {
            dataIndex: 'convert_chips_type',
            key: 'convert_chips_type',
            title: '类型',
            align: 'center',
            valueType: 'select',
            fieldProps: {
                options: [
                    {
                        label: '全部',
                        value: 0,
                    },
                    ...chipType,
                ],
            },
        },
        {
            dataIndex: 'principal_type',
            key: 'principal_type',
            title: '出码',
            align: 'center',
        },
        {
            dataIndex: 'convert_chips',
            key: 'convert_chips',
            title: '转码(万)',
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'total_convert_chips',
            key: 'total_convert_chips',
            title: '总转码',
            align: 'center',
            render: (val: any) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'remark',
            key: 'remark',
            title: '备注',
            align: 'center',
        },
        {
            dataIndex: 'created_by',
            key: 'created_by',
            title: '备注人',
            align: 'center',
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            align: 'center',
            render: (text, record, _, action) => (
                <Print
                    trigger={<Button type="link">补印</Button>}
                    visible={!!record.log_id}
                    templateType="Ticket"
                    getData={async () => {
                        const res = await printCovertChips({
                            log_id: record.log_id,
                            convert_chips_type: record.convert_chips_type,
                        });
                        if (res.code === 10000) {
                            const data = res.data;
                            return formatChips(data);
                        }
                    }}
                />
            ),
        },
    ];

    const handlecovertChange = (value: number) => {
        setCovertType(value);
    };

    const handleChipChange = (value: number) => {
        setChipTypeValue(value);
    };
    const handlefundsChange = (value: number) => {
        setFundsTypeValue(value);
    };
    return (
        <div className="a-detail-table-head">
            <Collapse
                bordered={false}
                defaultActiveKey={['0', '1', '2']}
                style={{ marginTop: '8px' }}
                expandIcon={() => null}
            >
                <Panel
                    header={
                        <Row align="middle" justify="space-between">
                            <Col>暂存记录</Col>
                            <Col>
                                <Select
                                    style={{ width: 120 }}
                                    value={covertType}
                                    onChange={handlecovertChange}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    {[
                                        {
                                            label: '全部',
                                            value: 0,
                                        },
                                        ...covertTypes,
                                    ].map((item) => {
                                        return (
                                            <Option
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </Option>
                                        );
                                    })}
                                </Select>
                                <Button
                                    type="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    style={{ marginLeft: '8px' }}
                                >
                                    导出
                                </Button>
                            </Col>
                        </Row>
                    }
                    key="0"
                >
                    <ProTable<DetailItem>
                        actionRef={actionCovert}
                        columns={columnsCovert}
                        request={async (params) => {
                            const res = await storageList({
                                round: paramsR.id || '',
                                convert_chips_type: covertType,
                                page: params.current || 1,
                                size: params.pageSize || 10,
                            });
                            if (res.code === 10000) {
                                if (storageRefreshClose) {
                                    storageRefreshClose();
                                }
                            }
                            return Promise.resolve({
                                data: res.data.list,
                                total: res.data.total,
                                success: true,
                            });
                        }}
                        rowKey={() => nanoid()}
                        pagination={{
                            showQuickJumper: true,
                            defaultPageSize: 10,
                        }}
                        toolBarRender={false}
                        search={false}
                        size="small"
                    />
                </Panel>
                <Panel
                    header={
                        <Row align="middle" justify="space-between">
                            <Col>资金记录</Col>
                            <Col>
                                <Select
                                    style={{ width: 120 }}
                                    onChange={handlefundsChange}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    value={fundsTypeValue}
                                >
                                    {[
                                        {
                                            label: '全部',
                                            value: 0,
                                        },
                                        ...fundsTypes,
                                    ].map((item) => {
                                        return (
                                            <Option
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </Option>
                                        );
                                    })}
                                </Select>
                                <Button
                                    type="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    style={{ marginLeft: '8px' }}
                                >
                                    导出
                                </Button>
                            </Col>
                        </Row>
                    }
                    key="1"
                >
                    <ProTable<DetailItem>
                        actionRef={actionRefFund}
                        columns={columns}
                        request={async (params) => {
                            const res: any = await chipsList({
                                recode_type: 2,
                                round: paramsR.id || '',
                                convert_chips_type: fundsTypeValue,
                                page: params.current || 1,
                                size: params.pageSize || 10,
                            });
                            if (res.code === 10000) {
                                if (fundRefreshClose) {
                                    fundRefreshClose();
                                }
                            }
                            return Promise.resolve({
                                data: res.data.list,
                                total: res.data.total,
                                success: true,
                            });
                        }}
                        rowKey={(record, index) => record.log_id}
                        pagination={{
                            showQuickJumper: true,
                        }}
                        toolBarRender={false}
                        search={false}
                        size="small"
                    />
                </Panel>
                <Panel
                    header={
                        <Row align="middle" justify="space-between">
                            <Col>转码记录</Col>
                            <Col>
                                <Select
                                    style={{ width: 120 }}
                                    onChange={handleChipChange}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    value={chipTypeValue}
                                >
                                    {[
                                        {
                                            label: '全部',
                                            value: 0,
                                        },
                                        ...chipType,
                                    ].map((item) => {
                                        return (
                                            <Option
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </Option>
                                        );
                                    })}
                                </Select>
                                <Button
                                    type="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    style={{ marginLeft: '8px' }}
                                >
                                    导出
                                </Button>
                            </Col>
                        </Row>
                    }
                    key="2"
                >
                    <ProTable<DataItem>
                        actionRef={actionRef}
                        columns={columns2}
                        request={async (params) => {
                            const res: any = await chipsList({
                                recode_type: 1,
                                round: paramsR.id || '',
                                convert_chips_type: chipTypeValue,
                                page: params.current || 1,
                                size: params.pageSize || 10,
                            });
                            if (res.code === 10000) {
                                if (refreshClose) {
                                    refreshClose();
                                }
                            }
                            return Promise.resolve({
                                data: res.data.list,
                                total: res.data.total,
                                success: true,
                            });
                        }}
                        rowKey={(record, index) => record.log_id}
                        pagination={{
                            showQuickJumper: true,
                        }}
                        scroll={{ y: 350 }}
                        toolBarRender={false}
                        search={false}
                        size="small"
                    />
                </Panel>
            </Collapse>
            <RegisterPrint />
        </div>
    );
};

export default RecordListData;
