import React, {
    FC,
    useState,
    memo,
    useCallback,
    useRef,
    useEffect,
    useMemo,
} from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import type {
    ProColumns,
    ProFormInstance,
    ActionType,
} from '@ant-design/pro-components';
import {
    Button,
    message,
    Row,
    Col,
    Modal,
    Form,
    Input,
    Descriptions,
} from 'antd';
import VerifierPassword from '@/pages/AccountManagement/components/VerifierPassword';
import { useHttp, useLatest } from '@/hooks';
import {
    accountTrade,
    getDepositorList,
    getMemberCodeList,
} from '@/api/account';
import {
    AccountTradeParams,
    DepositorListItem,
    MemberCodeListItem,
    GetMemberCodeParams,
} from '@/types/api/account';
import { useAppSelector } from '@/store/hooks';
import {
    selectAccountInfo,
    selectAccountType,
} from '@/store/account/accountSlice';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import TradeTable from '@/pages/AccountManagement/components/TradeTable';
import UpAndDownTable from './UpAndDownTable';
import FormCurrency from '@/components/Currency/FormCurrency';
import AuthButton from '@/components/AuthButton';
import usePrint from '@/hooks/usePrint';
import { OfficialDataProps } from '@/hooks/usePrint/print';
import { selectUserName } from '@/store/user/userSlice';
import { formatCurrency } from '@/utils/tools';
import { transferType } from '@/common/commonConstType';

type TransferProps = {};

interface AddTransferAccountProps {
    visible: boolean;
    onCancel: () => void;
    setAccountInfo: (params: MemberCodeListItem) => void;
}

const AddTransferAccount: FC<AddTransferAccountProps> = memo(
    ({ visible, onCancel, setAccountInfo }) => {
        const tableRef = useRef<ActionType>();

        const [searchValue, setSearchValue] = useState('');
        const [memberValue, setMemberValue] = useState<MemberCodeListItem>(
            {} as MemberCodeListItem,
        );

        const { fetchData: _fetchMemberCodeList } = useHttp<
            GetMemberCodeParams,
            MemberCodeListItem[]
        >(getMemberCodeList);

        const SearchAccount = () => {
            const onFinish = (values: any) => {
                setSearchValue(values.search_value);
            };

            return (
                <Row>
                    <Col span={6}>添加户口</Col>
                    <Col>
                        <Form
                            onFinish={onFinish}
                            style={{
                                display: 'flex',
                            }}
                        >
                            <Form.Item
                                name="search_value"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入户口号/户口名',
                                    },
                                ]}
                                initialValue={searchValue}
                            >
                                <Input
                                    placeholder="请输入户口号/户口名"
                                    style={{ width: '300px' }}
                                />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                                <Row wrap={false}>
                                    <Col>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            搜索
                                        </Button>
                                    </Col>

                                    <Col offset={2}>
                                        <Button
                                            type="primary"
                                            htmlType="reset"
                                            onClick={() => setSearchValue('')}
                                        >
                                            重置
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            );
        };
        const columns: ProColumns<MemberCodeListItem>[] = [
            {
                dataIndex: 'member_type',
                title: '户口类型',
                valueType: 'select',
                fieldProps: {
                    fieldNames: {
                        options: transferType,
                    },
                },
            },
            {
                dataIndex: 'member_code',
                title: '户口号',
            },
            {
                dataIndex: 'member_name',
                title: '户口名',
            },
        ];

        const handleOk = () => {
            if (!searchValue) {
                message.error('请先输入户口号进行搜索');
                return;
            }
            setAccountInfo(memberValue);
            handleCancel();
        };
        const handleCancel = () => {
            onCancel();
            setSearchValue('');
        };

        return (
            <Modal
                title={<SearchAccount></SearchAccount>}
                visible={visible}
                onCancel={handleCancel}
                width={800}
                onOk={handleOk}
                zIndex={9999}
                destroyOnClose
            >
                <div
                    style={{
                        maxHeight: '65vh',
                        overflowY: 'auto',
                    }}
                >
                    <ProTable
                        columns={columns}
                        headerTitle={false}
                        search={false}
                        options={false}
                        request={async (params: any) => {
                            if (!params.member_code) {
                                return {
                                    data: [],
                                };
                            }

                            const res = await _fetchMemberCodeList({
                                member_code: params.member_code,
                            });
                            return {
                                data: res.data,
                                success: true,
                            };
                        }}
                        params={{
                            member_code: searchValue,
                        }}
                        pagination={false}
                        rowSelection={{
                            alwaysShowAlert: false,
                            type: 'radio',
                            onSelect: (val) => {
                                setMemberValue(val);
                            },
                        }}
                        actionRef={tableRef}
                        rowKey={(record) => record.member_id}
                    />
                </div>
            </Modal>
        );
    },
);

const TransferForm: FC<TransferProps> = (props) => {
    const userName = useAppSelector(selectUserName);
    const { RegisterPrint, handlePrint } =
        usePrint<OfficialDataProps>('Official');

    const [accountVisible, setAccountVisible] = useState(false);
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数

    const [tabActiveKey, setTabActiveKey] = useState('1');
    const [memberInfo, setMemberInfo] = useState<MemberCodeListItem>(
        {} as MemberCodeListItem,
    );
    const [isPass, setIsPass] = useState(false); //操作码是否通过

    const accountInfo = useAppSelector(selectAccountInfo);
    const currencyList = useAppSelector(selectCurrencyList);
    const currentHall = useAppSelector(selectCurrentHall);
    const accountType = useAppSelector(selectAccountType);
    const handleAccountVisible = useCallback((visible: boolean) => {
        setAccountVisible(visible);
    }, []);

    const setAccountInfo = (val: MemberCodeListItem) => {
        setMemberInfo(val);
    };
    const formRef = useRef<ProFormInstance>();

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        hall: currentHall.hall_name,
    }).current;

    const { fetchData: _fetchAccountTrade } = useHttp<AccountTradeParams, null>(
        accountTrade,
        ({ msg }) => {
            message.success(msg);
        },
    );

    const { fetchData: _fetchDepositorList } = useHttp<
        string,
        DepositorListItem[]
    >(getDepositorList);

    const handleAccountTrade = async (values: any) => {
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
            member_id: accountInfo.member_id,
            member_code: accountInfo.member_code,
            member_name: accountInfo.member_name,
            currency_id: +values.currency_id,
            currency_code:
                currencyList.find((item) => +item.value === +values.currency_id)
                    ?.label ?? '',
            amount: values.amount,
            trade_account: values.trade_account,
            payee_member_code: values.payee_member_code,
            payee_member_name: values.payee_member_name,
            hall: currentHall.id,
            hall_name: currentHall.hall_name,
            describe: values.describe,
            type: 3,
        };

        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await _fetchAccountTrade(doubleParams);

        if (res.code === 10000) {
            let data: any = res.data;
            handlePrint(
                {
                    name: doubleParams.member_name,
                    account: doubleParams.member_code,
                    type: '转账/转出',
                    currency: doubleParams.currency_code,
                    amountCapital: `Transfer to ${doubleParams.member_code} ${
                        doubleParams.member_name
                    } ${formatCurrency(doubleParams.amount) * 10000}`,
                    amountCurrency: `转出到 ${doubleParams.member_code}${
                        doubleParams.member_name
                    } ${formatCurrency(doubleParams.amount)}万`,
                    remark: doubleParams.describe,
                    manager: userName,
                    id: data.id,
                },
                undefined,
                {
                    onAfterPrint: () => {
                        handlePrint({
                            name: doubleParams.payee_member_name,
                            account: doubleParams.payee_member_code,
                            type: '转账/转入',
                            currency: doubleParams.currency_code,
                            amountCapital: `${
                                formatCurrency(doubleParams.amount) * 10000
                            } Transfer from ${doubleParams.payee_member_code} ${
                                doubleParams.payee_member_name
                            }`,
                            amountCurrency: `${formatCurrency(
                                doubleParams.amount,
                            )}万 由${doubleParams.payee_member_code}${
                                doubleParams.payee_member_name
                            } 转入`,
                            remark: doubleParams.describe,
                            manager: userName,
                            id: data.id,
                        });
                    },
                },
            );

            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
        }
    };

    useEffect(() => {
        if (Object.keys(memberInfo).length > 0) {
            formRef.current?.setFieldsValue({
                payee_member_code: memberInfo.member_code,
                payee_member_name: memberInfo.member_name,
            });
        }
    }, [memberInfo]);

    const TransferTab = useMemo(() => {
        return (
            <Row wrap={false}>
                <Col span={10}>
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
                    <Row justify="start" align="middle" wrap={false}>
                        <ProFormText
                            width={150}
                            name="trade_account"
                            label="转账人"
                            placeholder="请输入转账人"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入转账人',
                                },
                            ]}
                        />
                        <div
                            style={{
                                marginLeft: '28px',
                                position: 'relative',
                                top: '16px',
                            }}
                        >
                            <ProFormSelect
                                name="depositor"
                                width={150}
                                placeholder="请选择转账人"
                                fieldProps={{
                                    getPopupContainer: (triggerNode) =>
                                        triggerNode.parentNode,
                                    onChange: (val, option) => {
                                        formRef.current?.setFieldsValue({
                                            trade_account: val,
                                        });
                                    },
                                }}
                                request={async () => {
                                    const res = await _fetchDepositorList(
                                        accountInfo.member_id,
                                    );
                                    return (res.data ?? []).map((item) => {
                                        return {
                                            label: item,
                                            value: item,
                                        };
                                    }) as any;
                                }}
                                showSearch
                            />
                        </div>
                    </Row>
                    <ProFormText
                        width={250}
                        name="payee_member_code"
                        label="收款户口"
                        placeholder="请选择收款户口"
                        addonAfter={
                            <Button
                                type="primary"
                                onClick={() => handleAccountVisible(true)}
                            >
                                添加
                            </Button>
                        }
                        rules={[
                            {
                                required: true,
                                message: '请选择收款户口',
                            },
                        ]}
                        disabled
                    />
                    <ProFormText
                        width="md"
                        name="payee_member_name"
                        label="收款户名"
                        placeholder="请选择收款户名"
                        rules={[
                            {
                                required: true,
                                message: '请选择收款户名',
                            },
                        ]}
                        disabled
                    />
                    <ProFormSelect
                        name="currency_id"
                        label="转账币种"
                        width="md"
                        options={currencyList}
                        placeholder="请选择转账币种"
                        rules={[
                            {
                                required: true,
                                message: '请选择转账币种',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                        }}
                        showSearch
                    />
                    <FormCurrency
                        width="md"
                        name="amount"
                        label="转账金额"
                        placeholder="请输入转账金额"
                        rules={[
                            {
                                required: true,
                                message: '请输入转账金额',
                            },
                        ]}
                    />
                    <VerifierPassword
                        formRef={formRef}
                        for="转账"
                        identity_module={2}
                    ></VerifierPassword>
                    <ProFormTextArea
                        width="md"
                        name="describe"
                        label="备注"
                        placeholder="请输入备注"
                        fieldProps={{
                            maxLength: 100,
                        }}
                    />
                </Col>
                <Col span={14}>
                    <ProFormText width="md" name="hall" label="场馆" disabled />
                    <TradeTable></TradeTable>
                </Col>
            </Row>
        );
    }, [
        _fetchDepositorList,
        accountInfo.member_id,
        currencyList,
        handleAccountVisible,
    ]);

    const UpAndDown = memo(() => {
        const tradeTableRef = useRef<any>();
        const handleReloadData = useCallback(() => {
            tradeTableRef?.current?.reload();
        }, []);

        return (
            <div>
                <ProForm.Group>
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
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText width="md" name="hall" label="场馆" disabled />
                </ProForm.Group>
                <TradeTable ref={tradeTableRef}></TradeTable>
                <UpAndDownTable
                    handleReloadData={handleReloadData}
                ></UpAndDownTable>
            </div>
        );
    });

    useEffect(() => {
        if (!isPass) {
            setTabActiveKey('1');
            setAccountInfo({} as MemberCodeListItem);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPass]);

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal="customerAccount-transfer"
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        buttonProps={{
                            type: 'primary',
                        }}
                        firstVisible={isPass}
                        isSecond={true}
                        secondDom={
                            <Descriptions column={24}>
                                <Descriptions.Item label="户口" span={12}>
                                    {accountInfo?.member_code}
                                </Descriptions.Item>
                                <Descriptions.Item label="户名" span={12}>
                                    {accountInfo?.member_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="币种" span={12}>
                                    {currencyList.find(
                                        (item) =>
                                            +item.value ===
                                            +doubleParams.currency_id,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="金额" span={12}>
                                    {formatCurrency(doubleParams.amount)}万
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        secondVerify={(val) => {
                            if (val) {
                                handleDoubleSuccess();
                            }
                        }}
                        secondVisible={doubleVisible}
                        secondOnClose={() => setDoubleVisible(false)}
                    ></AuthButton>
                }
                onFinish={handleAccountTrade}
                title="转账"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setIsPass(false);
                        setDoubleVisible(false);
                        setDoubleParams({});
                    },
                }}
                width={1100}
                initialValues={updatedValues}
                formRef={formRef}
                visible={isPass}
                // submitter={tabActiveKey === '2' ? false : undefined}
            >
                {TransferTab}
                {/* <Tabs
                    activeKey={tabActiveKey}
                    onChange={(val) => {
                        setTabActiveKey(val);
                    }}
                    type="card"
                    destroyInactiveTabPane
                >
                    <Tabs.TabPane tab="转账" key="1">
                        {tabActiveKey === '1' && TransferTab}
                    </Tabs.TabPane>
                    {accountType === 2 && (
                        <Tabs.TabPane tab="上下分" key="2">
                            {tabActiveKey === '2' && <UpAndDown></UpAndDown>}
                        </Tabs.TabPane>
                    )}
                </Tabs> */}
            </ModalForm>
            <AddTransferAccount
                visible={accountVisible}
                onCancel={() => handleAccountVisible(false)}
                setAccountInfo={setAccountInfo}
            ></AddTransferAccount>
            <RegisterPrint />
        </div>
    );
};

export default TransferForm;
