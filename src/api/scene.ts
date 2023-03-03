/**
 * 场面管理
 */
import request from '@/utils/request';
import { ResponseData } from '@/types/api/common';
import {
    GetCustomerListParams,
    ResCustomerList,
    CustomerCreateParams,
    CustomerLotteryParams,
    GetSpectacleListParams,
    ResGetSpectacleList,
    GetRoundListParams,
    ResRoundList,
    customerDetailParams,
    CustomerDetailUpdateParams,
    RemarkListParams,
    RemarkCreateParams,
    CircleListParams,
    CircleListUpdateParams,
    CashBalancePaeams,
    BagChipsParams,
    FooterDateParams,
} from '@/types/api/scene';

// 查询入场列表
export const getSpectacleList = (params: GetSpectacleListParams) =>
    request.post<ResGetSpectacleList, ResponseData<ResGetSpectacleList>>(
        '/api/scene/spectacle/list',
        params,
    );

// 查询所有户口
export const getCustomerList = (params: GetCustomerListParams) =>
    request.post<ResCustomerList, ResponseData<ResCustomerList>>(
        '/api/scene/spectacle/customer/list',
        params,
    );
// 新增客人
export const customerCreate = (params: CustomerCreateParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/spectacle/customer/create',
        params,
    );
// 新增客人加彩
export const customerLottery = (params: CustomerLotteryParams) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/spectacle/customer/add/chips',
        params,
    );
// 客人加彩信息
export const customerLotteryInfo = (params: {}) =>
    request.post<null, ResponseData<null>>(
        '/api/scene/spectacle/customer/add/chips/info',
        params,
    );
// 查询场次编号-根据户口号
export const getRoundList = (params: GetRoundListParams) =>
    request.post<ResRoundList, ResponseData<ResRoundList>>(
        '/api/scene/spectacle/customer/round/list',
        params,
    );
// 查询户口客户详情
export const customerDetail = (params: customerDetailParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/spectacle/customer/detail',
        params,
    );
// 更新户口客户特征-场面状态,入场身份, 桌台号, 座位号
export const customerDetailUpdate = (params: CustomerDetailUpdateParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/spectacle/customer/detail/update',
        params,
    );
// 查询客户备注列表
export const remarkList = (params: RemarkListParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/spectacle/customer/remark/list',
        params,
    );
// 新增备注
export const remarkCreate = (params: RemarkCreateParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/spectacle/customer/remark/create',
        params,
    );
// 查询围数
export const circleList = (params: CircleListParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/spectacle/circle/list',
        params,
    );
// 导出围数列表
export const exportCircleList = (params: CircleListParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/v1/download/circle/list',
        params,
    );
// 更新围数
export const circleListUpdate = (params: CircleListUpdateParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/spectacle/circle/update',
        params,
    );

// 查询页脚日期
export const footerDate = (params: FooterDateParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/spectacle/footer/data',
        params,
    );

// 查询cash加彩余额
export const getCashBalance = (params: CashBalancePaeams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/convert/chips/add/chips/cash/balance',
        params,
    );

// 查询marker加彩余额
export const getMarkerBalance = (params: CashBalancePaeams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/convert/chips/add/chips/marker/balance',
        params,
    );

// 获取用户离场信息
export const getLeaverConfirmInfo = (params: customerDetailParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/spectacle/leave/confirm',
        params,
    );

// 用户离场增加袋码
export const bagChipsCreate = (params: BagChipsParams) =>
    request.post<any, ResponseData<any>>(
        '/api/scene/spectacle/leave/bag/chips/create',
        params,
    );
