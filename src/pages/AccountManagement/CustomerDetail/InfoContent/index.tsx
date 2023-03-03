import React, { FC, useEffect } from 'react';
import { ProCard, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Descriptions, Tag, Row, Col, Button } from 'antd';
import moment from 'moment';
import { useHttp } from '@/hooks';
import { getLabelList } from '@/api/account';
import { AccountInfoTelephoneListItem } from '@/types/api/account';
import { handleTagClor } from '@/common/commonHandle';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import { genderType } from '@/common/commonConstType';
import AuthButton from '@/components/AuthButton';
import ShowText from '@/components/Opcode/ShowText';
import ShowModal from '@/components/Opcode/ShowModal';
import { AccountActionListLeft } from '@/pages/AccountManagement/components/CommonDetail/AccountActionList';
import { usePhone } from '@/pages/Communication/Telephone/CallModal/usePhone';
type InfoContentProps = {};

const InfoContent: FC<InfoContentProps> = (props) => {
    const { onDial } = usePhone();
    const accountInfo = useAppSelector(selectAccountInfo);

    const { fetchData: _fetchGetLabelList, response: tagList = [] } = useHttp<
        string,
        string[]
    >(getLabelList);

    const columns: ProColumns<AccountInfoTelephoneListItem, any>[] = [
        {
            title: '电话验证',
            colSpan: 2,
            dataIndex: 'telephone',
            valueType: 'encryption',
            onCell: (_, index) => {
                if (index === 1) {
                    return { rowSpan: 1 };
                }
                return {};
            },
        },
        {
            title: 'Action',
            colSpan: 0,
            dataIndex: 'action',
            render: (_, { telephone }) => {
                return (
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            onDial(telephone);
                        }}
                    >
                        呼叫
                    </Button>
                );
            },
        },
    ];

    useEffect(() => {
        _fetchGetLabelList(accountInfo.member_id);
    }, [_fetchGetLabelList, accountInfo.member_id]);

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
                        {accountInfo?.member_code}
                    </Descriptions.Item>
                    <Descriptions.Item label="上线户口">
                        {accountInfo?.parent_member_code || '-'}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                    <Descriptions.Item label="户名">
                        {accountInfo?.member_name}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                    <Descriptions.Item label="标签">
                        <Row>
                            {tagList?.map(
                                (item, index) =>
                                    item && (
                                        <Col key={index}>
                                            <Tag
                                                color={handleTagClor(
                                                    index.toString(),
                                                )}
                                                style={{ marginBottom: '5px' }}
                                                key={index}
                                            >
                                                {item}
                                            </Tag>
                                        </Col>
                                    ),
                            )}
                        </Row>
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                    <Descriptions.Item label="姓名">
                        {accountInfo?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="证件信息">
                        <AuthButton
                            buttonProps={{
                                type: 'primary',
                                size: 'small',
                            }}
                            childrenType="modal"
                            normal="customerAccount-certificate-check"
                        >
                            <ShowModal
                                title="证件信息"
                                infoType="certificate"
                                data={accountInfo.grade_list}
                            ></ShowModal>
                        </AuthButton>
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                    <Descriptions.Item label="性别">
                        {genderType.find(
                            (item) => item.value === accountInfo.gender,
                        )?.label ?? ''}
                    </Descriptions.Item>
                    <Descriptions.Item label="联系方式">
                        <AuthButton
                            buttonProps={{
                                type: 'primary',
                                size: 'small',
                            }}
                            childrenType="modal"
                            normal="customerAccount-contact-check"
                        >
                            <ShowModal
                                infoType="contact"
                                title="联系方式"
                                data={accountInfo.telephone_list?.map(
                                    (item) => {
                                        return {
                                            ...item,
                                            sending_method: item.sending_method
                                                ?.split(',')
                                                ?.map((v) => +v),
                                        };
                                    },
                                )}
                            ></ShowModal>
                        </AuthButton>
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                    <Descriptions.Item label="生日">
                        <AuthButton
                            buttonProps={{
                                type: 'primary',
                                size: 'small',
                            }}
                            childrenType="text"
                            normal="customerAccount-birthday-check"
                        >
                            <ShowText
                                data={
                                    accountInfo?.birthday
                                        ? moment
                                              .unix(accountInfo?.birthday)
                                              .format('YYYY-MM-DD')
                                        : '-'
                                }
                                title="生日"
                            ></ShowText>
                        </AuthButton>
                    </Descriptions.Item>
                    <Descriptions.Item label="地址">
                        <AuthButton
                            buttonProps={{
                                type: 'primary',
                                size: 'small',
                            }}
                            childrenType="text"
                            normal="customerAccount-address-check"
                        >
                            <ShowText
                                data={accountInfo.address}
                                title="地址"
                            ></ShowText>
                        </AuthButton>
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                    <Descriptions.Item label="国籍">
                        <AuthButton
                            buttonProps={{
                                type: 'primary',
                                size: 'small',
                            }}
                            childrenType="text"
                            normal="customerAccount-country-check"
                        >
                            <ShowText
                                data={accountInfo.country}
                                title="国籍"
                            ></ShowText>
                        </AuthButton>
                    </Descriptions.Item>
                    <Descriptions.Item label="照片">
                        <AuthButton
                            buttonProps={{
                                type: 'primary',
                                size: 'small',
                            }}
                            childrenType="modal"
                            normal="customerAccount-photo-check"
                        >
                            <ShowModal
                                title="照片"
                                infoType="photo"
                                data={accountInfo.photo_list}
                            ></ShowModal>
                        </AuthButton>
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                    <Descriptions.Item label="开户场馆">
                        {accountInfo?.hall_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="客户助理">
                        {accountInfo?.customer_assistant}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                    <Descriptions.Item label="开户时间">
                        {accountInfo?.created_at
                            ? moment
                                  .unix(accountInfo?.created_at)
                                  .format('YYYY-MM-DD HH:mm:ss')
                            : '-'}
                    </Descriptions.Item>
                </Descriptions>
            </div>
            <div
                style={{
                    marginTop: '40px',
                }}
            >
                <ProTable<AccountInfoTelephoneListItem>
                    columns={columns}
                    dataSource={accountInfo.telephone_list}
                    bordered
                    pagination={false}
                    rowKey={(item) => item.phone_id}
                    search={false}
                    toolBarRender={false}
                />
            </div>
            <AccountActionListLeft />
        </ProCard>
    );
};

export default InfoContent;
