import React, { ReactNode, useEffect, useState } from 'react';
import { ProCard, ProTable } from '@ant-design/pro-components';
import PageRoute from '@/components/PageRoute';
import _ from 'lodash';

type EBetProps = {};

const EBetSetup: React.FC<EBetProps> = (props) => {
    return (
        <ProCard>
            <PageRoute {...props}></PageRoute>
        </ProCard>
    );
};

export const Summary = (
    pageData: any[],
    columns: any[],
    summaryKeys: string[] = [],
    initValues: any = {},
    render?: (
        value: any,
        key: string,
        summaryKeys: string[],
        initValues: any,
    ) => ReactNode,
) => {
    if (!(pageData.length > 0)) {
        return;
    }
    const initValue: [string, number][] = summaryKeys.map((k) => [k, 0]);
    const totalMap = new Map<string, number | string>(initValue);

    pageData.forEach((data) => {
        Object.keys(data).forEach((key, index, arr) => {
            const val = data[key];
            if (totalMap.has(key) && Number(val)) {
                totalMap.set(
                    key,
                    Number(totalMap.get(key) ?? 0) + (Number(val) || 0),
                );
            }
        });
    });
    Object.keys(initValues).map((key) => totalMap.set(key, initValues[key]));

    return (
        <ProTable.Summary.Row
            style={{
                background: 'rgb(250 250 250)',
                fontWeight: 'bold',
            }}
        >
            {columns
                .filter((c) => !c.hideInTable)
                .map((c, ci, array) => {
                    let colSpan = 1;
                    if (!totalMap.has(String(c.dataIndex))) {
                        const start_idx = _.findLastIndex(
                            array,
                            (af: any, afi: number) =>
                                afi < ci && totalMap.has(String(af.dataIndex)),
                        );
                        let end_idx = array.findIndex(
                            (af, afi) =>
                                afi > ci && totalMap.has(String(af.dataIndex)),
                        );
                        end_idx = end_idx < 0 ? array.length : end_idx;
                        colSpan =
                            start_idx + 1 === ci ? end_idx - start_idx - 1 : 0;
                    }
                    const value = totalMap.get(String(c.dataIndex));
                    return (
                        <ProTable.Summary.Cell
                            {...c}
                            key={`${c.dataIndex}_${ci}`}
                            index={ci}
                            colSpan={colSpan}
                        >
                            {render?.(
                                value,
                                c.dataIndex,
                                summaryKeys,
                                initValues,
                            ) ?? value}
                        </ProTable.Summary.Cell>
                    );
                })}
        </ProTable.Summary.Row>
    );
};

export default EBetSetup;
