/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useHttp } from '@/hooks';
import { amountType, fromToMarkType } from '@/common/commonConstType';
import { MarkerProposalReportListParams } from '@/types/api/report';
import { markerProposalReportList } from '@/api/report';
import { ProTable, ModalForm, ProColumns } from '@ant-design/pro-components';
import Currency from '@/components/Currency';
import moment from 'moment';
type Props = {
    triggerDom: JSX.Element;
    record: any;
};
type AccountProps = {
    created_at: number;
};
const AccountModal: FC<Props> = (props) => {
    const { triggerDom, record } = props;
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<any>([]);
    const { fetchData: fetchMarkerProposalReportList } = useHttp<
        MarkerProposalReportListParams,
        any
    >(markerProposalReportList);
    const columns: ProColumns<AccountProps>[] = [
        {
            dataIndex: 'member_code',
            title: '批额户口',
        },
        {
            dataIndex: 'marker_type',
            title: '下批类型',
            valueType: 'select',
            request: async () => [...fromToMarkType],
        },
        {
            dataIndex: 'proposal_amount',
            title: '下批额度(万)',
            render: (val) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'member_code_t',
            title: '受批户口',
        },
        {
            dataIndex: 'marker_type_t',
            title: '获得类型',
            valueType: 'select',
            request: async () => [...fromToMarkType],
        },
        {
            dataIndex: 'proposal_amount',
            title: '获得额度(万)',
            render: (val) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'type',
            valueType: 'select',
            title: '状态',
            request: async () => [...amountType],
        },
        {
            dataIndex: 'created_at',
            title: '时间',
            render: (_, record) => {
                if (record.created_at) {
                    return moment(record.created_at * 1000).format(
                        'YYYY/MM/DD HH:mm:ss',
                    );
                }
            },
        },
        {
            dataIndex: 'operation',
            title: '经手人',
        },
    ];
    useEffect(() => {
        if (visible) {
            fetchMarkerProposalReportList({
                page: 1,
                size: 100,
                from_member: record.member_code,
            }).then((res) => {
                if (res.code === 10000) {
                    setData(res.data?.list ?? []);
                }
            });
        }
    }, [visible]);
    return (
        <ModalForm
            visible={visible}
            onVisibleChange={(vis) => {
                setVisible(vis);
            }}
            width={1000}
            trigger={triggerDom}
            layout="horizontal"
            readonly
            title="批额记录"
            grid
            initialValues={{
                name: record.member_code,
                accout: record.member_code,
            }}
            submitter={{
                searchConfig: {
                    resetText: '关闭',
                },
                submitButtonProps: {
                    style: {
                        display: 'none',
                    },
                },
            }}
        >
            <ProTable<AccountProps>
                style={{ width: '100%' }}
                columns={columns}
                search={false}
                pagination={false}
                dataSource={data}
            />
        </ModalForm>
    );
};

export default AccountModal;
