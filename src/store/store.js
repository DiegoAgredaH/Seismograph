import { configureStore } from '@reduxjs/toolkit'
import { graphicSlice } from './slices/graphics'


export const store = configureStore({
  reducer: {
    graphic: graphicSlice.reducer,
  },
})