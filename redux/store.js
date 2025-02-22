// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import accessReducer from './accessSlice';

const store = configureStore({
  reducer: {
    access: accessReducer,
  },
});

export default store;
