import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormTextArea,
    ProFormRadio,
    EditableProTable,
    ProFormSelect,
} from '@ant-design/pro-components';
import type {
    ProColumns,
    ProFormInstance,
    ActionType,
} from '@ant-design/pro-components';
import { Button, message, Row, Col, Popconfirm } from 'antd';
import VerifierPassword from '@/pages/AccountManagement/components/VerifierPassword';
import { SignedListItem } from '@/types/api/accountAction';
import { useLatest, useHttp } from '@/hooks';
import { repayMarker, getMemberByCode, repayMarkerfree } from '@/api/account';
import { RepayMarkerParams, MemberByCodeItem } from '@/types/api/account';
import { markerType } from '@/common/commonConstType';
import { useAppSelector } from '@/store/hooks';
import {
    selectCurrencyList,
    selectCurrentHall,
} from '@/store/common/commonSlice';
import Big from 'big.js';
import { isPositiveNumber } from '@/utils/validate';
import Currency from '@/components/Currency';
import FormCurrency from '@/components/Currency/FormCurrency';

type GiveMarkerProps = {
    record: SignedListItem;
    reloadData: () => void;
};

const GiveMarkerList: FC<{
    list: SignedListItem[];
    handleMarkerAmount: (params: Record<string, number>) => void;
}> = ({ list, handleMarkerAmount }) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<SignedListItem[]>(() => list);
    const tableRef = useRef<ActionType>();

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
                <div
                    key="editable"
                    className="m-primary-font-color pointer"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </div>,
                record.interest > 0 && (
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

    useEffect(() => {
        setDataSource(list);
        return () => {
            setDataSource([]);
        };
    }, [list]);

    return (
        <EditableProTable<SignedListItem>
            columns={columns}
            value={dataSource}
            onChange={setDataSource}
            pagination={{
                showQuickJumper: true,
            }}
            toolBarRender={false}
            search={false}
            scroll={{ x: 1400 }}
            editable={{
                type: 'single',
                editableKeys,
                onSave: async (rowKey, data, row) => {
                    handleMarkerAmount({
                        marker_amount: data.markerAmount
                            ? Number(new Big(+data.markerAmount).times(1000000))
                            : 0,
                        interest_amount: data.interestAmount
                            ? Number(
                                  new Big(+data.interestAmount).times(1000000),
                              )
                            : 0,
                    });
                },
                onChange: setEditableRowKeys,
                actionRender: (row, config, dom) => [dom.save, dom.cancel],
            }}
            rowKey={(item) => item.id}
            recordCreatorProps={false}
        />
    );
};
const GiveMarkerForm: FC<GiveMarkerProps> = ({ record, reloadData }) => {
    const formRef = useRef<ProFormInstance>();
    const currentHall = useAppSelector(selectCurrentHall);
    const updatedValues = useLatest({
        member_code: record.member_code,
        member_name: record.member_name,
        hall: currentHall.hall_name,
    }).current;
    const [markerAmount, setMarkerAmount] = useState({
        marker_amount: 0,
        interest_amount: 0,
    });

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

        const parmas = {
            remark: values.remark,
            member_code: values.my_member_code,
            param: [
                {
                    id: record.id,
                    repay_model: values.repay_model,
                    marker_type: record.marker_type,
                    ...markerAmount,
                },
            ],
        };
        const res = await _fetchRepayMarker(parmas);
        if (res?.code === 10000) {
            reloadData();
            return true;
        }
    };

    useEffect(() => {
        formRef.current?.setFieldsValue({
            totalAmount: Number(
                new Big(markerAmount.marker_amount).plus(
                    markerAmount.interest_amount,
                ),
            ),
        });
    }, [markerAmount]);

    return (
        <div>
            <ModalForm
                trigger={
                    <div className="m-primary-font-color pointer">还款</div>
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
                }}
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
                    <GiveMarkerList
                        list={[record]}
                        handleMarkerAmount={(params: Record<string, number>) =>
                            setMarkerAmount((prev) => ({
                                ...prev,
                                ...params,
                            }))
                        }
                    ></GiveMarkerList>
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
