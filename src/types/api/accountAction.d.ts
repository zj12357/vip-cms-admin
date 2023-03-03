import { NormalizeMulti } from 'react-i18next';
import { CommonList } from './common.d';
// 新增备注
export interface CreateRemarkParams {
    member_id: string;
    content: string;
    department: string;
    see_department: number[];
}

//修改备注
export interface UpdateRemarkParams {
    id: number;
    content: string;
    department: string;
    see_department: number[];
}

//查询备注
export interface GetRemarkListParams {
    member_id: string;
    page: number;
    size: number;
    department?: number;
}

export interface RemarkListItem {
    content: string;
    created_at: number;
    department: number;
    index: number;
    member_code: string;
    member_id: number;
    member_name: string;
    operator: string;
    remarks_id: number;
    see_department: string;
    updatedAt: number;
    is_top: number;
}
export type RemarkListType = CommonList<RemarkListItem>;

//备注置顶
export interface RemarksTopParams {
    id: number;
    member_id: string;
    is_top: number;
}

//新增授权人
export interface CreateAuthorizerParams {
    member_id: string;
    authorizer_name: string;
    gender: number;
    birthday: string;
    country: string;
    address: string;
    telephone_list: TelephoneListItem[];
    verify_name: string;
    verify_password: string;
    grade_list: GradeListItem[];
    permission: number[];
    photo_list?: PhotoListItem[];
    other: string;
}

//修改授权人
export interface UpdateAuthorizerParams {
    authorizer_id: string;
    gender: number;
    birthday: string;
    country: string;
    address: string;
    telephone_list: TelephoneListItem[];
    verify_name: string;
    verify_password: string;
    grade_list: GradeListItem[];
    permission: number[];
    photo_list?: PhotoListItem[];
    other: string;
}

export interface TelephoneListItem {
    telephone: string;
    sending_method: number[] & string;
    language: number;
    phone?: string;
}

export interface GradeListItem {
    certificate_type: string;
    certificate_number: string;
    certificate_name: string;
    certificate_validity: string;
}

export interface PhotoListItem {
    photo: string;
}

//获取授权人
export interface GetAuthorizerListParams {
    page: number;
    size: number;
    member_id: string;
}
export interface AuthorizerListItem {
    authorizer_id: string;
    member_id: string;
    authorizer_name: string;
    gender: number;
    birthday: number;
    country: string;
    address: string;
    photo_list?: PhotoListItem[];
    permission: string;
    other: string;
    telephone_list: TelephoneListItem[];
    grade_list: GradeListItem[];
    password: string;
}

export type AuthorizerListType = CommonList<AuthorizerListItem>;

//设置授权人密码
export interface SetAuthorizerPasswordParams {
    authorizer_id: string;
    password: string;
}

//修改授权人密码
export interface UpdateAuthorizerPasswordParams {
    authorizer_id: string;
    old_password: string;
    new_password: string;
}

//户口开工记录
export interface GetStartWorkListParams {}

export type StartWorkListType = CommonList<StartWorkListItem>;
export interface StartWorkListItem {
    round: string;
    club: number;
    currency: number;
    start_work_type: number;
    start_work_time: number;
    stop_work_time: number;
    shares_type: string;
    total_principal: string;
    total_convert_chips: number;
    total_up_down_chips: number;
}

//新增客户
export interface CreateClientParams {
    client_name: string;
    gender: number;
    telephone: string;
    certificate_type: number;
    certificate_number: string;
    photo: string;
    remark: string;
    member_id: string;
}

//查询客户列表
export interface GetClientListParams {
    member_id: string;
    page: number;
    size: number;
}

export type ClientListType = CommonList<ClientListItem>;
export interface ClientListItem {
    certificate_number: string;
    certificate_type: string;
    client_id: string;
    client_name: string;
    created_at: number;
    gender: number;
    member_code: string;
    member_id: string;
    photo: string;
    remark: string;
    telephone: string;
    updated_at: number;
}

//修改客户
export interface UpdateClientParams {
    id: string;
    client_name: string;
    telephone: string;
    certificate_type: number;
    certificate_number: string;
    photo: string;
    remark: string;
}

//获取上下线管理

export interface GetOnlineAndOfflineListParams {
    member_code: string;
    currency: number;
}

export interface OnlineAndOfflineListItem {
    currency: number;
    member_id: string;
    member_code: string;
    member_name: string;
    member_marker_credit: memberMarkerCreditItem[];
    turn_over_c_commission: string;
    turn_over_m_commission: string;
    type: number;
    is_have_sup: boolean;
    parent_id: string;
    parent_member_code: string;
    parent_member_name: string;
}

export interface memberMarkerCreditItem {
    marker_type: number;
    currency: number;
    total_amount: number;
    available_amount: number;
}

//获取信贷额
export interface GetCreditDetailListParams {
    member_code: string;
    currency: number;
}

export interface CreditDetailListItem {
    marker_type: number;
    available_amount: number;
    count: number;
    overdue_amount: number;
    penalty: string;
    signed_amount: number;
    total_amount: number;
    used_amount: number;
    approve_amount: number;
}

//批额记录
export interface GetProposalListParams {
    member_code: string;
    currency: number;
}

export interface ProposalListItem {
    after_amount: number;
    created_at: number;
    currency: number;
    flag: number;
    id: string;
    marker_type: number;
    member_code: string;
    member_name: string;
    proposal_amount: number;
    repay_mode: number;
    round: string;
    type: number;
    remark?: string;
    operation?: string;
}

export interface CreditApprovalParams {
    hall: string;
    hall_id: number;
    to_member: string;
    amount: number;
    currency: number;
    from_member: string;
    remark: string;
}

//已签M
export interface GetSignedListParams {
    member_code: string;
    currency?: number;
    marker_type?: number;
    state?: number;
    page: number;
    size: number;
}

export interface SignedListItem {
    currency: number;
    expired_date: string;
    expired_day: number;
    hall: string;
    id: string;
    interest: number;
    interest_state: number;
    is_expired: number;
    left_amount: number;
    left_interest: number;
    marker_amount: number;
    marker_state: number; //1.未还款，2已还款
    marker_type: number;
    member_code: string;
    member_name: string;
    operation_name: string;
    p_id: string;
    rate: number;
    repay_amount: number;
    round: string;
    signed_at: number;
    updated_at: number;
    markerAmount: number;
    interestAmount: number;
}
export type SignedListType = CommonList<SignedListItem>;

//查询户口余额(币种)
export interface GetMemberCurrencyBalanceParams {
    member_id: string;
    currency_id: number;
    currency_code: string;
    hall: string;
}

export interface MemberCurrencyBalanceType {
    hall: string;
    balance: number;
    frozen: number;
    available: number;
}

//下批额度记录
export interface GetMarkerDownListParams {
    member_code: string;
    currency: number;
    marker_type: number;
}

export interface MarkerDownListItem {
    marker_type: number;
    total_amount: number;
    used_amount: number;
    available_amount: number;
    signed_amount: number;
    overdue_amount: number;
    approve_amount: number;
    penalty: string;
    count: number;
    member_code: string;
    member_name: string;
}

//信贷总额详情
export interface GetMarkerPartnerListParams {
    member_code: string;
    currency: number;
    marker_type: number;
}

export interface MarkerPartnerListItem {
    marker_type: number;
    total_amount: number;
    used_amount: number;
    available_amount: number;
    signed_amount: number;
    overdue_amount: number;
    approve_amount: number;
    penalty: string;
    count: number;
    member_code: string;
    member_name: string;
}

//消费记录

export interface GetConsumeListParams {
    venue_type?: number;
    currency_type?: number;
    account?: string;
    customer_name?: string;
    payment_type?: number;
    order_type?: number;
    operator?: string;
    order_status?: number;
    order_start_time?: number;
    order_end_time?: number;
    page: number;
    size: number;
}
export interface ConsumeListItem {
    account: string;
    account_name: string;
    approval_flag: boolean;
    create_time: number;
    creator: string;
    currency_type: number;
    customer_name: string;
    department: string;
    id: string;
    operator: string;
    order_amount: number;
    order_number: string;
    order_status: number;
    payment_type: number;
    update_time: number;
    updater: string;
    venue_type: number;
}

export type ConsumeListType = CommonList<ConsumeListItem>;

//查询积分礼遇金

export interface ConsumeCourtesyListItem {
    total: number;
    used: number;
    balance: number;
    expiring: number;
    type: number;
}

//查询消费详情
export interface ConsumeDetailType {
    order_info: OrderInfoType;
    order_item_detail: OrderDetailItem[];
}

interface OrderInfoType {
    id: string;
    venue_type: number;
    order_number: string;
    account: string;
    account_name: string;
    customer_name: string;
    currency_type: number;
    payment_type: number;
    order_amount: number;
    order_status: number;
    department: string;
    approval_flag: boolean;
    operator: string;
    create_time: number;
    update_time: number;
    creator: string;
    updater: string;
}
export interface OrderDetailItem {
    id: string;
    order_number: string;
    consume_type: number;
    item_name: string;
    item_count: number;
    item_price: number;
    item_subtotal: number;
    sub_order_status: number;
    create_time: number;
    update_time: number;
    creator: string;
    updater: string;
}

//查询转码详情
export interface GetTranscodingDetailListParams {
    member_id: string;
    start_work_type: number;
    currency: number;
    principal_type: string;
    shares_type: string;
    hall: number;
}

//转码详情
export interface TranscodingDetailDataListItem {
    id: string;
    start_work_type: string;
    currency: string;
    shares_type: string;
    principal_type: string;
    shares_rate: string;
    amount: number;
    settle_amount: number;
    un_settle_amount: number;
    settle_commission: number;
    un_settle_commission: number;
    commission_rate: string;
}

//下批额度
export interface CreditQuotaParams {
    from_member: string;
    to_member: string;
    amount: number;
    marker_type?: number;
    currency: number;
}

//下线上缴
export interface CreditCptainParams {
    member_code: string;
    member_name: string;
    parent_member_code: string;
    parent_member_name: string;
    turn_over_c_commission_rate: number;
    turn_over_m_commission_rate: number;
}

//上下线回收额度

export interface CreditRecycleParams {
    from_member: string;
    to_member: string;
    marker_type: number;
    currency: number;
}

//帐变明细
export interface ReportWalletProposalParams {
    member_code?: string;
    currency?: number;
    hall?: number;
    type?: number;
    detail_type?: number;
    company_card?: string;
    page: number;
    size: number;
}

export interface ReportWalletProposalItem {
    id: string;
    round: string;
    currency_id: number;
    hall_id: number;
    type: number;
    detail_type: number;
    amount: number;
    before_amount: number;
    after_amount: number;
    remark: string;
    interval: number;
    created_at: number;
    created_name: string;
    member_code: string;
    member_name: string;
}

export type ReportWalletProposalType = CommonList<ReportWalletProposalItem>;
