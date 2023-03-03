import React, { FC } from 'react';
import { ProFormText } from '@ant-design/pro-components';
import { isFloatingPointNumber } from '@/utils/validate';
import Big from 'big.js';

type FormCurrencyProps = typeof ProFormText;

//金额提交处理
const FormCurrency: FC<any> = (props) => {
    const rules = props.rules || [];
    const fieldProps = props.fieldProps || {};
    return (
        <ProFormText
            //值不是初始化，二次计算得到，convertValue要用传进来的
            convertValue={(val) => {
                if (props.disabled) {
                    return val ? Number(new Big(+val || 0).div(1000000)) : 0;
                }

                return val;
            }}
            {...props}
            fieldProps={{
                ...fieldProps,
                addonAfter: '万',
            }}
            rules={[
                {
                    pattern: /^(-?\d+)(\.\d{0,4})?$/,
                    message: '最多输入4位小数',
                },
                {
                    pattern: isFloatingPointNumber,
                    message: '请输入数字',
                },
                {
                    validator: async (rules, value) => {
                        if (value > 9999999999) {
                            return Promise.reject(
                                '输入的数字超过限制，不能大于9999999999',
                            );
                        } else {
                            return true;
                        }
                    },
                },
                ...rules,
            ]}
            tooltip={props?.hideTooltip ?? ''}
            transform={(val) => {
                return {
                    [props.name]: val
                        ? props.disabled
                            ? val
                            : Number(new Big(+val || 0).times(1000000))
                        : 0,
                };
            }}
        />
    );
};

export default FormCurrency as FormCurrencyProps;
