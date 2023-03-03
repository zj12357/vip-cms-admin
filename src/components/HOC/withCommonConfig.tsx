import React, {
    ComponentType,
    FC,
    Fragment,
    useEffect,
    useCallback,
} from 'react';
import {
    currencyListAsync,
    hallListAsync,
    currentHallAsync,
    departmentListAsync,
} from '@/store/common/commonSlice';
import { menuListAsync } from '@/store/user/userSlice';
import { useIconName } from '@/config/icon';
import { selectToken } from '@/store/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { batch } from 'react-redux';

// 获取公共配置
export default function WithCommonConfig<Props>(
    WrappedComponent: ComponentType<Props>,
) {
    const Component: FC<Props> = (props) => {
        //获取所有的图标
        useIconName();

        const token = useAppSelector(selectToken);

        const dispatch = useAppDispatch();

        useEffect(() => {
            if (token) {
                batch(() => {
                    //获取币种
                    dispatch(currencyListAsync());
                    //获取场馆
                    dispatch(hallListAsync());
                    //获取当前场馆信息
                    dispatch(currentHallAsync());
                    //获取部门
                    dispatch(departmentListAsync());

                    //获取用户菜单
                    dispatch(menuListAsync());
                });
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [window.location.pathname, token, dispatch]);

        useEffect(() => {
            //要切换到tag下面可以看到
            console.log(
                `%c 当前系统版本 %c ${process.env.REACT_APP_TAG || null} %c`,
                'background:#181818 ; padding: 2px; border-radius: 3px 0 0 3px;  color: #fff',
                'background:#b3893d ; padding: 2px; border-radius: 0 3px 3px 0;  color: #fff',
                'background:transparent',
            );

            !process.env.REACT_APP_TAG &&
                console.log(
                    `%c 注意：需要切换到对应版本的tag构建 %c`,
                    'background:#f5222d ; padding: 2px; border-radius: 3px;  color: #fff',
                    'background:transparent',
                );
        }, []);

        return (
            <Fragment>
                <WrappedComponent {...props} />
            </Fragment>
        );
    };

    Component.displayName = `WithCommonConfig(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return Component;
}
