import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    loading: false,
    error: false,
    isAdmin: false,
    isActive: false,
    isStaff: false,
    token: null,
  },
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload?.user?.username;
      state.isAdmin = action.payload?.user?.isAdmin;
      state.isActive = action.payload?.user?.isActive;
      state.isStaff = action.payload?.user?.isStaff;
      state.token = action.payload?.token?.access; // Store the access token
      state.refreshToken = action.payload?.token?.refresh; // Store the refresh token
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.token = null;
      state.isAdmin = false;
      state.isActive = false;
      state.isStaff = false;
      state.refreshToken = null;
    },
    registerSuccess: (state, { payload }) => {
      state.loading = false;
      state.currentUser = payload?.user?.username;
      state.token = payload?.token?.access; // Store the access token
      state.isAdmin = payload?.user?.isAdmin;
      state.isActive = payload?.user?.isActive;
      state.isStaff = payload?.user?.isStaff;
      state.error = false;
      // Store the refresh token
      state.refreshToken = payload?.token?.refresh;
    },
    fetchFail: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const {
  fetchStart,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
  fetchFail,
} = authSlice.actions;
export default authSlice.reducer;