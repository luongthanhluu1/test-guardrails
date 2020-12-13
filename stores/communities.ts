import { createSlice } from "@reduxjs/toolkit";

export const { actions, reducer } = createSlice({
  name: "communities",
  initialState: {
    list: [],
    selected: null
  },
  reducers: {
    load(state, action) {
      state.list = action.payload;
    },
    select(state, action) {
      let id = action.payload;
      if (!id) state.selected = null;
      else if (id !== 'new') state.selected = state.list.find(p => p.id === id);
      else state.selected = { name: "", admin_id: "" };
    },
    add(state, action) {
      state.list.push(action.payload);
    },
    delete(state, action) {
      let index = state.list.findIndex(p => p.id === action.payload);
      if (index >= 0) state.list.splice(index, 1);
    },
    update(state, action) {
      let index = state.list.findIndex(p => p.id === action.payload.id);
      state.list[index] = {
        ...state.list[index],
        ...action.payload.changes
      };
    }
  }
});
