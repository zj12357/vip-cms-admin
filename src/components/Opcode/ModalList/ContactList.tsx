import React, { FC } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { AccountInfoTelephoneListItem } from '@/types/api/account';
import { certificateType, phoneMethodType } from '@/common/commonConstType';
import { nanoid } from 'nanoid';

type ContactListProps = {
    data?: any[];
};

const ContactList: FC<ContactListProps> = ({ data }) => {
    const columns: ProColumns<AccountInfoTelephoneListItem>[] = [
        {
            dataIndex: 'telephone',
            title: '手机号',
        },

        {
            dataIndex: 'sending_method',
            valueType: 'select',
            fieldProps: {
                options: phoneMethodType,
            },
            title: '类型',
        },
    ];
    return (
        <ProTable<AccountInfoTelephoneListItem>
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

export default ContactList;
