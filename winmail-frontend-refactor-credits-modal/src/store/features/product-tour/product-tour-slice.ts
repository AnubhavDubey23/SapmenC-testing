import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IProductTourState {
  isOpen: boolean;
}

const initialState: IProductTourState = {
  isOpen: false,
};

const productTourSlice = createSlice({
  name: 'product-tour',
  initialState,
  reducers: {
    setProductTour(state, action: PayloadAction<IProductTourState>) {
      state.isOpen = action.payload.isOpen;
    },
  },
});

export const { setProductTour } = productTourSlice.actions;

export const productTourReducer = productTourSlice.reducer;
