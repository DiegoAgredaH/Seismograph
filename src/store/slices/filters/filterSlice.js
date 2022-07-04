import { createSlice } from '@reduxjs/toolkit';

const valuesHz = [
    {},
    { lowCorner: .7, highCorner: 2 },
    { lowCorner: 1, highCorner: 3 },
    { lowCorner: 2, highCorner: 4, },
    { lowCorner: 4, highCorner: 8, }
]

export const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        filterBand: '',
        filterHz: {}
    },
    reducers: {
        getHZForFilters: (state, action) => {
            state.filterHz = valuesHz[action.payload.filterHz]
        },
        getBandForFilters: (state, action) => {
            state.filterBand = action.payload.band
        },
    }
});


// Action creators are generated for each case reducer function
export const { getHZForFilters, getBandForFilters } = filterSlice.actions;