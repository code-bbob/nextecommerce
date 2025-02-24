// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import accessReducer from './accessSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    access: accessReducer,
    cart: cartReducer,
  },
});

export default store;
