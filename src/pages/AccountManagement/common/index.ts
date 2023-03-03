/*
 * @Version:  ;
 * @Description: 处理户口模块的公共逻辑 ;
 * @Date: 2022-10-06 17:28:37
 */
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setAccountInfo } from '@/store/account/accountSlice';
import { useHttp } from '@/hooks';
import { getAccountInfo, getCompanyMemberInfo } from '@/api/account';
import { AccountInfoType, GetCompanyMemberInfoType } from '@/types/api/account';
import { nanoid } from 'nanoid';

//获取客户户口详情
export const useGetAccountInfo = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();
    const { fetchData: _fetchAccountInfo } = useHttp<string, AccountInfoType>(
        getAccountInfo,
        ({ data }) => {
            dispatch(setAccountInfo(data));
        },
    );
    const callback = useCallback(() => {
        _fetchAccountInfo(id);
    }, [_fetchAccountInfo, id]);

    return callback;
};

//获取公司户口详情
export const useGetCompanyInfo = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();

    const { fetchData: _fetchCompanyMemberInfo } = useHttp<
        string,
        GetCompanyMemberInfoType
    >(getCompanyMemberInfo, ({ data }) => {
        dispatch(setAccountInfo(data as any));
    });
    const callback = useCallback(() => {
        _fetchCompanyMemberInfo(id);
    }, [_fetchCompanyMemberInfo, id]);

    return callback;
};

//处理客户助理
export const transTableData = (list: Record<string, any>[], field: string) => {
    return list.reduce((res: any[], next: Record<string, any>) => {
        const haveChildren =
            Array.isArray(next[field]) && next[field].length > 0;

        let newItem: Record<string, any> = {
            depart_name: next.depart_name,
            id: nanoid(),
            children: haveChildren
                ? next[field].map((item: any) => {
                      return {
                          depart_name: item.login_name,
                          id: nanoid(),
                      };
                  })
                : [],
        };

        res = res.concat(newItem);

        return res;
    }, []);
};
