import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type FilterOption = 'all' | 'draft' | 'sent';

export interface IFilterState {
  currentFilter: FilterOption;
}

const initialState: IFilterState = {
  currentFilter: 'all',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<FilterOption>) {
      state.currentFilter = action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
