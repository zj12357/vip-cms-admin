import React, { FC, memo } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { ProColumns, ModalForm } from '@ant-design/pro-components';
import { Descriptions, Divider } from 'antd';
import {
    AdminAccountListItem,
    GetAdminAccountLogListParams,
    AdminAccountLogListType,
    AdminAccountLogListItem,
} from '@/types/api/system';
import { getAdminAccountLogList } from '@/api/system';
import { useHttp } from '@/hooks';
import { nanoid } from 'nanoid';

type AccountDetailProps = {
    trigger: JSX.Element;

    record: AdminAccountListItem;
};

const columns: ProColumns<AdminAccountLogListItem, any>[] = [
    {
        title: '登录时间',
        dataIndex: 'login_at',
        valueType: 'milliDateTime',
    },

    {
        title: '登录ip',
        dataIndex: 'login_ip',
    },
];
const AccountDetail: FC<AccountDetailProps> = memo(({ trigger, record }) => {
    const { fetchData: _fetchAdminAccountLogList } = useHttp<
        GetAdminAccountLogListParams,
        AdminAccountLogListType
    >(getAdminAccountLogList);

    return (
        <ModalForm
            trigger={trigger}
            title="登录详情"
            width={800}
            modalProps={{
                destroyOnClose: true,
            }}
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
        >
            <Descriptions>
                <Descriptions.Item label="场馆">
                    {record.hall_name}
                </Descriptions.Item>
            </Descriptions>
            <Descriptions>
                <Descriptions.Item label="员工姓名">
                    {record.user_name}
                </Descriptions.Item>
                <Descriptions.Item label="联系电话">
                    {record.tel}
                </Descriptions.Item>
            </Descriptions>
            <Descriptions>
                <Descriptions.Item label="部门">
                    {record.department_name}
                </Descriptions.Item>
                <Descriptions.Item label="职务">
                    {record.department_title_name}
                </Descriptions.Item>
                <Descriptions.Item label="职级">
                    {record.department_level_name}
                </Descriptions.Item>
            </Descriptions>
            <Divider></Divider>
            <div
                style={{
                    marginTop: '20px',
                }}
            >
                <ProTable<AdminAccountLogListItem>
                    columns={columns}
                    request={async (params) => {
                        const res = await _fetchAdminAccountLogList({
                            page: params.current ?? 1,
                            size: params.pageSize ?? 20,
                            admin_id: record.admin_id,
                        });
                        return {
                            data: res.data?.list ?? [],
                            total: res.data?.total ?? 0,
                            success: true,
                        };
                    }}
                    rowKey={() => nanoid()}
                    search={false}
                    toolBarRender={false}
                    scroll={{ x: 700 }}
                />
            </div>
        </ModalForm>
    );
});

export default AccountDetail;
