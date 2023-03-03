/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { AccountState } from './types';
import { AccountInfoType, AuthorizerAllListItem } from '@/types/api/account';
import { CreditDetailListItem } from '@/types/api/accountAction';
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage';

const initialState: AccountState = {
    accountInfo: (getLocalStorage('accountInfo') ?? {}) as AccountInfoType,
    authorizerInfo: {} as AuthorizerAllListItem,
    creditDetailList: [],
    accountType: getLocalStorage('accountType') ?? 1,
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccountInfo: (
            state: AccountState,
            action: PayloadAction<AccountInfoType>,
        ) => {
            state.accountInfo = action.payload;
            setLocalStorage('accountInfo', action.payload);
        },
        setAuthorizerInfo: (
            state: AccountState,
            action: PayloadAction<AuthorizerAllListItem>,
        ) => {
            state.authorizerInfo = action.payload;
        },
        setCreditDetailList: (
            state: AccountState,
            action: PayloadAction<CreditDetailListItem[]>,
        ) => {
            state.creditDetailList = action.payload;
        },
        setAccountType: (state: AccountState, action: PayloadAction<1 | 2>) => {
            state.accountType = action.payload;
            setLocalStorage('accountType', action.payload);
        },
    },
});

export const {
    setAccountInfo,
    setAuthorizerInfo,
    setCreditDetailList,
    setAccountType,
} = accountSlice.actions;

export const selectAccountInfo = (state: RootState) =>
    state.account.accountInfo;

export const selectAuthorizerInfo = (state: RootState) =>
    state.account.authorizerInfo;

export const selectCreditDetailList = (state: RootState) =>
    state.account.creditDetailList;

export const selectAccountType = (state: RootState) =>
    state.account.accountType;
export default accountSlice.reducer;
