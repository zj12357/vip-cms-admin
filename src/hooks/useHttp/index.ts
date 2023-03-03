/*
 * @version:  ;
 * @description: 请求成功，返回数据，请求失败，异常处理 ;
 * @date: Do not edit
 */
import { useState, useCallback } from 'react';
import { ResponseData } from '@/types/api/common';
import { useLatest, useUnmountedRef } from '@/hooks';

export default function <P = any, T = any>(
    api: (params: P, header?: any) => Promise<ResponseData<T>>, //请求
    successCallback?: (res: ResponseData<T>) => void, //成功回调
    failCallback?: (res: ResponseData<T>) => void, //失败回调
) {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<T>();
    const [error, setError] = useState();

    const latestLoading = useLatest(loading);
    const latestResponse = useLatest(response);
    const latestError = useLatest(error);
    const unmountRef: { current: boolean } = useUnmountedRef();

    //如果组件已经卸载，就去更新状态，否则会警告：Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function

    const fetchData = useCallback(
        (params?: P, header?: any): Promise<ResponseData<T>> => {
            setLoading(true);
            return api(params ?? ({} as P), header)
                .then((res: ResponseData<T>) => {
                    if (!unmountRef.current) {
                        if (res.code === 10000) {
                            setResponse(res.data);
                            successCallback && successCallback(res);
                        } else {
                            failCallback && failCallback(res);
                        }
                    }
                    return res ?? null;
                })
                .catch((err) => {
                    if (!unmountRef.current) {
                        setError(err);
                        failCallback && failCallback(err);
                    }
                    return err;
                })
                .finally(() => {
                    if (!unmountRef.current) {
                        setLoading(false);
                    }
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return {
        loading: latestLoading.current,
        response: latestResponse.current,
        error: latestError.current,
        fetchData,
    };
}
