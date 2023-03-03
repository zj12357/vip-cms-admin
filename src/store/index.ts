/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from './rootReducer';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export default store;
