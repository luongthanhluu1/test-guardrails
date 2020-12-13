import { createSlice } from "@reduxjs/toolkit";

export const { actions, reducer } = createSlice({
  name: "user",
  initialState: {
    token: null
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    }
  }
});
