export interface AddChipParams {
    hall_id: number;
    hall_name: string;
    chips_name: string;
    currency_id: number;
    currency_code: string;
    use_for: number;
    mode: number;
    use_type: string;
    capital_type: string;
}

export interface ChipSettingParams {
    currency_code?: number;
    user_for?: number;
}

export interface ChipSettingItem {
    id: number;
    created_at: number;
    updated_at: number;
    hall_id: number;
    hall_name: string;
    chips_list: Array<any>;
    currency_id: number;
    currency_code: string;
    tag_of_member: string;
    chips_type: number;
    use_for: number;
    mode: number;
    use_type: string;
    capital_type: string;
    percent: number;
    create_by_id: string;
    creator_name: string;
    isShowMode: boolean;
}

export interface ChipManageItem {
    created_at: number;
    updated_at: number;
    id: number;
    hall_id: number;
    hall_name: string;
    chips_name: string;
    currency_id: number;
    currency_code: string;
    create_by_id: string;
    creator_name: string;
}

export interface ChipManageRes {
    list: ChipManageItem[];
}

export interface BuyChipParams {
    hall_id: number;
    hall_name: string;
    chips_id: number;
    chips_name: string;
    amount: number;
    remark?: string;
    trade_kind: number;
}

export interface RefundParams {
    hall_id: number;
    hall_name: string;
    chips_id: number;
    chips_name: string;
    amount: number;
    junkets_amount: number;
    remark?: string;
    trade_kind: number;
}

export interface ChangeParams {
    hall_id: number;
    hall_name: string;
    chips_id: number;
    chips_name: string;
    amount: number;
    trade_kind: number;
}

export interface ShiftListParams {
    admin_name?: string;
    start_time?: number;
    end_time?: number;
}

export interface ShiftHeadParams {
    currency_id: number;
    order_no: string;
}
export interface ShiftTranscodingParams {
    mdate: number;
    order_no: string;
}
export interface MonthHeadParams {
    hall_id: number;
    mdate: number;
    currency_id: number;
}

export interface MonthListParams {
    created_at_from?: number;
    created_at_end?: number;
    creator_name?: string;
}

export interface BuRecordParams {
    created_at_from?: number;
    created_at_end?: number;
    operation?: number;
    creator_name?: string;
    currency_id?: 1;
}
