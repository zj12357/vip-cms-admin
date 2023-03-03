import React, { FC } from 'react';
import { Row, Col } from 'antd';
import { ProCard } from '@ant-design/pro-components';

type SceneReportProps = {};

const SceneReport: FC<SceneReportProps> = (props) => {
    return (
        <Row>
            <Col span={12}>围数报表</Col>
        </Row>
    );
};

export default SceneReport;
