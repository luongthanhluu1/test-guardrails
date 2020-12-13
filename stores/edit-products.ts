import { createSlice } from '@reduxjs/toolkit'

export const { actions, reducer } = createSlice({
  name: 'editProducts',
  initialState: {
    list: [],
    hotList: [],
    selected: null,
  },
  reducers: {
    setProducts(state, action) {
      state.list = action.payload
    },
    selectProduct(state, action) {
      let id = action.payload
      console.log('id', id)
      if (!id) state.selected = null
      else state.selected = state.list.find((p) => p.id === id)
    },

    updateProduct(state, action) {
      let index = state.list.findIndex((p) => p.id === action.payload.id)
      state.list[index] = {
        ...state.list[index],
        ...action.payload.changes,
      }
    },
    setHotProducts(state, action) {
      state.hotList = action.payload
    },
  },
})
