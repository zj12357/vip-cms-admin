import React, {
    MouseEvent,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Button,
    ButtonProps,
    Col,
    Form,
    message,
    Modal,
    Radio,
    Row,
    Table,
    Input,
} from 'antd';
import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';
import './index.scoped.scss';
import { LogProps } from '@/store/communication/types';
import {
    CallStatus,
    callType,
    formatHMS,
} from '@/pages/Communication/Telephone/CallModal/common';
import classNames from 'classnames';
import moment from 'moment';
import { ColumnsType } from 'antd/es/table';
import { getAccountList } from '@/api/account';
import { useNewWindow, useHttp } from '@/hooks';
import { useAppDispatch } from '@/store/hooks';
import { unshiftManyLogs } from '@/store/communication/communicationSlice';
import {
    GetAccountParams,
    AccountListItem,
    AccountSingle,
} from '@/types/api/account';
import { getBindAccount } from '../../usePhone';
import {
    selectHallList,
    selectDepartmentList,
} from '@/store/common/commonSlice';
import { useAppSelector } from '@/store/hooks';
import { bind } from '@/api/communication';

interface Props extends React.ComponentProps<any> {
    data: LogProps;
    onAnswer?: (code: string) => Promise<boolean>; // 接听电话
    onHangup?: (code: string) => Promise<boolean>; // 挂断电话
    onHold?: (code: string, hold?: boolean) => Promise<boolean>; // 通话保持/取消保持
    onVcfrun?: (code: string) => Promise<boolean>; // 密码认证
    onAtxferDept?: (
        code: string,
        hallId: string,
        departmentId: string,
    ) => Promise<boolean>; // 部门转接
    onAtxferSeat?: (code: string, seatId: string) => Promise<boolean>; // 部门转接
    show: boolean; // 是否显示
}

const MyButton: React.FC<
    Omit<ButtonProps, 'onClick'> & {
        onClick: (e: MouseEvent<HTMLElement>) => Promise<any>;
    }
> = (props) => {
    const [loading, setLoading] = useState<boolean>(false);
    return (
        <Button
            {...props}
            loading={loading}
            onClick={async (e) => {
                setLoading(true);
                const res = await props.onClick?.(e)?.finally?.(() => {
                    setLoading(false);
                });
                return Promise.resolve(res);
            }}
        />
    );
};

const BindAccountModal: React.FC<any> = ({ trigger, data, onOk, onCancel }) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleClick = useCallback(() => {
        setOpen(true);
    }, []);

    const handleCancel = useCallback(() => {
        setOpen(false);
        onCancel?.();
    }, [onCancel]);

    const handleChange = useCallback(
        (item: any) => {
            onOk?.(item);
            setOpen(false);
        },
        [onOk],
    );

    const columns = useMemo<ColumnsType<any>>(
        () => [
            {
                title: '户口号',
                dataIndex: 'member_code',
                align: 'center',
            },
            {
                title: '户口名',
                dataIndex: 'member_name',
                align: 'center',
            },
            {
                title: '手机号码',
                dataIndex: 'telephone',
                align: 'center',
            },
            {
                title: '户主/授权人',
                dataIndex: 'type',
                align: 'center',
                render: (value) => (value === 1 ? '户主' : '授权人'),
            },
            {
                title: '授权人姓名',
                dataIndex: 'authorizer_name',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                render: (_, record) => (
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => handleChange?.(record)}
                    >
                        绑定
                    </Button>
                ),
            },
        ],
        [handleChange],
    );

    return (
        <>
            <span onClick={handleClick}>{trigger}</span>
            <Modal
                title="请选择绑定户口"
                visible={open}
                footer={false}
                width={800}
                onCancel={handleCancel}
                wrapClassName="call-modal-inner-wrap"
            >
                <Table
                    size="small"
                    pagination={false}
                    columns={columns}
                    rowKey={(record) => String(record.id)}
                    dataSource={data?.accounts}
                />
            </Modal>
        </>
    );
};

const CallModalPane: React.FC<Props> = ({
    data,
    onHangup,
    onHold,
    onVcfrun,
    onAtxferDept,
    onAtxferSeat,
    show,
    seatList,
    currentSeatId,
}) => {
    const dispatch = useAppDispatch();
    const [isCallHold, setCallHold] = useState<boolean>(false);
    const [callEndTime, setCallEndTime] = useState<number>(0);
    const [authInProgress, setAuthInProgress] = useState<boolean>(false); // 是否密码认证中
    const [departmentForm] = Form.useForm(); // 转部门表单
    const [seatForm] = Form.useForm(); // 转坐席表单
    const bindAccount = data.account;
    const { toNewWindow } = useNewWindow();
    const { fetchData: _fetchDataAccountList } = useHttp<
        GetAccountParams,
        AccountListItem[] & AccountSingle
    >(getAccountList);
    const { fetchData: submitBind } = useHttp(bind as any);

    const hallList = useAppSelector(selectHallList);
    const departmentList = useAppSelector(selectDepartmentList);
    const pwdRef = useRef(data.pwd);
    useEffect(() => {
        // 接听状态
        if (
            [CallStatus.CALL, CallStatus.HOLD].includes(data.status) &&
            data.startTime
        ) {
            const timer = setInterval(() => {
                setCallEndTime(Date.now());
            }, 1000);
            return () => {
                clearInterval(timer);
            };
        } else {
            setCallEndTime(0);
        }
    }, [data.startTime, data.status]);

    useEffect(() => {
        setAuthInProgress(false);
        pwdRef.current = data.pwd;
    }, [data.pwd]);

    useEffect(() => {
        if (authInProgress) {
            setTimeout(() => {
                if (pwdRef.current === undefined) {
                    dispatch(
                        unshiftManyLogs([
                            {
                                code: data.code,
                                pwd: false,
                            },
                        ]),
                    );
                }
            }, 45 * 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authInProgress]);

    // 通话时长（格式化-时分秒）
    const callTimeText = useMemo(
        () => formatHMS(data.startTime!, callEndTime),
        [callEndTime, data.startTime],
    );

    // 接听电话
    // const handleAnswer = useCallback(async () => {
    //     if (!data.code) {
    //         return Promise.reject('数据异常');
    //     }
    //     const res = await onAnswer?.(data.code);
    //     // 接听成功
    //     if (res) {
    //         console.log('接听成功');
    //     }
    // }, [data.code, onAnswer]);

    // 挂断电话
    const handleHangup = useCallback(async () => {
        if (!data.code) {
            return Promise.reject('数据异常');
        }
        const res = await onHangup?.(data.code);
        // 挂断成功
        if (res) {
            return Promise.resolve(true);
        }
        return Promise.reject(false);
    }, [data.code, onHangup]);

    // 通话保持
    const handleCallHold = useCallback(
        async (hold = true) => {
            if (!data.code) {
                return Promise.reject('数据异常');
            }
            const res = await onHold?.(data.code, hold);
            if (res) {
                setCallHold(hold);
                return Promise.resolve(res);
            }
            return Promise.reject(false);
        },
        [data.code, onHold],
    );

    // 密码认证
    const handleVcfrun = useCallback(async () => {
        if (!data.code) {
            return Promise.reject('数据异常');
        }
        if (authInProgress || data.pwd === true) return;
        dispatch(
            unshiftManyLogs({
                code: data.code,
                pwd: undefined,
            }),
        );
        setAuthInProgress(true);
        onVcfrun?.(data.code)
            .catch((err) => {
                console.error(err);
                return false;
            })
            .finally(() => {
                // wait ws to tell pass or not, otherwise timeout
            });
    }, [data.code, data.pwd, authInProgress, dispatch, onVcfrun]);

    // 密码认证按钮文案
    const pwdAuthText = useMemo(() => {
        if (data.pwd === false) {
            setTimeout(() => {
                dispatch(
                    unshiftManyLogs({
                        code: data.code,
                        pwd: undefined,
                    }),
                );
            }, 3000);
        }
        if (authInProgress) {
            return '认证中';
        } else {
            if (data.pwd === undefined) {
                return '密码认证';
            }
            return data.pwd ? '认证成功' : '认证失败';
        }
    }, [authInProgress, data.code, data.pwd, dispatch]);

    // 部门列表
    const departments = useMemo(() => {
        return [
            {
                value: '0',
                label: '服务部',
            },
            {
                value: '1',
                label: '市场部',
            },
            {
                value: '2',
                label: '账房部',
            },
        ];
    }, []);

    const LogTemplate = (params: {
        time: number | string;
        type?: ReactNode;
        content?: ReactNode;
        action?: ReactNode;
    }) => (
        <Row align="middle">
            <span>系统</span>
            <span style={{ margin: '0 5px' }}>
                {moment(params.time).format('YYYY-MM-DD HH:mm:ss')}
            </span>
            {!!params.type && (
                <span style={{ margin: '0 5px' }}>[{params.type}]</span>
            )}
            {!!params.content && (
                <span style={{ margin: '0 5px' }}>{params.content}</span>
            )}
            {!!params.action && (
                <span style={{ margin: '0 5px' }}>{params.action}</span>
            )}
        </Row>
    );

    const templates = useMemo(
        () => ({
            // 来电/外呼
            Ringing: (params: {
                time: number;
                type: string;
                phone: string;
            }) => (
                <LogTemplate
                    time={params.time}
                    type={callType.find((p) => p.value === params.type)?.label}
                    content={params.phone}
                />
            ),
            // 自动检索户口
            SearchAccount: (params: {
                time: number;
                accounts: Record<any, any>[];
                type: string;
            }) => (
                <LogTemplate
                    time={params.time}
                    type={params.type || '自动检索'}
                    content={
                        <span>
                            <span>匹配到</span>
                            <span style={{ color: '#1890ff', margin: '0 3px' }}>
                                {params.accounts?.length || 0}
                            </span>
                            <span>条户口</span>
                        </span>
                    }
                    action={
                        <BindAccountModal
                            trigger={
                                <Button type={'link'} size={'small'}>
                                    查看
                                </Button>
                            }
                            data={params}
                            onOk={async (item: any) => {
                                (
                                    await submitBind({
                                        call_id: data.code,
                                        member_code: item.member_code,
                                        authorizer_id: item.authorizer_id,
                                        bind_type: item.type,
                                    })
                                ).code === 10000 &&
                                    dispatch(
                                        unshiftManyLogs([
                                            {
                                                code: data.code,
                                                account: item,
                                            },
                                        ]),
                                    );
                            }}
                        />
                    }
                />
            ),
            // 录音中
            Recording: (params: { time: number }) => (
                <LogTemplate time={params.time} content={'通话录音中…'} />
            ),
            // 录音中
            Info: (params: { time: number; info: string }) => (
                <LogTemplate time={params.time} content={params.info} />
            ),
            // 通话结束
            END: (params: { time: number }) => (
                <LogTemplate time={params.time} content={'通话已结束…'} />
            ),
            // 已取消
            CANCEL: (params: { time: number }) => (
                <LogTemplate time={params.time} content={'已取消…'} />
            ),
            // 户主绑定
            Binding: (params: { time: number }) => (
                <LogTemplate time={params.time} type={'户主绑定'} />
            ),
        }),
        [data.code, dispatch, submitBind],
    );

    const logs = data.details;
    const Logs = useMemo(() => {
        return logs?.map((l, li) => (
            <div key={li} className="log-item">
                {(templates as any)[l.template]?.(l)}
            </div>
        ));
    }, [logs, templates]);

    const onFinish = async (values: GetAccountParams) => {
        getBindAccount(values.member_code, data.code, dispatch, '手动检索');
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Row
            style={{ display: show ? undefined : 'none' }}
            justify="space-between"
            className="call-modal-pane"
        >
            {[CallStatus.CALL, CallStatus.HOLD].includes(data.status!) && (
                <Row align="middle" className="pane-header">
                    <span className="time">{callTimeText}</span>
                    <Button
                        icon={
                            isCallHold ? (
                                <AudioMutedOutlined className="forbidden" />
                            ) : (
                                <AudioOutlined className="allowed" />
                            )
                        }
                        type="link"
                        onClick={() => handleCallHold(!isCallHold)}
                    />
                </Row>
            )}
            {[CallStatus.CALL, CallStatus.HOLD].includes(data.status!) &&
                (bindAccount ? (
                    <Row
                        justify="space-between"
                        align="middle"
                        className="pane-bind"
                    >
                        <Col span={19}>
                            <Row gutter={[25, 0]}>
                                <Col>
                                    <span>户口号</span>
                                    <span>[{bindAccount.member_code}]</span>
                                </Col>
                                <Col>
                                    <span>户主名</span>
                                    <span>[{bindAccount.member_name}]</span>
                                </Col>
                                <Col>
                                    <span>预留号码</span>
                                    <span>[{bindAccount.telephone}]</span>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={5}>
                            <Row justify="end" gutter={[15, 0]}>
                                <Col>
                                    <Button
                                        size="small"
                                        type="primary"
                                        onClick={() => {
                                            toNewWindow(
                                                `/account/customerAccountDetail/${bindAccount.MemberId}`,
                                            );
                                        }}
                                    >
                                        户口详情
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        size="small"
                                        type="primary"
                                        onClick={async () => {
                                            (
                                                await submitBind({
                                                    call_id: data.code,
                                                    member_code: '',
                                                })
                                            ).code === 10000 &&
                                                dispatch(
                                                    unshiftManyLogs([
                                                        {
                                                            code: data.code,
                                                            account: null,
                                                        },
                                                    ]),
                                                );
                                        }}
                                    >
                                        解绑
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                ) : (
                    <div
                        className="m-header-search intro-step2"
                        style={{ paddingLeft: '15px' }}
                    >
                        <Form
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            className="m-ant-form-inline"
                            style={{
                                transform: 'translateY(12px)',
                                display: 'flex',
                            }}
                        >
                            <Form.Item
                                name="member_code"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            '请输入户口名/户名/手机号/证件名进行查询',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="请输入户口名进行查询"
                                    style={{ width: '300px' }}
                                />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                                <Button type="primary" htmlType="submit">
                                    搜索
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                ))}
            <Row className="pane-body">
                {data && (
                    <div className="seat-logs">
                        <div className="title">坐席记录</div>
                        <div>{Logs}</div>
                    </div>
                )}
            </Row>
            {[CallStatus.CALL, CallStatus.HOLD].includes(data.status!) && (
                <Row className="pane-footer" align="middle">
                    <Col span={8} className="btn-box">
                        <MyButton
                            type="primary"
                            onClick={handleHangup}
                            block
                            danger
                            className="btn"
                            shape="round"
                        >
                            挂断
                        </MyButton>
                    </Col>
                    <Col span={8} className="btn-box">
                        <MyButton
                            type="primary"
                            onClick={async () => handleCallHold(!isCallHold)}
                            block
                            className={classNames(
                                'btn',
                                isCallHold ? 'light' : undefined,
                            )}
                            shape="round"
                        >
                            {isCallHold ? '取消保持' : '通话保持'}
                        </MyButton>
                    </Col>
                    <Col span={8} className="btn-box">
                        <Button
                            type="primary"
                            block
                            className={classNames(
                                'btn',
                                data.pwd === false ? 'fail' : undefined,
                                data.pwd !== undefined || authInProgress
                                    ? 'light'
                                    : undefined,
                            )}
                            shape="round"
                            onClick={handleVcfrun}
                            disabled={!data.account}
                            loading={authInProgress}
                        >
                            {pwdAuthText}
                        </Button>
                    </Col>
                    <Col span={8} className="btn-box">
                        <Button
                            type="primary"
                            block
                            className="btn"
                            shape="round"
                            onClick={() => {
                                Modal.confirm({
                                    wrapClassName: 'call-modal-inner-wrap',
                                    title: '请选择转接场馆/部门',
                                    cancelText: '取消转接',
                                    okText: '立即转接',
                                    content: (
                                        <>
                                            <Form.Item
                                                name="hallId"
                                                label="场馆"
                                            >
                                                <Radio.Group
                                                    options={hallList}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="departmentId"
                                                label="部门"
                                            >
                                                <Radio.Group
                                                    options={departmentList}
                                                />
                                            </Form.Item>
                                        </>
                                    ),
                                    modalRender: (dom) => {
                                        return (
                                            <Form form={departmentForm}>
                                                {dom}
                                            </Form>
                                        );
                                    },
                                    onCancel: () => {
                                        departmentForm.resetFields();
                                    },
                                    onOk: async () => {
                                        const hallId =
                                            departmentForm.getFieldValue(
                                                'hallId',
                                            );
                                        const departmentId =
                                            departmentForm.getFieldValue(
                                                'departmentId',
                                            );
                                        if (!hallId || !departmentId) {
                                            message.error('请选择场馆/部门');
                                            return Promise.reject(false);
                                        }
                                        const res = await onAtxferDept?.(
                                            data.code,
                                            hallId,
                                            departmentId,
                                        );
                                        if (res) {
                                            dispatch(
                                                unshiftManyLogs({
                                                    code: data.code,
                                                    details: [
                                                        {
                                                            time: Date.now(),
                                                            info: '转接中…',
                                                            template: 'Info',
                                                        },
                                                    ],
                                                }),
                                            );
                                            return Promise.resolve(true);
                                        }
                                        return Promise.reject(false);
                                    },
                                });
                            }}
                        >
                            转部门
                        </Button>
                    </Col>
                    <Col span={8} className="btn-box">
                        <Button
                            type="primary"
                            block
                            className="btn"
                            shape="round"
                            onClick={() => {
                                Modal.confirm({
                                    wrapClassName: 'call-modal-inner-wrap',
                                    title: '请选择转接坐席',
                                    cancelText: '取消转接',
                                    okText: '立即转接',
                                    content: (
                                        <Radio.Group
                                            options={seatList
                                                .filter(
                                                    (x: any) =>
                                                        x.id !== currentSeatId,
                                                )
                                                .map((x: any) => {
                                                    return {
                                                        value: x.id,
                                                        label: x.id,
                                                    };
                                                })}
                                        />
                                    ),
                                    modalRender: (dom) => {
                                        return (
                                            <Form form={seatForm}>
                                                <Form.Item name="seatId">
                                                    {dom}
                                                </Form.Item>
                                            </Form>
                                        );
                                    },
                                    onCancel: () => {
                                        seatForm.resetFields();
                                    },
                                    onOk: async () => {
                                        const seatId =
                                            seatForm.getFieldValue('seatId');
                                        if (!seatId) {
                                            message.error('请选择坐席');
                                            return Promise.reject(false);
                                        }
                                        const res = await onAtxferSeat?.(
                                            data.code,
                                            seatId,
                                        );
                                        if (res) {
                                            dispatch(
                                                unshiftManyLogs({
                                                    code: data.code,
                                                    details: [
                                                        {
                                                            time: Date.now(),
                                                            info: '转接中…',
                                                            template: 'Info',
                                                        },
                                                    ],
                                                }),
                                            );
                                            return Promise.resolve(true);
                                        }
                                        return Promise.reject(false);
                                    },
                                });
                            }}
                        >
                            转坐席
                        </Button>
                    </Col>
                </Row>
            )}
        </Row>
    );
};

export default CallModalPane;
