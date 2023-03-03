/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    FC,
    memo,
    useEffect,
    useState,
    useCallback,
    useRef,
} from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormList,
    ProFormRadio,
    ProFormSelect,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { useHttp, useLatest } from '@/hooks';
import { getCommission, updateShares } from '@/api/system';
import {
    GetCommissionParams,
    MemberTypeListItem,
    CommissionListItem,
    UpdateSharesParams,
    ParamConfigArrItem,
} from '@/types/api/system';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import { isPositiveNumber } from '@/utils/validate';
import {
    Button,
    message,
    Row,
    Col,
    Radio,
    RadioChangeEvent,
    Select,
} from 'antd';

import Loading from '@/components/Loading';
import AuthButton from '@/components/AuthButton';

type OccupyModalFormProps = {
    reloadData: () => void;
    record: MemberTypeListItem;
};

const OccupyModalForm: FC<OccupyModalFormProps> = memo(
    ({ record, reloadData }) => {
        const [isPass, setIsPass] = useState(false); //操作码是否通过

        const formRef = useRef<ProFormInstance>();
        const currencyList = useAppSelector(selectCurrencyList);
        const [currencyCode, setCurrencyCode] = useState<string>(
            currencyList?.[0]?.label,
        );
        const [currencyType, setCurrencyType] = useState<number>(
            currencyList?.[0]?.value,
        );
        const [onlineType, setOnlineType] = useState<number>(1);
        const [commissionList, setCommissionList] = useState<
            CommissionListItem[]
        >([]);

        const { fetchData: _fetchGetCommission, loading } = useHttp<
            GetCommissionParams,
            CommissionListItem[]
        >(getCommission);

        const { fetchData: _fetchUpdateShares } = useHttp<
            UpdateSharesParams,
            null
        >(updateShares, ({ msg }) => {
            message.success(msg);
            reloadData();
        });

        // 普通C
        const ordinaryC = `${
            currencyType ?? currencyList?.[0]?.value
        }-1-C`.toUpperCase();

        // 普通M
        const ordinaryM = `${
            currencyType ?? currencyList?.[0]?.value
        }-1-M`.toUpperCase();

        //营运C
        const operateC = `${
            currencyType ?? currencyList?.[0]?.value
        }-2-C`.toUpperCase();

        //营运M
        const operateM = `${
            currencyType ?? currencyList?.[0]?.value
        }-2-M`.toUpperCase();

        //获取占成比
        const hanleCommissionType = useCallback(
            (type: string, codeType: string) => {
                const filterList = commissionList.filter(
                    (item) =>
                        item.param_name.toUpperCase() === type &&
                        !item.principal_type.includes('A'),
                );

                if ([ordinaryM, ordinaryC].includes(type)) {
                    return filterList.map((v) => {
                        return {
                            start_type: 1,
                            code_type: codeType,
                            principal_type: 'B',
                            shares_rate: v.shares_rate,
                            commission_rate: v.commission_rate,
                            point_rate: v.point_rate,
                        };
                    });
                } else if ([operateC, operateM].includes(type)) {
                    const uplist = filterList.filter((item) =>
                        item.principal_type.includes('台面'),
                    );
                    const downlist = filterList.filter((item) =>
                        item.principal_type.includes('台底'),
                    );
                    let allList = [];
                    for (
                        let index = 0;
                        index < filterList.length / 2;
                        index++
                    ) {
                        allList.push({
                            start_type: 2,
                            code_type: codeType,
                            shares_rate_up: uplist[index]?.shares_rate,
                            shares_rate_down: downlist[index]?.shares_rate,
                            commission_rate_up: uplist[index]?.commission_rate,
                            commission_rate_down:
                                downlist[index]?.commission_rate,
                            point_rate_up: uplist[index]?.point_rate,
                            point_rate_down: downlist[index]?.point_rate,
                        });
                    }
                    return allList;
                }
            },
            [commissionList],
        );

        //修改占成比
        const handleUpdateShares = async (values: any) => {
            const handleOperateList = (type: string, codeType: string) => {
                let allList: ParamConfigArrItem[] = [];

                [...values[type]].forEach((val, index) => {
                    allList.push({
                        start_type: 2,
                        code_type: codeType,
                        principal_type: 'B(台面)',
                        shares_rate: val.shares_rate_up,
                        commission_rate: val.commission_rate_up,
                        point_rate: val.point_rate_up,
                    });
                    allList.push({
                        start_type: 2,
                        code_type: codeType,
                        principal_type: 'B(台底)',
                        shares_rate: val.shares_rate_down,
                        commission_rate: val.commission_rate_down,
                        point_rate: val.point_rate_down,
                    });
                });

                return allList;
            };

            const handleOrdinaryList = (type: string, codeType: string) => {
                let allList: ParamConfigArrItem[] = [];

                [...values[type]].forEach((val, index) => {
                    allList.push({
                        start_type: 1,
                        code_type: codeType,
                        principal_type: 'B',
                        shares_rate: val.shares_rate,
                        commission_rate: val.commission_rate,
                        point_rate: val.point_rate,
                    });
                });
                return allList;
            };

            const paramConfigList = [
                {
                    param_name: ordinaryC,
                    param: handleOrdinaryList(ordinaryC, 'C'),
                },
                {
                    param_name: ordinaryM,
                    param: handleOrdinaryList(ordinaryM, 'M'),
                },
                {
                    param_name: operateC,
                    param: handleOperateList(operateC, 'C'),
                },
                {
                    param_name: operateM,
                    param: handleOperateList(operateM, 'M'),
                },
            ];
            const params = {
                type: onlineType ?? 1,
                currency: currencyType ?? currencyList?.[0]?.value,
                member_type_id: record.member_type_id,
                currency_code: currencyCode ?? currencyList?.[0]?.label,
                param_config_arr: [...paramConfigList],
            };

            const res = await _fetchUpdateShares(params);
            if (res.code === 10000) {
                setIsPass(false);
                setCurrencyType(currencyList?.[0]?.value);
                setCurrencyCode(currencyList?.[0]?.label);
                setOnlineType(1);
            }
        };

        useEffect(() => {
            if (isPass) {
                _fetchGetCommission({
                    type: onlineType ?? 1,
                    currency: currencyType ?? currencyList?.[0]?.value,
                    member_type_id: record.member_type_id,
                }).then((res) => {
                    setCommissionList(res.data ?? []);
                });
            }
        }, [currencyType, onlineType, record.member_type_id, isPass]);

        useEffect(() => {
            formRef.current?.setFieldsValue({
                [ordinaryC]: hanleCommissionType(ordinaryC, 'C'),
                [ordinaryM]: hanleCommissionType(ordinaryM, 'M'),
                [operateC]: hanleCommissionType(operateC, 'C'),
                [operateM]: hanleCommissionType(operateM, 'M'),
            });
        }, [commissionList]);

        return (
            <div>
                <ModalForm
                    formRef={formRef}
                    trigger={
                        <AuthButton
                            normal="account-type-orate"
                            verify={(pass) => {
                                setIsPass(pass);
                            }}
                            buttonProps={{
                                type: 'link',
                                style: {
                                    padding: '4px',
                                },
                            }}
                        >
                            占成
                        </AuthButton>
                    }
                    onFinish={handleUpdateShares}
                    title="设置占成"
                    style={{
                        maxHeight: '70vh',
                        overflowY: 'auto',
                    }}
                    modalProps={{
                        destroyOnClose: true,
                        onCancel: () => {
                            setIsPass(false);
                        },
                    }}
                    width={1000}
                    visible={isPass}
                >
                    <div
                        style={{
                            marginBottom: '20px',
                        }}
                    >
                        <Row
                            align="middle"
                            justify="space-between"
                            style={{
                                marginBottom: '14px',
                            }}
                        >
                            <Col>
                                <Radio.Group
                                    options={[
                                        { label: '线下', value: 1 },
                                        { label: '线上', value: 2 },
                                    ]}
                                    value={onlineType}
                                    onChange={({
                                        target: { value },
                                    }: RadioChangeEvent) => {
                                        setOnlineType(+value);
                                    }}
                                />
                            </Col>
                            <Col>
                                <Select
                                    value={currencyType}
                                    style={{
                                        width: '100px',
                                        margin: '0 20px 10px 0',
                                    }}
                                    onSelect={(_: any, option: any) => {
                                        setCurrencyType(+option.value);
                                        setCurrencyCode(option?.label);
                                    }}
                                    options={currencyList}
                                ></Select>
                            </Col>
                        </Row>
                    </div>
                    {loading ? (
                        <Loading></Loading>
                    ) : (
                        <>
                            <ProForm.Group>
                                {/* 普通 C */}
                                <ProFormList
                                    name={ordinaryC}
                                    style={{
                                        width: '360px',
                                    }}
                                    label={currencyCode + '普通 C'}
                                >
                                    <ProFormText
                                        name="shares_rate"
                                        width="md"
                                        placeholder="请输入占成比例"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入占成比例',
                                            },
                                            {
                                                pattern: isPositiveNumber,
                                                message: '请输入数字',
                                            },
                                            {
                                                validator: async (_, value) => {
                                                    if (+value > 80) {
                                                        return Promise.reject(
                                                            '输入的数字不能大于80',
                                                        );
                                                    }
                                                    return true;
                                                },
                                            },
                                        ]}
                                        fieldProps={{
                                            addonAfter: '%',
                                        }}
                                    ></ProFormText>
                                </ProFormList>
                                {/* 普通 M */}
                                <ProFormList
                                    name={ordinaryM}
                                    style={{
                                        width: '360px',
                                    }}
                                    label={currencyCode + '普通 M'}
                                >
                                    <ProFormText
                                        name="shares_rate"
                                        width="md"
                                        placeholder="请输入占成比例"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入占成比例',
                                            },
                                            {
                                                pattern: isPositiveNumber,
                                                message: '请输入数字',
                                            },
                                            {
                                                validator: async (_, value) => {
                                                    if (+value > 80) {
                                                        return Promise.reject(
                                                            '输入的数字不能大于80',
                                                        );
                                                    }
                                                    return true;
                                                },
                                            },
                                        ]}
                                        fieldProps={{
                                            addonAfter: '%',
                                        }}
                                    ></ProFormText>
                                </ProFormList>
                            </ProForm.Group>

                            <ProForm.Group>
                                {/* 营运 C */}
                                <ProFormList
                                    name={operateC}
                                    style={{
                                        width: '360px',
                                    }}
                                    label={currencyCode + '营运 C'}
                                >
                                    <ProFormText
                                        name="shares_rate_up"
                                        width="md"
                                        placeholder="请输入台面占成比例"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入台面占成比例',
                                            },
                                            {
                                                pattern: isPositiveNumber,
                                                message: '请输入数字',
                                            },
                                            {
                                                validator: async (_, value) => {
                                                    if (+value > 80) {
                                                        return Promise.reject(
                                                            '输入的数字不能大于80',
                                                        );
                                                    }
                                                    return true;
                                                },
                                            },
                                        ]}
                                        fieldProps={{
                                            addonAfter: '%',
                                        }}
                                    ></ProFormText>
                                    <ProFormText
                                        name="shares_rate_down"
                                        width="md"
                                        placeholder="请输入台底占成比例"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入台底占成比例',
                                            },
                                            {
                                                pattern: isPositiveNumber,
                                                message: '请输入数字',
                                            },
                                            {
                                                validator: async (_, value) => {
                                                    if (+value > 80) {
                                                        return Promise.reject(
                                                            '输入的数字不能大于80',
                                                        );
                                                    }
                                                    return true;
                                                },
                                            },
                                        ]}
                                        fieldProps={{
                                            addonAfter: '%',
                                        }}
                                    ></ProFormText>
                                </ProFormList>
                                {/* 营运 M */}
                                <ProFormList
                                    name={operateM}
                                    style={{
                                        width: '360px',
                                    }}
                                    label={currencyCode + '营运 M'}
                                >
                                    <ProFormText
                                        name="shares_rate_up"
                                        width="md"
                                        placeholder="请输入台面占成比例"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入台面占成比例',
                                            },
                                            {
                                                pattern: isPositiveNumber,
                                                message: '请输入数字',
                                            },
                                            {
                                                validator: async (_, value) => {
                                                    if (+value > 80) {
                                                        return Promise.reject(
                                                            '输入的数字不能大于80',
                                                        );
                                                    }
                                                    return true;
                                                },
                                            },
                                        ]}
                                        fieldProps={{
                                            addonAfter: '%',
                                        }}
                                    ></ProFormText>
                                    <ProFormText
                                        name="shares_rate_down"
                                        width="md"
                                        placeholder="请输入台底占成比例"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入台底占成比例',
                                            },
                                            {
                                                pattern: isPositiveNumber,
                                                message: '请输入数字',
                                            },
                                            {
                                                validator: async (_, value) => {
                                                    if (+value > 80) {
                                                        return Promise.reject(
                                                            '输入的数字不能大于80',
                                                        );
                                                    }
                                                    return true;
                                                },
                                            },
                                        ]}
                                        fieldProps={{
                                            addonAfter: '%',
                                        }}
                                    ></ProFormText>
                                </ProFormList>
                            </ProForm.Group>
                        </>
                    )}
                </ModalForm>
            </div>
        );
    },
);

export default OccupyModalForm;
