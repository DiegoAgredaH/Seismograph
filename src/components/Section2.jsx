import React, { useEffect } from 'react'
import * as seisplotjs from 'seisplotjs';
import { Paper, Typography } from '@mui/material'
import { RowSection2 } from './RowSection2';
import { useSelector } from 'react-redux';

const styleSection2 = {
    backgroundColor: '#253e5d',
    borderRadius: '10px',
}

const styleTypography = {
    backgroundColor: '#253e5d',
    borderRadius: '10px',
    color: '#326997',
    fontWeight: 'bold',
}

export const Section2 = () => {

//Redux
const {seismogramDataSection2} = useSelector( (state) => state.graphic )

    return (
        <>
            <Paper style={styleSection2} elevation={5} className="animate__animated animate__slideInLeft">
                <Typography style={styleTypography} align='center' variant='h6'>
                    Listado de estaciones
                </Typography>
                {
                    seismogramDataSection2.map(seismogram => {
                        return <RowSection2
                            key={seismogram.channel.station.stationCode}
                            seismogram={seismogram}
                        />
                    })
                }
            </Paper>
        </>
    )
}
