import { createSlice } from '@reduxjs/toolkit'

export const graphicSlice = createSlice({
    name: 'graphics',
    initialState: {
        // all data
        seismogramData: [],
        // data for secction1 and section2 
        seismogramDataSection1: [],
        seismogramDataSection2: [],
        stationForSection1: 'HODGE',
        isLoading: false
    },
    reducers: {
        startGetSeismogramData: (state, action) => {
            state.isLoading = true;
        },
        getSeismogramData: (state, action) => {
            state.isLoading = false;
            state.seismogramData = action.payload.seismogramDataList
        },
        getDataForSection1: (state) => {
            state.seismogramDataSection1 = state.seismogramData.filter(seismogram => seismogram.channel.station.stationCode === state.stationForSection1);
        },
        getDataForSection2: (state) => {
            state.seismogramDataSection2 = state.seismogramData.filter(seismogram => seismogram.channel.channelCode[2] === 'Z');
        },
        setStationForSection1: (state, action) => {
            state.stationForSection1 = action.payload.stationForSection1;
        },
    },
})

// Action creators are generated for each case reducer function
export const { startGetSeismogramData, getSeismogramData, getDataForSection1, getDataForSection2, setStationForSection1 } = graphicSlice.actions
