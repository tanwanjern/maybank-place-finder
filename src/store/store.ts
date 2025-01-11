import { configureStore } from '@reduxjs/toolkit';
import placesReducer from './placesSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    places: placesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;