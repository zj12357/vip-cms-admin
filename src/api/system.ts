import request from '@/utils/request';
import { ResponseData } from '@/types/api/common';
import {
    CreateMemberTypeParams,
    MemberTypeListItem,
    UpdateMemberTypeParams,
    GetCommissionParams,
    CommissionListItem,
    UpdateSharesParams,
    UpdateCommissionParams,
    CreateMemberIdentityParams,
    UpdateMemberIdentityParams,
    GetMemberIdentityParams,
    GetMemberIdentityListItem,
    CreateIntegralParams,
    UpdateIntegralParams,
    GetIntegralListItem,
    GetCreditCfgListItem,
    WalletCurrencyListItem,
    UpdateWalletRateParams,
    GetRateRecordListParams,
    RateRecordListType,
    CreateMenuParams,
    MenuListItem,
    UpdateMenuParams,
    CreateDepartParams,
    GetDepartListParams,
    DepartListItem,
    DepartMemberListItem,
    UpdateDepartParams,
    CreateDepartTitleParams,
    UpdateDepartTitleParams,
    GetDepartTitleListParams,
    DepartTitleListItem,
    CreateDepartLevelParams,
    DepartLevelListItem,
    GetDepartLevelListParams,
    UpdateDepartLevelParams,
    CreateAdminAccountParams,
    UpdateAdminAccountParams,
    GetAdminAccountListParams,
    AdminAccountListType,
    UpdateIntegralStateParams,
    GetAdminAccountLogListParams,
    AdminAccountLogListType,
    UpdateAdminStateParams,
    GetHallListParams,
    HallListItem,
    VipListItem,
    CreateVipParams,
    UpdateVipParams,
    CreateHallParams,
    UpdateHallParams,
    SwitchHallParams,
    CurrencyListItem,
    UpdateCurrencyParams,
    GetMenuListParams,
    UpdateCreditCfgParams,
} from '@/types/api/system';

// 新增户口类型
export const createMemberType = (params: CreateMemberTypeParams) =>
    request.post<null, ResponseData<null>>(
        '/api/accountant/memberType/create',
        params,
    );

//查询户口类型
export const getMemberTypeList = () =>
    request.post<MemberTypeListItem[], ResponseData<MemberTypeListItem[]>>(
        '/api/accountant/memberType/list',
        {},
    );

//修改户口类型
export const updateMemberType = (params: UpdateMemberTypeParams) =>
    request.post<null, ResponseData<null>>(
        '/api/accountant/memberType/update',
        params,
    );

//查询占成,佣金/积分率
export const getCommission = (params: GetCommissionParams) =>
    request.post<CommissionListItem[], ResponseData<CommissionListItem[]>>(
        '/api/accountant/memberType/param/list',
        params,
    );

//修改占成
export const updateShares = (params: UpdateSharesParams) =>
    request.post<null, ResponseData<null>>(
        '/api/accountant/memberType/generate/param',
        params,
    );

//修改佣金/积分率
export const updateCommission = (params: UpdateCommissionParams) =>
    request.post<null, ResponseData<null>>(
        '/api/accountant/memberType/param/update',
        params,
    );

//新增户口身份
export const createMemberIdentity = (params: CreateMemberIdentityParams) =>
    request.post<null, ResponseData<null>>(
        '/api/accountant/memberIdentity/create',
        params,
    );

//修改户口身份
export const updateMemberIdentity = (params: UpdateMemberIdentityParams) =>
    request.post<null, ResponseData<null>>(
        '/api/accountant/memberIdentity/update',
        params,
    );

//查询户口身份
export const getMemberIdentityList = (params: GetMemberIdentityParams) =>
    request.post<
        GetMemberIdentityListItem[],
        ResponseData<GetMemberIdentityListItem[]>
    >('/api/accountant/memberIdentity/list', params);

//新增积分配置
export const createIntegral = (params: CreateIntegralParams) =>
    request.post<null, ResponseData<null>>('/api/cms/settle/create', params);

//修改积分配置
export const updateIntegral = (params: UpdateIntegralParams) =>
    request.post<null, ResponseData<null>>('/api/cms/settle/edit', params);

//查询积分设置
export const getIntegralList = () =>
    request.post<GetIntegralListItem[], ResponseData<GetIntegralListItem[]>>(
        '/api/cms/settle/list',
        {},
    );

//查询信贷列表
export const getCreditCfg = () =>
    request.post<GetCreditCfgListItem[], ResponseData<GetCreditCfgListItem[]>>(
        '/api/cms/marker/setting/list',
        {},
    );

//更新信贷列表中的一项
export const updateCreditCfg = (params: UpdateCreditCfgParams) =>
    request.post<UpdateCreditCfgParams, ResponseData<null>>(
        '/api/cms/marker/setting/update',
        params,
    );

//结算配置开启关闭
export const updateIntegralState = (params: UpdateIntegralStateParams) =>
    request.post<null, ResponseData<null>>(
        '/api/cms/settle/update/state',
        params,
    );

//获取汇率列表
export const getWalletCurrencyList = () =>
    request.get<
        Record<string, WalletCurrencyListItem[]>,
        ResponseData<Record<string, WalletCurrencyListItem[]>>
    >('api/wallet/currency/rate/list');

//修改汇率
export const updateWalletRate = (params: UpdateWalletRateParams) =>
    request.post<null, ResponseData<null>>(
        '/api/wallet/currency/rate/edit',
        params,
    );

//历史汇率
export const getRateRecordList = (params: GetRateRecordListParams) =>
    request.post<RateRecordListType, ResponseData<RateRecordListType>>(
        '/api/wallet/currency/rate/rateRecord',
        params,
    );

//菜单新增
export const createMenu = (params: CreateMenuParams) =>
    request.post<null, ResponseData<null>>('/api/cms/menu/create', params);

//获取菜单列表
export const getMenuList = (params: GetMenuListParams) =>
    request.post<MenuListItem[], ResponseData<MenuListItem[]>>(
        '/api/cms/menu/list',
        params,
    );

//菜单更新
export const updateMenu = (params: UpdateMenuParams) =>
    request.post<null, ResponseData<null>>('/api/cms/menu/update', params);

//菜单删除
export const deteleMenu = (id: number) =>
    request.post<null, ResponseData<null>>('/api/cms/menu/delete', {
        menu_id: id,
    });

//新建部门
export const createDepart = (params: CreateDepartParams) =>
    request.post<null, ResponseData<null>>('/api/cms/depart/create', params);

//部门查询
export const getDepartList = (params: GetDepartListParams) =>
    request.post<DepartListItem[], ResponseData<DepartListItem[]>>(
        '/api/cms/depart/list',
        params,
    );

//更新部门
export const updateDepart = (params: UpdateDepartParams) =>
    request.post<null, ResponseData<null>>('/api/cms/depart/update', params);

//部门删除
export const deleteDepart = (id: number) =>
    request.post<null, ResponseData<null>>('/api/cms/depart/delete', { id });

//部门成员
export const getDepartMemberList = () =>
    request.post<DepartMemberListItem[], ResponseData<DepartMemberListItem[]>>(
        '/api/cms/admin/depart',
        {},
    );

//职务创建
export const createDepartTitle = (params: CreateDepartTitleParams) =>
    request.post<null, ResponseData<null>>(
        '/api/cms/depart/title/create',
        params,
    );

//职务更新
export const updateDepartTitle = (params: UpdateDepartTitleParams) =>
    request.post<null, ResponseData<null>>(
        '/api/cms/depart/title/update',
        params,
    );

//职务查询
export const getDepartTitleList = (params: GetDepartTitleListParams) =>
    request.post<DepartTitleListItem[], ResponseData<DepartTitleListItem[]>>(
        '/api/cms/depart/title/list',
        params,
    );

//职务删除
export const deleteDepartTitle = (id: number) =>
    request.post<null, ResponseData<null>>('/api/cms/depart/title/delete', {
        id,
    });

//职级新增
export const createDepartLevel = (params: CreateDepartLevelParams) =>
    request.post<null, ResponseData<null>>(
        '/api/cms/depart/level/create',
        params,
    );

//职务查询
export const getDepartLevelList = (params: GetDepartLevelListParams) =>
    request.post<DepartLevelListItem[], ResponseData<DepartLevelListItem[]>>(
        '/api/cms/depart/level/list',
        params,
    );

//职级更新
export const updateDepartLevel = (params: UpdateDepartLevelParams) =>
    request.post<null, ResponseData<null>>(
        '/api/cms/depart/level/update',
        params,
    );

//职级删除
export const deleteDepartLevel = (id: number) =>
    request.post<null, ResponseData<null>>('/api/cms/depart/level/delete', {
        id,
    });

//后台账号查询
export const getAdminAccountList = (params: GetAdminAccountListParams) =>
    request.post<AdminAccountListType, ResponseData<AdminAccountListType>>(
        '/api/cms/admin/list',
        params,
    );

//后台账号创建
export const createAdminAccount = (params: CreateAdminAccountParams) =>
    request.post<null | string, ResponseData<null | string>>(
        '/api/cms/admin/create',
        params,
    );

//后台账号编辑
export const updateAdminAccount = (params: UpdateAdminAccountParams) =>
    request.post<null, ResponseData<null>>('/api/cms/admin/update', params);

//后台账号删除
export const deleteAdminAccount = (id: number) =>
    request.post<null, ResponseData<null>>('/api/cms/admin/delete', { id });

//后台账号状态切换
export const updateAdminState = (params: UpdateAdminStateParams) =>
    request.post<null, ResponseData<null>>(
        '/api/cms/admin/state/update',
        params,
    );

//日志记录
export const getAdminAccountLogList = (params: GetAdminAccountLogListParams) =>
    request.post<
        AdminAccountLogListType,
        ResponseData<AdminAccountLogListType>
    >('/api/cms/admin/log/login', params);

//获取场馆列表
export const getHallList = (params: GetHallListParams) =>
    request.post<HallListItem[], ResponseData<HallListItem[]>>(
        '/api/cms/hall/list',
        params,
    );

//新建场馆
export const createHall = (params: CreateHallParams) =>
    request.post<null, ResponseData<null>>('/api/cms/hall/create', params);

//更新场馆
export const updateHall = (params: UpdateHallParams) =>
    request.post<null, ResponseData<null>>('/api/cms/hall/edit', params);

//场馆状态切换
export const switchHall = (params: SwitchHallParams) =>
    request.post<null, ResponseData<null>>('/api/cms/hall/switch', params);

//vip等级列表
export const getVipList = () =>
    request.post<VipListItem[], ResponseData<VipListItem[]>>(
        '/api/cms/vip/list',
        {},
    );

//vip等级创建
export const createVip = (params: CreateVipParams) =>
    request.post<null, ResponseData<null>>('/api/cms/vip/create', params);

//vip等级修改
export const updateVip = (params: UpdateVipParams) =>
    request.post<null, ResponseData<null>>('/api/cms/vip/update', params);

//vip等级删除
export const deleteVip = (id: number) =>
    request.post<null, ResponseData<null>>('/api/cms/vip/remove', { id });

//币种查询
export const getCurrencyList = () =>
    request.post<CurrencyListItem[], ResponseData<CurrencyListItem[]>>(
        '/api/cms/currency/list',
        {},
    );

//币种更新
export const updateCurrency = (params: UpdateCurrencyParams) =>
    request.post<null, ResponseData<null>>('/api/cms/currency/update', params);
