import React, { forwardRef } from 'react';
import './index.scoped.scss';
import { TicketDataProps } from '@/hooks/usePrint/print';
import { formatCurrency } from '@/utils/tools';
import moment from 'moment';

type TicketToPrintProps = {
    data: TicketDataProps;
};

enum formatFn {
    Date = 'Date',
    Currency = 'Currency',
}

const Formatter = {
    Date: (v: number) => {
        return moment(new Date(v * 1000)).format('YYYY-MM-DD HH:mm');
    },
    Currency: (v: number | string) => {
        return formatCurrency(v) + '万';
    },
};

const TicketToPrint = forwardRef<HTMLDivElement, TicketToPrintProps>(
    ({ data }, ref) => {
        return (
            <div ref={ref} className="print-box">
                <div className="title">{data.title || '盈樂貴賓會'}</div>
                <div className="content">
                    {data.items?.map((item, index) => (
                        <div key={index} className="item">
                            <div className="label">{item.label}:</div>
                            <div className="value">
                                {!item.type
                                    ? item.value
                                    : Formatter[item.type as formatFn](
                                          item.value as any,
                                      )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
);

export default TicketToPrint;
