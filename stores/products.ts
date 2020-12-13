import { createSlice } from "@reduxjs/toolkit";

import { Product } from "@models";

interface ProductState {
  list: any[];
  selected: Product | null;
}

const initialState: ProductState = {
  list: [],
  selected: {
    price_list: {},
  },
};
export const { actions, reducer } = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    setProducts(state, action) {
      state.list = action.payload;
    },
    selectProduct(state: ProductState, action) {
      let id = action.payload;
      if (!id) state.selected = null;
      else if (id !== "new")
        state.selected = state.list.find((p) => p.id === id);
      else
        state.selected = {
          name: "",
          photo: "",
          category: "",
          origin: "",
          market_price: 0,
          price_list: {
            [Date.now()]: {
              label: "Từ 1",
              qty: 1,
              price: 0,
            },
            [Date.now() + 1]: {
              label: "Từ 3",
              qty: 3,
              price: 0,
            },
          },
          unit: "kg",
          info: {
            banner: "",
            description: "",
            tags: "Bao Ăn, 1 Đổi 1",
            photos: [],
          },
        };
    },
    addProduct(state, action) {
      state.list.push(action.payload);
    },
    deleteProduct(state, action) {
      let index = state.list.findIndex((p) => p.id === action.payload);
      if (index >= 0) state.list.splice(index, 1);
    },
    updateProduct(state, action) {
      let index = state.list.findIndex((p) => p.id === action.payload.id);
      state.list[index] = {
        ...state.list[index],
        ...action.payload.changes,
      };
    },
  },
});
