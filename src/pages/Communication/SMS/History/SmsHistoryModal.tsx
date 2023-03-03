import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHttp } from '@/hooks';
import { getSmsHistoryDetailList } from '@/api/communication';
import { SmsHistoryProps } from '@/types/api/communication';
import { Modal } from 'antd';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';

interface SmsHistoryModalProps {
    trigger: JSX.Element;
    entity: SmsHistoryProps;
}

export const messageTypes = [
    {
        value: 1,
        label: '发送成功',
    },
    {
        value: 2,
        label: '发送失败',
    },
];

const SmsHistoryModal: React.FC<SmsHistoryModalProps> = ({
    trigger,
    entity,
}) => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchList } = useHttp(getSmsHistoryDetailList);
    const [visible, setVisible] = useState<boolean>(false);
    const columns = useMemo<ProColumns<SmsHistoryProps, any>[]>(
        () => [
            {
                title: '到达时间',
                dataIndex: 'updated_at',
                align: 'center',
                valueType: 'milliDateTime',
                width: 180,
            },
            {
                title: '发送状态',
                dataIndex: 'message_status',
                valueType: 'select',
                fieldProps: {
                    options: messageTypes,
                },
                align: 'center',
                width: 100,
            },
            {
                title: '发送日志',
                dataIndex: 'error_desc',
                align: 'center',
            },
        ],
        [],
    );

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <span onClick={() => setVisible(true)}>{trigger}</span>
            <Modal
                title={'详细信息'}
                visible={visible}
                destroyOnClose
                onCancel={handleCancel}
                onOk={handleCancel}
                width={800}
            >
                <ProTable<SmsHistoryProps>
                    rowKey={(record) => String(record.message_id)}
                    actionRef={tableRef}
                    columns={columns}
                    toolBarRender={false}
                    search={false}
                    dateFormatter={'number'}
                    pagination={false}
                    params={{
                        uniquecode: entity?.unique_code,
                    }}
                    request={async (params) => {
                        const res = await fetchList(params);
                        return {
                            data: res?.data?.list,
                            success: true,
                            total: res?.data?.total,
                        };
                    }}
                />
            </Modal>
        </>
    );
};

export default SmsHistoryModal;
