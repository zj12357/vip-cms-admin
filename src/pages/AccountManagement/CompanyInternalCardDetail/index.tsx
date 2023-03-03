import React, { FC, useEffect } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Row, Col } from 'antd';
import { useSearchParams, useParams } from 'react-router-dom';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';
import TransferForm from './components/TransferForm';
import CurrencyExchangeForm from './components/CurrencyExchangeForm';
import VenueBalanceList from './components/VenueBalanceList';
import { useHttp } from '@/hooks';
import { getCompanyCardBalance } from '@/api/account';
import { CompanyCardBalanceItem } from '@/types/api/account';

type CompanyInternalCardDetailProps = {};

const CompanyInternalCardDetail: FC<CompanyInternalCardDetailProps> = (
    props,
) => {
    const [searchParams] = useSearchParams();
    const { id } = useParams<{ id: string }>();
    const {
        fetchData: _fetchCompanyCardBalance,
        response: blanceList,
        loading,
    } = useHttp<string, CompanyCardBalanceItem[]>(getCompanyCardBalance);

    const reloadData = () => {
        _fetchCompanyCardBalance(id);
    };

    useEffect(() => {
        _fetchCompanyCardBalance(id);
    }, [_fetchCompanyCardBalance, id]);

    return (
        <ProCard>
            <Row>
                <Col>
                    <DepositForm
                        cardName={id ?? ''}
                        reloadData={reloadData}
                    ></DepositForm>
                </Col>
                <Col offset={1}>
                    <WithdrawForm
                        cardName={id ?? ''}
                        reloadData={reloadData}
                    ></WithdrawForm>
                </Col>
                <Col offset={1}>
                    <TransferForm
                        cardName={id ?? ''}
                        reloadData={reloadData}
                    ></TransferForm>
                </Col>
                <Col offset={1}>
                    <CurrencyExchangeForm
                        cardName={id ?? ''}
                        reloadData={reloadData}
                    ></CurrencyExchangeForm>
                </Col>
            </Row>
            <div
                style={{
                    marginTop: '50px',
                }}
            >
                <VenueBalanceList
                    blanceList={blanceList ?? []}
                    loading={loading}
                    cardName={id ?? ''}
                ></VenueBalanceList>
            </div>
        </ProCard>
    );
};

export default CompanyInternalCardDetail;
