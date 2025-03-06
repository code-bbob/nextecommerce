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
    municipality: "",
  },
  shippingMethod: "economy",
  shippingCost: 0,
  paymentMethod: "",
  paymentAmount: "",
  paymentStatus: "",
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {

    updateFirstName(state, action) {
      state.shippingAddress.firstName = action.payload;
    },
    updateLastName(state, action) {
      state.shippingAddress.lastName = action.payload;
    },
    updatePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
    updatePaymentAmount(state, action) {
      state.paymentAmount = action.payload;
    },
    updateMunicipality(state, action) {
      state.shippingAddress.municipality = action.payload;
    },
    
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

export const { updateFirstName,updateLastName,updatePaymentAmount,updatePaymentMethod,updateMunicipality,updateEmail,updatePhone, updateNewsOptIn, updateShippingAddress, updateShippingMethod,updateShippingCost, updateCheckoutData } = checkoutSlice.actions;
export default checkoutSlice.reducer;
