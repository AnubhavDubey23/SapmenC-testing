import { Tsegment } from '@/types/segment.types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IsegmentsState {
  segments: Tsegment[];
}

const initialState: IsegmentsState = {
  segments: [],
};

const segmentsSlice = createSlice({
  name: 'segments',
  initialState,
  reducers: {
    setsegments: (state, action: PayloadAction<Tsegment[]>) => {
      state.segments = action.payload;
    },
    resetsegments: (state) => {
      state.segments = [];
    },
  },
});

export const { setsegments, resetsegments } = segmentsSlice.actions;

export const segmentsReducer = segmentsSlice.reducer;
