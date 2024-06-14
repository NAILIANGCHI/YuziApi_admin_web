// loadingSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
