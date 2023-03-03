import request from '@/utils/request';
import { ResponseData } from '@/types/api/common';
import {
    UserLoginParams,
    UserLoginType,
    UserMenuListItem,
    UserUpdatePassWordParams,
} from '@/types/api/user';

//登录
export const userLogin = (params: UserLoginParams) =>
    request.post<UserLoginType, ResponseData<UserLoginType>>(
        '/api/cms/admin/login',
        params,
    );

//登出
export const userLogout = () =>
    request.post<null, ResponseData<null>>('/api/cms/admin/logout');

//用户菜单
export const getUserMenuList = () =>
    request.post<UserMenuListItem[], ResponseData<UserMenuListItem[]>>(
        '/api/cms/menu/owner',
    );

//重置密码
export const userUpdatePassWord = (params: UserUpdatePassWordParams) =>
    request.post<null | string, ResponseData<null | string>>(
        '/api/cms/admin/reset/pwd',
        params,
    );
