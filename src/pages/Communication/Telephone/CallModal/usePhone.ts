import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    getSeatListAsync,
    getLogListAsync,
    selectCallLogs,
    selectCurrentCallId,
    selectIsOpenModal,
    unshiftManyLogs,
    setIsOpenModal,
    setKyc,
    selectKyc,
} from '@/store/communication/communicationSlice';
import { CallStatus } from '@/pages/Communication/Telephone/CallModal/common';
import { useCallback, useEffect, useRef } from 'react';
import { LogProps } from '@/store/communication/types';
import { useHttp } from '@/hooks';
import { call } from '@/api/communication';
import { selectCurrentHall } from '@/store/common/commonSlice';
import { useSeat } from '../CallSeat/useSeat';
import { getAccountList } from '@/api/account';
import { message } from 'antd';

// 操作类型
export enum ActionType {
    Dial = 'Dial', // 拨打
    Hangup = 'Hangup', // 挂断
    UnHold = 'UnHold', // 取消保持电话
    Hold = 'Hold', // 通话保持
    Atxfer = 'atxfer', // 电话转移
    Vcfrun = 'vcfrun', // 密码认证
}

export const usePhone = function () {
    const dispatch = useAppDispatch();

    // 是否打开来电弹框
    const isOpenModal = useAppSelector(selectIsOpenModal);
    // 当前通话ID
    const currentCallId = useAppSelector(selectCurrentCallId);
    const currentHall = useAppSelector(selectCurrentHall);

    // 外拨电话接口
    const { fetchData: submitCall } = useHttp(call);
    const callLogs = useAppSelector(selectCallLogs);

    const { currentSeatId } = useSeat();

    useEffect(() => {
        dispatch(
            getSeatListAsync({
                hall: currentHall.id,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentHall.id]);

    // 打开/关闭来电弹框
    const modalOpen = useCallback(
        (open = true) => {
            // true打开，false关闭
            dispatch(setIsOpenModal(open));
        },
        [dispatch],
    );

    const getCurrentSeatId = (currentSeatId: string | undefined) => {
        if (!currentSeatId) {
            message.error('请绑定坐席');
        }
        return currentSeatId as string;
    };
    /**
     * 拨打电话
     */
    const onDial = useCallback(
        async (phoneNumber: string, businessType?: string) => {
            let id = getCurrentSeatId(currentSeatId);
            if (id) {
                let { code, data } = await submitCall({
                    id,
                    action: ActionType.Dial,
                    called: String(phoneNumber),
                    business_type: businessType,
                });
                // init kyc
                if (businessType) {
                    dispatch(
                        setKyc({
                            callId: data.callid,
                            for: businessType,
                            status: undefined,
                        }),
                    );
                }

                return code === 10000;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentSeatId],
    );

    /**
     * 挂断电话
     */
    const onHandUp = useCallback(
        async (code: string) => {
            return (
                (
                    await submitCall({
                        id: getCurrentSeatId(currentSeatId),
                        action: ActionType.Hangup,
                    })
                ).code === 10000
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentSeatId],
    );

    /**
     * 通话保持/取消保持
     */
    const onHold = useCallback(
        async (code: string, hold?: boolean) => {
            return (
                (
                    await submitCall({
                        id: getCurrentSeatId(currentSeatId),
                        action: hold ? ActionType.Hold : ActionType.UnHold,
                    })
                ).code === 10000
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentSeatId],
    );

    /**
     * 密码认证
     */
    const onVcfrun = useCallback(
        async (code: string) => {
            return (
                (
                    await submitCall({
                        id: getCurrentSeatId(currentSeatId),
                        action: ActionType.Vcfrun,
                    })
                ).code === 10000
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentSeatId],
    );

    // 转部门
    const onAtxferDept = useCallback(
        async (code: string, hallId: string, departmentId: string) => {
            return (
                (
                    await submitCall({
                        id: getCurrentSeatId(currentSeatId),
                        action: ActionType.Atxfer,
                        target: `${hallId},${departmentId}`,
                    })
                ).code === 10000
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentSeatId],
    );

    /**
     * 转坐席
     */
    const onAtxferSeat = useCallback(
        async (code: string, anotherSeatId: string) => {
            return (
                (
                    await submitCall({
                        id: getCurrentSeatId(currentSeatId),
                        action: ActionType.Atxfer,
                        target: anotherSeatId,
                    })
                ).code === 10000
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentSeatId],
    );

    /**
     * 接听电话
     */
    const onAnswer = useCallback(
        async (code: string) => {
            return Promise.reject();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentSeatId],
    );

    return {
        isOpenModal,
        modalOpen,
        callLogs,
        onAnswer,
        onHandUp,
        onHold,
        onVcfrun,
        onAtxferDept,
        onAtxferSeat,
        onDial,
        currentCallId,
        onData(data: any, setSelectedKey?: any) {
            switch (data.Packet) {
                case 'DTMFS':
                    return dispatch(
                        unshiftManyLogs([
                            {
                                code: data.callid,
                                pwd: !!data.verify_result,
                            },
                        ]),
                    );
                case 'Event':
                    let log = makeUpData(data, dispatch);
                    if (log.status === CallStatus.RINGING) {
                        setSelectedKey(log.id);
                    }
                    dispatch(unshiftManyLogs([log]));
            }
        },
    };
};

function makeUpData(data: any, dispatch: any) {
    let log: LogProps = {
        id: data.id,
        // 匹配的户口
        account: undefined,
        // 唯一标识
        code: data.callid,
        // i 表示来电，显示主叫
        // 非i 表示去电，显示被叫
        phone: data.ct === 'i' ? data.caller : data.called,
        // 电话类型，预留/非预留
        phoneType: data.mobile_number_type,
        // '0' 表来电， '1' 表去电
        callType: data.ct === 'i' ? '0' : '1',
        // 状态
        status: data.Event,
        // 开始时间
        startTime: data.Event === CallStatus.CALL ? Date.now() : 0,
        // 结束时间
        endTime: data.Event === CallStatus.END ? Date.now() : 0,
        // 详情
        details: [],
    };

    // make event
    if (data.DID) {
        log.status = CallStatus.CANCEL;
    }

    let detail = {
        time: Date.now(),
        type: log.callType,
        phone: log.phone,
        template: '',
    };
    switch (log.status) {
        case CallStatus.RINGING:
            detail.template = 'Ringing';
            if (data.AuthorizerList) {
                // 已匹配到户口
                setTimeout(() => {
                    dispatch(
                        unshiftManyLogs({
                            code: log.code,
                            details: [
                                {
                                    time: Date.now(),
                                    accounts: data.AuthorizerList,
                                    template: 'SearchAccount',
                                },
                            ],
                        }),
                    );
                }, 0);

                if (data.AuthorizerList.length === 1) {
                    log.account = data.AuthorizerList[0];
                }
            }
            break;

        case CallStatus.CALL:
            detail.template = 'Recording';
            break;

        case CallStatus.END:
            detail.template = 'END';
            break;

        case CallStatus.CANCEL:
            detail.template = 'CANCEL';

            break;
    }

    log.details.push(detail);
    return log;
}

export async function getBindAccount(
    phone: string,
    code: string,
    dispatch: any,
    type?: string,
) {
    let data: any = (await getAccountList({ member_code: phone })).data;
    if (data) {
        data = [
            {
                member_id: data.member_id,
                member_code: data.member_code,
                member_name: data.member_name,
                telephone: data.telephone ? data.telephone[0] || '-' : '-',
                type: 1,
                authorizer_name: '-',
                authorizer_id: '',
            },
        ];
        dispatch(
            unshiftManyLogs({
                code,
                details: [
                    {
                        time: Date.now(),
                        accounts: data,
                        template: 'SearchAccount',
                        type,
                    },
                ],
            }),
        );
    }
}
