import React, { FC, useState, useEffect, useRef, useCallback } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Space, Row, Select } from 'antd';
import {
    ShareholderForm,
    OnlineForm,
    CompanyForm,
    EquityForm,
    TemporaryForm,
    BanForm,
} from './BatchSettingModal';
import { useHttp, useLatest } from '@/hooks';
import { getMarkerAllCreditList } from '@/api/account';
import {
    GetMarkerAllCreditListParams,
    MarkerAllCreditListItem,
} from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { selectCurrencyList } from '@/store/common/commonSlice';
import { nanoid } from 'nanoid';
import Big from 'big.js';
import Currency from '@/components/Currency';
import AuthButton from '@/components/AuthButton';

type BatchSettingFormProps = {};

const BatchSettingTable = () => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const currencyList = useAppSelector(selectCurrencyList);
    const [currencyType, setCurrencyType] = useState(1);
    const tableRef = useRef<ActionType>();

    const batchTypeName: { [key: number]: string } = {
        1: '股东授信',
        2: '上线批额',
        3: '公司批额',
        4: '临时批额',
        5: '股本',
        6: '禁批额度',
    };

    const { fetchData: _fetchMarkerAllCreditList } = useHttp<
        GetMarkerAllCreditListParams,
        MarkerAllCreditListItem[]
    >(getMarkerAllCreditList);

    const columns: ProColumns<MarkerAllCreditListItem>[] = [
        {
            dataIndex: 'batch_type',
            title: '类型',
            render: (text, record, index, action) => {
                if (index === 0) {
                    return <div>汇总</div>;
                }
                return <div>{batchTypeName[record.marker_type]}</div>;
            },
        },
        {
            dataIndex: 'currency',
            title: '币种',
            valueType: 'select',
            fieldProps: {
                options: currencyList,
            },
        },
        {
            dataIndex: 'total_amount',
            title: '总额度(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.total_amount.toString()}></Currency>
                );
            },
        },
        {
            dataIndex: 'used_amount',
            title: '已用额度(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.used_amount.toString()}></Currency>
                );
            },
        },
        {
            dataIndex: 'available_amount',
            title: '剩余额度(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.available_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'expired_at',
            title: '失效时间',
        },
        {
            dataIndex: 'expired_day',
            title: '过期天数',
        },
        {
            dataIndex: 'interest',
            title: '罚息率',
            render: (text, record, _, action) => {
                return (
                    <span>
                        {text?.toString() && text !== '-' ? `${text}%` : '-'}
                    </span>
                );
            },
        },
        {
            valueType: 'option',
            title: '操作',
            render: (text, record, index, action) => [
                <div
                    key="verification"
                    className="m-primary-font-color pointer"
                >
                    {1 === record.marker_type && (
                        <ShareholderForm
                            record={record}
                            reloadData={reloadData}
                        ></ShareholderForm>
                    )}
                    {2 === record.marker_type && (
                        <OnlineForm
                            record={record}
                            reloadData={reloadData}
                        ></OnlineForm>
                    )}
                    {3 === record.marker_type && (
                        <CompanyForm
                            record={record}
                            reloadData={reloadData}
                        ></CompanyForm>
                    )}
                    {4 === record.marker_type && (
                        <EquityForm
                            record={record}
                            reloadData={reloadData}
                        ></EquityForm>
                    )}
                    {5 === record.marker_type && (
                        <TemporaryForm
                            record={record}
                            reloadData={reloadData}
                        ></TemporaryForm>
                    )}
                    {6 === record.marker_type && (
                        <BanForm
                            record={record}
                            reloadData={reloadData}
                        ></BanForm>
                    )}
                </div>,
            ],
        },
    ];

    //计算总和

    const handleSum = (data: MarkerAllCreditListItem[]): any => {
        const toSum = (type: string) => {
            return data?.reduce(
                (prev: number, cur: any) =>
                    Number(new Big(prev).plus(cur?.[type] ?? 0)),
                0,
            );
        };

        const tableItem = {
            id: nanoid(),
            currency: currencyType,
            available_amount: toSum('available_amount'),
            total_amount: toSum('total_amount'),
            used_amount: toSum('used_amount'),
        };
        return tableItem;
    };

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    return (
        <div>
            <Row
                justify="end"
                align="middle"
                style={{
                    margin: '15px 0',
                }}
            >
                <span>币种：</span>
                <Space size="small">
                    <Select
                        value={currencyType}
                        style={{ width: '100px' }}
                        onChange={(val) => {
                            setCurrencyType(val);
                        }}
                        options={currencyList}
                    ></Select>
                </Space>
            </Row>
            <ProTable<MarkerAllCreditListItem>
                columns={columns}
                request={async (params, sorter, filter) => {
                    const { data } = await _fetchMarkerAllCreditList({
                        member_code: accountInfo.member_code,
                        currency: params.currency,
                    });

                    return {
                        data: data ? [handleSum(data), ...data] : [],
                        success: true,
                    };
                }}
                rowKey={() => nanoid()}
                params={{
                    currency: currencyType,
                }}
                pagination={false}
                toolBarRender={false}
                search={false}
                style={{
                    margin: '20px 0',
                }}
                actionRef={tableRef}
            />
        </div>
    );
};

const BatchSettingForm: FC<BatchSettingFormProps> = (props) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
    }).current;

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal="customerAccount-batchSetting"
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        buttonProps={{
                            type: 'primary',
                        }}
                    ></AuthButton>
                }
                title="批额设置"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setIsPass(false);
                    },
                }}
                width={1000}
                initialValues={updatedValues}
                submitter={false}
                visible={isPass}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_code"
                        label="户口"
                        disabled
                    />
                    <ProFormText
                        width="md"
                        name="member_name"
                        label="户名"
                        disabled
                    />
                </ProForm.Group>

                <BatchSettingTable></BatchSettingTable>
            </ModalForm>
        </div>
    );
};

export default BatchSettingForm;
