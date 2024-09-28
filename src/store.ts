import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from 'features/userSlice';

const rootReducer = combineReducers({
    user: userReducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
    });
}

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
