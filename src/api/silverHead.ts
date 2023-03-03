import request from '@/utils/request';
import { ResponseData } from '@/types/api/common';
import {
    AddChipParams,
    ChipManageItem,
    ChipSettingParams,
    BuyChipParams,
    ChangeParams,
    RefundParams,
    ShiftListParams,
    BuRecordParams,
    MonthListParams,
    ShiftHeadParams,
    MonthHeadParams,
    ShiftTranscodingParams,
} from '@/types/api/silverHead';
// 银头统计
export const getChipsSummary = (params: { currency_id?: number }) =>
    request.post<any, ResponseData<any>>(
        `/api/ledger/ledger/count/list`,
        params,
    );

// 获取场馆筹码配置(列表)
export const getChipsSettingList = (params: ChipSettingParams) =>
    request.post<any, ResponseData<any>>(
        `/api/ledger/chips/config/list`,
        params,
    );
// 调整筹码
export const editChipSetting = (params: any) =>
    request.post<any, ResponseData<any>>(
        `/api/ledger/chips/config/edit`,
        params,
    );

// 获取场馆筹码配置(列表)
export const getChipSettingList = () =>
    request.post<any, ResponseData<ChipManageItem[]>>(
        `/api/ledger/chips/search/bind/list`,
    );

// 获取场馆筹码管理(列表)
export const getChipsManageList = () =>
    request.post<any, ResponseData<ChipManageItem[]>>(
        `/api/ledger/chips/search/list`,
    );

// 添加筹码
export const addChip = (params: AddChipParams) =>
    request.post<AddChipParams, ResponseData<any>>(
        `/api/ledger/chips/new`,
        params,
    );
// 编辑筹码
export const editChip = (params: AddChipParams) =>
    request.post<AddChipParams, ResponseData<any>>(
        `/api/ledger/chips/edit`,
        params,
    );
// 删除筹码
export const delChip = (params: { id: number }) =>
    request.post<AddChipParams, ResponseData<any>>(
        `/api/ledger/chips/remove`,
        params,
    );

// 大场买码的筹码集合
export const getBuyChipsList = () =>
    request.post<any, ResponseData<any>>(`/api/ledger/chips/struct`);
// 大场买码
export const buyChip = (params: BuyChipParams) =>
    request.post<BuyChipParams, ResponseData<any>>(
        `/api/ledger/ledger/casino/buy`,
        params,
    );
// 大场退码
export const refundChip = (params: RefundParams) =>
    request.post<RefundParams, ResponseData<any>>(
        `/api/ledger/ledger/casino/refund`,
        params,
    );
// 大场转码
export const changeChip = (params: ChangeParams) =>
    request.post<ChangeParams, ResponseData<any>>(
        `/api/ledger/ledger/casino/changed`,
        params,
    );

// 交更
export const createShift = () =>
    request.post<any, ResponseData<any>>(`/api/ledger/shift/create`);

// 交更记录
export const getShiftList = (params: ShiftListParams) =>
    request.post<ShiftListParams, ResponseData<any>>(
        `/api/ledger/shift/list`,
        params,
    );

// 交更-银头详情
export const getShiftHead = (params: ShiftHeadParams) =>
    request.post<MonthListParams, ResponseData<any>>(
        `/api/ledger/shift/detail`,
        params,
    );
// 交更-转码详情
export const getShiftTranscoding = (params: ShiftTranscodingParams) =>
    request.post<MonthListParams, ResponseData<any>>(
        `/api/ledger/shift/rolling`,
        params,
    );
// 月结
export const createMonth = () =>
    request.post<any, ResponseData<any>>(`api/ledger/monthly/create`, {});

// 月结记录
export const getMonthList = (params: MonthListParams) =>
    request.post<MonthListParams, ResponseData<any>>(
        `/api/ledger/monthly/list`,
        params,
    );
// 月结-银头详情
export const getMonthHead = (params: MonthHeadParams) =>
    request.post<MonthListParams, ResponseData<any>>(
        `/api/ledger/monthly/detail`,
        params,
    );
// 月结-银头详情
export const getMonthTranscoding = (params: MonthHeadParams) =>
    request.post<MonthListParams, ResponseData<any>>(
        `/api/ledger/monthly/rolling`,
        params,
    );
// 大厂买码记录
export const getBuyRecordList = (params: BuRecordParams) =>
    request.post<BuRecordParams, ResponseData<any>>(
        `/api/ledger/ledger/casino/buy/list`,
        params,
    );

// 全部银头概览
export const getAllList = () =>
    request.post<any, ResponseData<any>>(`/api/ledger/ledger/all/list`);
