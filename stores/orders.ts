import { createSlice } from "@reduxjs/toolkit";

export const { actions, reducer } = createSlice({
  name: "orders",
  initialState: {
    list: [],
    selected: null,
  },
  reducers: {
    setOrders(state, action) {
      state.list = action.payload;
    },
    updateOrder(state, action) {
      let index = state.list.findIndex((p) => p?.id === action.payload.id);
      state.list[index] = {
        ...state.list[index],
        ...action.payload.changes,
      };
    },
  },
});
