import React, { FC, useRef, useState, useCallback, useEffect } from 'react';
import {
    ModalForm,
    ProTable,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message, Row, Col, Descriptions } from 'antd';
import type { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import AddAccountForm from './AddAccountForm';
import { useHttp, useLatest } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import {
    selectAccountInfo,
    selectCreditDetailList,
} from '@/store/account/accountSlice';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import { creditApproval, getCreditDetailList } from '@/api/accountAction';
import {
    CreditApprovalParams,
    CreditDetailListItem,
    GetCreditDetailListParams,
} from '@/types/api/accountAction';
import VerifierPassword from '@/pages/AccountManagement/components/VerifierPassword';
import { MemberCodeListItem } from '@/types/api/account';
import { markerType } from '@/common/commonConstType';
import FormCurrency from '@/components/Currency/FormCurrency';
import Currency from '@/components/Currency';

type ShareholdersCreditFormProps = {
    currency: number;
};
type CreditQuotaListProps = {
    member_code: string;
    quotaList: CreditDetailListItem[];
};

const CreditQuotaList: FC<CreditQuotaListProps> = ({
    member_code,
    quotaList,
}) => {
    const columns: ProColumns<CreditDetailListItem>[] = [
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
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.total_amount.toString()}></Currency>
                );
            },
        },
        {
            dataIndex: 'available_amount',
            title: '可用额度(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.available_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'used_amount',
            title: '已用额度(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.used_amount.toString()}></Currency>
                );
            },
        },
        {
            dataIndex: 'approve_amount',
            title: '下批额度(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.approve_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'signed_amount',
            title: '已签额度(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.signed_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'overdue_amount',
            title: '逾期金额(万)',
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.overdue_amount.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'penalty',
            title: '罚息(万)',
            render: (text, record, _, action) => {
                return <Currency value={record.penalty.toString()}></Currency>;
            },
        },

        {
            dataIndex: 'count',
            title: '逾期次数',
        },
    ];
    return (
        <div
            style={{
                marginBottom: '60px',
            }}
        >
            <Descriptions>
                <Descriptions.Item label="户口">
                    {member_code}
                </Descriptions.Item>
            </Descriptions>

            <ProTable<CreditDetailListItem>
                columns={columns}
                dataSource={quotaList}
                rowKey={(item) => item.marker_type}
                pagination={false}
                toolBarRender={false}
                search={false}
                scroll={{ x: 1200 }}
            />
        </div>
    );
};

const ShareholdersCreditForm: FC<ShareholdersCreditFormProps> = ({
    currency,
}) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const currentHall = useAppSelector(selectCurrentHall);
    const creditDetailList = useAppSelector(selectCreditDetailList);
    const formRef = useRef<ProFormInstance>();
    const [accountVisible, setAccountVisible] = useState(false);
    const currencyList = useAppSelector(selectCurrencyList);
    const [memberInfo, setMemberInfo] = useState<MemberCodeListItem>(
        {} as MemberCodeListItem,
    );
    const [onlineCreditList, setOnlineCreditList] = useState<
        CreditDetailListItem[]
    >([]);

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        hall: currentHall.hall_name,
        currency: currency,
    }).current;

    const { fetchData: _fetchCreditApproval } = useHttp<
        CreditApprovalParams,
        null
    >(creditApproval, ({ msg }) => {
        message.success(msg);
    });

    const handleAccountVisible = useCallback((visible: boolean) => {
        setAccountVisible(visible);
    }, []);

    const setAccountInfo = (val: MemberCodeListItem) => {
        setMemberInfo(val);
    };

    const { fetchData: _fetchCreditDetailList } = useHttp<
        GetCreditDetailListParams,
        CreditDetailListItem[]
    >(getCreditDetailList);

    const handleCreditApproval = async (values: any) => {
        if (
            values.verifier_pass === undefined &&
            values.phone_verifier_pass === undefined
        ) {
            message.error('请先验证');
            return;
        }
        if (!(values.verifier_pass || values.phone_verifier_pass)) {
            message.error('验证不通过，不能操作');
            return;
        }

        const params = {
            hall: currentHall.hall_name,
            hall_id: currentHall.id,
            to_member: values.from_code,
            amount: +values.amount,
            from_member: accountInfo.member_code,
            remark: values.remark,
            currency: values.currency,
        };
        const res = await _fetchCreditApproval(params);
        if (res?.code === 10000) {
            return true;
        }
    };

    useEffect(() => {
        if (Object.keys(memberInfo).length > 0) {
            formRef.current?.setFieldsValue({
                from_code: memberInfo.member_code,
                from_name: memberInfo.member_name,
            });
            if (currency) {
                _fetchCreditDetailList({
                    currency: currency,
                    member_code: memberInfo.member_code,
                }).then((res) => {
                    setOnlineCreditList(res.data ?? []);
                });
            }
        }
    }, [_fetchCreditDetailList, currency, memberInfo]);

    return (
        <div>
            <ModalForm
                trigger={<Button type="primary">股东授信</Button>}
                onFinish={handleCreditApproval}
                title="股东授信"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                width={1000}
                initialValues={updatedValues}
                formRef={formRef}
                onVisibleChange={(visible) => {
                    if (!visible) {
                        setMemberInfo({} as MemberCodeListItem);
                        setOnlineCreditList([]);
                    }
                }}
            >
                <Row wrap={false}>
                    <Col span={10}>
                        <ProFormText
                            width="md"
                            name="hall"
                            label="场馆"
                            disabled
                        />
                        <ProFormText
                            width="md"
                            name="member_code"
                            label="户口"
                            disabled
                        />
                        <ProFormText
                            width="md"
                            name="member_name"
                            label="户名"
                            disabled
                        />
                        <ProFormSelect
                            name="currency"
                            label="币种"
                            width="md"
                            placeholder="请选择币种"
                            options={currencyList}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择币种',
                                },
                            ]}
                            disabled
                        />
                        <ProFormText
                            name="from_code"
                            label="受额户口"
                            width={260}
                            placeholder="请选择受额户口"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择受额户口',
                                },
                            ]}
                            addonAfter={
                                <Button
                                    type="primary"
                                    onClick={() => handleAccountVisible(true)}
                                >
                                    添加
                                </Button>
                            }
                            disabled
                        />
                        <ProFormText
                            width="md"
                            name="from_name"
                            label="受额户名"
                            placeholder="请选择受额户口"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择受额户口',
                                },
                            ]}
                            disabled
                        />

                        <FormCurrency
                            width="md"
                            name="amount"
                            label="调整后额度"
                            placeholder="请输入调整后额度"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入调整后额度',
                                },
                            ]}
                        />
                        <VerifierPassword
                            formRef={formRef}
                            for="股东授信"
                            identity_module={8}
                        ></VerifierPassword>
                        <ProFormTextArea
                            name="remark"
                            label="备注"
                            width="md"
                            placeholder="请输入备注"
                            fieldProps={{
                                maxLength: 100,
                            }}
                        />
                    </Col>
                    <Col
                        span={14}
                        style={{
                            padding: '0 20px 0 0',
                        }}
                    >
                        <CreditQuotaList
                            member_code={accountInfo.member_code}
                            quotaList={creditDetailList.filter(
                                (item) => item.marker_type === 3,
                            )}
                        ></CreditQuotaList>

                        {onlineCreditList?.length > 0 && (
                            <CreditQuotaList
                                member_code={memberInfo.member_code}
                                quotaList={onlineCreditList.filter(
                                    (item) => item.marker_type === 1,
                                )}
                            ></CreditQuotaList>
                        )}

                        <AddAccountForm
                            visible={accountVisible}
                            onCancel={() => handleAccountVisible(false)}
                            setAccountInfo={setAccountInfo}
                        ></AddAccountForm>
                    </Col>
                </Row>
            </ModalForm>
        </div>
    );
};

export default ShareholdersCreditForm;
