import React, { FC } from 'react';
import { Tabs } from 'antd';
import CurrentList from './CurrentList';
import HistoryList from './HistoryList';

const { TabPane } = Tabs;

type ExchangeRateListProps = {};

const ExchangeRateList: FC<ExchangeRateListProps> = (props) => {
    return (
        <div>
            <Tabs type="card" defaultActiveKey="1" destroyInactiveTabPane>
                <TabPane tab="汇率列表" key="1">
                    <CurrentList></CurrentList>
                </TabPane>
                <TabPane tab="历史汇率" key="2">
                    <HistoryList></HistoryList>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ExchangeRateList;
