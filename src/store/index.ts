// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './loadingSlice';

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    // 其他 reducer
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
