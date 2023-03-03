/*
 *
 * @Version:  ;
 * @Description: 金额处理，负数是红色，保留4位小数不四舍五入，小数结尾不能是0;
 * @Date: 2022-08-21 12:58:53
 */
import React, { FC } from 'react';
import { isNegativeNumber } from '@/utils/validate';
import { formatCurrency } from '@/utils/tools';

type CurrencyProps = {
    value: string | number;
    decimal?: number; //保留位数
};

const Currency: FC<CurrencyProps> = ({ value, decimal }) => {
    return (
        <span
            className={
                isNegativeNumber.test(value + '') ? 'm-primary-error-color' : ''
            }
        >
            {formatCurrency(value, decimal)}万
        </span>
    );
};

export default Currency;
