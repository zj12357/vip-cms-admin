/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */
import {
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
} from '@/utils/localStorage';

const tokenKey = 'token';

export default Object.freeze({
    clearToken: () => {
        removeLocalStorage(tokenKey);
    },
    setToken: (data: string) => {
        setLocalStorage(tokenKey, data);
    },
    getToken: () => {
        return getLocalStorage(tokenKey);
    },
});
