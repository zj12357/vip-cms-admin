import React, { FC } from 'react';
import { Tabs } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import DepartmentList from './DepartmentList';
import PositionList from './PositionList';
import RankList from './RankList';

type DepartmentConfigProps = {};
const { TabPane } = Tabs;

const DepartmentConfig: FC<DepartmentConfigProps> = (props) => {
    return (
        <ProCard>
            <Tabs defaultActiveKey="1" type="card" destroyInactiveTabPane>
                <TabPane tab="部门管理" key="1">
                    <DepartmentList></DepartmentList>
                </TabPane>
                <TabPane tab="职务管理" key="2">
                    <PositionList></PositionList>
                </TabPane>
                <TabPane tab="职级管理" key="3">
                    <RankList></RankList>
                </TabPane>
            </Tabs>
        </ProCard>
    );
};

export default DepartmentConfig;
