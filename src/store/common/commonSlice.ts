/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */
import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    createSelector,
} from '@reduxjs/toolkit';
import { RootState } from '..';
import {
    CommonState,
    DetailPageMenuListItem,
    DetailPageInfo,
    RouteInfo,
    SelectOptions,
    CurrencyOptions,
} from './types';
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage';
import {
    getCurrencyList,
    getHallList,
    getCurrentHall,
    getDepartmentList,
} from '@/api/public';
import { getChipSettingList } from '@/api/silverHead';
import { CurrentHallType } from '@/types/api/public';

const initialState: CommonState = {
    iconList: [],
    detailPageInfo: (getLocalStorage('detailPageInfo') ?? {}) as DetailPageInfo,
    detailPageMenuList: [],
    secondRouteInfo: (getLocalStorage('secondRouteInfo') ?? {}) as RouteInfo,
    thirdRouteInfo: (getLocalStorage('thirdRouteInfo') ?? {}) as RouteInfo,
    currencyList: getLocalStorage('currencyList') ?? [],
    hallList: getLocalStorage('hallList') ?? [],
    currentHall: (getLocalStorage('currentHall') ?? {}) as CurrentHallType,
    departmentList: getLocalStorage('departmentList') ?? [],
    chipsList: getLocalStorage('chipsList') ?? [],
};

export const currencyListAsync = createAsyncThunk(
    'common/fetchCurrency',
    async () => {
        const { data } = await getCurrencyList();
        return data?.map((item) => {
            return {
                label: item.currency_code,
                value: +item.id,
                permission: item.permission,
            };
        });
    },
);

export const hallListAsync = createAsyncThunk('common/fetchHall', async () => {
    const { data } = await getHallList();
    return data?.map((item) => {
        return {
            label: item.hall_name,
            value: +item.id,
        };
    });
});

export const currentHallAsync = createAsyncThunk(
    'common/fetchCurrentHall',
    async () => {
        const { data } = await getCurrentHall();
        return data;
    },
);

export const departmentListAsync = createAsyncThunk(
    'common/fetchDepartment',
    async () => {
        const { data } = await getDepartmentList();
        return data?.map((item) => {
            return {
                label: item.department_name,
                value: +item.id,
            };
        });
    },
);

export const chipsListAsync = createAsyncThunk(
    'common/fetchChipsList',
    async () => {
        const { data } = await getChipSettingList();
        return data?.map((item) => {
            return {
                label: item.chips_name,
                value: +item.id,
                currencyId: item.currency_id,
            };
        });
    },
);

export const commonSlice = createSlice({
    name: 'common',
    initialState,

    reducers: {
        setIconList: (state: CommonState, action: PayloadAction<string[]>) => {
            state.iconList = action.payload;
        },
        setDetailPageInfo: (
            state: CommonState,
            action: PayloadAction<DetailPageInfo>,
        ) => {
            state.detailPageInfo = action.payload;
            setLocalStorage('detailPageInfo', action.payload ?? {});
        },
        setDetailPageMenuList: (
            state: CommonState,
            action: PayloadAction<DetailPageMenuListItem[]>,
        ) => {
            state.detailPageMenuList = action.payload;
        },
        setSecondRouteInfo: (
            state: CommonState,
            action: PayloadAction<Partial<RouteInfo>>,
        ) => {
            state.secondRouteInfo = {
                ...state.secondRouteInfo,
                ...action.payload,
            };
            setLocalStorage('secondRouteInfo', state.secondRouteInfo);
        },
        setThirdRouteInfo: (
            state: CommonState,
            action: PayloadAction<Partial<RouteInfo>>,
        ) => {
            state.thirdRouteInfo = {
                ...state.thirdRouteInfo,
                ...action.payload,
            };

            setLocalStorage('thirdRouteInfo', state.thirdRouteInfo);
        },
    },

    //extraReducers 处理接口状态，一般是列表加载，loading状态获取，加载成功，加载失败
    extraReducers: (builder) => {
        builder

            //货币
            .addCase(currencyListAsync.pending, (state) => {})
            .addCase(
                currencyListAsync.fulfilled,
                (
                    state: CommonState,
                    action: PayloadAction<CurrencyOptions[]>,
                ) => {
                    state.currencyList = action.payload ?? [];
                    setLocalStorage('currencyList', action.payload ?? []);
                },
            )
            .addCase(currencyListAsync.rejected, (state, action) => {})

            //场馆
            .addCase(hallListAsync.pending, (state) => {})
            .addCase(
                hallListAsync.fulfilled,
                (
                    state: CommonState,
                    action: PayloadAction<SelectOptions[]>,
                ) => {
                    state.hallList = action.payload ?? [];
                    setLocalStorage('hallList', action.payload ?? []);
                },
            )
            .addCase(hallListAsync.rejected, (state, action) => {})

            //当前场馆信息
            .addCase(currentHallAsync.pending, (state) => {})
            .addCase(
                currentHallAsync.fulfilled,
                (
                    state: CommonState,
                    action: PayloadAction<CurrentHallType>,
                ) => {
                    state.currentHall = action.payload ?? {};
                    setLocalStorage('currentHall', action.payload ?? {});
                },
            )
            .addCase(currentHallAsync.rejected, (state, action) => {})

            //部门
            .addCase(departmentListAsync.pending, (state) => {})
            .addCase(
                departmentListAsync.fulfilled,
                (
                    state: CommonState,
                    action: PayloadAction<SelectOptions[]>,
                ) => {
                    state.departmentList = action.payload ?? [];
                    setLocalStorage('departmentList', action.payload ?? []);
                },
            )
            .addCase(departmentListAsync.rejected, (state, action) => {})
            // 所有筹码种类
            .addCase(chipsListAsync.pending, (state) => {})
            .addCase(
                chipsListAsync.fulfilled,
                (
                    state: CommonState,
                    action: PayloadAction<SelectOptions[]>,
                ) => {
                    state.chipsList = action.payload ?? [];
                    setLocalStorage('chipsList', action.payload ?? []);
                },
            )
            .addCase(chipsListAsync.rejected, (state, action) => {});
    },
});

export const {
    setDetailPageInfo,
    setDetailPageMenuList,
    setSecondRouteInfo,
    setThirdRouteInfo,
    setIconList,
} = commonSlice.actions;

export const selectIconList = (state: RootState) => state.common.iconList;
export const selectDetailPageInfo = (state: RootState) =>
    state.common.detailPageInfo;
export const selectDetailPageMenuList = (state: RootState) =>
    state.common.detailPageMenuList;
export const selectSecondRouteInfo = (state: RootState) =>
    state.common.secondRouteInfo;
export const selectThirdRouteInfo = (state: RootState) =>
    state.common.thirdRouteInfo;

export const selectSecondRoutePath = createSelector(
    selectSecondRouteInfo,
    (info) => info.parentPath,
);
export const selectThirdRoutePath = createSelector(
    selectThirdRouteInfo,
    (info) => info.parentPath,
);

export const selectCurrencyList = (state: RootState) =>
    state.common.currencyList;
export const selectHallList = (state: RootState) => state.common.hallList;
export const selectCurrentHall = (state: RootState) => state.common.currentHall;
export const selectDepartmentList = (state: RootState) =>
    state.common.departmentList;
export const selectChipsList = (state: RootState) => state.common.chipsList;

export default commonSlice.reducer;
