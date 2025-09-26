import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ISidebarState {
  isEnabled: boolean;
  isOpen: boolean;
}

const initialState: ISidebarState = {
  isEnabled: false,
  isOpen: true,
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSidebarState: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    enableSidebar: (state) => {
      state.isEnabled = true;
    },
    disableSidebar: (state) => {
      state.isEnabled = false;
    },
  },
});

export const { setSidebarState } = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;
