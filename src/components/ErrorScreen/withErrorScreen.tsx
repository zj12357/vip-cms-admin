import * as React from 'react';
import { ComponentType, FC, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectErrorScreen } from '@/store/errorScreen/errorScreenSlice';
import ErrorScreen from '.';
import { ErrorScreenType } from '@/store/errorScreen/types';
import {
    hideErrorScreen,
    showErrorScreen,
} from '@/store/errorScreen/errorScreenSlice';

export default function WithErrorScreen<Props>(
    WrappedComponnet: ComponentType<Props>,
) {
    const Component: FC<Props> = (props) => {
        const error = useAppSelector(selectErrorScreen);

        const dispatch = useAppDispatch();
        const showError = useCallback(
            (type: ErrorScreenType) => {
                dispatch(showErrorScreen(type));
            },
            [dispatch],
        );

        const hideError = useCallback(() => {
            dispatch(hideErrorScreen());
        }, [dispatch]);

        return (
            <ErrorScreen
                error={error}
                hideError={hideError}
                showError={showError}
            >
                <WrappedComponnet {...props} />
            </ErrorScreen>
        );
    };

    Component.displayName = `withErrorScreen(${
        Component.displayName || Component.name
    })`;

    return Component;
}
