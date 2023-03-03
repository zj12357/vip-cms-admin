/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */
import { UserMenuListItem } from '@/types/api/user';
export interface UserState {
    token: null | string;
    status: 'loading' | 'success' | 'failed';
    menuList: UserMenuListItem[];
    userName: string;
}
