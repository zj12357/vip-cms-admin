import React, { FC, useState } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import { useHttp, useNewWindow } from '@/hooks';
import { CreditLimitListParams } from '@/types/api/report';
import { creditLimitList } from '@/api/report';
import DetailModal from './detailModal';
import AccountModal from './accountModal';
import RecordModal from './recordModal';
import Currency from '@/components/Currency';
import { formatCurrency } from '@/utils/tools';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';

type Props = {};
type UpDownProps = {
    member_code_text: string;
    member_code: string;
    member_name: string;
    currency: string;
};

const UpDown: FC<Props> = (props) => {
    const { toNewWindow } = useNewWindow();
    const currencyList = useAppSelector(selectCurrencyList);
    const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
    const { fetchData: fetchCreditLimitList } = useHttp<
        CreditLimitListParams,
        any
    >(creditLimitList);
    const columns: ProColumns<UpDownProps>[] = [
        {
            dataIndex: 'member',
            title: '',
            hideInTable: true,
            fieldProps: {
                placeholder: '输入户口名称/户口号',
            },
        },
        {
            dataIndex: 'member_code_text',
            title: '户口号',
            search: false,
            render: (_, record) => {
                return (
                    <div
                        className="m-primary-font-color pointer"
                        key="detail"
                        onClick={() =>
                            toNewWindow(
                                `/account/customerAccountDetail/${record.member_code_text}`,
                            )
                        }
                    >
                        {record.member_code_text}
                    </div>
                );
            },
        },
        {
            dataIndex: 'member_name_text',
            title: '户口名',
            search: false,
        },
        {
            dataIndex: 'currency',
            title: '币种',
            valueType: 'select',
            search: false,
            fieldProps: {
                options: currencyList,
            },
        },
        {
            dataIndex: 'total_amount',
            title: '总额(万)',
            search: false,
            render: (val) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'available_amount',
            title: '可用额度(万)',
            search: false,
            render: (val) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'used_amount',
            title: '已用额度(万)',
            search: false,
            render: (val) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'approve_amount',
            title: '下批额度(万)',
            search: false,
            render: (val) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'signed_amount',
            title: '已签额度(万)',
            search: false,
            render: (val) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'overdue_amount',
            title: '过期金额(万)',
            search: false,
            render: (val) => <Currency value={val + ''} />,
        },
        {
            dataIndex: 'xia_xian_overdue_amount',
            title: '下线过期金额（万）',
            search: false,
            render: (val) => {
                return (
                    <span className="m-primary-error-color">
                        {formatCurrency(val + '') + '万'}
                    </span>
                );
            },
        },
        {
            dataIndex: 'count',
            title: '过期次数',
            search: false,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => {
                return [
                    <DetailModal
                        record={record}
                        key="detailModal"
                        triggerDom={
                            <div className="m-primary-font-color pointer">
                                查看详情
                            </div>
                        }
                    />,
                    <AccountModal
                        record={record}
                        key="accountModal"
                        triggerDom={
                            <div className="m-primary-font-color pointer">
                                下批户口列表
                            </div>
                        }
                    />,
                    <RecordModal
                        record={record}
                        key="recordModal"
                        triggerDom={
                            <div className="m-primary-font-color pointer">
                                批额记录
                            </div>
                        }
                    />,
                ];
            },
        },
    ];
    const resetData = (data: any[]) => {
        const resArr: any[] = [];
        data.forEach((item, index) => {
            item.info.forEach((itm: any, idx: number) => {
                if (idx === 0) {
                    resArr[index] = {
                        ...itm,
                        member_code_text: itm.member_code,
                        member_name_text: itm.member_name,
                    };
                } else if (idx === 1) {
                    resArr[index] = {
                        ...resArr[index],
                        children: [
                            {
                                ...itm,
                                member_code_text: '',
                                member_name_text: '',
                            },
                        ],
                    };
                } else {
                    resArr[index].children.push({
                        ...itm,
                        member_code_text: '',
                        member_name_text: '',
                    });
                }
            });
        });
        return resArr;
    };

    return (
        <div>
            <ProTable<UpDownProps>
                columns={columns}
                cardBordered={{
                    table: true,
                }}
                rowKey={(i) => (i.member_code || '') + (i.currency || '')}
                expandable={{
                    defaultExpandAllRows: true,
                    expandedRowKeys,
                    onExpandedRowsChange: (keys) => {
                        setExpandedRowKeys(keys);
                    },
                }}
                request={async (params: any) => {
                    params.page = params.current;
                    params.size = params.pageSize;
                    delete params.current;
                    delete params.pageSize;
                    const res: any = await fetchCreditLimitList({
                        ...params,
                    });
                    const arr = resetData(res.data.data ?? []);
                    return Promise.resolve({
                        data: arr,
                        total: res.data.total ?? 0,
                        success: true,
                    });
                }}
            />
        </div>
    );
};
export default UpDown;
