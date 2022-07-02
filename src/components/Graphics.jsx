import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import * as seisplotjs from 'seisplotjs';
import { Template } from './Template';
import { Spinner } from './Spinner';
import { useSelector, useDispatch } from 'react-redux';
import { getDataForSection1, getDataForSection2, getSeismograms } from '../store/slices/graphics';

export const Graphics = () => {
    //Redux
    const {seismogramData, seismogramDataSection1, stationForSection1} = useSelector( (state) => state.graphic )
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch( getSeismograms() )
    }, [])

    useEffect(() => {
        if (seismogramData.length !== 0) {
            dispatch( getDataForSection1() )            
        }
    }, [seismogramData, stationForSection1]) 

    useEffect(() => {
        if (seismogramData.length !== 0) {
            dispatch( getDataForSection2() )
        }
    }, [seismogramData]) 

    return (
        <div className='principalDiv'>
            {seismogramDataSection1.length !== 0
                ? <>
                    <Template
                    />
                </>
                :
                <Spinner />
            }
        </div>
    )
}
