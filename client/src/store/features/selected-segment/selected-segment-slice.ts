import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ISelectedsegmentstate {
  segmentId: string;
  name: string;
  description: string;
  recipients: object[];
  created_by: {
    name: string;
    email: string;
  };
  updated_by: {
    name: string;
    email: string;
  };
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

const initialState: ISelectedsegmentstate | null = {
  segmentId: '',
  name: '',
  description: '',
  recipients: [],
  created_by: {
    name: '',
    email: '',
  },
  updated_by: {
    name: '',
    email: '',
  },
  is_active: false,
  createdAt: '',
  updatedAt: '',
};

const selectedsegmentslice = createSlice({
  name: 'selected-segment',
  initialState,
  reducers: {
    setActivesegment(state, action: PayloadAction<ISelectedsegmentstate>) {
      if (action.payload) {
        state.segmentId = action.payload.segmentId;
        state.name = action.payload.name;
        state.description = action.payload.description;
        state.created_by = action.payload.created_by;
        state.updated_by = action.payload.updated_by;
        state.is_active = action.payload.is_active;
        state.createdAt = action.payload.createdAt;
        state.updatedAt = action.payload.updatedAt;
        state.recipients = action.payload.recipients;
      } else {
        state = initialState;
      }
    },
  },
});

export const { setActivesegment } = selectedsegmentslice.actions;

export const selectedsegmentReducer = selectedsegmentslice.reducer;
