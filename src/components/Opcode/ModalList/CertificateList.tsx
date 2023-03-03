import React, { FC } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { AccountInfoGradeListItem } from '@/types/api/account';
import { certificateType } from '@/common/commonConstType';
import { nanoid } from 'nanoid';
import moment from 'moment';

type CertificateListProps = {
    data: AccountInfoGradeListItem[];
};

const CertificateList: FC<CertificateListProps> = ({ data }) => {
    const columns: ProColumns<AccountInfoGradeListItem>[] = [
        {
            dataIndex: 'certificate_type',
            title: '证件类型',
            valueType: 'select',
            fieldProps: {
                options: certificateType,
            },
        },

        {
            dataIndex: 'certificate_number',
            title: '证件号码',
        },
        {
            dataIndex: 'certificate_name',
            title: '证件名',
        },
        {
            dataIndex: 'certificate_validity',
            title: '证件有效期',
            valueType: 'dateRange',
            render: (text, record, _, action) => {
                return (
                    <div>
                        {moment
                            .unix(Number(record.certificate_validity?.[0]))
                            .format('YYYY-MM-DD') +
                            '\t至\t' +
                            moment
                                .unix(Number(record.certificate_validity?.[1]))
                                .format('YYYY-MM-DD')}
                    </div>
                );
            },
        },
    ];
    return (
        <ProTable<AccountInfoGradeListItem>
            columns={columns}
            dataSource={data}
            rowKey={() => nanoid()}
            pagination={false}
            toolBarRender={false}
            search={false}
            scroll={{
                x: 700,
            }}
        />
    );
};

export default CertificateList;
