import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  counter: 10,
}

export const graphicSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.counter += 1
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment } = graphicSlice.actions
