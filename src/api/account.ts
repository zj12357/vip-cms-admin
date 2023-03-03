import request from '@/utils/request';
import { ResponseData } from '@/types/api/common';
import {
    CreateAccountParams,
    AccountIsExistParams,
    GetAccountParams,
    AccountListItem,
    AccountSingle,
    AccountInfoType,
    GetAccountParamsParams,
    AccountParamsConfigListItem,
    CreateMemberStartWorkParams,
    GetMemberCommissionParams,
    MemberCommissionItem,
    AccountTradeParams,
    DepositorListItem,
    AuthorizerAllListItem,
    VerifyAuthorizerPasswordParams,
    MemberBalanceListItem,
    TransferorListItem,
    GetMemberCodeParams,
    MemberCodeListItem,
    UpdateAccountPasswordParams,
    UpdateParamConfigParams,
    GetIntegralConfigListParams,
    IntegralConfigListItem,
    UpdateIntegralConfigParams,
    GetSettlementPlanListParams,
    SettlementPlanListItem,
    UpdateAccountParams,
    UpdateDtPasswordParams,
    VerifyAccountPasswordParams,
    VerifyDtPasswordParams,
    GetMarkerCreditParams,
    MarkerCreditType,
    GetMarkerAllCreditListParams,
    MarkerAllCreditListItem,
    UpdateMarkerCreditParams,
    TransferUpAndDownPointsParams,
    GetCurrencyRateParams,
    CurrencyRateType,
    ExchangeCurrencyParams,
    GetMemberCurrencyBalanceParams,
    MemberCurrencyBalanceType,
    RepayMarkerParams,
    MemberByCodeItem,
    CompanyCardBalanceItem,
    TradeCompanyCardParams,
    InternalCardExchangeCurrencyParams,
    GetImmediatelyComeOutDataParams,
    GetImmediatelyMonthDataParams,
    ImmediatelyMonthDataType,
    MonthUnFreezeParams,
    CreateCompanyMemberParams,
    ConfirmImmediatelyParams,
    GetCompanyMemberType,
    GetCompanyMemberInfoType,
    UpdateCompanyAccountParams,
    UpdateImmediatelyDataParams,
    UpdateAccountStatusParams,
    GetMemberIdentityParams,
    GetMemberIdentityListItem,
    GetAccountantListParams,
    GetAccountantListItem,
    CreateVerifyPhoneRecordParams,
    GetMixListParams,
    GetMixListType,
} from '@/types/api/account';

// 新增户口
export const createAccount = (params: CreateAccountParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/account/create',
        params,
    );

//户口资料修改
export const updateAccount = (params: UpdateAccountParams) =>
    request.post<null, ResponseData<null>>('/api/member/account/edit', params);

// 查询户口
export const getAccountList = (params: GetAccountParams) =>
    request.post<
        AccountListItem[] & AccountSingle,
        ResponseData<AccountListItem[] & AccountSingle>
    >('/api/member/account/list', params);

// 查询客户信息
export const getAccountInfo = (member_code: string) =>
    request.post<AccountInfoType, ResponseData<AccountInfoType>>(
        '/api/member/account/details',
        { member_code },
    );

//查询户口是否已经创建
export const getAccountIsExist = (params: AccountIsExistParams) =>
    request.post<boolean, ResponseData<boolean>>(
        '/api/member/account/queryMemberIsExist',
        params,
    );

// 户口设置，获取参数设置列表
export const getAccountParamsList = (params: GetAccountParamsParams) =>
    request.post<
        AccountParamsConfigListItem[],
        ResponseData<AccountParamsConfigListItem[]>
    >('/api/member/paramConfig/list', params);

//开工
export const createMemberStartWork = (params: CreateMemberStartWorkParams) =>
    request.post<null, ResponseData<null>>(
        '/api/accountant/member/startWork',
        params,
    );

//查询户口占成上限
export const getMemberCommission = (params: GetMemberCommissionParams) =>
    request.post<MemberCommissionItem[], ResponseData<MemberCommissionItem[]>>(
        '/api/accountant/member/queryMemberCommission',
        params,
    );

//户口钱包交易
export const accountTrade = (params: AccountTradeParams) =>
    request.post<null, ResponseData<null>>('/api/member/wallet/trade', params);

//获取存款人
export const getDepositorList = (id: string) =>
    request.post<DepositorListItem[], ResponseData<DepositorListItem[]>>(
        '/api/member/wallet/getDepositor',
        {
            member_id: id,
        },
    );

//获取验证人
export const getAuthorizerAllList = (id: string) =>
    request.post<
        AuthorizerAllListItem[],
        ResponseData<AuthorizerAllListItem[]>
    >('/api/member/authorizer/getAuthorizerAll', {
        member_id: id,
    });

//授权人密码验证
export const verifyAuthorizerPassword = (
    params: VerifyAuthorizerPasswordParams,
) =>
    request.post<boolean, ResponseData<boolean>>(
        '/api/member/authorizer/verifyAuthorizerPassword',
        params,
    );

//查询户口余额
export const getMemberBalanceList = (id: string) =>
    request.post<
        MemberBalanceListItem[],
        ResponseData<MemberBalanceListItem[]>
    >('/api/member/wallet/getMemberBalance', {
        member_id: id,
    });

//查询转账人
export const getTransferorList = (id: string) =>
    request.post<TransferorListItem[], ResponseData<TransferorListItem[]>>(
        '/api/member/wallet/getTransferor',
        {
            member_id: id,
        },
    );

//查询转账户口
export const getMemberCodeList = (params: GetMemberCodeParams) =>
    request.post<MemberCodeListItem[], ResponseData<MemberCodeListItem[]>>(
        '/api/member/account/selectMemberByMemberCode',
        params,
    );

//修改户口密码
export const updateAccountPassword = (params: UpdateAccountPasswordParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/account/updatePassword',
        params,
    );

//设置户口参数配置
export const updateParamConfig = (params: UpdateParamConfigParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/paramConfig/update',
        params,
    );

//查询积分结算配置信息
export const getIntegralConfigList = (params: GetIntegralConfigListParams) =>
    request.post<
        IntegralConfigListItem[],
        ResponseData<IntegralConfigListItem[]>
    >('/api/member/integralConfig/list', params);

//积分结算配置修改
export const updateIntegralConfig = (params: UpdateIntegralConfigParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/integralConfig/update',
        params,
    );

//查询户口交收方案信息
export const getSettlementPlanList = (params: GetSettlementPlanListParams) =>
    request.post<
        SettlementPlanListItem[],
        ResponseData<SettlementPlanListItem[]>
    >('/api/member/transferUpAndDownPoints/selectSettlementPlanList', params);

//修改电投密码
export const updateDtPassword = (params: UpdateDtPasswordParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/account/updateDtPassword',
        params,
    );

//验证户口密码
export const VerifyAccountPassword = (params: VerifyAccountPasswordParams) =>
    request.post<boolean, ResponseData<boolean>>(
        '/api/member/account/verifyMemberPassword',
        params,
    );

//验证电投密码
export const VerifyDtPassword = (params: VerifyDtPasswordParams) =>
    request.post<boolean, ResponseData<boolean>>(
        '/api/member/account/verifyDtPassword',
        params,
    );

//查询户口指定类型marker余额
export const getMarkerCredit = (params: GetMarkerCreditParams) =>
    request.post<MarkerCreditType, ResponseData<MarkerCreditType>>(
        '/api/marker/credit',
        params,
    );

//查询户口marker余额
export const getMarkerAllCreditList = (params: GetMarkerAllCreditListParams) =>
    request.post<
        MarkerAllCreditListItem[],
        ResponseData<MarkerAllCreditListItem[]>
    >('/api/marker/credit/list', params);

//修改marker额度
export const updateMarkerCredit = (params: UpdateMarkerCreditParams) =>
    request.post<null, ResponseData<null>>('/api/marker/credit/update', params);

//上下分
export const transferUpAndDownPoints = (
    params: TransferUpAndDownPointsParams,
) =>
    request.post<null, ResponseData<null>>(
        '/api/member/transferUpAndDownPoints/agencyTransfer',
        params,
    );

//查询币种兑换汇率
export const getCurrencyRate = (params: GetCurrencyRateParams) =>
    request.post<CurrencyRateType, ResponseData<CurrencyRateType>>(
        '/api/wallet/currency/rate/exchange',
        params,
    );

//归还额度
export const backMarkerCredit = (id: string) =>
    request.post<null, ResponseData<null>>('/api/marker/credit/back', { id });

//回收额度
export const recoverMarkerCredit = (id: string) =>
    request.post<null, ResponseData<null>>('/api/marker/credit/recover', {
        id,
    });

//货币兑换
export const exchangeCurrency = (params: ExchangeCurrencyParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/wallet/currencyExchange',
        params,
    );

//查询户口余额(币种)
export const getMemberCurrencyBalance = (
    params: GetMemberCurrencyBalanceParams,
) =>
    request.post<
        MemberCurrencyBalanceType,
        ResponseData<MemberCurrencyBalanceType>
    >('/api/member/wallet/getMemberCurrencyBalance', params);

//还marker
export const repayMarker = (params: RepayMarkerParams) =>
    request.post<null, ResponseData<null>>('/api/marker/repay', params);

//查询户口(户口code)
export const getMemberByCode = (code: string) =>
    request.post<MemberByCodeItem[], ResponseData<MemberByCodeItem[]>>(
        '/api/member/account/queryMemberByCode',
        {
            member_code: code,
        },
    );

//免利息
export const repayMarkerfree = (id: string) =>
    request.post<null, ResponseData<null>>('/api/marker/repay/interest/free', {
        id: id,
    });

//查询内部卡余额
export const getCompanyCardBalance = (id: string) =>
    request.post<
        CompanyCardBalanceItem[],
        ResponseData<CompanyCardBalanceItem[]>
    >('/api/member/companyCard/getCompanyCardBalance', {
        company_card_code: id,
    });

//内部卡交易，转账，取款，存款
export const tradeCompanyCard = (params: TradeCompanyCardParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/companyCard/trade',
        params,
    );

//内部卡货币兑换
export const internalCardExchangeCurrency = (
    params: InternalCardExchangeCurrencyParams,
) =>
    request.post<null, ResponseData<null>>(
        'api/member/wallet/companyCurrencyExchange',
        params,
    );

//查询即出
export const getImmediatelyData = (params: GetImmediatelyComeOutDataParams) =>
    request.post<
        ImmediatelyMonthDataType,
        ResponseData<ImmediatelyMonthDataType>
    >('/api/accountant/settle/getImmediatelyData', params);

//查询月结
export const getMonthData = (params: GetImmediatelyMonthDataParams) =>
    request.post<
        ImmediatelyMonthDataType,
        ResponseData<ImmediatelyMonthDataType>
    >('/api/accountant/settle/getMonthData', params);

//月结解冻
export const monthUnFreeze = (params: MonthUnFreezeParams) =>
    request.post<null, ResponseData<null>>(
        '/api/accountant/settle/unFreeze',
        params,
    );

//创建公司户口
export const createCompanyMember = (params: CreateCompanyMemberParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/account/createCompanyMember',
        params,
    );

//佣金结算
export const confirmImmediately = (params: ConfirmImmediatelyParams) =>
    request.post<null, ResponseData<null>>(
        '/api/accountant/settle/confirmImmediatelyData',
        params,
    );

//查询公司户口
export const getCompanyMember = (id: string) =>
    request.post<
        GetCompanyMemberType & GetCompanyMemberType[],
        ResponseData<GetCompanyMemberType & GetCompanyMemberType[]>
    >('/api/member/account/queryCompanyMember', {
        member_code: id,
    });

//查询公司户口详情
export const getCompanyMemberInfo = (id: string) =>
    request.post<
        GetCompanyMemberInfoType,
        ResponseData<GetCompanyMemberInfoType>
    >('/api/member/account/queryCompanyMemberDetails', {
        member_code: id,
    });

//查询标签
export const getLabelList = (id: string) =>
    request.post<string[], ResponseData<string[]>>('/api/member/label/list', {
        member_id: id,
    });

//修改公司户口资料
export const updateCompanyAccount = (params: UpdateCompanyAccountParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/account/company/update',
        params,
    );

//即出月结，结算佣金
export const updateImmediatelyData = (params: UpdateImmediatelyDataParams) =>
    request.post<null, ResponseData<null>>(
        '/api/accountant/settle/updateImmediatelyData',
        params,
    );

//更新户口状态
export const updateAccountStatus = (params: UpdateAccountStatusParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/account/update/status',
        params,
    );

//查询户口身份
export const getMemberIdentityList = (params: GetMemberIdentityParams) =>
    request.post<
        GetMemberIdentityListItem[],
        ResponseData<GetMemberIdentityListItem[]>
    >('/api/accountant/memberIdentity/q', params);

//获取筹码名称
export const getAccountantList = (params: GetAccountantListParams) =>
    request.post<
        GetAccountantListItem[],
        ResponseData<GetAccountantListItem[]>
    >('/api/accountant/chip/list', params);

//电话验证状态记录
export const createVerifyPhoneRecord = (
    params: CreateVerifyPhoneRecordParams,
) =>
    request.post<null, ResponseData<null>>(
        '/api/member/authorizer/createVerifyPhoneRecord',
        params,
    );

//查询客户，公司，内部卡
export const getMixList = (params: GetMixListParams) =>
    request.post<GetMixListType, ResponseData<GetMixListType>>(
        'api/member/account/mixList',
        params,
    );
