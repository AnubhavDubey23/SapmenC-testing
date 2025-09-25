import { TAuthUserProfile } from '@/types/user.types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IAuthState {
  authState: boolean;
  userId: string | null;
  username?: string | null;
  currentToken?: string | null;
  userProfile: TAuthUserProfile | null;
}

const initialState: IAuthState = {
  authState: false,
  userId: null,
  username: null,
  currentToken: null,
  userProfile: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<IAuthState>) => {
      state.authState = action.payload.authState;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.currentToken = action.payload.currentToken;
    },
    setUserProfile: (state, action: PayloadAction<TAuthUserProfile>) => {
      state.userProfile = action.payload;
    },
    auth_logout: (state) => {
      state.authState = false;
      state.userId = null;
      state.currentToken = null;
      state.username = null;
      state.userProfile = null;
    },
  },
});

export const { setAuthState, setUserProfile, auth_logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
