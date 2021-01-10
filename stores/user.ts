import { createSlice } from "@reduxjs/toolkit";

export const { actions, reducer } = createSlice({
  name: "user",
  initialState: {
    token: null,
    username: null,
    role: null,
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setUser(state, action) {
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
  },
});
