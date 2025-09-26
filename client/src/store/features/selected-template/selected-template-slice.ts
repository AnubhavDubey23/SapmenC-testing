import { Tsegment } from '@/types/segment.types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ISelectedTemplateState {
  templateId: string;
  name: string;
  description: string;
  subject: string;
  email_data: object;
  created_by: any;
  updated_by: any;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  is_triggered: boolean;
  stats: any;
  segments_used: Tsegment[];
}

const initialState: ISelectedTemplateState | null = {
  templateId: '',
  name: '',
  description: '',
  subject: '',
  email_data: {},
  created_by: {},
  updated_by: {},
  is_active: false,
  createdAt: '',
  updatedAt: '',
  is_triggered: false,
  stats: {},
  segments_used: [],
};

const selectedTemplateSlice = createSlice({
  name: 'selected-template',
  initialState,
  reducers: {
    setActiveTemplate(
      state,
      action: PayloadAction<ISelectedTemplateState | null>
    ) {
      if (action.payload) {
        state.templateId = action.payload.templateId;
        state.name = action.payload.name;
        state.description = action.payload.description;
        state.email_data = action.payload.email_data;
        state.created_by = action.payload.created_by;
        state.updated_by = action.payload.updated_by;
        state.is_active = action.payload.is_active;
        state.createdAt = action.payload.createdAt;
        state.updatedAt = action.payload.updatedAt;
        state.subject = action.payload.subject;
        state.is_triggered = action.payload.is_triggered;
        state.stats = action.payload.stats;
        state.segments_used = action.payload.segments_used;
      } else {
        state = initialState;
      }
    },
    setActiveTemplateStats(state, action: PayloadAction<any>) {
      state.stats = action.payload;
    },
  },
});

export const { setActiveTemplate, setActiveTemplateStats } =
  selectedTemplateSlice.actions;

export const selectedTemplateReducer = selectedTemplateSlice.reducer;
