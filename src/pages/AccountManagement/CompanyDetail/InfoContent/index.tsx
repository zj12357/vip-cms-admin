import React, { FC } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Descriptions, message } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { AccountActionListLeft } from '@/pages/AccountManagement/components/CommonDetail/AccountActionList';

type InfoContentProps = {};

const InfoContent: FC<InfoContentProps> = (props) => {
    const accountInfo = useAppSelector(selectAccountInfo);

    return (
        <ProCard
            style={{
                marginTop: '50px',
            }}
            className="m-primary-card-background"
        >
            <div>
                <Descriptions>
                    <Descriptions.Item label="户口">
                        {accountInfo.member_code}
                    </Descriptions.Item>
                    <Descriptions.Item label="户口类型">
                        公司户口
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                    <Descriptions.Item label="户名">
                        {accountInfo.member_name}
                    </Descriptions.Item>
                </Descriptions>

                <Descriptions>
                    <Descriptions.Item label="备注">
                        {accountInfo.remark}
                    </Descriptions.Item>
                </Descriptions>
            </div>
            <AccountActionListLeft />
        </ProCard>
    );
};

export default InfoContent;
