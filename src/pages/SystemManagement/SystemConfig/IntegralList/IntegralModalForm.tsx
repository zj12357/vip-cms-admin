import React, { FC } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormRadio,
    ProFormSelect,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { createIntegral, updateIntegral } from '@/api/system';
import {
    CreateIntegralParams,
    UpdateIntegralParams,
    GetIntegralListItem,
} from '@/types/api/system';
import { currencyIntegralType } from '@/common/commonConstType';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import { checkFormItemValue } from '@/common/commonHandle';

type IntegralModalFormProps = {
    trigger: JSX.Element;
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: GetIntegralListItem;
};

const VipModalForm: FC<IntegralModalFormProps> = ({
    trigger,
    type,
    reloadData,
    record,
}) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const identityTitle: Record<string, string> = {
        add: '新增配置',
        edit: '编辑配置',
    };

    const updatedValues = useLatest({
        currency_id: checkFormItemValue(record?.currency_id ?? 0),
        type: checkFormItemValue(record?.type ?? 0),
    }).current;

    const { fetchData: _fetchCreateIntegral } = useHttp<
        CreateIntegralParams,
        null
    >(createIntegral, ({ msg }) => {
        message.success(msg);
        reloadData();
    });
    const { fetchData: _fetchUpdateIntegral } = useHttp<
        UpdateIntegralParams,
        null
    >(updateIntegral, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const handleIntegral = (values: any) => {
        const commonParams = {
            currency_id: values.currency_id,
            currency_name:
                currencyList.find((item) => item.value === values.currency_id)
                    ?.label ?? '',
            type: values.type,
        };
        if (type === 'add') {
            return _fetchCreateIntegral({
                ...commonParams,
            });
        } else if (type === 'edit') {
            return _fetchUpdateIntegral({
                ...commonParams,
                id: record?.id ?? 0,
            });
        }
    };

    return (
        <div>
            <ModalForm
                trigger={trigger}
                onFinish={async (values: any) => {
                    let res = await handleIntegral(values);
                    if (res?.code === 10000) {
                        return true;
                    }
                }}
                title={identityTitle[type]}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                initialValues={updatedValues}
                request={async () => {
                    return Promise.resolve({
                        success: true,
                    });
                }}
            >
                <ProForm.Group>
                    <ProFormSelect
                        width="md"
                        name="currency_id"
                        label="币种"
                        placeholder="请选择币种"
                        options={currencyList}
                        rules={[
                            {
                                required: true,
                                message: '请选择币种',
                            },
                        ]}
                    />
                    <ProFormRadio.Group
                        name="type"
                        label="积分结算/默认配置"
                        options={currencyIntegralType}
                        rules={[
                            {
                                required: true,
                                message: '请选择积分结算/默认配置"',
                            },
                        ]}
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};

export default VipModalForm;
