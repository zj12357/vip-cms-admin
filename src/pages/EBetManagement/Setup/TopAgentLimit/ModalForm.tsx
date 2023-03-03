import React, { useMemo, useRef } from 'react';
import {
    ActionType,
    ModalForm,
    ProColumns,
    ProTable,
    ProFormRadio,
    ProForm,
} from '@ant-design/pro-components';
import { message, Radio } from 'antd';
import { TopAgentLimitProps } from '@/types/api/eBet';
import { useHttp } from '@/hooks';
import { updateTopAgentLimit } from '@/api/eBet';

interface Props {
    trigger?: JSX.Element;
    limitList?: Record<string, any>[];
    entity?: TopAgentLimitProps;
    onFinish?: () => void;
}

const TopAgentLimitModalForm: React.FC<Props> = ({
    trigger,
    entity,
    limitList,
    onFinish,
}) => {
    const formRef = useRef<any>();
    const tableRef = useRef<ActionType>();
    const { fetchData: submit } = useHttp(updateTopAgentLimit);
    const columns = useMemo<ProColumns<Record<string, any>>[]>(
        () => [
            {
                align: 'center',
                width: 80,
                render: (dom, record, index) => (
                    <Radio value={record.value} style={{ marginRight: 0 }} />
                ),
                onCell: (record) => {
                    return {
                        colSpan: 1,
                        style: {
                            verticalAlign: 'middle',
                        },
                    };
                },
            },
            {
                title: '庄/闲',
                dataIndex: 'betType1',
                align: 'center',
                onCell: (record) => {
                    return {
                        colSpan: record.value ? 1 : 3,
                        style: {
                            verticalAlign: 'middle',
                        },
                    };
                },
            },
            {
                title: '和',
                dataIndex: 'betType2',
                align: 'center',
                onCell: (record) => {
                    return {
                        colSpan: record.value ? 1 : 0,
                        style: {
                            verticalAlign: 'middle',
                        },
                    };
                },
            },
            {
                title: '对子',
                dataIndex: 'betType3',
                align: 'center',
                onCell: (record) => {
                    return {
                        colSpan: record.value ? 1 : 0,
                        style: {
                            verticalAlign: 'middle',
                        },
                    };
                },
            },
        ],
        [],
    );

    const handleFinish = async (values: Record<string, any>) => {
        const payload = {
            ...values,
            member_id: entity?.member_id,
        };
        const res = await submit(payload);
        if (res.code === 10000) {
            message.success('操作成功');
            onFinish?.();
            return true;
        }
        return false;
    };

    const dataSource = useMemo(
        () =>
            limitList?.map((a) => {
                const betType1 = a.limit_array?.find(
                    (a: any) => a.bet_type === 1,
                );
                const betType2 = a.limit_array?.find(
                    (a: any) => a.bet_type === 2,
                );
                const betType3 = a.limit_array?.find(
                    (a: any) => a.bet_type === 3,
                );
                return {
                    value: a.value,
                    betType1: `${Number(
                        betType1?.min_amount ?? 0,
                    ).toLocaleString()} ~ ${Number(
                        betType1?.max_amount ?? 0,
                    ).toLocaleString()}`,
                    betType2: `${Number(
                        betType2?.min_amount ?? 0,
                    ).toLocaleString()} ~ ${Number(
                        betType2?.max_amount ?? 0,
                    ).toLocaleString()}`,
                    betType3: `${Number(
                        betType3?.min_amount ?? 0,
                    ).toLocaleString()} ~ ${Number(
                        betType3?.max_amount ?? 0,
                    ).toLocaleString()}`,
                };
            }) ?? [],
        [limitList],
    );

    return (
        <ModalForm
            formRef={formRef}
            trigger={trigger}
            layout={'horizontal'}
            title="投注限红选择"
            onVisibleChange={() => {
                formRef?.current?.resetFields();
            }}
            onFinish={handleFinish}
        >
            <ProForm.Item
                name={'limit_id'}
                initialValue={entity?.limit_id}
                rules={[{ required: true, message: '请选择' }]}
            >
                <Radio.Group style={{ width: '100%' }}>
                    <ProTable<Record<string, any>>
                        actionRef={tableRef}
                        columns={columns}
                        toolBarRender={false}
                        rowKey={(record) => String(record.value)}
                        search={false}
                        pagination={false}
                        bordered
                        request={async () => {
                            const res = {
                                data: [
                                    ...dataSource,
                                    // {
                                    //     value: null,
                                    //     betType1: '无限制',
                                    // },
                                ],
                            };
                            return {
                                data: res.data,
                                success: true,
                            };
                        }}
                    />
                </Radio.Group>
            </ProForm.Item>
        </ModalForm>
    );
};

export default TopAgentLimitModalForm;
