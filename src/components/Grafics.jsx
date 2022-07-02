import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import * as seisplotjs from 'seisplotjs';
import { Template } from './Template';
import { Spinner } from './Spinner';

export const Grafics = () => {

    // all data
    const [seismogramData, setSeismogramData] = useState([])

    // data for secction1 and section2
    const [seismogramDataSection1, setSeismogramDataSection1] = useState([])
    const [seismogramDataSection2, setSeismogramDataSection2] = useState([])
    const [stationForSection1, setStationForSection1] = useState('HODGE')
    
    useEffect(() => {
        getSeismogramData()
    }, [])

    useEffect(() => {
        if (seismogramData.length !== 0) {
            dataForSection1()
            dataForSection2()
        }
    }, [seismogramData, stationForSection1]) 

    const getSeismogramData = async () => {
        let queryTimeWindow = new seisplotjs.util.StartEndDuration('2019-07-01', '2019-07-31');

        let stationQuery = new seisplotjs.fdsnstation.StationQuery()
            .networkCode('CO')
            .stationCode('HODGE,BIRD,JSC,PAULI,SUMMV,TEEBA')
            .locationCode('00')
            .channelCode('LH?')
            .timeWindow(queryTimeWindow);

        try {
            const [networks] = await Promise.all([stationQuery.queryChannels()])
            console.log(networks)
            let allChannels = Array.from(seisplotjs.stationxml.allChannels(networks));
            let timeWindow = new seisplotjs.util.StartEndDuration('2020-03-05T14:21:59Z', null, 1800);
            let seismogramDataList = allChannels.map(c => {
                let sdd = seisplotjs.seismogram.SeismogramDisplayData.fromChannelAndTimeWindow(c, timeWindow);
                return sdd;
            });
            let dsQuery = new seisplotjs.fdsndataselect.DataSelectQuery();

            [seismogramDataList] = await Promise.all([dsQuery.postQuerySeismograms(seismogramDataList)]);
            setSeismogramData(seismogramDataList)
            
        } catch (error) {
            console.error(`Error loading data. -> ${error}`);
        }

        // Promise.all([stationQuery.queryChannels()])
        //     .then(([networks]) => {
        //         let allChannels = Array.from(seisplotjs.stationxml.allChannels(networks));
        //         let timeWindow = new seisplotjs.util.StartEndDuration('2020-03-05T14:21:59Z', null, 1800);
        //         let seismogramDataList = allChannels.map(c => {
        //             let sdd = seisplotjs.seismogram.SeismogramDisplayData.fromChannelAndTimeWindow(c, timeWindow);
        //             return sdd;
        //         });
        //         let dsQuery = new seisplotjs.fdsndataselect.DataSelectQuery();
        //         return Promise.all([dsQuery.postQuerySeismograms(seismogramDataList)]);
        //     }).then(([seismogramDataList]) => {
        //         setSeismogramData(seismogramDataList)
        //         // setSeismogramDataFiltered(...seismogramDataList)
        //     }).catch(function (error) {
        //         seisplotjs.d3.select("div#myseismograph").append('p').html("Error loading data." + error);
        //         console.assert(false, error);
        //     });

    }

    const dataForSection1 = () => {
        const dataSection1 = seismogramData.filter(seismogram => seismogram.channel.station.stationCode === stationForSection1);
        setSeismogramDataSection1(dataSection1)
    }

    const dataForSection2 = () => {
        const dataSection2 = seismogramData.filter(seismogram => seismogram.channel.channelCode[2] === 'Z');
        setSeismogramDataSection2(dataSection2)
    }

    return (
        <div className='principalDiv'>
            {seismogramDataSection1.length !== 0
                ? <>
                    <Template
                        stationForSection1={stationForSection1}
                        seismogramDataSection1={seismogramDataSection1}
                        seismogramDataSection2={seismogramDataSection2}
                        setStationForSection1={setStationForSection1}
                    />
                </>
                :
                <Spinner />
            }
        </div>
    )
}
