/**
 * 场面管理
 */
import request from '@/utils/request';
import { ResponseData } from '@/types/api/common';
import {
    ConsumListParams,
    GetConsumDetailParams,
    QueryAccountParams,
    CreateConsumeConfigParams,
    GetConsumConfigListParams,
    DeleteConfigItemParams,
    UpdateConsumeConfigParams,
    ConsumCancelParams,
    ConsumApprovalParams,
    IntegralListParams,
    IntegralDetailParams,
    GiftsListParams,
    GiftsDetailParams,
    AddConsumParams,
    UpdateConsumParams,
    ChargebackParams,
    GetCompanyBalanceParams,
} from '@/types/api/service';

// 查询消费列表
export const getConsumList = (params: ConsumListParams) =>
    request.post<any, ResponseData<any>>(
        '/api/vipservice/consume/list',
        params,
    );
// 查询操作人
export const getConsumOperator = () =>
    request.get<any, ResponseData<any>>('/api/vipservice/consume/operator');

// 订单取消
export const consumCancel = (params: ConsumCancelParams) =>
    request.post<any, ResponseData<any>>(
        `/api/vipservice/consume/cancel/${params.id}`,
    );

// 订单审批
export const consumApproval = (params: ConsumApprovalParams) =>
    request.post<any, ResponseData<any>>(
        '/api/vipservice/consume/approval',
        params,
    );

// 查询消费详情
export const getConsumDetailById = (params: GetConsumDetailParams) =>
    request.get<any, ResponseData<any>>(
        `/api/vipservice/consume/detail/${params.id}`,
    );

// 新建消费
export const addConsum = (params: AddConsumParams) =>
    request.post<any, ResponseData<any>>(
        `/api/vipservice/consume/create`,
        params,
    );

// 取消订单
export const cancelConsum = (id: string) =>
    request.post<any, ResponseData<any>>(
        `/api/vipservice/consume/cancel/${id}`,
    );

// 退订单
export const chargebackConsum = (params: ChargebackParams) =>
    request.post<any, ResponseData<any>>(
        `/api/vipservice/consume/chargeback`,
        params,
    );
// 更新待结算的消费
export const updateConsum = (params: UpdateConsumParams) =>
    request.post<any, ResponseData<any>>(
        `/api/vipservice/consume/update`,
        params,
    );
// 查询户口
export const queryAccount = (params: QueryAccountParams) =>
    request.post<any, ResponseData<any>>(
        `/api/vipservice/consume/query/account`,
        params,
    );
// 新增消费配置
export const createConsumeConfig = (params: CreateConsumeConfigParams) =>
    request.post<any, ResponseData<any>>(
        '/api/vipservice/config/create',
        params,
    );
// 修改消费配置
export const updateConsumeConfig = (params: UpdateConsumeConfigParams) =>
    request.post<any, ResponseData<any>>(
        '/api/vipservice/config/update',
        params,
    );
// 查询分类关键字
export const queryKeyword = () =>
    request.get<any, ResponseData<any>>(`/api/vipservice/config/keyword`);
// 查询消费项目列表
export const getConsumConfigList = (params: GetConsumConfigListParams) =>
    request.post<any, ResponseData<any>>('/api/vipservice/config/list', params);
// 删除某项消费配置
export const deleteConfigItem = (params: DeleteConfigItemParams) =>
    request.post<any, ResponseData<any>>(
        `/api/vipservice/config/delete/${params.id}`,
        params,
    );
// 查询积分列表
export const getIntegralList = (params: IntegralListParams) =>
    request.post<any, ResponseData<any>>(
        `/api/vipservice/integral/list`,
        params,
    );
// 导出积分列表
export const getIntegralListExport = (params: any) =>
    request.get<any, ResponseData<any>>(`/api/vipservice/integral/export`, {
        responseType: 'arraybuffer',
        params,
    });
// 查询积分详情
export const getIntegralDetail = (params: IntegralDetailParams) =>
    request.post<any, ResponseData<any>>(
        `/api/vipservice/integral/detail`,
        params,
    );
// 查询礼遇金列表
export const getGiftsList = (params: GiftsListParams) =>
    request.post<any, ResponseData<any>>(`/api/vipservice/gifts/list`, params);
// 查询礼遇金列表
export const getGiftsListExport = (params: any) =>
    request.get<any, ResponseData<any>>(`/api/vipservice/gifts/export`, {
        responseType: 'arraybuffer',
        params,
    });
// 查询礼遇金详情
export const getGiftsDetail = (params: GiftsDetailParams) =>
    request.post<any, ResponseData<any>>(
        `/api/vipservice/gifts/detail`,
        params,
    );
// 查询部门
export const getDepartmentList = () =>
    request.post<any, ResponseData<any>>(`/api/cms/depart/list`, {});

// 查询部门成员
export const getDepartmentMember = (department_id: string) =>
    request.post<any, ResponseData<any>>(`/api/cms/admin/depart/list`, {
        department_id,
    });

// 查询公司户口
export const getCompanyList = () =>
    request.post<any, ResponseData<any>>(`api/member/account/hall/company`);
// 查询公司户口余额
export const getCompanyBalance = (params: GetCompanyBalanceParams) =>
    request.post<any, ResponseData<any>>(
        `/api/member/wallet/getMemberCurrencyBalance`,
        params,
    );
