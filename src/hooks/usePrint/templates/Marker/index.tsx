import React, { forwardRef } from 'react';
import './index.scoped.scss';
import { MarkerDataProps } from '@/hooks/usePrint/print';
import moment from 'moment';
import { formatMoney } from '@/utils/tools';
import { currencyMap } from '../../common';
type MarkerToPrintProps = {
    data: MarkerDataProps;
};

const MarkerToPrint = forwardRef<HTMLDivElement, MarkerToPrintProps>(
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
                                借款单
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="print-hidden">借款人</td>
                            <td className="print-content">{data.borrower}</td>
                            <td className="print-hidden">借款户口</td>
                            <td className="print-content">
                                {data.borrowAccount}
                            </td>
                        </tr>
                        <tr>
                            <td className="print-hidden">金额</td>
                            <td className="print-content">
                                {formatMoney(data.amountCapital) +
                                    (currencyMap[data.currency]
                                        ? ' ' + currencyMap[data.currency]
                                        : '')}
                            </td>
                            <td className="print-hidden">币种</td>
                            <td className="print-content">{data.currency}</td>
                        </tr>
                        <tr>
                            <td className="print-hidden">金额</td>
                            <td colSpan={3} className="print-content">
                                {data.amountCurrency}
                            </td>
                        </tr>
                        <tr>
                            <td className="print-hidden">还款日期</td>
                            <td className="print-content">
                                {data.repaymentDate}
                            </td>
                            <td className="print-hidden">违约利息</td>
                            <td className="print-content">{data.interest}</td>
                        </tr>
                        <tr>
                            <td className="print-hidden">备注</td>
                            <td colSpan={3} className="print-content">
                                {data.remark}
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* <div className="sign-list">
                    <div className="sign-list-item">
                        <span className="sign-content">
                            {data.publicRelations}
                        </span>
                    </div>
                    <div className="sign-list-item">
                        <span className="sign-content">{data.accountRoom}</span>
                    </div>
                    <div className="sign-list-item">
                        <span className="sign-content">
                            {data.borrowerSign}
                        </span>
                    </div>
                </div> */}
            </div>
        );
    },
);

export default MarkerToPrint;
