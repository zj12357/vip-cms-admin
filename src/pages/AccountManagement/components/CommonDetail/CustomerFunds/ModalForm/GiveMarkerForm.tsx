import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormTextArea,
    EditableProTable,
    ProFormSelect,
    ProFormRadio,
} from '@ant-design/pro-components';
import type {
    ProColumns,
    ProFormInstance,
    ActionType,
} from '@ant-design/pro-components';
import { Button, message, Row, Col, Popconfirm, Descriptions } from 'antd';
import VerifierPassword from '@/pages/AccountManagement/components/VerifierPassword';
import { useLatest, useHttp } from '@/hooks';
import { repayMarker, getMemberByCode, repayMarkerfree } from '@/api/account';
import { RepayMarkerParams, MemberByCodeItem } from '@/types/api/account';
import { getSignedList } from '@/api/accountAction';
import {
    GetSignedListParams,
    SignedListItem,
    SignedListType,
} from '@/types/api/accountAction';
import { markerType } from '@/common/commonConstType';
import { useAppSelector } from '@/store/hooks';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import { selectAccountInfo } from '@/store/account/accountSlice';
import Big from 'big.js';
import { isPositiveNumber } from '@/utils/validate';
import Currency from '@/components/Currency';
import FormCurrency from '@/components/Currency/FormCurrency';
import AuthButton from '@/components/AuthButton';
import { formatCurrency } from '@/utils/tools';

type GiveMarkerProps = {};

const GiveMarkerList: FC<{
    currentMarkerType?: number;
    currentCurrency: number;
    handleSignedList: (list: SignedListItem[]) => void;
}> = ({ currentMarkerType, handleSignedList, currentCurrency }) => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const currencyList = useAppSelector(selectCurrencyList);
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const tableRef = useRef<ActionType>();

    const { fetchData: _fetchSignedList } = useHttp<
        GetSignedListParams,
        SignedListType
    >(getSignedList);

    const { fetchData: _fetchRepayMarkerfree } = useHttp<string, null>(
        repayMarkerfree,
        ({ msg }) => {
            message.success(msg);
        },
    );

    const columns: ProColumns<SignedListItem, any>[] = [
        {
            dataIndex: 'marker_type',
            title: '??????',
            valueType: 'select',
            fieldProps: {
                options: markerType,
            },
            hideInSearch: true,
            editable: false,
        },

        {
            dataIndex: 'signed_at',
            valueType: 'milliDateTime',
            title: '???M??????',
            editable: false,
        },
        {
            title: '??????',
            dataIndex: 'currency',
            valueType: 'select',
            fieldProps: {
                placeholder: '???????????????',
                options: currencyList,
            },
            editable: false,
        },
        {
            dataIndex: 'left_amount',
            title: '???M??????(???)',
            editable: false,
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.left_amount.toString()}></Currency>
                );
            },
        },
        {
            dataIndex: 'left_interest',
            title: '??????(???)',
            editable: false,
            render: (text, record, _, action) => {
                return (
                    <Currency
                        value={record.left_interest.toString()}
                    ></Currency>
                );
            },
        },
        {
            dataIndex: 'signed_day',
            title: '????????????',
            editable: false,
        },
        {
            dataIndex: 'expired_day',
            title: '????????????',
            editable: false,
        },
        {
            dataIndex: 'expired_date',
            title: '????????????',
            editable: false,
        },
        {
            dataIndex: 'markerAmount',
            title: '????????????',
            formItemProps: {
                rules: [
                    {
                        pattern: isPositiveNumber,
                        message: '???????????????',
                    },
                    {
                        required: true,
                        message: '?????????????????????',
                    },
                ],
            },
            renderFormItem: () => {
                return <FormCurrency></FormCurrency>;
            },
            width: 150,
        },
        {
            dataIndex: 'interestAmount',
            title: '????????????',
            formItemProps: {
                rules: [
                    {
                        pattern: isPositiveNumber,
                        message: '???????????????',
                    },
                    {
                        required: true,
                        message: '?????????????????????',
                    },
                ],
            },
            renderFormItem: () => {
                return <FormCurrency></FormCurrency>;
            },
            width: 150,
        },
        {
            valueType: 'option',
            title: '??????',
            width: 150,
            render: (text, record, _, action) => [
                record.marker_state === 1 && (
                    <div
                        key="editable"
                        className="m-primary-font-color pointer"
                        onClick={() => {
                            action?.startEditable?.(record.id);
                        }}
                    >
                        ??????
                    </div>
                ),
                record.marker_state === 1 && record.left_interest > 0 && (
                    <Popconfirm
                        key="detele"
                        title="???????????????????????????"
                        onConfirm={() => {
                            handleRepayMarkerfree(record.id);
                        }}
                        okText="??????"
                        cancelText="??????"
                    >
                        <div className="m-primary-font-color pointer">
                            ?????????
                        </div>
                    </Popconfirm>
                ),
            ],
        },
    ];

    const handleRepayMarkerfree = (id: string) => {
        _fetchRepayMarkerfree(id);
        reloadData();
    };

    const reloadData = useCallback(() => {
        //??????????????????
        tableRef.current?.reload();
    }, []);

    return (
        <EditableProTable<SignedListItem>
            columns={columns}
            request={async (params) => {
                if (currentMarkerType) {
                    const res = await _fetchSignedList({
                        member_code:
                            params.member_code || accountInfo.member_code,
                        currency: params.currency,
                        marker_type: params.marker_type,
                        page: params.current ?? 1,
                        size: params.pageSize ?? 20,
                        state: 1,
                    });

                    return {
                        data: res.data?.list ?? [],
                        total: res.data?.total ?? 0,
                        success: true,
                    };
                } else {
                    return {
                        data: [],
                        total: 0,
                        success: true,
                    };
                }
            }}
            params={{
                marker_type: currentMarkerType,
                currency: currentCurrency,
            }}
            pagination={{
                showQuickJumper: true,
            }}
            toolBarRender={false}
            search={false}
            scroll={{ x: 1400 }}
            onChange={(list) => {
                handleSignedList(list);
            }}
            editable={{
                type: 'single',
                editableKeys,
                onSave: async (rowKey, data, row) => {},
                onChange: setEditableRowKeys,
                actionRender: (row, config, dom) => [dom.save, dom.cancel],
            }}
            rowKey={(item) => item.id}
            recordCreatorProps={false}
            actionRef={tableRef}
        />
    );
};
const GiveMarkerForm: FC<GiveMarkerProps> = () => {
    const accountInfo = useAppSelector(selectAccountInfo);
    const currentHall = useAppSelector(selectCurrentHall);
    const currencyList = useAppSelector(selectCurrencyList);
    const formRef = useRef<ProFormInstance>();
    const [isPass, setIsPass] = useState(false); //?????????????????????
    const [doubleVisible, setDoubleVisible] = useState(false); //????????????
    const [doubleParams, setDoubleParams] = useState<any>({}); //???????????????????????????
    const [showParams, setShowParams] = useState<any>({}); //?????????????????????????????????

    const [currentMarkerType, setCurrentMarkerType] = useState<number>();
    const [signedList, setSignedList] = useState<SignedListItem[]>();
    //????????????
    const [currentCurrency, setCurrentCurrency] = useState<number>(
        currencyList?.[0]?.value,
    );

    const updatedValues = useLatest({
        member_code: accountInfo.member_code,
        member_name: accountInfo.member_name,
        hall: currentHall.hall_name,
        currency: currentCurrency,
    }).current;

    const { fetchData: _fetchGetMemberByCode, response: memberList } = useHttp<
        string,
        MemberByCodeItem[]
    >(getMemberByCode);

    const { fetchData: _fetchRepayMarker } = useHttp<RepayMarkerParams, null>(
        repayMarker,
        ({ msg }) => {
            message.success(msg);
        },
    );

    const handleRepayMarker = async (values: any) => {
        if (
            values.verifier_pass === undefined &&
            values.phone_verifier_pass === undefined
        ) {
            message.error('????????????');
            return;
        }
        if (!(values.verifier_pass || values.phone_verifier_pass)) {
            message.error('??????????????????????????????');
            return;
        }

        const params = {
            remark: values.remark,
            member_code: values.my_member_code,
            param:
                signedList?.map((item) => {
                    return {
                        id: item.id,
                        marker_type: values.marker_type,
                        repay_model: values.repay_model,
                        marker_amount: item.markerAmount,
                        interest_amount: item.interestAmount,
                    };
                }) ?? [],
        };
        setDoubleParams(params);
        setShowParams(values);
        setDoubleVisible(true);
    };
    const handleDoubleSuccess = async () => {
        const res = await _fetchRepayMarker(doubleParams);

        if (res.code === 10000) {
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
            setShowParams({});
        }
    };

    useEffect(() => {
        if (signedList?.length) {
            const toSum = () => {
                return signedList?.reduce(
                    (prev: number, cur: SignedListItem) =>
                        Number(
                            new Big(prev)
                                .plus(cur.markerAmount ?? 0)
                                .plus(cur.interestAmount ?? 0),
                        ),
                    0,
                );
            };
            formRef.current?.setFieldsValue({
                totalAmount: toSum(),
            });
        }
    }, [signedList]);

    useEffect(() => {
        if (!isPass) {
            setCurrentMarkerType(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPass]);

    return (
        <div>
            <ModalForm
                trigger={
                    <AuthButton
                        normal="customerAccount-giveMarker"
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
                                <Descriptions.Item label="????????????" span={12}>
                                    {showParams?.my_member_code}
                                </Descriptions.Item>
                                <Descriptions.Item label="????????????" span={12}>
                                    {showParams?.my_member_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="????????????" span={12}>
                                    {showParams?.member_code}
                                </Descriptions.Item>
                                <Descriptions.Item label="????????????" span={12}>
                                    {showParams?.member_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="????????????" span={12}>
                                    {[
                                        {
                                            label: '??????',
                                            value: 1,
                                        },
                                        {
                                            label: '??????',
                                            value: 2,
                                        },
                                    ].find(
                                        (item) =>
                                            +item.value ===
                                            +showParams.repay_model,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="??????" span={12}>
                                    {currencyList.find(
                                        (item) =>
                                            +item.value ===
                                            +showParams.currency,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="?????????" span={12}>
                                    {formatCurrency(showParams.totalAmount)}???
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
                onFinish={handleRepayMarker}
                title="???Marker"
                style={{
                    maxHeight: '65vh',
                    overflowY: 'auto',
                }}
                width={1000}
                initialValues={updatedValues}
                formRef={formRef}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setIsPass(false);
                        setDoubleVisible(false);
                        setDoubleParams({});
                    },
                }}
                visible={isPass}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_code"
                        label="????????????"
                        disabled
                    />
                    <ProFormText width="md" name="hall" label="??????" disabled />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_name"
                        label="????????????"
                        disabled
                    />
                    <ProFormSelect
                        name="currency"
                        label="??????"
                        width="md"
                        options={currencyList}
                        placeholder="???????????????"
                        rules={[
                            {
                                required: true,
                                message: '???????????????',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onChange: (val) => {
                                setCurrentCurrency(+val);
                            },
                        }}
                        showSearch
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormRadio.Group
                        name="repay_model"
                        layout="horizontal"
                        width="md"
                        label="????????????"
                        options={[
                            {
                                label: '??????',
                                value: 1,
                            },
                            {
                                label: '??????',
                                value: 2,
                            },
                        ]}
                        rules={[
                            {
                                required: true,
                                message: '?????????????????????',
                            },
                        ]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        width="md"
                        name="my_member_code"
                        label="????????????"
                        placeholder=""
                        showSearch
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                            onSelect: (val: string) => {
                                formRef.current?.setFieldsValue({
                                    my_member_name: memberList?.find(
                                        (item) => item.member_code === val,
                                    )?.member_name,
                                });
                            },
                        }}
                        request={async ({ keyWords }) => {
                            if (keyWords) {
                                const res = await _fetchGetMemberByCode(
                                    keyWords,
                                );

                                const memberList = (res.data ?? [])?.map(
                                    (item) => {
                                        return {
                                            label: item.member_code,
                                            value: item.member_code,
                                        };
                                    },
                                );

                                return memberList;
                            } else {
                                return [];
                            }
                        }}
                        debounceTime={500}
                        rules={[
                            {
                                required: true,
                                message: '?????????????????????',
                            },
                        ]}
                    />
                    <ProFormText
                        width="md"
                        name="my_member_name"
                        label="????????????"
                        placeholder=""
                        disabled
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormRadio.Group
                        name="marker_type"
                        layout="horizontal"
                        width="md"
                        label="M??????"
                        options={markerType}
                        rules={[
                            {
                                required: true,
                                message: '?????????M??????',
                            },
                        ]}
                        fieldProps={{
                            onChange: (e) => {
                                setCurrentMarkerType(e.target.value);
                            },
                        }}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    {currentMarkerType && (
                        <GiveMarkerList
                            currentMarkerType={currentMarkerType}
                            handleSignedList={(list: SignedListItem[]) => {
                                setSignedList(
                                    list?.map((item) => {
                                        return {
                                            ...item,
                                            markerAmount: item.markerAmount
                                                ? Number(
                                                      new Big(
                                                          +item.markerAmount,
                                                      ).times(1000000),
                                                  )
                                                : 0,
                                            interestAmount: item.interestAmount
                                                ? Number(
                                                      new Big(
                                                          +item.interestAmount,
                                                      ).times(1000000),
                                                  )
                                                : 0,
                                        };
                                    }) ?? [],
                                );
                            }}
                            currentCurrency={currentCurrency}
                        ></GiveMarkerList>
                    )}
                </ProForm.Group>
                <Row wrap={false}>
                    <Col span={12}>
                        <ProFormTextArea
                            width="md"
                            name="remark"
                            label="??????"
                            placeholder="???????????????"
                            fieldProps={{
                                maxLength: 100,
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <FormCurrency
                            width="md"
                            name="totalAmount"
                            label="???????????????"
                            placeholder=""
                            disabled
                        />
                        <VerifierPassword
                            formRef={formRef}
                            for="???Marker"
                            identity_module={3}
                        ></VerifierPassword>
                    </Col>
                </Row>
            </ModalForm>
        </div>
    );
};

export default GiveMarkerForm;
