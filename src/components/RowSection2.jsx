import React from 'react'
import * as seisplotjs from 'seisplotjs';
import { Button, Paper } from '@mui/material'
import { useEffect } from 'react'
import '../styles/label.css'

const styleSection2 = {
    backgroundColor: '#253e5d',
    borderRadius: '10px',
}


export const RowSection2 = ({ seismogram, setStationForSection1 }) => {
    useEffect(() => {
        plotSection2()
    }, [seismogram])

    const plotSection2 = () => {
        let div = seisplotjs.d3.select(`div#myseismograph${seismogram.channel.station.stationCode}`);
        let seisConfig = new seisplotjs.seismographconfig.SeismographConfig();
        seisConfig.isXAxis = false;
        seisConfig.isYAxis = false;
        seisConfig.xLabel = "";
        seisConfig.yLabel = "";
        seisConfig.ySublabel = "";
        seisConfig.ySublabelIsUnits = false;
        seisConfig.doRMean = false;
        seisConfig.windowAmp = false;
        seisConfig.lineColors = ["darkcyan"]
        let graph = new seisplotjs.seismograph.Seismograph(div,
            seisConfig,
            seismogram);
        graph.draw()

    }

    return (
        <>
            <Paper style={styleSection2} elevation={5}>
                <Button className="container-fluid " onClick={() => setStationForSection1(seismogram.channel.station.stationCode)}>
                    <label className="label ">{seismogram.channel.station.stationCode}</label>
                    <div className="seismograph1 container-fluid " id={`myseismograph${seismogram.channel.station.stationCode}`}>
                    </div>
                </Button>
            </Paper>
        </>
    )
}
