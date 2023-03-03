import React, { FC } from 'react';
import { Button, message } from 'antd';
import { useHttp } from '@/hooks';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
    ProFormDigit,
} from '@ant-design/pro-components';
import { consume_type } from '@/common/commonConstType';
import {
    CreateConsumeConfigParams,
    UpdateConsumeConfigParams,
} from '@/types/api/service';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList, selectHallList } from '@/store/common/commonSlice';
import { createConsumeConfig, updateConsumeConfig } from '@/api/service';
import FormCurrency from '@/components/Currency/FormCurrency';

type ConsumConfigItem = {
    id: string;
    venue_type: number;
    currency_type: number;
    consume_type: number;
    consume_keyword: string;
    item_name: string;
    item_price: number;
    remark?: string;
};
type AddOrUpdateConsumConfigProps = {
    type: string;
    record?: ConsumConfigItem;
    refreshData: () => void;
};

const AddOrUpdateConsumConfig: FC<AddOrUpdateConsumConfigProps> = (props) => {
    const { type, record, refreshData } = props;
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);
    // 新增
    const { fetchData: fetchCreateConsumeConfig } = useHttp<
        CreateConsumeConfigParams,
        any
    >(createConsumeConfig);
    // 修改
    const { fetchData: fetchUpdateConsumeConfig } = useHttp<
        UpdateConsumeConfigParams,
        any
    >(updateConsumeConfig);
    return (
        <ModalForm
            modalProps={{
                destroyOnClose: true,
            }}
            trigger={
                type === 'add' ? (
                    <Button type="primary">新建</Button>
                ) : (
                    <div
                        className="m-primary-font-color pointer"
                        key="editable"
                    >
                        修改
                    </div>
                )
            }
            onFinish={async (values: any) => {
                if (+values.item_price <= 0) {
                    message.error('请输入正确的价格');
                    return;
                }
                if (type === 'update') {
                    const res = await fetchUpdateConsumeConfig({
                        ...record,
                        ...values,
                    });
                    if (res.code === 10000) {
                        message.success(res.msg);
                        refreshData();
                        return true;
                    }
                } else {
                    const res = await fetchCreateConsumeConfig({
                        id: record?.id,
                        ...values,
                        item_price:
                            type === 'update'
                                ? values.item_price * 10000000
                                : values.item_price,
                    });
                    if (res.code === 10000) {
                        message.success(res.msg);
                        refreshData();
                        return true;
                    }
                }
            }}
            title="消费配置"
            style={{
                maxHeight: '80vh',
                overflowY: 'auto',
            }}
        >
            <ProForm.Group>
                <ProFormSelect
                    request={async () => [...hallList]}
                    width="md"
                    name="venue_type"
                    label="场馆"
                    initialValue={type === 'update' ? record?.venue_type : null}
                    rules={[{ required: true, message: '请选择场馆' }]}
                />
                <ProFormSelect
                    width="md"
                    options={currencyList}
                    name="currency_type"
                    label="定价币种"
                    initialValue={
                        type === 'update' ? record?.currency_type : null
                    }
                    rules={[{ required: true, message: '请选择定价币种' }]}
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormSelect
                    width="md"
                    options={consume_type}
                    name="consume_type"
                    label="消费类型"
                    initialValue={
                        type === 'update' ? record?.consume_type : null
                    }
                    rules={[{ required: true, message: '请选择消费类型' }]}
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="consume_keyword"
                    label="分类关键字"
                    placeholder="请输入分类关键字"
                    initialValue={
                        type === 'update' ? record?.consume_keyword : ''
                    }
                    rules={[
                        { required: true, message: '请输入分类关键字' },
                        { max: 20, message: '最长不超过20个字符' },
                    ]}
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText
                    width="lg"
                    name="item_name"
                    label="项目名称"
                    placeholder="请输入项目名称"
                    initialValue={type === 'update' ? record?.item_name : ''}
                    rules={[
                        { required: true, message: '请输入项目名称' },
                        { max: 20, message: '最长不超过20个字符' },
                    ]}
                />
            </ProForm.Group>
            <ProForm.Group>
                <FormCurrency
                    width="lg"
                    name="item_price"
                    label="价格"
                    placeholder="请输入价格"
                    initialValue={
                        type === 'update' ? record?.item_price! / 1000000 : ''
                    }
                    rules={[
                        { required: true, message: '请输入价格' },
                        {
                            validator: (_, value) => {
                                const reg = /^([1-9]\d{0,4}|0)(\.\d{1,4})?$/;
                                if (
                                    value !== '' &&
                                    value !== '0.' &&
                                    value !== '-0.' &&
                                    Number(value) < 0.00001
                                ) {
                                    return Promise.reject('请输入正确的价格');
                                } else if (!reg.test(value)) {
                                    return Promise.reject(
                                        '小数点后不得超过4位',
                                    );
                                } else if (Number(value) > 1000) {
                                    return Promise.reject('最大不得超过1000');
                                }
                                return Promise.resolve(value);
                            },
                        },
                    ]}
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormTextArea
                    width="lg"
                    name="remark"
                    label="备注"
                    placeholder="请输入备注"
                    initialValue={type === 'update' ? record?.remark : ''}
                    fieldProps={{
                        maxLength: 100,
                    }}
                />
            </ProForm.Group>
        </ModalForm>
    );
};

export default AddOrUpdateConsumConfig;
