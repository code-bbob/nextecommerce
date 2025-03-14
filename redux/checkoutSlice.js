import { createSlice } from '@reduxjs/toolkit';

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
  shippingMethod: "standard",  // Updated default method
  subtotal: 0,
  discount: 0,
  shippingCost: 0,
  paymentMethod: "",
  paymentAmount: 0,  // Changed from empty string to 0
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
    updateSubtotal(state, action) {
      state.subtotal = action.payload;
    },
    updateDiscount(state, action) {
      state.discount = action.payload;
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
    },
    resetCheckout(state) {
      state.email = "";
      state.phone = "";
      state.newsOptIn = false;
      state.shippingAddress = { ...initialState.shippingAddress };
      state.shippingMethod = initialState.shippingMethod;
      state.subtotal = 0;
      state.discount = 0;
      state.shippingCost = 0;
      state.paymentMethod = "";
      state.paymentAmount = 0;
      state.paymentStatus = "";
    }
  }
});

export const { updateFirstName, updateLastName, updatePaymentAmount, updatePaymentMethod, updateMunicipality, updateEmail, updatePhone, updateNewsOptIn, updateShippingAddress, updateShippingMethod, updateShippingCost, updateCheckoutData, updateDiscount, updateSubtotal, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
