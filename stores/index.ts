import { configureStore } from "@reduxjs/toolkit";
// import { reducer as partners } from "./partners";
// import { reducer as products } from "./products";
// import { reducer as orders } from "./orders";
// import { reducer as customerOrders } from "./customer-orders";
import { reducer as user } from "./user";
// import { reducer as chats } from "./chats";
// import { reducer as communities } from "./communities";
// import { reducer as categories } from "./category";
// import { reducer as editProducts } from "./edit-products";

export const initialState = {
  customerOrders: null,
  orders: null,
  products: null,
  partners: null,
  user: null,
  chats: null,
  communities: null,
  categories: null,
  editProducts: null,
};

export const store = configureStore({
  reducer: {
    user,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
