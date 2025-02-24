// redux/accessSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  isAuthenticated: Cookies.get('isAuthenticated') === 'true',
};

const accessSlice = createSlice({
  name: 'access',
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      Cookies.set('isAuthenticated', true);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      Cookies.remove('isAuthenticated');
    },
  },
});

export const { login, logout } = accessSlice.actions;
export default accessSlice.reducer;
