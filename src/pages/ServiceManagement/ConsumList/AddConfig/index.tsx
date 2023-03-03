import React, { FC, useState, useImperativeHandle, forwardRef } from 'react';
import { Row, Col, InputNumber, Input, Select, message } from 'antd';
import { useHttp } from '@/hooks';
import './index.scoped.scss';
import { consume_type } from '@/common/commonConstType';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList, selectHallList } from '@/store/common/commonSlice';
import { CreateConsumeConfigParams } from '@/types/api/service';
import { createConsumeConfig } from '@/api/service';

type AddConfigProps = {
    currency: number;
    venueForProps: number;
    ref: any;
    closeAddModal: () => void;
};

const SIZE = 1000000;

const AddConfig: FC<AddConfigProps> = forwardRef((props, ref) => {
    const { Option } = Select;
    const { currency, venueForProps, closeAddModal } = props;
    const [data, setData] = useState<any>({ consume_type: 1 });
    const [errorArr, setErrorArr] = useState({
        consume_keyword: false,
        item_name: false,
        item_price: false,
    });
    const currencyList = useAppSelector(selectCurrencyList);
    const hallList = useAppSelector(selectHallList);
    const { fetchData: fetchCreateConsumeConfig } = useHttp<
        CreateConsumeConfigParams,
        any
    >(createConsumeConfig);
    useImperativeHandle(ref, () => ({
        createConsumConfig: () => {
            const params = {
                venue_type: venueForProps,
                currency_type: currency,
                ...data,
            };
            if (!params.consume_keyword) {
                setErrorArr({ ...errorArr, consume_keyword: true });
                return false;
            }
            if (!params.item_name) {
                setErrorArr({ ...errorArr, item_name: true });
                return false;
            }
            const reg = /^([1-9]\d{0,4}|0)(\.\d{1,4})?$/;
            if (!reg.test(params.item_price)) {
                setErrorArr({ ...errorArr, item_price: true });
                return false;
            }
            if (!params.item_price) {
                setErrorArr({ ...errorArr, item_price: true });
                return false;
            }
            fetchCreateConsumeConfig({
                ...params,
                item_price: params.item_price * SIZE,
            }).then((res) => {
                if (res.code === 10000) {
                    message.success(res.msg);
                    closeAddModal();
                }
            });
        },
    }));
    return (
        <div className="add-box">
            <Row justify="center" align="middle" style={{ marginTop: '18px' }}>
                <Col span={8}>
                    <p style={{ textAlign: 'right', marginRight: '10px' }}>
                        场馆：
                    </p>
                </Col>
                <Col span={14}>
                    <Input
                        size="small"
                        value={
                            hallList.find(
                                (item) => item.value === venueForProps,
                            )?.label || ''
                        }
                        disabled
                    />
                </Col>
            </Row>
            <Row justify="center" align="middle" style={{ marginTop: '18px' }}>
                <Col span={8}>
                    <p style={{ textAlign: 'right', marginRight: '10px' }}>
                        定价货币：
                    </p>
                </Col>
                <Col span={14}>
                    <Input
                        size="small"
                        value={
                            currencyList.find((item) => item.value === currency)
                                ?.label || ''
                        }
                        disabled
                    />
                </Col>
            </Row>
            <Row justify="center" align="middle" style={{ marginTop: '18px' }}>
                <Col span={8}>
                    <p style={{ textAlign: 'right', marginRight: '10px' }}>
                        消费类型：
                    </p>
                </Col>
                <Col span={14}>
                    <Select
                        size="small"
                        defaultValue={1}
                        style={{ width: '100%' }}
                        onChange={(value) => {
                            setData({ ...data, consume_type: value });
                        }}
                    >
                        {consume_type.map((item) => {
                            return (
                                <Option key={item.value} value={item.value}>
                                    {item.label}
                                </Option>
                            );
                        })}
                    </Select>
                </Col>
            </Row>
            <Row justify="center" align="middle" style={{ marginTop: '18px' }}>
                <Col span={8}>
                    <p style={{ textAlign: 'right', marginRight: '10px' }}>
                        分类关键字：
                    </p>
                </Col>
                <Col span={14}>
                    <Input
                        maxLength={20}
                        size="small"
                        defaultValue=""
                        status={errorArr.consume_keyword ? 'error' : ''}
                        onChange={(e) => {
                            setData({
                                ...data,
                                consume_keyword: e.target.value,
                            });
                            if (e.target.value) {
                                setErrorArr({
                                    ...errorArr,
                                    consume_keyword: false,
                                });
                            }
                        }}
                    />
                </Col>
            </Row>
            <Row justify="center" align="middle" style={{ height: '22px' }}>
                {errorArr.consume_keyword && (
                    <Col offset={8} span={14}>
                        <span style={{ fontSize: '12px', color: '#ff4d4f' }}>
                            请输入分类关键字
                        </span>
                    </Col>
                )}
            </Row>
            <Row justify="center" align="middle">
                <Col span={8}>
                    <p style={{ textAlign: 'right', marginRight: '10px' }}>
                        项目名称：
                    </p>
                </Col>
                <Col span={14}>
                    <Input
                        maxLength={20}
                        size="small"
                        defaultValue=""
                        status={errorArr.item_name ? 'error' : ''}
                        onChange={(e) => {
                            setData({ ...data, item_name: e.target.value });
                            if (e.target.value) {
                                setErrorArr({
                                    ...errorArr,
                                    item_name: false,
                                });
                            }
                        }}
                    />
                </Col>
            </Row>
            <Row justify="center" align="middle" style={{ height: '22px' }}>
                {errorArr.item_name && (
                    <Col offset={8} span={14}>
                        <span style={{ fontSize: '12px', color: '#ff4d4f' }}>
                            请输入项目名称
                        </span>
                    </Col>
                )}
            </Row>
            <Row justify="center" align="middle">
                <Col span={8}>
                    <p style={{ textAlign: 'right', marginRight: '10px' }}>
                        价格：
                    </p>
                </Col>
                <Col span={14}>
                    <InputNumber
                        maxLength={8}
                        size="small"
                        defaultValue=""
                        status={errorArr.item_price ? 'error' : ''}
                        precision={4}
                        addonAfter={'万'}
                        onChange={(value) => {
                            setData({ ...data, item_price: value });
                            const reg = /^([1-9]\d{0,4}|0)(\.\d{1,4})?$/;
                            if (
                                Number(value) < 0.00001 ||
                                Number(value) > 1000 ||
                                !reg.test(value)
                            ) {
                                setErrorArr({
                                    ...errorArr,
                                    item_price: true,
                                });
                            } else {
                                setErrorArr({
                                    ...errorArr,
                                    item_price: false,
                                });
                            }
                        }}
                    />
                </Col>
            </Row>
            <Row justify="center" align="middle" style={{ height: '22px' }}>
                {errorArr.item_price && (
                    <Col offset={8} span={14}>
                        <span style={{ fontSize: '12px', color: '#ff4d4f' }}>
                            请输入正确的价格
                        </span>
                    </Col>
                )}
            </Row>
        </div>
    );
});

export default AddConfig;
