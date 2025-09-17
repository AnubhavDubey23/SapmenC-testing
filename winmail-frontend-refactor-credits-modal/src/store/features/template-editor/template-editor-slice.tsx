import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ITemplateEditorState {
  isOpen: boolean;
  inspectorDrawerOpen: boolean;
}

const initialState: ITemplateEditorState = {
  isOpen: false,
  inspectorDrawerOpen: false,
};

const templateEditorSlice = createSlice({
  name: 'template-editor',
  initialState,
  reducers: {
    openTemplateEditor(state, action: PayloadAction<ITemplateEditorState>) {
      state.isOpen = action.payload.isOpen;
    },
  },
});

export const { openTemplateEditor } = templateEditorSlice.actions;

export const templateEditorReducer = templateEditorSlice.reducer;
