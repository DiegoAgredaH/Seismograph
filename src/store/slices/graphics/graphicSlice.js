import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

export const graphicSlice = createSlice({
    name: 'graphics',
    initialState: {
        // all data
        seismogramData: [],
        seismogramDataForFilters: [],
        // data for secction1 and section2 
        seismogramDataSection1: [],
        seismogramDataSection2: [],
        stationForSection1: 'HODGE',
        isLoadingSeismogramData: false
    },
    reducers: {
        startGetSeismogramData: (state ) => {
            state.isLoadingSeismogramData = true;
        },
        getSeismogramData: (state, action) => {
            state.seismogramData = action.payload.seismogramDataList
            state.seismogramDataForFilters = _.cloneDeep(state.seismogramData)
            state.isLoadingSeismogramData = false;
        },
        getDataForSection1: (state) => {
            state.seismogramDataSection1 = state.seismogramDataForFilters.filter(seismogram => seismogram.channel.station.stationCode === state.stationForSection1);
        },
        getDataForSection2: (state) => {
            state.seismogramDataSection2 = state.seismogramDataForFilters.filter(seismogram => seismogram.channel.channelCode[2] === 'Z');
        },
        setStationForSection1: (state, action) => {
            state.stationForSection1 = action.payload.stationForSection1;
        },
        setSeismogramDataForFilters: (state, action) => {
            state.seismogramDataForFilters = action.payload.seismogramDataForFilters
        }
    },
})

// Action creators are generated for each case reducer function
export const { startGetSeismogramData, getSeismogramData, getDataForSection1, getDataForSection2, setStationForSection1, setSeismogramDataForFilters } = graphicSlice.actions
