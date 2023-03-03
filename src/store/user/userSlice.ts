/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../';
import { UserState } from './types';
import authToken from '@/common/token';
import { getUserMenuList } from '@/api/user';
import { UserLoginType, UserMenuListItem } from '@/types/api/user';
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage';

const initialState: UserState = {
    token: authToken.getToken() ?? '',
    status: 'loading',
    menuList: getLocalStorage('menuList') ?? [],
    userName: getLocalStorage('userName') ?? '',
};

export const menuListAsync = createAsyncThunk(
    'user/fetchMenuList',
    async () => {
        const { data } = await getUserMenuList();
        return data;
    },
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginOut: (state: UserState) => {
            state.token = '';
            authToken.clearToken();
        },
        login: (state: UserState, action: PayloadAction<UserLoginType>) => {
            state.token = action.payload.token ?? '';
            state.userName = action.payload.login_name ?? '';
            authToken.setToken(action.payload.token ?? '');
            setLocalStorage('userName', action.payload.login_name ?? '');
        },
    },
    //extraReducers 处理接口状态，一般是列表加载，loading状态获取，加载成功，加载失败
    extraReducers: (builder) => {
        builder

            //用户菜单
            .addCase(menuListAsync.pending, (state) => {})
            .addCase(
                menuListAsync.fulfilled,
                (
                    state: UserState,
                    action: PayloadAction<UserMenuListItem[]>,
                ) => {
                    state.menuList = action.payload ?? [];
                    setLocalStorage('menuList', action.payload ?? []);
                },
            )
            .addCase(menuListAsync.rejected, (state, action) => {});
    },
});

export const { loginOut, login } = userSlice.actions;

export const selectToken = (state: RootState) => state.user.token;
export const selectUserName = (state: RootState) => state.user.userName;
export const selectMenuList = (state: RootState) => state.user.menuList;

export default userSlice.reducer;
