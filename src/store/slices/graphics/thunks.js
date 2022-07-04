import { getSeismogramData, startGetSeismogramData } from "./graphicSlice"

import * as seisplotjs from 'seisplotjs';

export const getSeismograms = () => {
    return async (dispatch) => {
        dispatch(startGetSeismogramData())

        let queryTimeWindow = new seisplotjs.util.StartEndDuration('2019-01-01', '2019-07-31');
        let stationQuery = new seisplotjs.fdsnstation.StationQuery()
            .networkCode('CO')
            .stationCode('HODGE,BIRD,PAULI')
            // .stationCode('HODGE,BIRD,JSC,PAULI,SUMMV,TEEBA')
            .locationCode('00')
            .channelCode('HH?')
            .timeWindow(queryTimeWindow);

        try {
            const [networks] = await Promise.all([stationQuery.queryResponses()])
            let allChannels = Array.from(seisplotjs.stationxml.allChannels(networks));
            let timeWindow = new seisplotjs.util.StartEndDuration('2019-07-05T14:21:59Z', null, 300);
            let seismogramDataList = allChannels.map(c => {
                let sdd = seisplotjs.seismogram.SeismogramDisplayData.fromChannelAndTimeWindow(c, timeWindow);
                return sdd;
            });
            let dsQuery = new seisplotjs.fdsndataselect.DataSelectQuery();

            [seismogramDataList] = await Promise.all([dsQuery.postQuerySeismograms(seismogramDataList)]);
            dispatch(getSeismogramData({ seismogramDataList }))

        } catch (error) {
            console.error(`Error loading data. -> ${error}`);
        }

    }
}