import { TTemplate } from '@/types/template.types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ITemplatesState {
  templates: TTemplate[];
}

const initialState: ITemplatesState = {
  templates: [],
};

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setTemplates: (state, action: PayloadAction<TTemplate[]>) => {
      state.templates = action.payload;
    },
    resetTemplates: (state) => {
      state.templates = [];
    },
  },
});

export const { setTemplates, resetTemplates } = templatesSlice.actions;

export const templatesReducer = templatesSlice.reducer;
