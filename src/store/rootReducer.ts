/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */
import { combineReducers } from '@reduxjs/toolkit';

import commonSlice from './common/commonSlice';
import userSlice from './user/userSlice';
import errorScreenSlice from './errorScreen/errorScreenSlice';
import accountSlice from './account/accountSlice';
import eBetSlice from './eBet/eBetSlice';
import communicationSlice from '@/store/communication/communicationSlice';

const rootReducer = combineReducers({
    common: commonSlice,
    user: userSlice,
    errorScreen: errorScreenSlice,
    account: accountSlice,
    eBet: eBetSlice,
    communication: communicationSlice,
});

export default rootReducer;
