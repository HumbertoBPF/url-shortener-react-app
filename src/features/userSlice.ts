import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import IUser from 'interfaces/IUser';

const initialState: IUser = {
    email: '',
    urls: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            return {
                ...action.payload,
            };
        },
        clearUser: () => {
            return {
                ...initialState,
            };
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
