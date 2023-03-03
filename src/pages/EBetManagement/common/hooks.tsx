import { useEffect, useMemo, useState } from 'react';
import { SelectProps } from 'rc-select/lib/Select';
import { useHttp } from '@/hooks';
import { vipClubDeskList, vipClubList } from '@/api/eBet';
import { selectVipClubList, setVipClubList } from '@/store/eBet/eBetSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { VipClubDeskProps } from '@/types/api/eBet';

export const useVipClub = () => {
    const dispatch = useAppDispatch();
    const [clubId, setClubId] = useState<Pick<VipClubDeskProps, 'club_id'>>();
    const [deskId, setDeskId] = useState<Pick<VipClubDeskProps, 'desk_id'>>();
    const [deskOptions, setDeskOptions] = useState<SelectProps['options']>();
    // 获取贵宾厅
    const { fetchData: fetchVipClubList, loading: clubLoading } = useHttp(
        vipClubList,
        (res) => {
            dispatch(setVipClubList(res.data));
        },
    );

    useEffect(() => {
        fetchVipClubList().then();
    }, [fetchVipClubList]);
    const clubList = useAppSelector(selectVipClubList);
    const clubOptions = useMemo(
        () =>
            clubList.map((v) => ({
                value: v.id,
                label: v.name,
            })),
        [clubList],
    );
    const { fetchData: fetchDeskList, loading: deskLoading } =
        useHttp(vipClubDeskList);

    useEffect(() => {
        fetchDeskList({
            club_id: clubId,
        })
            .then((res) => {
                if (res.code !== 10000) {
                    return Promise.reject('Error');
                }
                const options =
                    res.data.map((v) => ({
                        value: v.desk_id,
                        label: v.desk_no,
                    })) ?? [];
                setDeskOptions(options);
            })
            .catch(() => setDeskOptions([]))
            .finally(() => {
                setDeskId(undefined);
            });
    }, [clubId, fetchDeskList]);

    return {
        clubOptions,
        deskOptions,
        clubId,
        setClubId,
        deskId,
        setDeskId,
        clubLoading,
        deskLoading,
    };
};
