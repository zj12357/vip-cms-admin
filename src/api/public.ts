//通用接口
import request from '@/utils/request';
import { ResponseData } from '@/types/api/common';
import {
    CurrencyOptions,
    HallOptions,
    DepartmentOptions,
    CurrentHallType,
    VerifyOpcodeParams,
} from '@/types/api/public';

//获取币种类型
export const getCurrencyList = () =>
    request.post<CurrencyOptions[], ResponseData<CurrencyOptions[]>>(
        '/api/cms/currency/list',
        {},
    );
//获取场馆类型
export const getHallList = () =>
    request.post<HallOptions[], ResponseData<HallOptions[]>>(
        '/api/cms/hall/cache',
        {},
    );

//获取部门类型
export const getDepartmentList = () =>
    request.post<DepartmentOptions[], ResponseData<DepartmentOptions[]>>(
        '/api/cms/depart/list',
        {},
    );

//上传证件图片
export const uploadMemberImage = (params: FormData) =>
    request.post<string, ResponseData<string>>(
        '/api/member/uploadMultiImg',
        params,
    );

//获取当前场馆信息
export const getCurrentHall = () =>
    request.post<CurrentHallType, ResponseData<CurrentHallType>>(
        '/api/cms/hall/current',
        {},
    );

//验证操作码
export const verifyOpcode = (header: VerifyOpcodeParams) => {
    return request.patch<string, ResponseData<string>>(
        '/api/cms/admin/opc',
        null,
        {
            headers: { ...header },
        },
    );
};
