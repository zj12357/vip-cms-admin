import React, { FC } from 'react';
import { Row, Col, Table, Image, Tag } from 'antd';
import moment from 'moment';
import RecordListData from '@/pages/AdmissionManagement/components/RecordListTable';
import '../../index.scoped.scss';
import { formatCurrency } from '@/utils/tools';
import { useNewWindow } from '@/hooks';

type AccountDetailsProps = {
    resData: {
        member_code: string;
        member_name: string;
        total_principal: number;
        total_add_chips: number;
        total_convert_chips: number;
        total_up_down_chips: number;
        start_work_time: number;
        stop_work_time: number;
        member_tag: string;
        scene_status: number;
        member_photo: string;
        total_principal_type: string;
    };
};

const AccountDetails: FC<AccountDetailsProps> = (props) => {
    const { toNewWindow } = useNewWindow();
    const { resData = undefined } = props;
    const sceneStatus = [
        {
            label: '入场',
            value: 1,
        },
        {
            label: '在场',
            value: 2,
        },
        {
            label: '离场',
            value: 3,
        },
    ];
    const columns: any[] = [
        {
            title: '',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '',
            dataIndex: 'value',
            key: 'value',
            onCell: (_: any, index: number) => {
                if (index === 5) {
                    return { colSpan: 5 };
                }
                return {};
            },
            render: (_: any, record: any, index: number) => {
                if (index === 5) {
                    return (
                        record.value &&
                        record.value.map((item: string, i: number) => {
                            if (item) {
                                return <Tag key={i}>{item}</Tag>;
                            }
                            return '';
                        })
                    );
                } else {
                    return record.value;
                }
            },
        },
        {
            title: '',
            dataIndex: 'title2',
            key: 'title2',
            onCell: (_: any, index: number) => {
                if (index === 5) {
                    return { colSpan: 0 };
                }
                return {};
            },
        },
        {
            title: '',
            dataIndex: 'value2',
            key: 'value2',
            onCell: (_: any, index: number) => {
                if (index === 4) {
                    return { colSpan: 2 };
                }
                if (index === 5) {
                    return { colSpan: 0 };
                }
                return {};
            },
        },
        {
            title: '',
            dataIndex: 'photo',
            key: 'photo',
            width: 100,
            onCell: (_: any, index: number) => {
                if (index === 0) {
                    return { rowSpan: 3 };
                }
                if (index === 0 || index === 1 || index === 2) {
                    return { rowSpan: 0 };
                }
                if (index === 4) {
                    return { colSpan: 0 };
                }
                if (index === 5) {
                    return { colSpan: 0 };
                }
                return {};
            },
        },
    ];
    const data: any[] = [
        {
            uid: '1',
            title: '户口号：',
            value: resData && (
                <span
                    className="m-primary-font-color pointer"
                    onClick={() =>
                        toNewWindow(
                            `/account/customerAccountDetail/${resData.member_code}`,
                        )
                    }
                >
                    {resData.member_code}
                </span>
            ),
            title2: '户口名：',
            value2: resData && resData.member_name,
            photo: '',
        },
        {
            uid: '2',
            title: '总本金：',
            value: resData && resData.total_principal_type,
            title2: '总加彩',
            value2: resData && formatCurrency(resData.total_add_chips),
            photo: '',
        },
        {
            uid: '3',
            title: '总转码：',
            value: resData && formatCurrency(resData.total_convert_chips),
            title2: '上下数：',
            value2: resData && formatCurrency(resData.total_up_down_chips),
            photo: '',
        },
        {
            uid: '4',
            title: '',
            value: '',
            title2: '',
            value2: '',
            photo:
                resData &&
                sceneStatus.find((item) => {
                    return item.value === resData.scene_status;
                })?.label,
        },
        {
            uid: '5',
            title: '账房开工时间：',
            value:
                resData && resData.start_work_time
                    ? moment(resData.start_work_time * 1000).format(
                          'YYYY-MM-DD HH:mm:ss',
                      )
                    : '',
            title2: '账房收工时间：',
            value2:
                resData && resData.stop_work_time
                    ? moment(resData.stop_work_time * 1000).format(
                          'YYYY-MM-DD HH:mm:ss',
                      )
                    : '',
            photo: '',
        },
        {
            uid: '6',
            title: '标签：',
            value: resData && resData.member_tag.split('|'),
        },
    ];
    return (
        <>
            <div className="s-info">
                <Table
                    style={{ width: '100%' }}
                    size="small"
                    bordered
                    rowKey={'uid'}
                    pagination={false}
                    columns={columns}
                    showHeader={false}
                    dataSource={data}
                />
                <div className="s-photo">
                    <Image
                        width={100}
                        height={117}
                        src={
                            resData && resData.member_photo
                                ? resData.member_photo
                                : 'error'
                        }
                        fallback="data:image/png;base64,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"
                    />
                </div>
            </div>
            <RecordListData />
        </>
    );
};

export default AccountDetails;
