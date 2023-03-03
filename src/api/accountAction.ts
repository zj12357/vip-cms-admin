import request from '@/utils/request';
import { ResponseData } from '@/types/api/common';
import {
    CreateRemarkParams,
    UpdateRemarkParams,
    GetRemarkListParams,
    RemarkListType,
    RemarksTopParams,
    CreateAuthorizerParams,
    AuthorizerListType,
    GetAuthorizerListParams,
    SetAuthorizerPasswordParams,
    UpdateAuthorizerPasswordParams,
    UpdateAuthorizerParams,
    GetStartWorkListParams,
    StartWorkListType,
    CreateClientParams,
    ClientListType,
    GetClientListParams,
    UpdateClientParams,
    GetOnlineAndOfflineListParams,
    OnlineAndOfflineListItem,
    GetCreditDetailListParams,
    CreditDetailListItem,
    GetProposalListParams,
    ProposalListItem,
    CreditApprovalParams,
    GetSignedListParams,
    GetMarkerDownListParams,
    MarkerDownListItem,
    GetMarkerPartnerListParams,
    MarkerPartnerListItem,
    GetConsumeListParams,
    ConsumeListType,
    SignedListType,
    ConsumeCourtesyListItem,
    ConsumeDetailType,
    GetTranscodingDetailListParams,
    TranscodingDetailDataListItem,
    CreditQuotaParams,
    CreditCptainParams,
    CreditRecycleParams,
    ReportWalletProposalParams,
    ReportWalletProposalType,
} from '@/types/api/accountAction';

// 添加备注
export const createRemark = (params: CreateRemarkParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/remarks/create',
        params,
    );

//修改备注
export const updateRemark = (params: UpdateRemarkParams) =>
    request.post<null, ResponseData<null>>('api/member/remarks/update', params);

//删除备注
export const deleteRemark = (id: number) =>
    request.post<null, ResponseData<null>>('api/member/remarks/del', { id });

//查询备注
export const getRemarkList = (params: GetRemarkListParams) =>
    request.post<RemarkListType, ResponseData<RemarkListType>>(
        '/api/member/remarks/list',
        params,
    );

//备注置顶
export const remarksTop = (params: RemarksTopParams) =>
    request.post<null, ResponseData<null>>('/api/member/remarks/top', params);

//新增授权人
export const createAuthorizer = (params: CreateAuthorizerParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/authorizer/create',
        params,
    );

//修改授权人
export const updateAuthorizer = (params: UpdateAuthorizerParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/authorizer/update',
        params,
    );

//获取授权人
export const getAuthorizerList = (params: GetAuthorizerListParams) =>
    request.post<AuthorizerListType, ResponseData<AuthorizerListType>>(
        '/api/member/authorizer/list',
        params,
    );

//删除授权人
export const deleteAuthorizer = (id: string) =>
    request.post<null, ResponseData<null>>('/api/member/authorizer/del', {
        authorizer_id: id,
    });

//设置授权人密码
export const setAuthorizerPassword = (params: SetAuthorizerPasswordParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/authorizer/setUpPassword',
        params,
    );

//修改授权人密码
export const updateAuthorizerPassword = (
    params: UpdateAuthorizerPasswordParams,
) =>
    request.post<null, ResponseData<null>>(
        '/api/member/authorizer/updatePassword',
        params,
    );

//户口开工记录
export const getStartWorkList = (params: GetStartWorkListParams) =>
    request.post<StartWorkListType, ResponseData<StartWorkListType>>(
        '/api/scene/member/start/work/list',
        params,
    );

//新增客户
export const createClient = (params: CreateClientParams) =>
    request.post<null, ResponseData<null>>('/api/member/client/create', params);

export const getClientList = (params: GetClientListParams) =>
    request.post<ClientListType, ResponseData<ClientListType>>(
        '/api/member/client/list',
        params,
    );

//修改客户
export const updateClient = (params: UpdateClientParams) =>
    request.post<null, ResponseData<null>>('/api/member/client/update', params);

//删除客户
export const deleteClient = (id: string) =>
    request.post<null, ResponseData<null>>('/api/member/client/del', { id });

//获取上下线管理
export const getOnlineAndOfflineList = (
    params: GetOnlineAndOfflineListParams,
) =>
    request.post<
        OnlineAndOfflineListItem[],
        ResponseData<OnlineAndOfflineListItem[]>
    >('/api/member/onlineAndOffline/list', params);

//获取信贷额
export const getCreditDetailList = (params: GetCreditDetailListParams) =>
    request.post<CreditDetailListItem[], ResponseData<CreditDetailListItem[]>>(
        '/api/marker/credit/detail',
        params,
    );

//获取信贷额
export const getCreditDetail = (params: GetCreditDetailListParams) =>
    request.post<CreditDetailListItem[], ResponseData<CreditDetailListItem[]>>(
        '/api/marker/report/MemberXinDaiERecord',
        params,
    );
//移除下线
export const removeOffline = (id: string) =>
    request.post<null, ResponseData<null>>(
        '/api/member/onlineAndOffline/removeOffline',
        {
            member_id: id,
        },
    );

//批额记录
export const getProposalList = (params: GetProposalListParams) =>
    request.post<ProposalListItem[], ResponseData<ProposalListItem[]>>(
        '/api/marker/record/proposal/list',
        params,
    );

//股东授信
export const creditApproval = (params: CreditApprovalParams) =>
    request.post<null, ResponseData<null>>(
        '/api/marker/credit/partner/approval',
        params,
    );

//已签M
export const getSignedList = (params: GetSignedListParams) =>
    request.post<SignedListType, ResponseData<SignedListType>>(
        '/api/marker/record/signed/list',
        params,
    );

//下批额度记录
export const getMarkerDownList = (params: GetMarkerDownListParams) =>
    request.post<MarkerDownListItem[], ResponseData<MarkerDownListItem[]>>(
        '/api/marker/record/down/list',
        params,
    );

//信贷总额详情
export const getMarkerPartnerList = (params: GetMarkerPartnerListParams) =>
    request.post<
        MarkerPartnerListItem[],
        ResponseData<MarkerPartnerListItem[]>
    >('/api/marker/record/partner', params);

//消费记录
export const getConsumeList = (params: GetConsumeListParams) =>
    request.post<ConsumeListType, ResponseData<ConsumeListType>>(
        '/api/vipservice/consume/list',
        params,
    );

//查询积分礼遇金
export const getConsumeCourtesyList = (id: string) =>
    request.get<
        ConsumeCourtesyListItem[],
        ResponseData<ConsumeCourtesyListItem[]>
    >(`/api/vipservice/consume/info/${id}`);

//消费详情
export const getConsumeDetail = (id: string) =>
    request.get<ConsumeDetailType, ResponseData<ConsumeDetailType>>(
        `/api/vipservice/consume/detail/${id}`,
    );

//查询转码详情
export const getTranscodingDetailList = (
    params: GetTranscodingDetailListParams,
) =>
    request.post<
        TranscodingDetailDataListItem[],
        ResponseData<TranscodingDetailDataListItem[]>
    >('/api/accountant/transcoding/transcodingDetails', params);

//下线批额
export const creditQuota = (params: CreditQuotaParams) =>
    request.post<null, ResponseData<null>>('/api/marker/credit/quota', params);

//下线上缴
export const creditCptain = (params: CreditCptainParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/onlineAndOffline/settings',
        params,
    );

//上下线回收额度
export const creditRecycle = (params: CreditRecycleParams) =>
    request.post<null, ResponseData<null>>(
        '/api/marker/credit/recycle',
        params,
    );

//帐变明细
export const reportWalletProposal = (params: ReportWalletProposalParams) =>
    request.post<
        ReportWalletProposalType,
        ResponseData<ReportWalletProposalType>
    >('/api/report/wallet/proposal', params);
