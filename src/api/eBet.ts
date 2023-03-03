import request from '@/utils/request';
import {
    AnnouncementProps,
    DeskOverviewProps,
    ResponsePageData,
    GamingProps,
    BetProps,
    AgentPhoneProps,
    BetterProps,
    VipClubProps,
    VipClubDeskProps,
    LimitDeskProps,
    ClubDeskProps,
    BetLimitUser,
    Page,
    ArchiveProps,
    BetterLog,
    CommissionConfigProps,
    ArchiveBetDetail,
    TopAgentLimitProps,
} from '@/types/api/eBet';
import { ResponseData } from '@/types/api/common';

// 桌台即时概况
export const getDeskOverviewList = (params: Page<DeskOverviewProps>) =>
    request.post<
        Page<DeskOverviewProps>,
        ResponseData<ResponsePageData<DeskOverviewProps[]>>
    >('/api/gameSetting/desk/list', params);

// 公告管理
export const getAnnouncementList = (params: Page & AnnouncementProps) =>
    request.post<
        Page & AnnouncementProps,
        ResponseData<ResponsePageData<AnnouncementProps[]>>
    >('/api/gameSetting/announcement/list', params);

export const announcementInsert = (params: AnnouncementProps) =>
    request.post<AnnouncementProps, ResponseData<AnnouncementProps>>(
        '/api/gameSetting/announcement/insert',
        params,
    );

export const announcementUpdate = (params: AnnouncementProps) =>
    request.post<AnnouncementProps, ResponseData<AnnouncementProps>>(
        '/api/gameSetting/announcement/update',
        params,
    );

export const announcementDelete = (params: any) =>
    request.post<any, ResponseData<null>>(
        '/api/gameSetting/announcement/delete',
        params,
    );

// 局管理
export const getGamingList = (params: Page<GamingProps>) =>
    request.post<
        Page<GamingProps>,
        ResponseData<ResponsePageData<GamingProps[]>>
    >('/api/gameSetting/gaming/list', params);
export const manualSetGameRecord = (params: any) =>
    request.post<any, ResponseData<null>>(
        '/api/gameSetting/gaming/manualSetGameRecord',
        params,
    );
export const calibrationGameRecord = (params: GamingProps) =>
    request.post<GamingProps, ResponseData<null>>(
        '/api/gameSetting/gaming/calibrationGameRecord',
        params,
    );

// 注单管理
export const getBetList = (params: any) =>
    request.post<any, ResponseData<ResponsePageData<BetProps[]>>>(
        '/api/gameSetting/bet/list',
        params,
    );

// 代理电话配置
export const getAgentPhone = (params: any) =>
    request.post<any, ResponseData<AgentPhoneProps>>(
        '/api/gameSetting/config/query',
        params,
    );
export const saveAgentPhone = (params: AgentPhoneProps) =>
    request.post<AgentPhoneProps, ResponseData<AgentPhoneProps>>(
        '/api/gameSetting/config/mobile',
        params,
    );

// 电投手管理
export const getBetterList = (params: Page<BetterProps>) =>
    request.get<
        Page<BetterProps>,
        ResponseData<ResponsePageData<BetterProps[]>>
    >('/api/gameSetting/better/list', {
        params,
    });
export const betterInsert = (params: BetterProps) =>
    request.post<BetterProps, ResponseData>(
        '/api/gameSetting/better/insert',
        params,
    );
export const betterUpdate = (params: BetterProps) =>
    request.post<BetterProps, ResponseData>(
        '/api/gameSetting/better/update',
        params,
    );
export const betterDelete = (params: BetterProps) =>
    request.post<BetterProps, ResponseData>(
        '/api/gameSetting/better/delete',
        params,
    );

// 桌台限红管理
export const vipClubList = () =>
    request.get<any, ResponseData<VipClubProps[]>>(
        '/api/gameSetting/limit/club/list',
        {},
    );
export const vipClubDeskList = (params: any) =>
    request.post<any, ResponseData<VipClubDeskProps[]>>(
        '/api/gameSetting/limit/club-desk/list',
        params,
    );
export const limitDeskList = (params: any) =>
    request.post<any, ResponseData<LimitDeskProps>>(
        '/api/gameSetting/limit/desk/list',
        params,
    );
export const limitDeskUpdate = (params: any) =>
    request.post<any, ResponseData<LimitDeskProps>>(
        '/api/gameSetting/limit/desk/update',
        params,
    );

// 桌台参数设置
export const queryClubDeskList = (params: Page<ClubDeskProps>) =>
    request.post<
        Page<ClubDeskProps>,
        ResponseData<ResponsePageData<ClubDeskProps[]>>
    >('/api/gameSetting/clubDesk/queryList', params);
export const addClubDeskList = (params: any) =>
    request.post<any, ResponseData<ResponsePageData<ClubDeskProps[]>>>(
        '/api/gameSetting/clubDesk/addClubDesk',
        params,
    );
export const updateClubDeskList = (params: any) =>
    request.post<any, ResponseData<ResponsePageData<ClubDeskProps[]>>>(
        '/api/gameSetting/clubDesk/modifyClubDesk',
        params,
    );
export const deleteClubDeskList = (params: any) =>
    request.post<any, ResponseData<ResponsePageData<ClubDeskProps[]>>>(
        '/api/gameSetting/clubDesk/deleteClubDesk',
        params,
    );

// 用户限红参数管理
export const queryBetLimitUserList = (params: Page & BetLimitUser) =>
    request.post<
        Page & BetLimitUser,
        ResponseData<ResponsePageData<BetLimitUser[]>>
    >('/api/gameSetting/betLimitUser/queryList', params);
export const addBetLimitUserList = (params: BetLimitUser) =>
    request.post<BetLimitUser, ResponseData<ResponsePageData<ClubDeskProps[]>>>(
        '/api/gameSetting/betLimitUser/addBetLimit',
        params,
    );
export const updateBetLimitUserList = (params: BetLimitUser) =>
    request.post<BetLimitUser, ResponseData<ResponsePageData<ClubDeskProps[]>>>(
        '/api/gameSetting/betLimitUser/modifyBetLimit',
        params,
    );
export const deleteBetLimitUserList = (params: BetLimitUser) =>
    request.post<BetLimitUser, ResponseData<ResponsePageData<ClubDeskProps[]>>>(
        '/api/gameSetting/betLimitUser/deleteBetLimit',
        params,
    );

// 提案管理
export const queryArchiveList = (params: Page & ArchiveProps) =>
    request.post<
        Page & ArchiveProps,
        ResponseData<ResponsePageData<ArchiveProps[]>>
    >('/api/gameSetting/archive/list', params);
export const queryPlayerBetsList = (params: Page & ArchiveBetDetail) =>
    request.post<
        Page & ArchiveBetDetail,
        ResponseData<ResponsePageData<ArchiveBetDetail[]>>
    >('/api/gameSetting/archive/queryPlayerBetsList', params);

// 电投手报表
export const queryBetterLogList = (params: Page<BetterLog>) =>
    request.post<Page<BetterLog>, ResponseData<ResponsePageData<BetterLog[]>>>(
        '/api/gameSetting/betterLog/queryList',
        params,
    );

// 转码参数管理
export const getCommissionConfig = (params: Page<CommissionConfigProps>) =>
    request.post<
        Page<CommissionConfigProps>,
        ResponseData<ResponsePageData<CommissionConfigProps[]>>
    >('/api/gameSetting/commissionConfig/queryList', params);
export const saveCommissionConfig = (params: CommissionConfigProps) =>
    request.post<CommissionConfigProps, ResponseData<null>>(
        '/api/gameSetting/commissionConfig/modifyCommissionConf',
        params,
    );

// 一级代理限红配置
export const queryTopAgentLimitList = (params: Page & TopAgentLimitProps) =>
    request.post<
        Page<TopAgentLimitProps>,
        ResponseData<ResponsePageData<TopAgentLimitProps[]>>
    >('/api/gameSetting/firstLevelLimit/queryList', params);
export const updateTopAgentLimit = (params: TopAgentLimitProps) =>
    request.post<TopAgentLimitProps, ResponseData<null>>(
        '/api/gameSetting/firstLevelLimit/update',
        params,
    );
