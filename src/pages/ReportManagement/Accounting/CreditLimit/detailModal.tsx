/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useHttp, useNewWindow } from '@/hooks';
import { GetCreditDetailListParams } from '@/types/api/accountAction';
import { getCreditDetail } from '@/api/accountAction';
import {
    ProTable,
    ModalForm,
    ProColumns,
    ProFormText,
} from '@ant-design/pro-components';
import Big from 'big.js';
import Currency from '@/components/Currency';
import { markerType } from '@/common/commonConstType';
type Props = {
    record: any;
    triggerDom: JSX.Element;
};
type DetailProps = {
    marker_type: number;
    total_amount: number;
    available_amount: number;
    used_amount: number;
    approve_amount: number;
    signed_amount: number;
    overdue_amount: number;
    count: number;
};
const DetailModal: FC<Props> = (props) => {
    const { triggerDom, record } = props;
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<any>([]);
    const { fetchData: fetchGetCreditDetail } = useHttp<
        GetCreditDetailListParams,
        any
    >(getCreditDetail);
    const columns: ProColumns<DetailProps>[] = [
        {
            dataIndex: 'marker_type',
            title: '类型',
            valueType: 'select',
            fieldProps: {
                options: markerType,
            },
        },
        {
            dataIndex: 'total_amount',
            title: '总额(万)',
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
            dataIndex: 'used_amount',
            title: '已用额度(万)',
            render: (val) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'approve_amount',
            title: '下批额度(万)',
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
            dataIndex: 'no_expired_amount',
            title: '未过期金额(万)',
            render: (val) => {
                return <Currency value={val + ''} />;
            },
        },
        {
            dataIndex: 'count',
            title: '过期次数',
        },
    ];

    useEffect(() => {
        if (visible) {
            fetchGetCreditDetail({
                member_code: record.member_code,
                currency: record.currency,
            }).then((res) => {
                if (res.code === 10000) {
                    setData(res.data);
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
            title="户口详情"
            grid
            initialValues={{
                member_code: record.member_code,
                member_name: record.member_name,
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
            <ProFormText
                name="member_code"
                label="户口"
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProFormText
                name="member_name"
                label="户名"
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProTable<DetailProps>
                style={{ width: '100%' }}
                columns={columns}
                search={false}
                pagination={false}
                dataSource={data}
            />
        </ModalForm>
    );
};

export default DetailModal;
