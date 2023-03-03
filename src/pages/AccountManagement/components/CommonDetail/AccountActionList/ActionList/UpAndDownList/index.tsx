import React, { FC, useState, useRef, useCallback, useEffect } from 'react';
import { ProTable, ActionType } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import DownDetailForm from './DownDetailForm';
import UpDetailForm from './UpDetailForm';
import AccountDetailForm from './AccountDetailForm';
import { useHttp } from '@/hooks';
import { getOnlineAndOfflineList, removeOffline } from '@/api/accountAction';
import {
    GetOnlineAndOfflineListParams,
    OnlineAndOfflineListItem,
} from '@/types/api/accountAction';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { selectCurrencyList } from '@/store/common/commonSlice';
import { message, Popconfirm } from 'antd';
import { nanoid } from 'nanoid';
import Currency from '@/components/Currency';
import AuthButton from '@/components/AuthButton';

type UpAndDownListProps = {};

const UpAndDownList: FC<UpAndDownListProps> = (props) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const tableRef = useRef<ActionType>();
    const currencyList = useAppSelector(selectCurrencyList);
    const upAndDownListType: Record<number, string> = {
        0: '户主',
        1: '上线',
        2: '下线',
    };

    const {
        fetchData: _fetchOnlineAndOfflineList,
        response: onlineAndOfflineList,
    } = useHttp<GetOnlineAndOfflineListParams, OnlineAndOfflineListItem[]>(
        getOnlineAndOfflineList,
    );

    const { fetchData: _fetchRemoveOffline } = useHttp<string, null>(
        removeOffline,
        ({ msg }) => {
            message.success(msg);
        },
    );

    //户主信息
    const currentAccountInfo =
        (onlineAndOfflineList ?? []).find((item) => item.type === 0) ??
        ({} as OnlineAndOfflineListItem);

    const columns: ProColumns<OnlineAndOfflineListItem>[] = [
        {
            title: '上下线类型',
            dataIndex: 'type',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return <div>{upAndDownListType[record.type]}</div>;
            },
        },
        {
            title: '户口',
            dataIndex: 'member_code',
            fieldProps: {
                placeholder: '请输入户口名或者户口号',
            },
        },
        {
            title: '户名',
            dataIndex: 'member_name',
            hideInSearch: true,
        },
        {
            title: '币种',
            dataIndex: 'currency',
            valueType: 'select',
            fieldProps: {
                options: currencyList,
                defaultValue: 1,
            },
        },
        {
            title: '上线额度',
            dataIndex: 'member_marker_credit',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={
                            record?.member_marker_credit
                                ?.find((item) => item.marker_type === 2)
                                ?.total_amount.toString() ?? '0'
                        }
                    ></Currency>
                );
            },
        },
        {
            title: '公司额度',
            dataIndex: 'member_marker_credit',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={
                            record?.member_marker_credit
                                ?.find((item) => item.marker_type === 3)
                                ?.total_amount.toString() ?? '0'
                        }
                    ></Currency>
                );
            },
        },
        {
            title: '股东额度',
            dataIndex: 'member_marker_credit',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={
                            record?.member_marker_credit
                                ?.find((item) => item.marker_type === 1)
                                ?.total_amount.toString() ?? '0'
                        }
                    ></Currency>
                );
            },
        },
        {
            title: '上缴C佣金',
            dataIndex: 'turn_over_c_commission',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.turn_over_c_commission.toString()}
                    ></Currency>
                );
            },
        },
        {
            title: '上缴M佣金',
            dataIndex: 'turn_over_m_commission',
            hideInSearch: true,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.turn_over_m_commission.toString()}
                    ></Currency>
                );
            },
        },

        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                record.type === 0 && (
                    <AccountDetailForm
                        key="account"
                        record={record}
                    ></AccountDetailForm>
                ),
                record.type === 1 && (
                    <UpDetailForm key="up" record={record}></UpDetailForm>
                ),
                record.type === 2 && (
                    <DownDetailForm
                        key="down"
                        record={record}
                        currentAccountInfo={currentAccountInfo}
                        reloadData={reloadData}
                    ></DownDetailForm>
                ),
                record.type === 2 && (
                    <AuthButton
                        key="del"
                        normal="customerAccount-upAndDown-remove"
                        buttonProps={{
                            type: 'link',
                        }}
                        isSecond={true}
                        secondDom={<div>请确定是否要移除下线</div>}
                        secondVerify={(val) => {
                            if (val) {
                                handleRemoveOffline(record);
                            }
                        }}
                    ></AuthButton>
                ),
            ],
        },
    ];

    const handleRemoveOffline = (record: OnlineAndOfflineListItem) => {
        _fetchRemoveOffline(record.member_id);
        reloadData();
    };

    const reloadData = useCallback(() => {
        //重新获取数据
        tableRef.current?.reload();
    }, []);

    return (
        <div>
            <ProTable<OnlineAndOfflineListItem>
                columns={columns}
                request={async (params) => {
                    const res = await _fetchOnlineAndOfflineList({
                        member_code:
                            params.member_code || accountInfo.member_code,
                        currency: params.currency ?? 1,
                    });
                    return {
                        data: res.data,
                        success: true,
                    };
                }}
                rowKey={() => nanoid()}
                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                    span: 12,
                }}
                toolBarRender={false}
                scroll={{ x: 1000 }}
                pagination={{
                    pageSize: 10,
                }}
                actionRef={tableRef}
            />
        </div>
    );
};

export default UpAndDownList;
