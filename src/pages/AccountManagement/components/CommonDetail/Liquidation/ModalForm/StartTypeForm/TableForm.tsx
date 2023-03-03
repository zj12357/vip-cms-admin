import React, { FC, Fragment } from 'react';
import { ProFormText, ProForm } from '@ant-design/pro-components';
import Big from 'big.js';
import _ from 'lodash';
import { isInteger } from '@/utils/validate';
import FormCurrency from '@/components/Currency/FormCurrency';

type TableFormProps = {
    totalOutCode: () => void;
};

const TableForm: FC<TableFormProps> = ({ totalOutCode }) => {
    return (
        <Fragment>
            <ProForm.Group>
                <FormCurrency
                    width="md"
                    name="table_up_code"
                    label="台面出码"
                    placeholder="请输入台面出码"
                    initialValue={0}
                    disabled
                />
                <ProFormText
                    width="md"
                    name="table_bottom_magnification"
                    label="台底倍率"
                    placeholder="请输入台底倍率"
                    rules={[
                        {
                            required: true,
                            message: '请输入台底倍率',
                        },
                        {
                            pattern: isInteger,
                            message: '请输入整数',
                        },
                    ]}
                    fieldProps={{
                        onChange: () => {
                            totalOutCode();
                        },
                    }}
                />
            </ProForm.Group>
            <ProForm.Group>
                <FormCurrency
                    width="md"
                    name="table_bottom_deposit"
                    label="台底押金"
                    placeholder="请输入台底押金"
                    initialValue={0}
                    disabled
                />

                <FormCurrency
                    width="md"
                    name="total_code"
                    label="出码总额"
                    placeholder="请输入出码总额"
                    initialValue={0}
                    disabled
                    convertValue={(val) => {
                        return val;
                    }}
                    rules={[
                        {
                            validateTrigger: 'onsubmit',
                            validator: async (_, value) => {
                                if (+value === 0) {
                                    return Promise.reject('开工金额不能为0');
                                }
                                return true;
                            },
                        },
                    ]}
                />
            </ProForm.Group>
        </Fragment>
    );
};

export default TableForm;
