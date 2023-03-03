// 桌台即时概况
import { Page } from '@/types/api/common';
import request from '@/utils/request';
import { CommonList, ResponseData } from '@/types/api/common';
import {
    callProps,
    MemberPhoneInfo,
    SeatProps,
    SmsHistoryProps,
    SmsSendBatchQuery,
    SmsServicesProps,
    SmsTemplateAddProps,
    SmsTemplateProps,
    TelephoneCallLog,
} from '@/types/api/communication';
import { LogProps } from '@/store/communication/types';

// 渠道管理
export const getSmsServiceList = () =>
    request.get<null, ResponseData<CommonList<SmsServicesProps>>>(
        '/api/sms/service/list',
    );
export const smsBalanceCheck = (params: Record<string, string>) =>
    request.get<Record<string, string>, ResponseData<string>>(
        '/api/sms/service/check/balance',
        {
            params,
        },
    );
export const smsServiceUpdate = (params: SmsServicesProps) =>
    request.post<SmsServicesProps, ResponseData<null>>(
        '/api/sms/service/update',
        params,
    );

// 模版管理
export const getSmsTemplateList = (params: Page<SmsTemplateProps>) =>
    request.post<
        Page<SmsTemplateProps>,
        ResponseData<CommonList<SmsTemplateProps>>
    >('/api/sms/template/list', params);

// 模板编辑
export const SmsTemplateUpdate = (params: SmsTemplateProps) =>
    request.post<SmsTemplateProps, ResponseData<null>>(
        '/api/sms/template/update',
        params,
    );

// 模板新增
export const SmsTemplateAdd = (params: SmsTemplateAddProps) =>
    request.post<SmsTemplateProps, ResponseData<null>>(
        '/api/sms/template/add',
        params,
    );

// 短信发送记录
export const getSmsHistoryList = (params: Page<SmsHistoryProps>) =>
    request.post<
        Page<SmsHistoryProps>,
        ResponseData<CommonList<SmsHistoryProps>>
    >('/api/sms/history/list', params);
// 发送记录详情
export const getSmsHistoryDetailList = (params: Record<string, any>) =>
    request.get<Record<string, any>, ResponseData<CommonList<SmsHistoryProps>>>(
        '/api/sms/history/get/bycode',
        { params },
    );
// 短信补发
export const smsResend = (params: Record<string, any>) =>
    request.get<Record<string, any>, ResponseData<null>>(
        '/api/sms/service/resend',
        { params },
    );
// 短信批量补发
export const smsResendBatch = (params: Record<string, any>) =>
    request.post<Record<string, any>, ResponseData<null>>(
        '/api/sms/service/bulk/resend',
        params,
    );

// 群发短信
export const smsSendBatch = (params: SmsSendBatchQuery) =>
    request.post<SmsSendBatchQuery, ResponseData<null>>(
        '/api/sms/service/bulk/send',
        params,
    );
// 根据户口查询手机号
export const getMemberSendMethod = (params: MemberPhoneInfo) =>
    request.post<SmsSendBatchQuery, ResponseData<MemberPhoneInfo[]>>(
        '/api/member/account/getMemberSendMethod',
        // change to below
        // '/api/member/phone/list',
        params,
    );

// 获取通话记录
export const getCallLogList = (params: any) =>
    request.post<TelephoneCallLog, ResponseData<CommonList<TelephoneCallLog>>>(
        '/api/voip/cdr/service/list',
        {
            current: params.page,
            ...params,
        },
    );

// 电话管理 - 坐席列表接口
export const getSeatList = (params?: SeatProps) =>
    request.post<SeatProps, ResponseData<CommonList<SeatProps>>>(
        '/api/voip/seats/service/list',
        params,
    );

// 电话管理 - 绑定/解绑坐席
export const bindSeat = (params: any) =>
    request.post<any, ResponseData<null>>(
        '/api/voip/seats/service/bind',
        params,
    );

// 电话管理 - 坐席 置闲/置忙
export const switchSeatDns = (params: any) =>
    request.get<any, ResponseData<null>>('/api/voip/seats/service/dns', {
        params,
    });

// 拨打电话接口
interface callRes {
    callid: string;
}
export const call = (params: callProps) =>
    request.post<callProps, ResponseData<callRes>>(
        '/api/voip/seats/service/cti',
        params,
    );

// 坐席弹窗 - 获取通话记录
export const getLogList = () =>
    request.post<ResponseData<CommonList<LogProps>>>(
        '/api/voip/cdr/service/list',
        {
            current: 1,
            size: 10,
        },
    );
// 通话绑定户口
export const bind = (params: any) =>
    request.post<ResponseData<null>>('/api/voip/cdr/service/bind', params);
