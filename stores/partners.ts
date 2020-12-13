import { createSlice } from "@reduxjs/toolkit";
import { Partner } from "models/Partner";

export const { actions, reducer } = createSlice({
  name: "partners",
  initialState: {
    list: [] as Partner[],
    selected: {} as Partner | undefined,
    partnerId: null,
  },
  reducers: {
    setPartners(state, action) {
      state.list = action.payload;
    },
    selectPartnerId(state, action) {
      state.partnerId = action.payload;
    },
    selectPartner(state, action) {
      let id = action.payload;
      if (!id) state.selected = {} as Partner;
      else if (id !== "new")
        state.selected = state.list.find((p) => p.id === id);
      else
        state.selected = {
          full_name: "",
          address: "",
          phone: "",
          code: "",
          station_id: "",
          profit_ratio: 10,
        };
    },
    addPartner(state, action) {
      state.list.push(action.payload);
    },
    deletePartner(state, action) {
      let index = state.list.findIndex((p) => p.id === action.payload);
      if (index >= 0) state.list.splice(index, 1);
    },
    updatePartner(state, action) {
      let index = state.list.findIndex((p) => p.id === action.payload.id);
      state.list[index] = {
        ...state.list[index],
        ...action.payload.changes,
      };
    },
  },
});
