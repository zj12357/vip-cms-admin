import React, { FC, useState, useEffect } from 'react';
import { Row, Col, Select, Tabs } from 'antd';
import ShareholdersCreditForm from './ShareholdersCreditForm';
import CreditOverviewList from './CreditOverviewList';
import BatchRecordList from './BatchRecordList';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import { selectAccountInfo } from '@/store/account/accountSlice';

type CreditMarkerListProps = {};

const { TabPane } = Tabs;

const CreditMarkerList: FC<CreditMarkerListProps> = (props) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const accountInfo = useAppSelector(selectAccountInfo);
    const [currencyType, setCurrencyType] = useState(currencyList?.[0]?.value);

    return (
        <div
            style={{
                position: 'relative',
            }}
        >
            <Row
                justify="end"
                align="middle"
                style={{
                    marginBottom: '14px',
                    position: 'absolute',
                    top: '0px',
                    right: '10px',
                    zIndex: 9,
                }}
                wrap={false}
            >
                {accountInfo.member_type === 2 && (
                    <Col>
                        <ShareholdersCreditForm
                            currency={currencyType}
                        ></ShareholdersCreditForm>
                    </Col>
                )}

                <Col>
                    <span style={{ width: '100px', margin: '0  0 0 20px' }}>
                        币种：
                    </span>
                    <Select
                        value={currencyType}
                        onChange={(val) => {
                            setCurrencyType(val);
                        }}
                        options={currencyList}
                    ></Select>
                </Col>
            </Row>
            <Tabs defaultActiveKey="1" type="card" destroyInactiveTabPane>
                <TabPane tab="信贷概览" key="1">
                    <CreditOverviewList
                        currencyType={currencyType}
                    ></CreditOverviewList>
                </TabPane>
                <TabPane tab="批额记录" key="2">
                    <BatchRecordList
                        currencyType={currencyType}
                    ></BatchRecordList>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default CreditMarkerList;
