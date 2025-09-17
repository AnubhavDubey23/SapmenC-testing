import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IActiveTabState {
  tabIndex: number;
}

const initialState: IActiveTabState = {
  tabIndex: 0,
};

export const activeTabSlice = createSlice({
  name: 'active-tab',
  initialState,
  reducers: {
    setActiveTabState: (state, action: PayloadAction<IActiveTabState>) => {
      state.tabIndex = action.payload.tabIndex;
    },
  },
});

export const { setActiveTabState } = activeTabSlice.actions;
export const activeTabReducer = activeTabSlice.reducer;
