import React, { FC } from 'react';
import { Tabs } from 'antd';
import PointsInfo from './PointsInfoList';
import ConsumptionList from './ConsumptionList';

const { TabPane } = Tabs;

type PointsListProps = {};

const PointsList: FC<PointsListProps> = (props) => {
    return (
        <div>
            <Tabs defaultActiveKey="1" type="card" destroyInactiveTabPane>
                <TabPane tab="积分/礼遇金" key="1">
                    <PointsInfo></PointsInfo>
                </TabPane>
                <TabPane tab="消费记录" key="2">
                    <ConsumptionList></ConsumptionList>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default PointsList;
