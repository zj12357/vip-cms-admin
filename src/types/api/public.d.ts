//货币类型
export interface CurrencyOptions {
    id: number;
    currency_code: string;
    currency_name: string;
    permission: string;
}

//场馆类型
export interface HallOptions {
    id: number;
    hall_name: string;
}

//当前场馆类型
export interface CurrentHallType {
    hall_name: string;
    currency: number;
    id: number;
}

//获取部门
export interface DepartmentOptions {
    created_at: number;
    created_name: string;
    department_name: string;
    id: number;
    updated_at: number;
    updated_name: string;
}

//验证操作码
export interface VerifyOpcodeParams {
    m: number;
    o: string;
    s?: string;
}
