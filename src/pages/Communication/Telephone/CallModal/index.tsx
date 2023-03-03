import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
    BarChartOutlined,
    CloseOutlined,
    PhoneFilled,
} from '@ant-design/icons';
import { Button, Modal, Select, message } from 'antd';
import { seatStatusOptions } from '@/pages/Communication/common';
import CallModalPane from '@/pages/Communication/Telephone/CallModal/components/Pane';
import CallMenus from '@/pages/Communication/Telephone/CallModal/components/LogMenus';
import Keypad from '@/pages/Communication/Telephone/CallModal/components/Keypad';
import { usePhone } from '@/pages/Communication/Telephone/CallModal/usePhone';
import { useSeat } from '@/pages/Communication/Telephone/CallSeat/useSeat';
import './index.scoped.scss';
import useNats from '@/hooks/useNats';
import { switchSeatDns } from '@/api/communication';
import { useHttp, useNewWindow } from '@/hooks';
import { CallStatus } from './common';
import classNames from 'classnames';
import { conversionMomentValue } from '@ant-design/pro-components';
import { useDispatch } from 'react-redux';
import {
    getLogListAsync,
    getSeatListAsync,
} from '@/store/communication/communicationSlice';

interface CallModalProps extends React.ComponentProps<any> {
    trigger?: ReactNode;
}

const CallModal: React.FC<CallModalProps> = ({ trigger }) => {
    const dispatch = useDispatch();
    const [selectedKey, setSelectedKey] = useState<string>();
    const [seat, setSeat] = useState<string>('');
    const {
        isOpenModal,
        modalOpen,
        callLogs,
        onHandUp,
        onAnswer,
        onHold,
        onVcfrun,
        onAtxferDept,
        onAtxferSeat,
        onDial,
        onData,
    } = usePhone();
    const { seatList, currentSeatId, bubSeat } = useSeat();
    const { connect, decode } = useNats();
    const [ws, setWS] = useState(null);
    const [sub, setSub] = useState(null);

    const [status, setStatus] = useState<number>(0);
    const [inServiceStatus, setInServiceStatus] = useState<string>('');
    const { fetchData: switchDns } = useHttp(switchSeatDns);
    const { toNewWindow } = useNewWindow();
    let protocol = 'ws:';
    if (window.location.protocol === 'https:') {
        protocol = 'wss:';
    }
    useEffect(() => {
        // 203.81.177.108:8087 ws://203.81.177.105:8087
        connect(`${protocol}//${window.location.host}/ws`).then((ws) => {
            // connect('wss://test-nats.vipsroom.net/ws').then((ws) => {
            setWS(ws);
        });
        return () => {
            ws && (ws as any).close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(getLogListAsync());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSeatId]);

    useEffect(() => {
        setSeat(currentSeatId as string);
        ws && sub && (sub as any).unsubscribe();
        ws && addSub(ws, currentSeatId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSeatId, ws]);

    useEffect(() => {
        setStatus(seatList?.find((x) => x.id === seat)?.dnd_status || 0);
    }, [seat, seatList]);

    useEffect(() => {
        let inService = callLogs.find((x) =>
            [CallStatus.CALL, CallStatus.RINGING, CallStatus.HOLD].includes(
                x.status,
            ),
        );
        if (inService) {
            setInServiceStatus(inService.status);
        } else {
            setInServiceStatus('');
        }
    }, [callLogs]);

    const addSub = useCallback(
        async (ws, currentSeatId) => {
            if (!currentSeatId) {
                return setSub(null);
            }
            let sub = ws.subscribe(`WS.cdr.event.${currentSeatId}`);
            setSub(sub);
            for await (const m of sub) {
                try {
                    onData(JSON.parse(decode(m.data)), setSelectedKey);
                } catch (e) {
                    console.error(e);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setSelectedKey],
    );

    const handleClick = useCallback(() => {
        modalOpen(!isOpenModal);
    }, [isOpenModal, modalOpen]);

    return (
        <>
            <span onClick={handleClick}>{trigger}</span>

            {!isOpenModal && !!inServiceStatus && (
                <span className="float-call" onClick={() => modalOpen(true)}>
                    <PhoneFilled
                        className={classNames(
                            'icon',
                            inServiceStatus === CallStatus.RINGING
                                ? 'ringing'
                                : '',
                        )}
                    />
                </span>
            )}

            <Modal
                visible={isOpenModal}
                footer={false}
                closable={false}
                bodyStyle={{ padding: 0 }}
                className="call-modal-container"
                wrapClassName="call-modal-wrap"
                destroyOnClose={false}
            >
                <div className="call-container">
                    <div className="header">
                        <div className="header-quick-seat">
                            <div className="label">坐席号</div>
                            <Select
                                className="seat-dropdown"
                                options={seatList?.map((x) => {
                                    return {
                                        value: x.id,
                                        label:
                                            x.id +
                                            `${
                                                x.id === currentSeatId
                                                    ? ' - (您已绑定)'
                                                    : x.binder
                                                    ? ` - (${x.binder})`
                                                    : ''
                                            }`,
                                    };
                                })}
                                value={seat}
                                onChange={(v) => setSeat(v)}
                                bordered={true}
                                showArrow={true}
                                style={{ width: 200 }}
                            />
                            <Button
                                type="primary"
                                disabled={!!currentSeatId}
                                onClick={() => seat && bubSeat({ id: seat })}
                            >
                                绑定
                            </Button>
                            <Button
                                type="primary"
                                // disabled={!currentSeatId}
                                onClick={() =>
                                    seat &&
                                    bubSeat(
                                        { id: currentSeatId || seat },
                                        false,
                                    )
                                }
                            >
                                解绑
                            </Button>
                        </div>
                        <Button
                            className="close"
                            icon={<CloseOutlined />}
                            type="link"
                            onClick={() => modalOpen(false)}
                        />
                    </div>
                    <div className="body">
                        <div className="left">
                            <div className="nav">
                                <div className="seat">
                                    <div className="avatar">
                                        <img
                                            src="https://joeschmoe.io/api/v1/random"
                                            alt=""
                                        />
                                    </div>
                                    <Select
                                        className="status"
                                        options={seatStatusOptions}
                                        onChange={(v) =>
                                            currentSeatId &&
                                            switchDns({
                                                id: currentSeatId,
                                            }).then((res) => {
                                                if (res.code === 10000) {
                                                    message.success('操作成功');
                                                    setStatus(v);
                                                    dispatch(
                                                        getSeatListAsync({}),
                                                    );
                                                }
                                            })
                                        }
                                        value={status}
                                        bordered={false}
                                        showArrow={false}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="menu">
                                    <Keypad
                                        trigger={
                                            <div className="menu-item">
                                                <PhoneFilled className="icon" />
                                                <span className="name">
                                                    拨号器
                                                </span>
                                            </div>
                                        }
                                        onCall={async (phone) => {
                                            return await onDial(String(phone));
                                        }}
                                    />
                                    <div
                                        className="menu-item"
                                        onClick={() =>
                                            toNewWindow(
                                                '/communication/telephone/callLogs',
                                            )
                                        }
                                    >
                                        <BarChartOutlined className="icon" />
                                        <span className="name">通话记录</span>
                                    </div>
                                </div>
                            </div>
                            <div className="call-menus">
                                <CallMenus
                                    selectedKeys={selectedKey}
                                    data={callLogs}
                                    onChange={(item) => {
                                        setSelectedKey(item.id);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="right">
                            {callLogs.map((data) => (
                                // allSelectedKeys.includes(data.code) &&
                                <CallModalPane
                                    currentSeatId={currentSeatId}
                                    key={data.code}
                                    data={data}
                                    seatList={seatList}
                                    show={data.id === selectedKey}
                                    onAnswer={onAnswer}
                                    onHangup={onHandUp}
                                    onHold={onHold}
                                    onVcfrun={onVcfrun}
                                    onAtxferDept={onAtxferDept}
                                    onAtxferSeat={onAtxferSeat}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default CallModal;
