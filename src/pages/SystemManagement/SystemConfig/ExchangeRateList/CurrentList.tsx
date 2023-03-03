import React, { FC, useState, useEffect, useRef } from 'react';
import {
    ProCard,
    ProTable,
    EditableProTable,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getWalletCurrencyList, updateWalletRate } from '@/api/system';
import {
    WalletCurrencyListItem,
    UpdateWalletRateParams,
} from '@/types/api/system';
import { Row, Col, message } from 'antd';
import Loading from '@/components/Loading';
import AuthButton from '@/components/AuthButton';

type CurrentListProps = {};

const CurrencyTable: FC<{
    dataSource: WalletCurrencyListItem[];
    reloadData: () => void;
}> = ({ dataSource, reloadData }) => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const tableRef = useRef<ActionType>();
    const [dataList, setDataList] = useState(dataSource);
    const { fetchData: _fetchUpdateWalletRate } = useHttp<
        UpdateWalletRateParams,
        null
    >(updateWalletRate, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const columns: ProColumns<WalletCurrencyListItem>[] = [
        {
            dataIndex: 'right_currency_code',
            editable: false,
        },
        {
            width: 150,
            dataIndex: 'left_unit_rate',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '请输入兑换汇率',
                    },
                    {
                        pattern: /^([0-9]{1,}.?[0-9]{0,4})$/,
                        message: '最多4位小数',
                    },
                ],
            },
        },
        {
            valueType: 'option',
            render: (text, record, _, action) => [
                <AuthButton
                    normal="exchange-rate-edit"
                    verify={(pass: boolean) => {
                        pass && action?.startEditable?.(record.id);
                    }}
                    buttonProps={{
                        type: 'link',
                        style: {
                            padding: '4px',
                        },
                    }}
                    key="edit"
                ></AuthButton>,
            ],
        },
    ];
    const handleUpdateWalletRate = (values: WalletCurrencyListItem) => {
        const params = {
            id: values.id,
            left_unit_rate: values.left_unit_rate,
            exchange_in: values.left_currency_code,
            exchange_out: values.right_currency_code,
        };
        _fetchUpdateWalletRate(params);
    };

    return (
        <EditableProTable<WalletCurrencyListItem>
            columns={columns}
            value={dataList}
            onChange={setDataList}
            dataSource={dataList}
            rowKey={(record) => record.id}
            search={false}
            toolBarRender={false}
            pagination={false}
            bordered
            showHeader={false}
            editable={{
                type: 'single',
                editableKeys,
                onSave: async (rowKey, data, row) => {
                    handleUpdateWalletRate(data);
                },
                onChange: setEditableRowKeys,
                actionRender: (row, config, dom) => [dom.save, dom.cancel],
            }}
            actionRef={tableRef}
            recordCreatorProps={false}
        />
    );
};

const CurrentList: FC<CurrentListProps> = (props) => {
    const {
        fetchData: _fetchWalletCurrencyList,
        response: currencyList,
        loading,
    } = useHttp<null, Record<string, WalletCurrencyListItem[]>>(
        getWalletCurrencyList,
    );

    const reloadData = () => {
        _fetchWalletCurrencyList();
    };

    useEffect(() => {
        _fetchWalletCurrencyList();
    }, [_fetchWalletCurrencyList]);

    return (
        <Row>
            {loading ? (
                <Loading size="default"></Loading>
            ) : (
                Object.keys(currencyList ?? {}).map((item, index) => {
                    const dataSource = [...(currencyList?.[item] ?? [])];
                    return (
                        <Col
                            key={index}
                            style={{ marginBottom: '40px', marginLeft: '40px' }}
                        >
                            <ProCard
                                title={`${item}汇率`}
                                style={{ maxWidth: 400, minWidth: 300 }}
                                className="m-primary-card-background"
                                bordered
                                hoverable
                            >
                                <CurrencyTable
                                    dataSource={dataSource}
                                    reloadData={reloadData}
                                ></CurrencyTable>
                            </ProCard>
                        </Col>
                    );
                })
            )}
        </Row>
    );
};

export default CurrentList;
