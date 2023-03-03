export interface SmsServicesProps {
    service_id?: string; // 渠道id
    service_name?: string; // 渠道名称
    service_from?: string; // 来源
    service_status?: number;
    operator?: string;
    support_region?: string;
    status?: number;
    remark?: string;
}

export interface SmsTemplateProps {
    template_id?: number;
    template_type?: string;
    template_name?: string;
    template_status?: number;
    template_content?: string;
    operator?: string;
    language?: string;
    updated_at?: number;
}

export interface SmsTemplateAddProps {
    language: string;
    template_content: string;
    template_id: number;
    template_name: string;
    template_status: number;
    template_type: string;
}

export interface SmsHistoryProps {
    message_id?: number;
    service_name?: string;
    template_type?: string;
    template_name?: string;
    mobile_number?: string;
    message_content?: string;
    message_status?: number;
    error_desc?: string;
    unique_code?: string;
    created_at?: number;
}

export interface SmsSendBatchQuery {
    is_all?: boolean;
    mobile_language?: {
        mobile_number?: string;
        language?: string;
    }[];
    template_name?: string;
    message_content?: string;
}

// 根据户口号查询出相关手机号
export interface MemberPhoneInfo {
    member_code_str?: string;
    member_id?: string; // 户口id
    member_code?: string; // 户口code
    authorizer_id?: string; // 授权人id
    authorizer_name?: string; // 授权人名称
    telephone?: string; // 电话号码
    sending_method?: string; // 发送方式  1.接收短信 2.能否呼叫
    language?: number; // 1.中文 2.英文 3.韩文
}

// 通话记录
export interface TelephoneCallLog {
    id?: string | number;
    [key: string]: any;
}

// 坐席列表
export interface SeatProps {
    id?: string | number;
    hall?: number; // 场馆  "OKADA": 1, 	"COD":   2, 	"HANNA": 3,
    department?: number; // 部门 "市场部": 1, 	"帐房部": 2, 	"礼宾部": 3, 	"电投部": 4,
    status?: number; // 0	Unknown	未知 1	Idle	空闲 2	Inuse	在用 3	Busy	忙 4	Invalid	无效 5	Offline	离线 6	ring	振铃 7	Ringing	回铃 8	hold	保留中
    vip?: string; // 坐席ID
    is_bind?: number; // 是否绑定 0 all 1 绑定 2 未绑定
    group_id?: string; // 技能组
    aid?: string;
    aid_name?: string;
    cti_pwd?: string;
    dnd_status?: string; // 1:置忙，0:置闲
    caller?: string;
    sip_address?: string;
    binder?: string;
    created_at?: number;
    updated_at?: number;
}

export interface callProps {
    id: string; // 坐席id
    action: string;
    called?: string;
    target?: string;
    business_type?: string;
    member_code?: string;
}
