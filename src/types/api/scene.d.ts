// 查询所有户口
export interface GetCustomerListParams {
    member_code: string;
}
export interface ResCustomerList {}
// 新增客人
export interface CustomerCreateParams {
    member_id: number;
    member_code: string;
    member_name: string;
    customer_name: string;
    mud_chips: number;
    cash_chips: number;
}

export interface CustomerLotteryParams {
    round: string;
    customer_id: string;
    mud_chips: number;
    cash_chips: number;
}
// 查询入场列表
export interface GetSpectacleListParams {
    club: string;
    member_code: string;
    member_name: string;
    customer_name: string;
    scene_status: number;
    currency: string;
    circle_start_date: number;
    circle_end_date: number;
    admission_start_time: number;
    admission_end_time: number;
    page: number;
    size: number;
}

export interface SpectacleListItem {
    summary?: string;
    children?: Array;
    customer_id: string;
    club: number;
    admission_type: number;
    round: string;
    member_code: string;
    member_name: string;
    account_status: number;
    scene_status: number;
    customer_name: string;
    currency: number;
    table_num: string;
    start_work_time: number;
    leave_scene_time: number;
    created_at: number;
    updated_at: number;
    member_tag: string;
    customer_remark: string;
    total_principal: string;
    total_convert_chips: number;
    today_up_down_chips: number;
    customer_num: number;
    leave_scene_sms_color: number;
    add_chips_color: number;
}
export interface ResGetSpectacleList {
    list: Array<SpectacleListItem>;
    total: number;
}

// 查询场次编号
export interface GetRoundListParams {
    member_code: string;
}
export interface ResRoundList {}

export interface customerDetailParams {
    start_work_start_time: number;
    start_work_end_time?: number;
    round: string;
}

export interface CustomerDetailUpdateParams {
    round: string;
    scene_status?: number;
    scene_identity?: number;
    table_num?: string;
    seat_num?: string;
    customer_feature?: string;
}

export interface RemarkListParams {
    round: string;
}
export interface RemarkCreateParams {
    round: string;
    content: string;
}

export interface CircleListParams {
    circle_date?: number;
    currency?: number;
}

interface ParamItem {
    spectacles_circle_id: string;
    today_up_down_chips: number;
    circle_num: number;
}

export interface CircleListUpdateParams {
    param: Array<ParamItem>;
}

export interface CashBalancePaeams {
    round?: string;
}

export interface FooterDateParams {
    start_work_start_time: number;
    start_work_end_time?: number;
    round?: string;
}

export interface BagChipsParams {
    round: string;
    bag_chips: number;
}
