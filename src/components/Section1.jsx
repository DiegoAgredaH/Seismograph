import React, { useEffect } from 'react'
import * as seisplotjs from 'seisplotjs';
import { useSelector } from 'react-redux';

export const Section1 = () => {

    const { seismogramDataSection1 } = useSelector((state) => state.graphic)

    useEffect(() => {
        if (seismogramDataSection1.length !== 0) {
            document.getElementById("myseismograph").innerHTML = "";
            window.scrollTo(0, 0)
            plotSection1()
        }
    }, [seismogramDataSection1])

    const plotSection1 = () => {
        let div = seisplotjs.d3.select('div#myseismograph');
        let graphList = [];
        let graph = [];

        // const ampLinker = new seisplotjs.seismograph.LinkedAmpScale();
        seismogramDataSection1.forEach(sdd => {
            let seisConfig = new seisplotjs.seismographconfig.SeismographConfig();
            seisConfig.title = 'Station: ' + sdd.stationCode + ' Channel: ' + sdd.channelCode
            seisConfig.isXAxis = false;
            seisConfig.xLabel = " ";
            if (sdd.channelCode == "LHE") {
                seisConfig.lineColors = ["orange"]
            }
            else if (sdd.channelCode == "LHN") {
                seisConfig.lineColors = ["olivedrab"]
            }
            else if (sdd.channelCode == "LHZ") {
                seisConfig.lineColors = ["darkcyan"]
                seisConfig.isXAxis = true;
                seisConfig.xLabel = "Time";
            }
            seisConfig.wheelZoom = true;
            seisConfig.isYAxis = true;
            seisConfig.windowAmp = false;
            graph = new seisplotjs.seismograph.Seismograph(div,
                seisConfig,
                sdd);
            graphList.forEach(g => graph.linkXScaleTo(g));
            graphList.push(graph);
            // ampLinker.link(graph);
            graph.draw()
            // }
        });
    }

    return (
        <>
            <div className='section1 animate__animated animate__slideInLeft'>
                <br />
                <div className='myseismograph' id="myseismograph">
                </div>
            </div>
        </>
    )
}
