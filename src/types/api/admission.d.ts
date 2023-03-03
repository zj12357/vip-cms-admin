// 查询开工列表
export interface WorkListParams {
    club?: string;
    account?: string;
    account_name?: string;
    customer_name?: string;
    admission_type?: number;
    currency?: string;
    start_work_type?: number;
    principal_type?: string;
    admission_time?: number;
    shares_type?: string;
    principal?: string;
    total_convert_chips?: number;
    round?: string;
    admission_start_time?: number;
    admission_end_time?: number;
    page?: number;
    size?: number;
}
export interface resWorkList {}

// 新增转码
export interface ChipsCreateParams {
    round: string;
    chips_num: number;
    remark?: string;
}

// 新增公水
export interface CreateChipsParams {
    round: string;
    mud_chips: number;
    cash_chips: number;
    remark?: string;
}
// 新增荷水
export interface CreateCroupierParams {
    round: string;
    mud_chips: number;
    cash_chips: number;
    remark?: string;
}
// 新增暂存
export interface CreateStorageParams {
    round: string;
    mud_chips: number;
    cash_chips: number;
    is_suspend_start_work: number;
    remark?: string;
}
// 查询暂存总额
export interface getStorageDetailsParams {
    round: string;
}
// 新增取暂存
export interface CreateStorageTemporaryParams {
    round: string;
    take_temp_chips: number;
    remark?: string;
    is_suspend_start_work: number;
}
// 查询收工详情
export interface GetWorkDetailsParams {
    round: string;
}
// 查询收工详情 V1
export interface GetWorkSettlementParams {
    round: string;
    total_temp_chips: number;
    mud_chips: number;
    cash_chips: number;
    cash_settlement: number;
    deposit_card_settlement?: number;
    marker_settlement?: number;
    remark?: string;
}
export interface StopWorkParams {
    round: string;
    total_temp_chips: number;
    mud_chips: number;
    cash_chips: number;
    cash_settlement: number;
    deposit_card_settlement?: number;
    marker_settlement?: number;
    remark?: string;
}

// 查询开工客户信息
export interface GetAccountDetailParams {
    round: string;
}
export interface AccountDetails {}

// 暂存列表
export interface StorageListParams {
    round: string;
    convert_chips_type: number;
    page: number;
    size: number;
}

// 查询转码记录列表
export interface ChipsListParams {
    recode_type: number;
    round: string;
    convert_chips_type: number;
    page: number;
    size: number;
}
export interface resChipsList {}

// 新增加彩
export interface CreateCashParams {
    round?: string;
    principal_type?: string;
    deposit_card_add_chips?: number;
    marker_add_chips?: number;
    cash_add_chips?: number;
    total_add_chips?: number;
    table_bottom_multiple: string;
    table_bottom_deposit?: number;
    frozen_share_deposit?: number;
    frozen_share_deposit_used?: number;
    remark?: string;
}
// 新增回码
export interface CreateReturnParams {
    round?: string;
    mud_chips?: number;
    cash_chips?: number;
    table_bottom_multiple?: number;
    table_bottom_deposit?: number;
    un_frozen_share_deposit?: number;
    cash_settlement?: number;
    deposit_card_settlement?: number;
    marker_settlement?: number;
    remark?: string;
}

// 查询入场记录列表
export interface admissionHistoryListParams {
    club: string;
    account: string;
    customer_name: string;
    round: string;
    admission_type: number;
    currency: string;
    start_work_type: number;
    start_work_start_time: number;
    start_work_end_time: number;
    stop_work_start_time: number;
    stop_work_end_time: number;
    page: number;
    size: number;
}
export interface resAdmissionHistoryList {}

export interface GetStartWorkDetailsParams {
    round: string;
}

export interface PrintChipsProps {
    member_code: string; // 户口号
    convert_chips_type: number; // 转码类型 1. 开工, 2 转码, 3 加彩, 4 回码, 5 公水, 6 荷水, 7 暂存, 8 去暂存, 9 收工
    round: string; // 提案编号
    amount: number; // 金额数量
    convert_chips: number; // 转码量
    total_convert_chips: number; // 总转码量
    created_at: number; // 时间
}
export interface UpdateStartWorkDetailsParams {
    round: string;
    remark: string;
}
