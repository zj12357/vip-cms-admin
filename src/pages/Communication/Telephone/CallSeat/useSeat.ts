import React, { useEffect, useCallback } from 'react';
import { useHttp } from '@/hooks';
import { bindSeat } from '@/api/communication';
import { SeatProps } from '@/types/api/communication';
import { selectUserName } from '@/store/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { message } from 'antd';
import {
    getSeatListAsync,
    selectSeatList,
    setCurrentSeatId,
    selectCurrentSeatId,
} from '@/store/communication/communicationSlice';
import { selectCurrentHall } from '@/store/common/commonSlice';

export const useSeat = () => {
    const dispatch = useAppDispatch();

    const userName = useAppSelector(selectUserName);
    const currentHall = useAppSelector(selectCurrentHall);

    // 坐席列表
    const seatList = useAppSelector(selectSeatList);
    const currentSeatId = useAppSelector(selectCurrentSeatId);

    const { fetchData: submitBind, loading: binding } = useHttp(bindSeat);
    const bubSeat = useCallback(
        async (data: SeatProps, isBind = true) => {
            const opearte = isBind ? 'bind' : 'unbind'; // unbind 解绑  bind 绑定
            const res = await submitBind({
                id: data.id,
                user_name: userName,
                opearte,
            });
            if (res.code === 10000) {
                message.success('操作成功');
                dispatch(setCurrentSeatId(isBind ? (data.id as string) : ''));
                dispatch(getSeatListAsync({}));
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [submitBind, userName],
    );

    useEffect(() => {
        dispatch(getSeatListAsync({}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        seatList,
        currentSeatId,
        bubSeat,
    };
};
