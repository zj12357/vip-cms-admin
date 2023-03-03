/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { eBetState } from './types';
import { VipClubProps } from '@/types/api/eBet';

const initialState: eBetState = {
    vipClubList: [],
};

export const eBetSlice = createSlice({
    name: 'eBet',
    initialState,
    reducers: {
        setVipClubList: (
            state: eBetState,
            action: PayloadAction<VipClubProps[]>,
        ) => {
            state.vipClubList = action.payload;
        },
    },
});

export const { setVipClubList } = eBetSlice.actions;

export const selectVipClubList = (state: RootState) => state.eBet.vipClubList;

export default eBetSlice.reducer;
