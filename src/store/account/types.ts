/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */

import { AccountInfoType, AuthorizerAllListItem } from '@/types/api/account';
import { CreditDetailListItem } from '@/types/api/accountAction';
export interface AccountState {
    accountInfo: AccountInfoType;
    authorizerInfo: AuthorizerAllListItem;
    creditDetailList: CreditDetailListItem[];
    accountType: 1 | 2; //公司1，客户2
}
