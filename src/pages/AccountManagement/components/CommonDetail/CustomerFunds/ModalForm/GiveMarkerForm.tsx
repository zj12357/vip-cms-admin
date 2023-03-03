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
            title: '类型',
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
            title: '签M时间',
            editable: false,
        },
        {
            title: '币种',
            dataIndex: 'currency',
            valueType: 'select',
            fieldProps: {
                placeholder: '请选择币种',
                options: currencyList,
            },
            editable: false,
        },
        {
            dataIndex: 'left_amount',
            title: '欠M金额(万)',
            editable: false,
            render: (text, record, _, action) => {
                return (
                    <Currency value={record.left_amount.toString()}></Currency>
                );
            },
        },
        {
            dataIndex: 'left_interest',
            title: '罚息(万)',
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
            title: '已签天数',
            editable: false,
        },
        {
            dataIndex: 'expired_day',
            title: '过期天数',
            editable: false,
        },
        {
            dataIndex: 'expired_date',
            title: '逾期时间',
            editable: false,
        },
        {
            dataIndex: 'markerAmount',
            title: '还款金额',
            formItemProps: {
                rules: [
                    {
                        pattern: isPositiveNumber,
                        message: '请输入数字',
                    },
                    {
                        required: true,
                        message: '请输入还款金额',
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
            title: '罚息金额',
            formItemProps: {
                rules: [
                    {
                        pattern: isPositiveNumber,
                        message: '请输入数字',
                    },
                    {
                        required: true,
                        message: '请输入罚息金额',
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
            title: '操作',
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
                        编辑
                    </div>
                ),
                record.marker_state === 1 && record.left_interest > 0 && (
                    <Popconfirm
                        key="detele"
                        title="你确定要免罚息吗？"
                        onConfirm={() => {
                            handleRepayMarkerfree(record.id);
                        }}
                        okText="确定"
                        cancelText="取消"
                    >
                        <div className="m-primary-font-color pointer">
                            免罚息
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
        //重新获取数据
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
    const [isPass, setIsPass] = useState(false); //操作码是否通过
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数
    const [showParams, setShowParams] = useState<any>({}); //显示二次验证的表单参数

    const [currentMarkerType, setCurrentMarkerType] = useState<number>();
    const [signedList, setSignedList] = useState<SignedListItem[]>();
    //当前币种
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
            message.error('请先验证');
            return;
        }
        if (!(values.verifier_pass || values.phone_verifier_pass)) {
            message.error('验证不通过，不能操作');
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
                                <Descriptions.Item label="还款户口" span={12}>
                                    {showParams?.my_member_code}
                                </Descriptions.Item>
                                <Descriptions.Item label="还款户名" span={12}>
                                    {showParams?.my_member_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="欠款户口" span={12}>
                                    {showParams?.member_code}
                                </Descriptions.Item>
                                <Descriptions.Item label="欠款户名" span={12}>
                                    {showParams?.member_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="还款方式" span={12}>
                                    {[
                                        {
                                            label: '现金',
                                            value: 1,
                                        },
                                        {
                                            label: '存卡',
                                            value: 2,
                                        },
                                    ].find(
                                        (item) =>
                                            +item.value ===
                                            +showParams.repay_model,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="币种" span={12}>
                                    {currencyList.find(
                                        (item) =>
                                            +item.value ===
                                            +showParams.currency,
                                    )?.label ?? ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="总还款" span={12}>
                                    {formatCurrency(showParams.totalAmount)}万
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
                title="还Marker"
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
                        label="欠款户口"
                        disabled
                    />
                    <ProFormText width="md" name="hall" label="场馆" disabled />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="member_name"
                        label="欠款户名"
                        disabled
                    />
                    <ProFormSelect
                        name="currency"
                        label="币种"
                        width="md"
                        options={currencyList}
                        placeholder="请选择币种"
                        rules={[
                            {
                                required: true,
                                message: '请选择币种',
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
                        label="还款方式"
                        options={[
                            {
                                label: '现金',
                                value: 1,
                            },
                            {
                                label: '存卡',
                                value: 2,
                            },
                        ]}
                        rules={[
                            {
                                required: true,
                                message: '请选择还款方式',
                            },
                        ]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        width="md"
                        name="my_member_code"
                        label="还款户口"
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
                                message: '请输入还款户口',
                            },
                        ]}
                    />
                    <ProFormText
                        width="md"
                        name="my_member_name"
                        label="还款户名"
                        placeholder=""
                        disabled
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormRadio.Group
                        name="marker_type"
                        layout="horizontal"
                        width="md"
                        label="M类型"
                        options={markerType}
                        rules={[
                            {
                                required: true,
                                message: '请选择M类型',
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
                            label="备注"
                            placeholder="请输入备注"
                            fieldProps={{
                                maxLength: 100,
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <FormCurrency
                            width="md"
                            name="totalAmount"
                            label="本次总还款"
                            placeholder=""
                            disabled
                        />
                        <VerifierPassword
                            formRef={formRef}
                            for="还Marker"
                            identity_module={3}
                        ></VerifierPassword>
                    </Col>
                </Row>
            </ModalForm>
        </div>
    );
};

export default GiveMarkerForm;
