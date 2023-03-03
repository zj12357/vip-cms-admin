import React, { FC } from 'react';
import { Row, Col } from 'antd';
import './index.scoped.scss';
import { formatCurrency } from '@/utils/tools';

type Column = {
    title: string;
    dataIndex: string;
    className?: string;
};
type Props = {
    columns: Array<Column>;
    data: Array<any>;
};

const SilverHeadTable: FC<Props> = (props) => {
    const { columns, data } = props;
    return (
        <div className="silver-table">
            <Row style={{ width: '100%' }}>
                <Col className="table-head" span={8}>
                    <div className={'tr'}>
                        {columns.map((item) => {
                            return (
                                <div
                                    key={item.title + item.dataIndex}
                                    className={`td${
                                        item.className
                                            ? ' ' + item.className
                                            : ''
                                    }`}
                                >
                                    {item.title}
                                </div>
                            );
                        })}
                    </div>
                </Col>
                <Col className="table-body" span={16}>
                    {data.map((item, index) => (
                        <div key={index} className={'tr'}>
                            {columns.map((itm, idx) => {
                                return (
                                    <div
                                        key={idx + itm.dataIndex}
                                        className={`td${
                                            itm.className
                                                ? ' ' + itm.className
                                                : ''
                                        }`}
                                    >
                                        {isNaN(item[columns[idx].dataIndex])
                                            ? item[columns[idx].dataIndex]
                                            : formatCurrency(
                                                  item[columns[idx].dataIndex],
                                              )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </Col>
            </Row>
        </div>
    );
};
export default SilverHeadTable;
