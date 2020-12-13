import { createSlice } from "@reduxjs/toolkit";

export const { actions, reducer } = createSlice({
  name: "categories",
  initialState: {
    list: [],
    selected: null
  },
  reducers: {
    setCategorys(state, action) {
      state.list = action.payload;
    },
    selectCategory(state, action) {
      let id = action.payload;
      if (!id) state.selected = null;
      else if (id !== "new") state.selected = state.list.find(p => p.id === id);
      else
        state.selected = {
        };
    },
    addCategory(state, action) {
      state.list.push(action.payload);
    },
    deleteCategory(state, action) {
      let index = state.list.findIndex(p => p.id === action.payload);
      if (index >= 0) state.list.splice(index, 1);
    },
    updateCategory(state, action) {
      let index = state.list.findIndex(p => p.id === action.payload.id);
      state.list[index] = {
        ...state.list[index],
        ...action.payload.changes
      };
    }
  }
});
