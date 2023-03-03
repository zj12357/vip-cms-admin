import React, { FC } from 'react';
import {
    ProFormText,
    ModalForm,
    ProFormSelect,
} from '@ant-design/pro-components';
import {
    identityModule,
    memberIdentityType,
    identityStatus,
    identityWay,
} from '@/common/commonConstType';
import moment from 'moment';

type Props = {
    record: any;
    triggerDom: JSX.Element;
};
const DetailModal: FC<Props> = (props) => {
    const { triggerDom, record } = props;

    return (
        <ModalForm
            trigger={triggerDom}
            title={'验证记录详情'}
            layout="horizontal"
            readonly
            grid
            initialValues={record}
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
                name="id"
                label="验证编号"
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
            <ProFormText
                name="created_at"
                label="验证时间"
                convertValue={(val) => {
                    return moment(record.created_at * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                    );
                }}
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProFormSelect
                name="member_identity"
                label="验证人身份"
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
                options={memberIdentityType}
            />
            <ProFormSelect
                name="identity_module"
                label="验证模块"
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
                options={identityModule}
            />
            <ProFormText
                name="member_name"
                label="验证人名称"
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProFormSelect
                name="identity_status"
                label="验证状态"
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
                options={identityStatus}
            />
            <ProFormSelect
                name="identity_way"
                label="验证方式"
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
                options={identityWay}
            />
            <ProFormText
                name="dealer"
                label="经手人"
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
        </ModalForm>
    );
};

export default DetailModal;
