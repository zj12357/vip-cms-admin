export const lineTypes = [
    {
        value: '0',
        label: '会话',
    },
];

export enum ServiceType {
    IN_SERVICE = 'in-service',
    COMPLETE = 'complete',
    MISSED = 'missed',
}
export const serviceType = [
    {
        value: ServiceType.IN_SERVICE,
        label: '服务中',
    },
    {
        value: ServiceType.COMPLETE,
        label: '已结束',
    },
    {
        value: ServiceType.MISSED,
        label: '未接起',
    },
];

export enum CallStatus {
    RINGING = 'Dial', // 振铃中
    CALL = 'Connect', // 通话中
    END = 'DisConnect', // 通话结束
    CANCEL = 'Cancel', // 已取消

    MISSED = '', // 未接电话
    HANGUP_USER = 'UserDisConnect', // 客人挂断
    HANGUP_SERVICE = 'CSRDisConnect', // 客服挂断
    HOLD = 'Hold', // 通话保持
    NOANSWER = 'NOANSWER', // 无人接听
}
export const callStatus = [
    {
        value: CallStatus.RINGING,
        label: '振铃中',
    },
    {
        value: CallStatus.CALL,
        label: '通话中',
    },
    {
        value: CallStatus.END,
        label: '通话结束',
    },
    {
        value: CallStatus.CANCEL,
        label: '已取消',
    },
    {
        value: CallStatus.HANGUP_USER,
        label: '客人挂断',
    },
    {
        value: CallStatus.HANGUP_SERVICE,
        label: '客服挂断',
    },
    {
        value: CallStatus.MISSED,
        label: '未接电话',
    },

    {
        value: CallStatus.HOLD,
        label: '通话保持',
    },
    {
        value: CallStatus.NOANSWER,
        label: '无人接听',
    },
];

export const phoneType = [
    {
        value: '0',
        label: '预留',
    },
    {
        value: '1',
        label: '非预留',
    },
];

export const callType = [
    {
        value: '0',
        label: '来电',
    },
    {
        value: '1',
        label: '呼出',
    },
];

export const formatHMS = (
    startTime: number | string,
    endTime: number | string,
): string => {
    let callTime = 0;
    if (startTime && endTime) {
        callTime =
            (new Date(endTime).getTime() - new Date(startTime).getTime()) /
            1000;
    }
    const h = Math.floor(callTime / 60 / 60);
    const m = Math.floor((callTime / 60) % 60);
    const s = Math.floor((callTime % 60) % 60);
    const fmt = (n: number) => {
        if (String(n || 0).length >= 2) {
            return String(n);
        }
        const v = `00${n}`;
        return v.substring(v.length - 2);
    };
    return `${fmt(h)}:${fmt(m)}:${fmt(s)}`;
};
