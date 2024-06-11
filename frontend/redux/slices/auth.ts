import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {},
    logout(state) {},
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
