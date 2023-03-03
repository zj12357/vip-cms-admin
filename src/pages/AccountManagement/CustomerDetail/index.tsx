import React, { FC, useEffect, useCallback } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Row, Col, Divider } from 'antd';
import CustomerFunds from '../components/CommonDetail/CustomerFunds';
import Liquidation from '../components/CommonDetail/Liquidation';
import AccountInfo from '../components/CommonDetail/AccountInfo';
import AccountActionList from '../components/CommonDetail/AccountActionList';
import InfoContent from './InfoContent';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
    selectAccountInfo,
    setAccountType,
} from '@/store/account/accountSlice';
import Loading from '@/components/Loading';
import { useGetAccountInfo } from '@/pages/AccountManagement/common';

type CustomerDetailProps = {};

const CustomerDetail: FC<CustomerDetailProps> = (props) => {
    const dispatch = useAppDispatch();
    const accountInfo = useAppSelector(selectAccountInfo);
    const callback = useGetAccountInfo();

    const getInfo = useCallback(() => {
        if (document.visibilityState === 'visible') {
            callback();
        }
    }, [callback]);

    useEffect(() => {
        document.addEventListener('visibilitychange', () => {
            getInfo();
        });
        callback();
        return () => {
            document.removeEventListener('visibilitychange', () => {
                getInfo();
            });
        };
    }, [callback, getInfo]);

    useEffect(() => {
        dispatch(setAccountType(2));
    }, [dispatch]);
    return (
        <ProCard>
            {Object.keys(accountInfo).length === 0 ? (
                <Loading></Loading>
            ) : (
                <Row justify="space-between" wrap={false}>
                    <Col
                        span={11}
                        style={{
                            minWidth: '600px',
                            marginBottom: '20px',
                        }}
                    >
                        <CustomerFunds></CustomerFunds>
                        <Divider></Divider>
                        <AccountInfo></AccountInfo>
                        <InfoContent></InfoContent>
                    </Col>
                    <Col
                        span={11}
                        style={{
                            minWidth: '600px',
                        }}
                    >
                        <Liquidation></Liquidation>
                        <Divider></Divider>
                        <AccountActionList></AccountActionList>
                    </Col>
                </Row>
            )}
        </ProCard>
    );
};

export default CustomerDetail;
