import { CommonList } from './common.d';
//新增户口类型
export interface CreateMemberTypeParams {
    name: string;
}
export interface ParamConfigType {
    param_name: string;
    param: ParamConfigArrItem[];
}

export interface ParamConfigArrItem {
    start_type: number;
    code_type: string;
    principal_type: string;
    shares_rate: string;
    commission_rate: string;
    point_rate: string;
}

export interface MemberTypeListItem {
    created_at: number;
    is_open: number;
    last_operator: string;
    name: string;
    member_type_id: number;
    updated_at: number;
    currency_type: number;
}

//修改户口类型
export interface UpdateMemberTypeParams {
    member_type_id: number;
    name?: string;
    is_open?: number;
}

//查询占成
export interface GetCommissionParams {
    currency: number;
    type: number; //1线下 2线上
    member_type_id: number;
}
export interface CommissionListItem {
    code_type: string;
    commission_rate: string;
    currency: number;
    currency_code: string;
    index: number;
    is_open: number;
    member_code: string;
    member_id: string;
    member_type: number;
    param_config_id: number;
    param_name: string;
    point_rate: string;
    principal_type: string;
    shares_rate: string;
    start_type: number;
}

//修改占成
export interface UpdateSharesParams {
    type: number;
    member_type_id: number;
    currency: number;
    currency_code: string;
    param_config_arr: ParamConfigType[];
}

//修改佣金/积分率
export interface UpdateCommissionParams {
    type: number;
    param_id: number;
    point_rate: string;
    commission_rate: string;
    shares_rate?: string;
}

//新增户口身份
export interface CreateMemberIdentityParams {
    name: string;
}

//修改户口身份
export interface UpdateMemberIdentityParams {
    member_identity_id: number;
    name?: string;
    is_open?: number;
}

//获取户口身份列表
export interface GetMemberIdentityParams {
    member_identity_id?: number;
}

export interface GetMemberIdentityListItem {
    member_identity_id: number;
    name: string;
    last_operator: string;
    is_open: number;
    created_at: number;
    updated_at: number;
}

//新增积分配置
export interface CreateIntegralParams {
    type: number;
    currency_id: number;
    currency_name: string;
}

//修改积分配置
export interface UpdateIntegralParams {
    id: number;
    type: number;
    currency_id: number;
    currency_name: string;
}

//查询积分设置
export interface GetIntegralListItem {
    created_at: number;
    created_name: string;
    currency_id: number;
    currency_name: string;
    id: number;
    state: number;
    type: number;
    updated_at: number;
    updated_name: string;
}

//查询信贷列表
export interface GetCreditCfgListItem {
    id: number;
    marker_type: string;
    marker_type_name: string;
    expired_day: number;
    rate: string;
    created_at: number;
    updated_at: number;
}
export interface UpdateCreditCfgParams {
    id: number;
    expired_day: number;
    rate: string;
}
export interface UpdateIntegralStateParams {
    id: number;
    state: number;
}

//币种汇率
export interface WalletCurrencyListItem {
    created_at: number;
    id: number;
    left_currency_code: string;
    left_currency_id: number;
    left_min_integer: number;
    left_unit_rate: string;
    right_currency_code: string;
    right_currency_id: number;
    right_min_integer: number;
    right_unit_rate: string;
    updated_at: number;
}

//修改汇率
export interface UpdateWalletRateParams {
    id: number;
    left_unit_rate: string;
    exchange_in: string;
    exchange_out: string;
}

//获取历史汇率
export interface GetRateRecordListParams {
    start_time?: number;
    end_time?: number;
    page: number;
    size: number;
}

export type RateRecordListType = CommonList<RateRecordListItem>;

export interface RateRecordListItem {
    created_at: string;
    exchange_in: string;
    exchange_out: string;
    exchange_rate: string;
    id: number;
    operation: string;
}

//菜单新增
export interface CreateMenuParams {
    parent_id: number;
    menu_name: string;
    menu_type: string;
    menu_location: string;
    path: string;
    icon?: string;
    opcode?: number;
    normal?: string;
    depart_ids?: string[];
}

//获取菜单列表
export interface GetMenuListParams {
    menu_name?: string;
}
export interface MenuListItem {
    menu_id: number;
    menu_name: string;
    parent_id: number;
    order_num: number;
    path: string;
    menu_type: string;
    menu_location: string;
    icon: string;
    created_at: number;
    updated_at: number;
    created_name: string;
    updated_name: string;
    normal: string;
    opcode: number;
    depart_ids: string[];
    children: MenuListItem[];
}

//菜单更新
export interface UpdateMenuParams {
    menu_id: number;
    parent_id: number;
    menu_name: string;
    menu_type: string;
    menu_location: string;
    path: string;
    icon?: string;
    opcode?: number;
    normal?: string;
    depart_ids?: string[];
}

//新建部门
export interface CreateDepartParams {
    department_name: string;
}

//部门查询
export interface GetDepartListParams {
    department_name?: string;
    updated_name?: string;
}
export interface DepartListItem {
    created_at: number;
    created_name: string;
    department_name: string;
    id: number;
    updated_at: number;
    updated_name: string;
}

//部门成员

export interface DepartMemberListItem {
    depart_name: string;
    admins: DepartAdminsItem[];
}
export interface DepartAdminsItem {
    admin_id: number;
    created_at: number;
    created_name: string;
    updated_at: number;
    user_name: string;
    login_name: string;
    department_id: number;
    department_name: string;
    department_level_id: number;
    department_level_name: string;
    department_title_id: number;
    department_title_name: string;
    tel: string;
    hall_id: number;
    hall_name: string;
    last_login_at: number;
    last_login_ip: string;
    last_log_mac_address: string;
    state: number;
}

//更新部门
export interface UpdateDepartParams {
    id: number;
    department_name: string;
}

//职务创建
export interface CreateDepartTitleParams {
    department_id: number;
    department_name: string;
    title_name: string;
}
//职务更新
export interface UpdateDepartTitleParams {
    id: number;
    department_id: number;
    title_name: string;
    department_name: string;
}

//职务查询
export interface GetDepartTitleListParams {
    department_id?: number;
    updated_name?: string;
}

export interface DepartTitleListItem {
    department_name: string;
    created_at: number;
    updated_name: string;
    department_id?: number;
    department_title_name?: string;
    copy_department_name?: string;
    id: ?number;
    r: DepartTitleRItem[];
}
export interface DepartTitleRItem {
    id: number;
    created_at: number;
    updated_at: number;
    created_name: string;
    updated_name: string;
    department_title_name: string;
    department_id: number;
    department_name: string;
    copy_department_name?: string;
}

//职级新增
export interface CreateDepartLevelParams {
    department_id: number;
    department_name: string;
    level_name: string;
    menus: number[];
    menu_ids?: number[];
}

//职级查询
export interface GetDepartLevelListParams {
    department_id: ?number;
    updated_name?: string;
}
export interface DepartLevelListItem {
    department_name: string;
    created_at: number;
    updated_name: string;
    department_id?: number;
    department_level_name?: string;
    copy_department_name?: string;
    id: ?number;
    r: DepartTitleRItem[];
    menu_ids?: number[];
    menus: number[];
}
export interface DepartLevelRItem {
    created_at: number;
    created_name: string;
    department_id: number;
    department_level_name: string;
    department_name: string;
    id: number;
    updated_at: number;
    updated_name: string;
    copy_department_name?: string;
    menu_ids: number[];
}

//职级更新
export interface UpdateDepartLevelParams {
    department_name: string;
    department_id: number;
    level_name: string;
    menus: number[];
    menu_ids?: number[];
    id: number;
}

//后台账号创建
export interface CreateAdminAccountParams {
    hall_id: number;
    hall_name: string;
    state: number;
    user_name: string;
    tel: string;
    login_name: string;
    department_id: number;
    department_name: string;
    department_title_id: number;
    department_title_name: string;
    department_level_id: number;
    department_level_name: string;
    password: string;
    g_code?: string;
}

//后台账号编辑
export interface UpdateAdminAccountParams {
    admin_id: number;
    hall_id: number;
    hall_name: string;
    state: number;
    user_name: string;
    tel: string;
    login_name: string;
    department_id: number;
    department_name: string;
    department_title_id: number;
    department_title_name: string;
    department_level_id: number;
    department_level_name: string;
    password: string;
    g_code?: string;
}
//后台账号查询
export interface GetAdminAccountListParams {
    page: number;
    size: number;
    state?: number;
    user_name?: string;
    department_id?: number;
    department_level_id?: number;
    department_title_id?: number;
}

export interface AdminAccountListItem {
    admin_id: number;
    created_at: number;
    created_name: string;
    updated_at: number;
    user_name: string;
    login_name: string;
    department_id: number;
    department_name: string;
    department_level_id: number;
    department_level_name: string;
    department_title_id: number;
    department_title_name: string;
    tel: string;
    opc: string;
    hall_id: number;
    hall_name: string;
    last_login_at: number;
    last_login_ip: string;
    g_code: string;
    last_log_mac_address: string;
    state: number;
}
export type AdminAccountListType = CommonList<AdminAccountListItem>;

//后台账号状态切换
export interface UpdateAdminStateParams {
    state: number;
    admin_id: number;
}

//日志记录
export interface GetAdminAccountLogListParams {
    page: number;
    size: number;
    admin_id: number;
}

export interface AdminAccountLogListItem {
    admin_id: number;
    login_at: number;
    login_ip: string;
    login_name: string;
    user_name: string;
}

export type AdminAccountLogListType = CommonList<AdminAccountLogListItem>;

//场馆列表
export interface GetHallListParams {
    hall_name: string;
}

export interface HallListItem {
    id: number;
    hall_name: string;
    address: string;
    currency: number;
    remark: string;
    created_at: number;
    updated_at: number;
    created_name: string;
    updated_name: string;
    white_ips: string;
    state: number;
}

//新建场馆
export interface CreateHallParams {
    hall_name: string;
    address: string;
    currency: number;
    remark: string;
    white_ips: string;
}
//更新场馆
export interface UpdateHallParams {
    id: number;
    hall_name: string;
    address: string;
    currency: number;
    remark: string;
    white_ips: string;
}

//场馆状态切换
export interface SwitchHallParams {
    state: number; //1正常 2关闭
    id: number;
}

//vip等级列表
export interface VipListItem {
    id: number;
    vip_level_name: string;
    promotion_amount: number;
    keep_amount: number;
    created_at: number;
    updated_at: number;
    created_name: string;
    updated_name: string;
}

//vip等级创建
export interface CreateVipParams {
    vip_level_name: string;
    promotion_amount: number;
    keep_amount: number;
}

//vip等级修改
export interface UpdateVipParams {
    id: number;
    vip_level_name: string;
    promotion_amount: number;
    keep_amount: number;
}

//币种查询
export interface CurrencyListItem {
    id: number;
    currency_code: string;
    currency_name: string;
    permission: string;
}

//币种更新
export interface UpdateCurrencyParams {
    id: number;
    permission: string;
}
