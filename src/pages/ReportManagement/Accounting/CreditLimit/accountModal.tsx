/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useHttp } from '@/hooks';
import { MarkerXiaPiListParams } from '@/types/api/report';
import { markerXiaPiList } from '@/api/report';
import { ProTable, ModalForm, ProColumns } from '@ant-design/pro-components';
import Currency from '@/components/Currency';
type Props = {
    record: any;
    triggerDom: JSX.Element;
};
type AccountProps = {};
const AccountModal: FC<Props> = (props) => {
    const { triggerDom, record } = props;
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<any>([]);
    const { fetchData: fetchMarkerXiaPiList } = useHttp<
        MarkerXiaPiListParams,
        any
    >(markerXiaPiList);
    useEffect(() => {
        if (visible) {
            fetchMarkerXiaPiList({
                member_code: record.member_code,
                currency: record.currency,
            }).then((res) => {
                if (res.code === 10000) {
                    setData(res.data);
                }
            });
        }
    }, [visible]);
    const columns: ProColumns<AccountProps>[] = [
        {
            dataIndex: 'member_code',
            title: '受批户口',
        },
        {
            dataIndex: 'approve_amount',
            title: '下批额度(万)',
            render: (val) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'available_amount',
            title: '可用额度(万)',
            render: (val) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'signed_amount',
            title: '已签额度(万)',
            render: (val) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'overdue_amount',
            title: '过期金额(万)',
            render: (val) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'count',
            title: '过期次数',
        },
    ];

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
            title="下批户口列表"
            grid
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
