import React, { forwardRef } from 'react';
import './index.scoped.scss';
import { OfficialDataProps } from '@/hooks/usePrint/print';
import moment from 'moment';
import { formatMoney } from '@/utils/tools';
import { currencyMap } from '../../common';

type OfficialToPrintProps = {
    data: OfficialDataProps;
};

const OfficialToPrint = forwardRef<HTMLDivElement, OfficialToPrintProps>(
    ({ data }, ref) => {
        return (
            <div ref={ref} className="print-box">
                <div className="print-header">
                    <div className="print-date">
                        {moment(new Date()).format('YYYY-MM-DD HH:mm')}
                    </div>
                    <div className="print-id">{data.id || ''}</div>
                </div>
                <table className="print-content">
                    <thead>
                        <tr>
                            <td colSpan={4} className="print-hidden">
                                收据
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="print-hidden">姓名</td>
                            <td className="print-content">{data.name}</td>
                            <td className="print-hidden">户口</td>
                            <td className="print-content">{data.account}</td>
                        </tr>
                        <tr>
                            <td className="print-hidden">类型</td>
                            <td className="print-content">{data.type}</td>
                            <td className="print-hidden">币种</td>
                            <td className="print-content">{data.currency}</td>
                        </tr>
                        <tr>
                            <td className="print-hidden">金额</td>
                            <td colSpan={3} className="print-content">
                                {formatMoney(data.amountCapital) +
                                    (currencyMap[data.currency]
                                        ? ' ' + currencyMap[data.currency]
                                        : '')}
                            </td>
                        </tr>
                        <tr>
                            <td className="print-hidden">$</td>
                            <td colSpan={3} className="print-content">
                                {data.amountCurrency}
                            </td>
                        </tr>
                        <tr>
                            <td className="print-hidden">备注</td>
                            <td colSpan={3} className="print-content">
                                {data.remark}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="sign-list">
                    <div className="sign-list-item">
                        <span className="print-hidden sign-content">
                            {data.manager}
                        </span>
                    </div>
                </div>
            </div>
        );
    },
);

export default OfficialToPrint;
