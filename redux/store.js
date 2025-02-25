// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import accessReducer from './accessSlice';
import cartReducer from './cartSlice';
import checkoutReducer from './checkoutSlice';

const store = configureStore({
  reducer: {
    access: accessReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
  },
});

export default store;
