import React, { FC, useState, useEffect } from 'react';
import { Modal, Switch } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { TelephoneListItem } from '@/types/api/accountAction';
import { nanoid } from 'nanoid';
import { phoneMethodType } from '@/common/commonConstType';

type AuthorizeContactListProps = {
    data: TelephoneListItem[];
};

const AuthorizeContactList: FC<AuthorizeContactListProps> = ({ data }) => {
    const columns: ProColumns<TelephoneListItem>[] = [
        {
            dataIndex: 'phone',
            title: '手机号',
        },
        {
            title: '权限',
            dataIndex: 'sending_method',
            valueType: 'checkbox',
            fieldProps: {
                options: phoneMethodType,
            },
        },
    ];

    return (
        <ProTable<TelephoneListItem>
            columns={columns}
            dataSource={data}
            rowKey={() => nanoid()}
            pagination={{
                showQuickJumper: true,
            }}
            toolBarRender={false}
            search={false}
            scroll={{
                x: 700,
            }}
        />
    );
};

export default AuthorizeContactList;
