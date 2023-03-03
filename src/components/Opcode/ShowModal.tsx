import React, { FC, useState, useEffect } from 'react';
import { Modal } from 'antd';
import {
    ContactList,
    CertificateList,
    PhotoList,
    AuthorizeContactList,
} from './ModalList';

type ShowModalProps = {
    visible?: boolean;
    onClose?: () => void;
    data?: any;
    title: string;
    infoType: 'certificate' | 'contact' | 'photo' | 'authorize';
};

const ShowModal: FC<ShowModalProps> = ({
    visible,
    onClose,
    title,
    infoType,
    data,
}) => {
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
            width={800}
        >
            {infoType === 'contact' && <ContactList data={data}></ContactList>}
            {infoType === 'certificate' && (
                <CertificateList data={data}></CertificateList>
            )}
            {infoType === 'photo' && <PhotoList data={data}></PhotoList>}
            {infoType === 'authorize' && (
                <AuthorizeContactList data={data}></AuthorizeContactList>
            )}
        </Modal>
    );
};

export default ShowModal;
