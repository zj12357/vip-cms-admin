import React, { FC, useEffect, useRef } from 'react';
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components';
import EditModal from './editModal';
import { admissionType } from '@/common/commonConstType';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useHttp } from '@/hooks';
import { selectCurrencyList, chipsListAsync } from '@/store/common/commonSlice';
import { getChipsSettingList } from '@/api/silverHead';
import { ChipSettingItem, ChipSettingParams } from '@/types/api/silverHead';
import { Popover, Typography } from 'antd';
type Props = {};

const ChipSetting: FC<Props> = (props) => {
    const tableRef = useRef<ActionType>();
    const dispatch = useAppDispatch();
    const { fetchData: fetchGetChipsSettingList } = useHttp<
        ChipSettingParams,
        ChipSettingItem[]
    >(getChipsSettingList);

    const currencyList = useAppSelector(selectCurrencyList);
    useEffect(() => {
        dispatch(chipsListAsync());
    }, [dispatch]);

    const columns: ProColumns<ChipSettingItem>[] = [
        {
            dataIndex: 'use_for',
            title: '入场类型',
            hideInTable: true,
            valueType: 'select',
            request: async () => [...admissionType],
        },
        {
            dataIndex: 'mode',
            title: '开工类型',
            search: false,
            render: (_, record) => {
                return record.isShowMode ? record.mode : '';
            },
        },
        {
            dataIndex: 'currency_id',
            title: '货币类型',
            valueType: 'select',
            request: async () => [...currencyList],
            render: (_, record) => {
                return (
                    currencyList.find(
                        (i: any) => i.value === record.currency_id,
                    )?.label || '-'
                );
            },
        },
        {
            dataIndex: 'capital_type',
            title: '本金类型',
            search: false,
        },
        {
            dataIndex: 'use_type',
            title: '出码类型',
            search: false,
        },
        {
            dataIndex: 'use_for_desc',
            title: '入场类型',
            search: false,
        },
        {
            dataIndex: 'chips_list',
            title: '筹码名称',
            search: false,
            render: (_, record) => (
                <Popover
                    content={(record.chips_list || [])
                        .map((i) => i.chips_name)
                        .join('，')}
                    overlayInnerStyle={{ maxWidth: 600 }}
                    title={false}
                >
                    <Typography.Text ellipsis={true} style={{ maxWidth: 700 }}>
                        {(record.chips_list || [])
                            .map((i) => i.chips_name)
                            .join('，')}
                    </Typography.Text>
                </Popover>
            ),
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => {
                return [
                    record.currency_id ? (
                        <EditModal
                            record={record}
                            key="editModal"
                            onSuccess={() => {
                                tableRef.current?.reload();
                            }}
                        />
                    ) : (
                        <span
                            className="m-primary-font-color pointer"
                            style={{ opacity: '0.5' }}
                        >
                            调整
                        </span>
                    ),
                ];
            },
        },
    ];
    return (
        <div>
            <ProTable<ChipSettingItem>
                columns={columns}
                pagination={false}
                actionRef={tableRef}
                request={async (params: any) => {
                    const res = await fetchGetChipsSettingList(params);
                    const resObj: any = res.data || {};
                    let arr: Array<any> = [];

                    delete resObj.normal_length;
                    delete resObj.operate_length;
                    Object.keys(resObj).forEach((key) => {
                        arr = arr.concat(
                            (resObj[key] || []).map((i: any, idx: number) => {
                                return {
                                    ...i,
                                    isShowMode: idx === 0,
                                    mode:
                                        key === 'normal'
                                            ? '普通'
                                            : key === 'operate'
                                            ? '营运'
                                            : '未设置',
                                };
                            }),
                        );
                    });
                    return Promise.resolve({
                        data: arr,
                        success: true,
                    });
                }}
                search={{
                    labelWidth: 'auto',
                }}
            />
        </div>
    );
};
export default ChipSetting;
