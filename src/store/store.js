import { configureStore } from '@reduxjs/toolkit'
import { filterSlice } from './slices/filters'
import { graphicSlice } from './slices/graphics'



export const store = configureStore({
    reducer: {
        graphic: graphicSlice.reducer,
        filter: filterSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

