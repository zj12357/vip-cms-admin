import React, { FC, useState, useEffect, useRef } from 'react';
import {
    Row,
    Col,
    Table,
    Button,
    Popover,
    Typography,
    Tag,
    Input,
    Image,
    message,
} from 'antd';
import type { InputRef } from 'antd';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { useHttp } from '@/hooks';
import { customerDetailUpdate } from '@/api/scene';
import { CustomerDetailUpdateParams } from '@/types/api/scene';
import { admissionType, workType } from '@/common/commonConstType';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
import '../../index.scoped.scss';

type ClientDetailsProps = {
    round: string;
    resData: {
        customer_name: string;
        admission_type: number;
        currency: number;
        start_work_type: number;
        shares_type: string;
        principal_type: string;
        customer_feature: string;
        shares_rate: number;
        shares_bottom_rate: number;
        start_work_time: number;
        leave_scene_time: number;
        customer_photo: string;
        scene_status: number;
    };
};

const ClientDetails: FC<ClientDetailsProps> = (props) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const { resData, round } = props;
    const [tips, setTips] = useState<any>([]);
    const [isEditor, setIsEditor] = useState(false);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<InputRef>(null);
    const { fetchData: fetchCustomerDetailUpdate } = useHttp<
        CustomerDetailUpdateParams,
        any
    >(customerDetailUpdate);

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    useEffect(() => {
        const originalTips = resData && resData.customer_feature.split(',');
        setTips(originalTips);
    }, [resData]);

    const tipItemClose = (e: React.MouseEvent<HTMLElement>, i: number) => {
        e.preventDefault();
        const newTips = [...tips];
        newTips.splice(i, 1);
        setTips(newTips);
    };

    const saveTips = () => {
        fetchCustomerDetailUpdate({
            round,
            customer_feature: tips.filter((item: any) => item).join(),
        }).then((res) => {
            if (res.code === 10000) {
                message.success(res.msg);
                setIsEditor(false);
            }
        });
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && tips.indexOf(inputValue) === -1) {
            setTips([...tips, inputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    };

    const columns: any[] = [
        {
            title: '',
            dataIndex: 'title',
            key: 'title',
            onCell: (_: any, index: number) => {
                if (index === 5) {
                    return { colSpan: 5 };
                }
                return {};
            },
            render: (_: any, record: any, index: number) => {
                if (index === 5) {
                    return (
                        <>
                            {record.title &&
                                record.title.map((item: string, i: number) => {
                                    if (item) {
                                        return (
                                            <Tag
                                                style={{ marginBottom: '5px' }}
                                                closable={
                                                    isEditor ? true : false
                                                }
                                                onClose={(e) => {
                                                    tipItemClose(e, i);
                                                }}
                                                key={i}
                                            >
                                                {item}
                                            </Tag>
                                        );
                                    } else {
                                        return '';
                                    }
                                })}
                            {inputVisible && (
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    size="small"
                                    maxLength={20}
                                    className="tag-input"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onBlur={handleInputConfirm}
                                    onPressEnter={handleInputConfirm}
                                    style={{ width: '80px' }}
                                />
                            )}
                            {!inputVisible && isEditor && (
                                <Tag
                                    className="site-tag-plus"
                                    onClick={showInput}
                                >
                                    <PlusOutlined /> 新标签
                                </Tag>
                            )}
                            <br />
                            {isEditor ? (
                                <div
                                    style={{ marginTop: '8px', float: 'right' }}
                                >
                                    <Button
                                        onClick={() => {
                                            setTips(
                                                resData &&
                                                    resData.customer_feature.split(
                                                        ',',
                                                    ),
                                            );
                                            setIsEditor(false);
                                        }}
                                        style={{ marginRight: '8px' }}
                                    >
                                        取消
                                    </Button>
                                    <Button onClick={saveTips} type="primary">
                                        保存
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setIsEditor(true);
                                    }}
                                    style={{ marginTop: '8px', float: 'right' }}
                                >
                                    编辑
                                </Button>
                            )}
                        </>
                    );
                } else {
                    return record.title;
                }
            },
        },
        {
            title: '',
            dataIndex: 'value',
            key: 'value',
            onCell: (_: any, index: number) => {
                if (index === 5) {
                    return { colSpan: 0 };
                }
                return {};
            },
        },
        {
            title: '',
            dataIndex: 'title2',
            key: 'title2',
            onCell: (_: any, index: number) => {
                if (index === 5) {
                    return { colSpan: 0 };
                }
                return {};
            },
        },
        {
            title: '',
            dataIndex: 'value2',
            key: 'value2',
            onCell: (_: any, index: number) => {
                if (index === 3 || index === 4) {
                    return { colSpan: 2 };
                }
                if (index === 5) {
                    return { colSpan: 0 };
                }
                return {};
            },
        },
        {
            title: '',
            dataIndex: 'photo',
            key: 'photo',
            width: 100,
            onCell: (_: any, index: number) => {
                if (index === 3 || index === 4) {
                    return { colSpan: 0 };
                }
                if (index === 5) {
                    return { colSpan: 0 };
                }
                return {};
            },
        },
    ];
    const data: any[] = [
        {
            uid: '1',
            title: '客户名：',
            value: resData && resData.customer_name,
            title2: '入场类型：',
            value2:
                resData &&
                admissionType.find(
                    (item) => item.value === resData.admission_type,
                )?.label,
            photo: '',
        },
        {
            uid: '2',
            title: '开工币种：',
            value:
                resData &&
                currencyList.find((item) => item.value === resData.currency)
                    ?.label,
            title2: '开工类型：',
            value2:
                resData &&
                workType.find((item) => item.value === resData.start_work_type)
                    ?.label,
            photo: '',
        },
        {
            uid: '3',
            title: '本金类型：',
            value: resData && resData.principal_type,
            title2: '出码类型：',
            value2: resData && resData.shares_type,
            photo: '',
        },
        {
            uid: '4',
            title: '占成数：',
            value:
                resData &&
                `${resData.shares_rate}%,${resData.shares_bottom_rate}%`,
            title2: '',
            value2: '',
            photo: '',
        },
        {
            uid: '5',
            title: '场面入场时间：',
            value:
                resData && resData.start_work_time
                    ? moment(resData.start_work_time * 1000).format(
                          'YYYY-MM-DD HH:mm:ss',
                      )
                    : '',
            title2: '场面离场时间：',
            value2:
                resData &&
                resData.scene_status === 3 &&
                resData.leave_scene_time
                    ? moment(resData.leave_scene_time * 1000).format(
                          'YYYY-MM-DD HH:mm:ss',
                      )
                    : '',
            photo: '',
        },
        {
            uid: '6',
            title: tips,
        },
    ];
    return (
        <>
            <div className="s-info">
                <Table
                    style={{ width: '100%' }}
                    size="small"
                    rowKey={'uid'}
                    bordered
                    pagination={false}
                    columns={columns}
                    showHeader={false}
                    dataSource={data}
                />
                <div className="s-photo">
                    <Image
                        width={100}
                        height={117}
                        src={
                            resData && resData.customer_photo
                                ? resData.customer_photo
                                : 'error'
                        }
                        fallback="data:image/png;base64,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"
                    />
                </div>
            </div>
        </>
    );
};

export default ClientDetails;
