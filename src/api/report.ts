import request from '@/utils/request';
import { ResponseData } from '@/types/api/common';
import {
    OpenAccountListParams,
    AccountInfoListParams,
    MReportListParams,
    WalletReportListParams,
    MarkerProposalReportListParams,
    TemporaryRecordListParams,
    MemberRemarksLogListParams,
    CommissionReportListParams,
    CommissionReportDetailParams,
    MemberIdentityRecordParams,
    CircleListParams,
    CreditLimitListParams,
    MarkerXiaPiListParams,
    OutGoingReportDetailParams,
    OutGoingReportListParams,
    MonthlyReportDetailParams,
    MonthlyReportListParams,
    CircleMonthListParams,
    CircleSettleParams,
} from '@/types/api/report';

// 开户报表
export const openAccountList = (params: OpenAccountListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/report/openAccount',
        params,
    );

// 户口资料报表
export const accountInfoList = (params: AccountInfoListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/report/accountInfo',
        params,
    );

// M报表
export const MReportList = (params: MReportListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/marker/report/MReport',
        params,
    );

// 存取款报表
export const walletReportList = (params: WalletReportListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/report/wallet/walletReport',
        params,
    );

// 围数日结报表
export const circleList = (params: CircleListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/report/v1/circle/daily/list',
        params,
    );
// 围数月结报表
export const circleMonthList = (params: CircleMonthListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/report/v1/circle/monthly/list',
        params,
    );
// 围数日结
export const circleSettle = (params: CircleSettleParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/spectacle/v1/circle/daily/settlement',
        params,
    );

// 围数月结
export const circleMonthSettle = (params: CircleMonthListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/spectacle/v1/circle/monthly/settlement',
        params,
    );

// 批额操作记录
export const markerProposalReportList = (
    params: MarkerProposalReportListParams,
) =>
    request.post<null, ResponseData<null>>(
        '/api/marker/report/MarkerApprovalReport',
        params,
    );

// 户口备注查询
export const memberRemarksLogList = (params: MemberRemarksLogListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/report/memberRemarksLog',
        params,
    );

// 暂存记录
export const temporaryRecordList = (params: TemporaryRecordListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/report/temporaryRecord',
        params,
    );

// 户口验证记录
export const memberIdentityRecordList = (params: MemberIdentityRecordParams) =>
    request.post<null, ResponseData<null>>(
        '/api/member/report/memberIdentityRecord',
        params,
    );

// 佣金记录转码
export const commissionReportList = (params: CommissionReportListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/report/commission/commissionReport',
        params,
    );

// 佣金记录转码明细
export const commissionReportDetail = (params: CommissionReportDetailParams) =>
    request.post<null, ResponseData<null>>(
        '/api/report/commission/commissionDetail',
        params,
    );
// 佣金记录即出
export const outGoingReportList = (params: OutGoingReportListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/report/commission/commissionJiChuReport',
        params,
    );

// 佣金记录即出明细
export const outGoingReportDetail = (params: OutGoingReportDetailParams) =>
    request.post<null, ResponseData<null>>(
        '/api/report/commission/commissionJiChuDetail',
        params,
    );

// 佣金记录即出
export const monthlyReportList = (params: MonthlyReportListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/report/commission/commissionYueJieReport',
        params,
    );

// 佣金记录即出明细
export const monthlyReportDetail = (params: MonthlyReportDetailParams) =>
    request.post<null, ResponseData<null>>(
        '/api/report/commission/commissionYueJieDetail',
        params,
    );
// 信贷额度记录
export const creditLimitList = (params: CreditLimitListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/marker/report/MarkerXinDaiReport',
        params,
    );
// 下批户口列表
export const markerXiaPiList = (params: MarkerXiaPiListParams) =>
    request.post<null, ResponseData<null>>(
        '/api/marker/report/MarkerXiaPiMemberRecord',
        params,
    );
