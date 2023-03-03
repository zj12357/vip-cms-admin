import React, { FC } from 'react';
import { Tabs } from 'antd';

type Props = {};

const SilverHead: FC<Props> = (props) => {
    return (
        <div>
            <Tabs defaultActiveKey="1"></Tabs>
        </div>
    );
};
export default SilverHead;
