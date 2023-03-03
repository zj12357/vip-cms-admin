// 查询开户报表
export interface AccountOpeingParams {
    openAccountStartTime?: number;
    openAccountEndTime?: number;
    admissionIdentity?: string;
    venue?: string;
    account?: string;
    page: number;
    size: number;
}

// 查询开户资料报表
export interface AccountInformationParams {
    openAccountStartTime?: number;
    openAccountEndTime?: number;
    admissionIdentity?: string;
    venue?: string;
    account?: string;
    page: number;
    size: number;
}
// 查询存取款报表
export interface FinanceParams {
    tradeStartTime?: number;
    tradeEndTime?: number;
    tradeType?: string;
    currency?: string;
    venue?: string;
    account?: string;
    page: number;
    size: number;
}
