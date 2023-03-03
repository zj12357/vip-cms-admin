import { CallStatus } from '@/pages/Communication/Telephone/CallModal/common';

export interface LogProps {
    id?: string;
    code: string; // 通话标识
    phone: string; // 电话号码
    phoneType: string; // 电话类型，预留/非预留
    callType: string; // 通话类型，来电/外呼
    status: CallStatus; // 通话状态
    createdTime?: number; // 记录生成时间
    startTime?: number; // 通话开始时间
    endTime?: number; // 通话结束时间
    details: any[]; // 通话详情
    account?: any; // 匹配的户口
    // check pwd
    // default to undefined,
    // false to fail
    // true to pass
    pwd?: boolean | undefined;
}
export interface UpdateLogProps {
    code: string; // 通话唯一标识
    [key: string]: any;
}

export interface Kyc {
    // purpose for call
    for: string;
    // pwd status
    // undefined -> unset
    // null -> progress
    // true -> success
    // false -> fail
    status: boolean | undefined | null;
    // call identity
    callId: string;
}

export interface communicationState {
    isOpenModal: boolean;
    callLogs: LogProps[];
    currentCallId?: string;
    currentSeatId?: string;
    seatList?: any[];
    kyc?: Kyc;
}
