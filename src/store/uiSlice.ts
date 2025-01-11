import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  showMobileList: boolean;
}

const initialState: UIState = {
  showMobileList: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileList: (state, action: PayloadAction<boolean>) => {
      state.showMobileList = action.payload;
    },
  },
});

export const { toggleMobileList } = uiSlice.actions;
export default uiSlice.reducer;