import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import growerReducer from './slices/GrowerSlice';
import seasonFieldReducer from './slices/SeasonFieldSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        grower: growerReducer,
        seasonField: seasonFieldReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
