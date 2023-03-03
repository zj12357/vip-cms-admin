import React, { FC, useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import FormCurrency from '@/components/Currency/FormCurrency';
import { useHttp } from '@/hooks';
import { ModalForm } from '@ant-design/pro-components';

type AddModalProps = {
    record: any;
    onSuccess: () => void;
};

const AddModal: FC<AddModalProps> = ({ record, onSuccess }) => {
    return (
        <ModalForm
            layout="horizontal"
            modalProps={{
                destroyOnClose: true,
            }}
            trigger={<span className="m-primary-font-color pointer">加彩</span>}
            onFinish={async (values: any) => {}}
            title="加彩"
            style={{
                width: 400,
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
        >
            <FormCurrency
                width={'xs'}
                name="start_work_principal"
                label="开工本金"
                placeholder=""
                disabled
            />
            <FormCurrency
                width={'xs'}
                name="start_work_principal"
                label="开工本金"
                placeholder=""
                disabled
            />
        </ModalForm>
    );
};

export default AddModal;
