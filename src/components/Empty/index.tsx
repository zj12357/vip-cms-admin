import React, { FC } from 'react';
import { Empty } from 'antd';

type EmptyProps = {
    description?: string;
    image?: string;
};

const EmptyComponent: FC<EmptyProps> = ({ description, image }) => {
    return <Empty description={description} image={image}></Empty>;
};

export default EmptyComponent;
