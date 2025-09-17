import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ISearchState {
  query: string | null;
  module: string | null;
}

const initialState: ISearchState = {
  query: null,
  module: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<ISearchState>) {
      state.query = action.payload.query;
      state.module = action.payload.module;
    },
  },
});

export const { setSearch } = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
