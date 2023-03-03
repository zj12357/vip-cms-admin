import React, { FC } from 'react';
import { Row, Col } from 'antd';
import { ProCard } from '@ant-design/pro-components';

type SceneRecordProps = {};

const SceneRecord: FC<SceneRecordProps> = (props) => {
    return (
        <Row>
            <Col span={12}>围数记录</Col>
        </Row>
    );
};

export default SceneRecord;
