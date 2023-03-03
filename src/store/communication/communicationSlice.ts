import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import {
    communicationState,
    LogProps,
    UpdateLogProps,
    Kyc,
} from '@/store/communication/types';
import { getSeatList, getLogList } from '@/api/communication';
import { SeatProps } from '@/types/api/communication';
import { CallStatus } from '@/pages/Communication/Telephone/CallModal/common';

const initialState: communicationState = {
    isOpenModal: false,
    callLogs: [],
    currentCallId: undefined,
    currentSeatId: '',
    seatList: [],
};

export const getSeatListAsync = createAsyncThunk(
    'communication/seat',
    async (params: any, store) => {
        const res = await getSeatList(params);
        let list = res.data?.list ?? [];
        let un = (store.getState() as any).user.userName;
        let unSeat = list.find((x) => x.binder === un);
        if (unSeat) {
            store.dispatch(setCurrentSeatId(unSeat.id as string));
        } else {
            store.dispatch(setCurrentSeatId(''));
        }
        return list;
    },
);

export const getLogListAsync = createAsyncThunk(
    'communication/log',
    async () => {
        const res: any = await getLogList();
        let list = res.data?.list ?? [];
        list = list.map((x: any) => {
            return {
                id: x.id,
                code: x.callid, // 通话唯一标识
                phone: x.mobile_number, // 电话号码
                phoneType: x.mobile_number_type, // 电话类型，预留/非预留
                callType: x.ct === 'i' ? '0' : '1',
                status: x.status === 'AW' ? CallStatus.END : CallStatus.CANCEL, // 通话状态
                startTime: x.connectime * 1 ? Date.now() : 0,
                endTime:
                    x.connectime * 1
                        ? Date.now() + (x.duration || 0) * 1000
                        : 0,
                details: [], // 通话详情
            };
        });
        return list;
    },
);

export const communicationSlice = createSlice({
    name: 'communication',
    initialState,
    reducers: {
        // insert or update
        unshiftManyLogs: (
            state: communicationState,
            action: PayloadAction<UpdateLogProps[] | UpdateLogProps>,
        ) => {
            let o = state.callLogs;
            let n: any = action.payload;
            if (n.code) n = [n];
            n.reverse().forEach((x: LogProps) => {
                let X = o.find((y) => y.code === x.code);
                if (X) {
                    // if receive a DisConnect again , throw it away
                    if (X.status === x.status && X.status === CallStatus.END)
                        return;

                    !X.startTime && (X.startTime = x.startTime);
                    x.endTime && (X.endTime = x.endTime);
                    x.status && (X.status = x.status);
                    x.account !== undefined && (X.account = x.account);

                    X.pwd = x.pwd;

                    if (x.details) X.details = [...X.details, ...x.details];
                } else {
                    o.unshift(x);
                }
            });

            if (state.kyc?.for) {
                let kycCall =
                    o.find((x) => x.code === state.kyc?.callId) || o[0];
                if (kycCall) {
                    if (kycCall.status === CallStatus.RINGING) {
                        state.kyc.status = null;
                    } else if (
                        kycCall.status === CallStatus.END ||
                        kycCall.status === CallStatus.CANCEL
                    ) {
                        if (
                            state.kyc.status === null ||
                            state.kyc.status === undefined
                        ) {
                            state.kyc.status = false;
                        }
                    } else if (kycCall.status === CallStatus.CALL) {
                        if (kycCall.pwd !== undefined) {
                            state.kyc.status = kycCall.pwd;
                        }
                    }
                }
            }

            state.callLogs = o;
        },
        setIsOpenModal: (
            state: communicationState,
            action: PayloadAction<boolean>,
        ) => {
            state.isOpenModal = action.payload;
        },
        setCurrentCallId: (
            state: communicationState,
            action: PayloadAction<string>,
        ) => {
            state.currentCallId = action.payload;
        },
        setCurrentSeatId: (
            state: communicationState,
            action: PayloadAction<string>,
        ) => {
            state.currentSeatId = action.payload;
        },
        setKyc: (state: communicationState, action: PayloadAction<Kyc>) => {
            state.kyc = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            getSeatListAsync.fulfilled,
            (state: communicationState, action: PayloadAction<SeatProps[]>) => {
                state.seatList = action.payload;
            },
        );

        builder.addCase(
            getLogListAsync.fulfilled,
            (state: communicationState, action: PayloadAction<LogProps[]>) => {
                state.callLogs = action.payload;
            },
        );
    },
});

export const {
    unshiftManyLogs,
    setIsOpenModal,
    setCurrentCallId,
    setCurrentSeatId,
    setKyc,
} = communicationSlice.actions;

export const selectCallLogs = (state: RootState) =>
    state.communication.callLogs;
export const selectIsOpenModal = (state: RootState) =>
    state.communication.isOpenModal;
export const selectCurrentCallId = (state: RootState) =>
    state.communication.currentCallId;
export const selectCurrentSeatId = (state: RootState) =>
    state.communication.currentSeatId;
export const selectSeatList = (state: RootState) =>
    state.communication.seatList;
export const selectKyc = (state: RootState) => state.communication.kyc;

export default communicationSlice.reducer;
