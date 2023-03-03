import React, { FC } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import {
    CompanyCardBalanceItem,
    CompanyCardCurrencyItem,
} from '@/types/api/account';
import { useSearchParams } from 'react-router-dom';
import { Row } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import FundingForms from '../FundingForm';
import Currency from '@/components/Currency';
import DebtList from '../DebtList';

type VenueBalanceListProps = {
    blanceList: CompanyCardBalanceItem[];
    loading: boolean;
    cardName: string;
};

const style: React.CSSProperties = {
    marginBottom: '14px',
    fontWeight: 'bold',
    fontSize: '16px',
};
const VenueBalanceList: FC<VenueBalanceListProps> = ({
    blanceList,
    loading,
    cardName,
}) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const [searchParams] = useSearchParams();
    const urrencyColumns = currencyList.map((item) => {
        return {
            dataIndex: 'currency_info',
            title: <span style={{ marginRight: '14px' }}>{item.label}</span>,
            render: (text: string, record: CompanyCardBalanceItem) => {
                if (record.hall_id === 0) {
                    const totalAmount = blanceList.reduce(
                        (prev: number, curr: CompanyCardBalanceItem) => {
                            const currAmount =
                                curr.currency_info.find(
                                    (v: CompanyCardCurrencyItem) =>
                                        v.currency_id === item.value,
                                )?.amount ?? 0;

                            return prev + currAmount;
                        },
                        0,
                    );

                    return (
                        <DebtList
                            hall={0}
                            currency={item.value}
                            trigger={
                                <div className="m-primary-font-color pointer">
                                    <Currency
                                        value={totalAmount.toString()}
                                    ></Currency>
                                </div>
                            }
                            company_card={cardName}
                        ></DebtList>
                    );
                }
                return (
                    <DebtList
                        hall={record.hall_id}
                        currency={item.value}
                        trigger={
                            <div className="m-primary-font-color pointer">
                                <Currency
                                    value={
                                        record.currency_info
                                            .find(
                                                (v) =>
                                                    v.currency_id ===
                                                    item.value,
                                            )
                                            ?.amount?.toString() ?? '0'
                                    }
                                ></Currency>
                            </div>
                        }
                        company_card={cardName}
                    ></DebtList>
                );
            },
        };
    }) as any;

    const columns: ProColumns<CompanyCardBalanceItem>[] = [
        {
            dataIndex: 'hall_code',
            title: '场馆',
            render: (text, record, _, action) => {
                return (
                    <Row
                        justify="space-between"
                        style={{ paddingRight: '20px' }}
                    >
                        <span style={{ marginRight: '14px' }}>
                            {record.hall_code}
                        </span>
                        {/* {[
                            'ying1',
                            'ying2',
                            'ying8',
                            'ying9',
                            'yingy',
                            'comm',
                            'bcomm',
                            'game',
                            'bgame',
                            'faxi',
                        ].includes(searchParams.get('cardNumber') ?? '') &&
                            record.hall_id !== 0 && (
                                <FundingForms record={record}></FundingForms>
                            )} */}
                    </Row>
                );
            },
        },
        ...urrencyColumns,
    ];
    const totalRow = {
        hall_code: '总计',
        hall_id: 0,
        currency_info: [],
    };
    return (
        <div>
            <h1 style={style}>{searchParams.get('cardName')}：余额概况</h1>
            <ProTable<CompanyCardBalanceItem>
                columns={columns}
                dataSource={[totalRow, ...blanceList]}
                rowKey={(item) => item.hall_id}
                pagination={false}
                toolBarRender={false}
                search={false}
                scroll={{
                    x: 800,
                }}
                loading={loading}
            />
        </div>
    );
};

export default VenueBalanceList;
