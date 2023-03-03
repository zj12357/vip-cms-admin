import React from 'react';
import { useParams } from 'react-router-dom';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable, ProCard } from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { getCompanyMember } from '@/api/account';
import { GetCompanyMemberType } from '@/types/api/account';
import { nanoid } from 'nanoid';

type CompanySearchListListProps = {};

const CompanySearchListList: React.FC<CompanySearchListListProps> = () => {
    const { id } = useParams<{ id: string }>();
    const { fetchData: _fetchCompanyMember } = useHttp<
        string,
        GetCompanyMemberType & GetCompanyMemberType[]
    >(getCompanyMember);

    const columns: ProColumns<GetCompanyMemberType>[] = [
        {
            dataIndex: 'member_code',
            title: '户口号',
        },
        {
            dataIndex: 'member_name',
            title: '户口名',
        },
        {
            dataIndex: 'remark',
            title: '备注',
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => {
                return (
                    <a
                        className="m-primary-font-color pointer"
                        href={`/account/companyAccountDetail/${record.member_code}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        进入户口详情
                    </a>
                );
            },
        },
    ];

    return (
        <ProCard>
            <ProTable<GetCompanyMemberType>
                columns={columns}
                request={async (params, sorter, filter) => {
                    const { data } = await _fetchCompanyMember(id);
                    return Promise.resolve({
                        data: data ?? [],
                        success: true,
                    });
                }}
                rowKey={() => nanoid()}
                pagination={{
                    showQuickJumper: true,
                }}
                toolBarRender={false}
                search={false}
            />
        </ProCard>
    );
};

export default CompanySearchListList;
