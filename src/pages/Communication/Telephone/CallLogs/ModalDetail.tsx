import React, { useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { TelephoneCallLog } from '@/types/api/communication';

interface Props {
    trigger?: JSX.Element;
}

const ModalDetail: React.FC<Props> = ({ trigger }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const tableRef = useRef<ActionType>();

    const handleClick = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const columns = useMemo<ProColumns<TelephoneCallLog>[]>(
        () => [
            {
                title: '场馆',
                dataIndex: 'field',
                align: 'center',
            },
            {
                title: '部门',
                dataIndex: 'field',
                align: 'center',
            },
            {
                title: '坐席',
                dataIndex: 'field',
                align: 'center',
            },
            {
                title: '户口号',
                dataIndex: 'field',
                align: 'center',
            },
            {
                title: '认证人',
                dataIndex: 'field',
                align: 'center',
            },
            {
                title: '认证状态',
                dataIndex: 'field',
                align: 'center',
            },
            {
                title: '操作业务',
                dataIndex: 'field',
                align: 'center',
            },
            {
                title: '开始时间',
                dataIndex: 'field',
                align: 'center',
            },
            {
                title: '录音时长',
                dataIndex: 'field',
                align: 'center',
            },
            {
                title: '播放录音',
                dataIndex: 'field',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'field',
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'field',
                align: 'center',
                width: 250,
            },
        ],
        [],
    );

    return (
        <React.Fragment>
            <span onClick={handleClick}>{trigger}</span>
            <Modal
                title={'录音/认证'}
                visible={visible}
                onCancel={handleCancel}
                width={1300}
            >
                <ProTable<any>
                    actionRef={tableRef}
                    toolBarRender={false}
                    search={false}
                    columns={columns}
                />
            </Modal>
        </React.Fragment>
    );
};

export default ModalDetail;
