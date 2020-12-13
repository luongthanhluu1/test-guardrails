import { Order } from "models/Order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const { actions, reducer } = createSlice({
  name: "customerOrders",
  initialState: {
    list: [] as Order[],
    order: null,
  } as {
    list: Order[];
    order: Order | null;
  },
  reducers: {
    setOrders(state, { payload }: PayloadAction<Order[]>) {
      state.list = payload;
    },
    selectOrder(state, { payload }: PayloadAction<Order | null>) {
      state.order = payload;
    },
  },
});
