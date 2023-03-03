interface Page {
    page: number;
    size: number;
}
/**开户报表请求参数 */
export interface OpenAccountListParams extends Page {
    hall?: number;
    member_name?: string;
    open_start_time?: number;
    open_end_time?: number;
    identity?: number;
}

/**户口资料报表请求参数 */
export interface AccountInfoListParams extends Page {
    hall?: number;
    member_name?: string;
    open_start_time?: number;
    open_end_time?: number;
    identity?: number;
}

/**M报表请求参数 */
export interface MReportListParams extends Page {
    currency?: number;
    marker_type?: number;
    marker_state?: number;
    start_time?: number;
    end_time?: number;
    member_code?: string;
    hall?: number;
}
/**存取款报表请求参数 */
export interface WalletReportListParams extends Page {
    currency?: number;
    member_code?: string;
    hall?: number;
    type?: number;
    detail_type?: number;
    company_card?: string;
    start_time?: number;
    end_time?: number;
}

/**围数日结报表请求参数 */
export interface CircleListParams extends Page {
    club?: number;
    start_time?: number;
    end_time?: number;
}

/**围数月结报表请求参数 */
export interface CircleMonthListParams {
    club?: number;
    month_start_time?: number;
    month_end_time?: number;
}

export interface CircleSettleParams {
    circle_date: number;
}
/**批额操作记录请求参数 */
export interface MarkerProposalReportListParams extends Page {
    currency?: number;
    type?: number; // '帐变类型  1.批额调整 2.签M 3还M 4利息 5下批 6受批 7回收'
    start_time?: number;
    end_time?: number;
    member_code?: string;
    to_member?: string;
    from_member?: string;
}

/**户口查询记录请求参数 */
export interface MemberRemarksLogListParams extends Page {
    start_time?: number;
    end_time?: number;
    member_code?: string;
    member_name?: string;
}

/**暂存记录请求参数 */
export interface TemporaryRecordListParams extends Page {
    start_time?: number;
    end_time?: number;
    created_by?: string;
    member_code?: string;
    member_name?: string;
}

/**户口验证记录请求参数 */
export interface MemberIdentityRecordParams extends Page {
    start_time?: number;
    end_time?: number;
    created_by?: string;
    member_code?: string;
    member_name?: string;
}

/**佣金-转码记录请求参数 */
export interface CommissionReportListParams extends Page {
    start_time?: number;
    end_time?: number;
    member_code?: string;
    member_name?: string;
}

/**佣金-转码记录详情请求参数 */
export interface CommissionReportDetailParams {
    created_at: string;
    member_code: string;
    currency: number;
}

/**佣金-即出记录请求参数 */
export interface OutGoingReportListParams extends Page {
    start_time?: number;
    end_time?: number;
    member_code?: string;
    member_name?: string;
}

/**佣金-即出记录详情请求参数 */
export interface OutGoingReportDetailParams {
    currency: number;
    member_code: string;
    start_time?: number;
    end_time?: number;
    club: number;
}

/**佣金-月结记录请求参数 */
export interface MonthlyReportListParams extends Page {
    start_time?: number;
    end_time?: number;
    member_code?: string;
    member_name?: string;
}

/**佣金-月结记录详情请求参数 */
export interface MonthlyReportDetailParams {
    currency: number;
    member_code: string;
    club: number;
    commissionStatus?: number;
}

export interface CreditLimitListParams extends Page {
    member_code?: string;
    member_name?: string;
}
export interface MarkerXiaPiListParams {
    member_code: string;
    currency: number;
}
