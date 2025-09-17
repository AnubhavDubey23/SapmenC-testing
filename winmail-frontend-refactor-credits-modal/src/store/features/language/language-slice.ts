import i18n from '@/app/i18n';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ILanguageState {
  language: string;
}

const initialState: ILanguageState = {
  language: 'en',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<ILanguageState>) {
      state.language = action.payload.language;
      i18n.changeLanguage(action.payload.language);
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export const languageReducer = languageSlice.reducer;
