import React, { FC, useState, useEffect } from 'react';
import { Modal } from 'antd';

type ShowTextProps = {
    visible?: boolean;
    onClose?: () => void;
    data?: any;
    title: string;
};

const ShowText: FC<ShowTextProps> = ({ visible, onClose, title, data }) => {
    const [infoVisible, setInfoVisible] = useState(false);

    useEffect(() => {
        setInfoVisible(visible ?? false);
    }, [visible]);
    return (
        <Modal
            onCancel={() => {
                setInfoVisible(false);
                onClose?.();
            }}
            onOk={() => {
                onClose?.();
            }}
            title={title}
            visible={infoVisible}
            width={600}
        >
            <div>{data}</div>
        </Modal>
    );
};

export default ShowText;
