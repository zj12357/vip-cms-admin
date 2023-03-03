//新增客户户口

export interface CreateAccountParams {
    member_name: string;
    member_type: number;
    member_code: string;
    name?: string;
    gender?: number;
    birthday?: string;
    country?: string;
    address?: string;
    identity?: number;
    customer_assistant?: string;
    parent_member_code?: string;
    parent_member_name?: string;
    photo_list?: PhotoListItem[];
    telephone_list?: TelephoneListItem[];
    grade_list?: GradeListItem[];
    online_transfer?: number;
    is_company?: number;
    hall_id?: number;
    hall_name?: string;
    member_type_name?: string;
    identity_name?: string;
}

export interface TelephoneListItem {
    telephone: string;
    sending_method: number;
    language: number;
    area_code?: string;
}
export interface GradeListItem {
    certificate_type: number;
    certificate_number: string;
    certificate_name: string;
    certificate_validity: number[];
}

//户口资料修改
export interface UpdateAccountParams {
    member_id: string;
    member_name: string;
    member_code: string;
    member_type: number;
    name?: string;
    gender?: number;
    country?: string;
    address?: string;
    birthday?: string;
    identity?: number;
    telephone_list?: AccountInfoTelephoneListItem[];
    grade_list?: GradeListItem[];
    photo_list?: TelephoneListItem[];
    online_transfer?: number;
    hall_id?: number;
    hall_name?: string;
    member_type_name?: string;
    identity_name?: string;
}

//查询户口列表
export interface GetAccountParams {
    member_code: string;
}

export interface AccountListItem {
    member_id: string;
    certificate_list: CertificateListItem[];
    member_code: string;
    member_id: string;
    member_name: string;
    telephone: string[];
}
export interface CertificateListItem {
    certificate_number: string;
    certificate_name: string;
}
export interface AccountSingle {
    member_code: string;
}

//查询户口是否已经创建
export interface AccountIsExistParams {
    member_code: string;
}

//查询客户信息
export interface AccountInfoType {
    member_id: string;
    member_code: string;
    member_name: string;
    member_type: number;
    name: string;
    gender: number;
    birthday: number;
    country: string;
    address: string;
    parent_id: string;
    parent_member_code: string;
    parent_member_name: string;
    identity: number;
    customer_assistant: string;
    password: string;
    photo_list: PhotoListItem[];
    status: number;
    grade: string;
    dt_password: string;
    created_at: number;
    updated_at: number;
    telephone_list: AccountInfoTelephoneListItem[];
    grade_list: AccountInfoGradeListItem[];
    hall: number;
    online_transfer: number;
    remark?: string;
    hall_name: string;
}

interface PhotoListItem {
    photo: string;
}

export interface AccountInfoTelephoneListItem {
    language: number;
    member_code: string;
    member_id: string;
    member_name: string;
    phone_id: string;
    sending_method: string;
    telephone: string;
}

export interface AccountInfoGradeListItem {
    certificate_id: string;
    certificate_name: string;
    certificate_number: string;
    certificate_type: number;
    certificate_validity: string[];
    member_code: string;
    member_id: string;
    member_name: string;
}

// 户口设置，获取参数配置
export interface GetAccountParamsParams {
    member_id: string;
    currency: number;
    is_online: number;
    member_type_id: number;
}

export interface AccountParamsConfigListItem {
    param_config_id: number;
    member_type: number;
    start_type: number;
    currency: number;
    code_type: string;
    principal_type: string;
    shares_rate: string;
    commission_rate: string;
    point_rate: string;
}
//开工
export interface CreateMemberStartWorkParams {
    member_code: string;
    member_name: string;
    member_type: number;
    hall: number;
    coder: string;
    currency: number;
    admission_type: number;
    start_type: number;
    chips_name: string;
    chips_id: number;
    share_type: string;
    principal_type: string;
    deposit_code?: number;
    cash_out?: number;
    total_code: number;
    share_number?: number;
    share_down_number?: number;
    share_deposit?: number;
    steal_food_share?: stealFoodShareType;
    other_share?: otherMemberShareType[];
    table_up_code?: number;
    table_bottom_magnification?: number;
    table_bottom_deposit?: number;
    describe?: string;
    member_use_marker?: MarkerUseListItem[];
}
interface stealFoodShareType {
    share_member?: string;
    share_number?: number;
    share_deposit?: number;
    commission_rate?: string;
    share_member_other?: string;
    share_number_other?: number;
    share_deposit_other?: number;
}

interface otherMemberShareType {
    share_member: string;
    share_number: number;
    share_deposit: string;
}
interface MarkerUseListItem {
    marker_type: number;
    amount: number;
}

//查询户口占成上限
export interface GetMemberCommissionParams {
    currency: number;
    member_id: string;
    start_type: number;
    code_type: string;
    principal_type: string;
    member_type: number;
}

export interface MemberCommissionItem {
    principal_type: string;
    shares_rate: string;
}

//户口钱包交易
export interface AccountTradeParams {
    member_id: string;
    member_code: string;
    currency_id: number;
    currency_code: string;
    amount?: string;
    trade_account?: string;
    payee_member_code?: string;
    payee_member_name?: string;
    hall: number;
    hall_name: string;
    type: number; //类型 1.存款 2.取款 3.转账 4.冻结 5.解冻
    documents?: string;
    describe?: string;
    member_name: string;
    first_auth?: string;
}

//获取存款人
export interface DepositorListItem {
    member_code: string;
    member_name: string;
}

//获取验证人
export interface AuthorizerAllListItem {
    authorizer_id: string;
    authorizer_name: string;
    permission: string;
    telephone_list: TelephoneListItem[];
}

//授权人密码验证
export interface VerifyAuthorizerPasswordParams {
    authorizer_id: string;
    password: string;
    identity_module: number; //1.取款2.转账3.还Marker4.即出5.月结 6.开工7.加彩，8.股东授信,9.现场认证
    member_code: string;
}

//查询余额列表
export interface MemberBalanceListItem {
    key: number;
    currency_code: string;
    hall: number;
    balance: number;
    frozen: number;
    available: number;
    currency_id: number;
    hall_balance: HallBalanceItem[];
}

export interface HallBalanceItem {
    available: number;
    balance: number;
    frozen: number;
    hall: number;
    currency_id: number;
}

//查询转账人
export interface TransferorListItem {
    member_code: string;
    member_name: string;
}

//查询转账户口
export interface GetMemberCodeParams {
    member_code: string;
}

export interface MemberCodeListItem {
    identity: number;
    member_code: string;
    member_id: string;
    member_name: string;
    member_type: number;
}

//修改户口密码
export interface UpdateAccountPasswordParams {
    old_password: string;
    member_code: string;
    new_password: string;
    confirm_password: string;
    opcode: string;
}
//设置户口参数配置
export interface UpdateParamConfigParams {
    param_config_id: number;
    member_id: string;
    shares_rate: string;
    commission_rate: string;
    point_rate: string;
    effective_time?: number;
    member_status: number;
    currency: number;
    is_online: number;
}

//查询积分结算配置信息
export interface GetIntegralConfigListParams {
    member_id: string;
}
export interface IntegralConfigListItem {
    integral_config_id: number;
    member_id: string;
    member_code: string;
    currency_integral_type: number;
    currency: number;
    index: number;
    status: number;
    operator: string;
    created_at: number;
    updated_at: number;
}

//积分结算配置修改
export interface UpdateIntegralConfigParams {
    member_id: string;
    integral_config_id: number;
    member_status: number;
    currency_integral_type: number;
    currency: number;
}

//查询户口交收方案信息
export interface GetSettlementPlanListParams {
    member_code: string;
    currency: number;
}

export interface SettlementPlanListItem {
    balance: string;
    code_type: string;
    currency: number;
    currency_code: string;
    param_config_id: string;
    principal_type: string;
    shares_rate: string;
    start_type: string;
    wallet_id: string;
}

//修改电投密码
export interface UpdateDtPasswordParams {
    old_password: string;
    member_code: string;
    new_password: string;
    confirm_password: string;
    opcode: string;
}

//验证户口密码
export interface VerifyAccountPasswordParams {
    member_code: string;
    password: string;
}

//验证电投密码
export interface VerifyDtPasswordParams {
    member_code: string;
    password: string;
}

//查询户口指定类型marker余额
export interface GetMarkerCreditParams {
    member_code: string;
    currency: number;
    marker_type: number;
}

export interface MarkerCreditType {
    available_amount: number;
    created_at: number;
    currency: number;
    expired_at: number;
    expired_day: number;
    id: number;
    interest: string;
    invalid_at: number;
    marker_type: number;
    member_code: string;
    member_name: string;
    total_amount: number;
    updated_at: number;
    used_amount: number;
}

//查询户口marker余额
export interface GetMarkerAllCreditListParams {
    member_code: string;
    currency: number;
}
export interface MarkerAllCreditListItem {
    available_amount: number;
    created_at: number;
    currency: number;
    expired_at: number;
    expired_day: number;
    id: string;
    interest: string;
    invalid_at: number;
    marker_type: number;
    member_code: string;
    member_name: string;
    total_amount: number;
    updated_at: number;
    used_amount: number;
}

//修改marker额度
export interface UpdateMarkerCreditParams {
    id: string;
    marker_type: number;
    amount?: number;
    invalid_at?: number;
    currency?: number;
}

//上下分
export interface TransferUpAndDownPointsParams {
    param_config_id: string;
    member_code: string;
    start_type: string;
    currency: number;
    currency_code: string;
    code_type: string;
    principal_type: string;
    shares_rate: string;
    wallet_id: string;
    type: number;
    amount: string;
    hall: number;
}

//查询币种兑换汇率
export interface GetCurrencyRateParams {
    left_currency_id: number;
    right_currency_id: number;
}

export interface CurrencyRateType {
    id: number;
    created_at: number;
    updated_at: number;
    left_currency_id: number;
    right_currency_id: number;
    left_currency_code: string;
    right_currency_code: string;
    left_unit_rate: string;
    right_unit_rate: string;
    left_min_integer: number;
    right_min_integer: number;
}

export interface ExchangeCurrencyParams {
    member_code: string;
    member_name: string;
    cash_in_currency_id: string;
    cash_in_currency_code: string;
    cash_in_amount: string;
    cash_out_currency_id: string;
    cash_out_currency_code: string;
    cash_out_amount: number;
    remark: string;
    exchange: string;
}

//查询户口余额(币种)
export interface GetMemberCurrencyBalanceParams {
    member_code: string;
    currency_id: number;
    currency_code: string;
    hall: number;
}

export interface MemberCurrencyBalanceType {
    hall: string;
    balance: number;
    frozen: number;
    available: number;
}

//还marker
export interface RepayMarkerParams {
    remark: string;
    member_code: string;
    param: RepayMarkerListItem[];
}

export interface RepayMarkerListItem {
    id: string;
    marker_type: number;
    repay_model: number;
    marker_amount: number;
    interest_amount: number;
}

//查询户口(户口code)
export interface MemberByCodeItem {
    member_id: string;
    member_code: string;
    member_name: string;
    member_type: number;
}

//查询内部卡余额
export interface CompanyCardBalanceItem {
    hall_id: number;
    hall_code: string;
    currency_info: CompanyCardCurrencyItem[];
}
export interface CompanyCardCurrencyItem {
    amount: number;
    currency_id: number;
}
//内部卡交易，转账，取款，存款
export interface TradeCompanyCardParams {
    company_card_code: string;
    hall_id: number;
    hall_code: string;
    currency_id: number;
    currency_code: string;
    amount: string;
    type: number; //1 存款 2 取款 3 转账
    in_company_card_name?: string;
    hall_id_out?: number; //转出场馆
}

//内部卡货币兑换
export interface InternalCardExchangeCurrencyParams {
    company_card: string;
    cash_in_currency_id: string;
    cash_in_currency_code: string;
    cash_in_amount: string;
    cash_out_currency_id: string;
    cash_out_currency_code: string;
    cash_out_amount: number;
    exchange: string;
}

//查询即出
export interface GetImmediatelyComeOutDataParams {
    member_id: string;
    currency_id: number;
    hall: number;
}

export interface ImmediatelyMonthDataType {
    data: ImmediatelyMonthDataItem[];
    advance_id: number[];
    balance_commission: number;
    parent_member_code: string;
    parent_member_name: string;
    sum_un_settle_amount: number;
    sum_un_settle_commission: number;
    this_settlement_commission: number;
    total_consumption_to_be_settled: number;
    turn_over_c_commission: number;
    turnover_c_commission_rate: number;
    turnover_m_commission: number;
    turnover_m_commission_rate: number;
    setal_amount: number;
    steal_id: number;
    freeze: boolean;
}

export interface ImmediatelyMonthDataItem {
    id: number;
    start_work_type: string;
    currency: string;
    shares_type: string;
    principal_type: string;
    shares_rate: string;
    un_settle_amount: number;
    un_settle_commission: number;
    commission_rate: string;
    turn_over_commission: string;
    turn_over_commission_rate: string;
}

//查询月结
export interface GetImmediatelyMonthDataParams {
    member_id: string;
    currency_id: number;
    hall: number;
    date: string;
}

//月结解冻

export interface MonthUnFreezeParams {
    settle_id: number[];
    member_code: string;
    hall_id: number;
    currency: number;
    date: string;
}

//创建公司户口
export interface CreateCompanyMemberParams {
    member_code: string;
    member_name: string;
    telephone_list?: TelephoneListItem[];
}

//佣金结算
export interface ConfirmImmediatelyParams {
    member_code: string;
    settle_type: number;
    settle_id: number[];
    currency: number;
    hall_id: number;
    advance_id: number[];
    settlement_method: number;
    amount: number;
    parent_member_code: string;
    parent_amount: number;
    steal_id: number;
    date?: string;
}

//查询公司户口
export interface GetCompanyMemberType {
    member_id: string;
    member_code: string;
    member_name: string;
    remark: string;
}

//查询公司户口详情
export interface GetCompanyMemberInfoType {
    member_id: string;
    member_code: string;
    member_name: string;
    remark: string;
}

//修改公司户口资料
export interface UpdateCompanyAccountParams {
    member_id: string;
    remark: string;
}

//即出月结，结算佣金
export interface UpdateImmediatelyDataParams {
    id: number;
    commission_rate: string;
    date?: string;
}

//更新户口状态
export interface UpdateAccountStatusParams {
    status: number;
    member_id: string;
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

//获取筹码名称
export interface GetAccountantListParams {
    currency: number;
    hall: number;
    start_type: number;
    principal_type: string;
    type: number;
    share_type: string;
}
export interface GetAccountantListItem {
    chips_name: string;
    id: number;
}

//电话验证状态记录
export interface CreateVerifyPhoneRecordParams {
    member_code: string;
    authorizer_id: string;
    status: number; //1.成功，2.失败
    identity_module: number;
}

//查询客户，公司，内部卡
export interface GetMixListParams {
    member_code: string;
}

export interface GetMixListType {
    companyCardList: CompanyCardListType;
    companyList: CompanyListItem[];
    memberList: MemberListItem[];
}

export interface CompanyCardListType {
    card_no: string;
}

export interface CompanyListItem {
    member_code: string;
    member_id: string;
    member_name: string;
    status: number;
    telephone?: TelephoneListItem[];
    certificate_list?: CertificateListItem[];
}

export interface MemberListItem {
    member_code: string;
    member_id: string;
    member_name: string;
    status: number;
}
