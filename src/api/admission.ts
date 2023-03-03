/**
 * 入场管理
 */
import request from '@/utils/request';
import { ResponseData } from '@/types/api/common';
import {
    WorkListParams,
    resWorkList,
    ChipsCreateParams,
    GetAccountDetailParams,
    AccountDetails,
    StorageListParams,
    ChipsListParams,
    resChipsList,
    CreateCashParams,
    CreateReturnParams,
    admissionHistoryListParams,
    resAdmissionHistoryList,
    CreateChipsParams,
    CreateCroupierParams,
    CreateStorageParams,
    getStorageDetailsParams,
    CreateStorageTemporaryParams,
    GetWorkDetailsParams,
    StopWorkParams,
    GetStartWorkDetailsParams,
    PrintChipsProps,
    UpdateStartWorkDetailsParams,
    GetWorkSettlementParams,
} from '@/types/api/admission';

// 查询开工列表cs
export const getWorkList = (params: WorkListParams) =>
    request.post<resWorkList, ResponseData<resWorkList>>(
        '/api/scene/convert/chips/start/work/list',
        params,
    );
// 新增转码
export const chipsCreate = (params: ChipsCreateParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/convert/chips/create',
        params,
    );
// 新增公水
export const createChips = (params: CreateChipsParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/convert/chips/public/tip/create',
        params,
    );
// 新增荷水
export const createCroupier = (params: CreateCroupierParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/convert/chips/croupier/tip/create',
        params,
    );
// 新增暂存
export const createStorage = (params: CreateStorageParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/convert/chips/temporary/storage/create',
        params,
    );
// 查询暂存总额
export const getStorageDetails = (params: getStorageDetailsParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/convert/chips/total/temporary/storage/detail',
        params,
    );
// 新增取暂存
export const createStorageTemporary = (params: CreateStorageTemporaryParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/convert/chips/take/temporary/storage/create',
        params,
    );
// 查询收工详情
export const getWorkDetails = (params: GetWorkDetailsParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/convert/chips/stop/work/detail',
        params,
    );
// 新增收工
export const stopWork = (params: StopWorkParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/convert/chips/stop/work/create',
        params,
    );

// 查询收工详情 V1
export const getWorkDetailsNew = (params: GetWorkDetailsParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/v1/stop/work/detail',
        params,
    );
// 查询收工结算详情 V1
export const getWorkSettlementNew = (params: GetWorkSettlementParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/v1/stop/work/settlement',
        params,
    );

// 新增收工 V1
export const stopWorkNew = (params: GetWorkDetailsParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/v1/stop/work/create',
        params,
    );

// 查询开工客户信息
export const getAccountDetail = (params: GetAccountDetailParams) =>
    request.post<AccountDetails, ResponseData<AccountDetails>>(
        '/api/scene/member/detail',
        params,
    );
// 查询暂存列表
export const getStorageList = (params: StorageListParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/convert/chips/temp/storage/list',
        params,
    );
// 转码记录列表/资金列表
export const getChipsList = (params: ChipsListParams) =>
    request.post<resChipsList, ResponseData<resChipsList>>(
        '/api/scene/convert/chips/list',
        params,
    );
// 转码打印数据
export const getPrintConvertChips = (params: {
    log_id: string;
    convert_chips_type: number;
}) =>
    request.post<
        { log_id: string; convert_chips_type: number },
        ResponseData<PrintChipsProps>
    >('/api/scene/print/scene/chips', params);

// 开工详情-新增加彩
export const createCash = (params: CreateCashParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/convert/chips/add/create',
        params,
    );
// 开工详情-新增回码
export const createReturn = (params: CreateReturnParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/convert/chips/return/create',
        params,
    );

// 查询入场历史记录列表
export const getAdmissionList = (params: admissionHistoryListParams) =>
    request.post<
        resAdmissionHistoryList,
        ResponseData<resAdmissionHistoryList>
    >('/api/scene/admission/history/list', params);
// 查询开工详情
export const getStartWorkDetails = (params: GetStartWorkDetailsParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/v1/start/work/detail',
        params,
    );

// 编辑开工详情备注
export const updateStartWorkDetails = (params: UpdateStartWorkDetailsParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/convert/chips/start/work/detail/remark/update',
        params,
    );

// 查询已冻结占成保证金
export const getFrozenAmount = (params: GetStartWorkDetailsParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/convert/chips/add/chips/used/frozen/share/deposit/detail',
        params,
    );
