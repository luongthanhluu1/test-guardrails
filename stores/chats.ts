import { createSlice } from "@reduxjs/toolkit";

export const { actions, reducer } = createSlice({
  name: "partners",
  initialState: {
    partners: [],
    customers: {},
    messages: {},
    selectedCustomer: null,
    selectedPartner: null
  },
  reducers: {
    setPartners(state, action) {
      state.partners = action.payload;
    },
    setCustomers(state, action) {
      let { id, customers } = action.payload;
      let partner = state.partners.find(p => p.id === state.selectedPartner);
      state.customers[id] = [partner, ...customers];
    },
    setMessages(state, action) {
      let { id, messages } = action.payload;
      state.messages[id] = messages;
    },
    selectCustomer(state, action) {
      state.selectedCustomer = action.payload;
    },
    selectPartner(state, action) {
      state.selectedPartner = action.payload;
    }
  }
});
