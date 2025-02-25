// store/checkoutSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  email: "",
  phone: "",
  newsOptIn: false,
  shippingAddress: {
    country: "US",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
  },
  shippingMethod: "economy",
  shippingCost: 0
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    
    updateEmail(state, action) {
      state.email = action.payload;
    },
    updatePhone(state, action) {
      state.phone = action.payload;
    },
    updateNewsOptIn(state, action) {
      state.newsOptIn = action.payload;
    },
    updateShippingAddress(state, action) {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload };
    },
    updateShippingMethod(state, action) {
      state.shippingMethod = action.payload;
    },
    updateShippingCost(state, action) {
      state.shippingCost = action.payload;
    },
    updateCheckoutData(state, action) {
      const data = action.payload;
      if (data.email !== undefined) state.email = data.email;
      if (data.newsOptIn !== undefined) state.newsOptIn = data.newsOptIn;
      if (data.shippingAddress !== undefined) {
        state.shippingAddress = { ...state.shippingAddress, ...data.shippingAddress };
      }
      if (data.shippingMethod !== undefined) state.shippingMethod = data.shippingMethod;
    }
  }
});

export const { updateEmail,updatePhone, updateNewsOptIn, updateShippingAddress, updateShippingMethod,updateShippingCost, updateCheckoutData } = checkoutSlice.actions;
export default checkoutSlice.reducer;
