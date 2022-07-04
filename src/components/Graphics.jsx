import React from 'react';
import { useEffect } from 'react';
import { Template } from './Template';
import { Spinner } from './Spinner';
import { useSelector, useDispatch } from 'react-redux';
import { getDataForSection1, getDataForSection2, getSeismograms } from '../store/slices/graphics';

export const Graphics = () => {

    //Redux
    const {
        seismogramData,
        seismogramDataForFilters,
        stationForSection1,
        isLoadingSeismogramData
    } = useSelector((state) => state.graphic)
    
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSeismograms())
    }, [])

    useEffect(() => {
        if (seismogramData.length !== 0) {
            dispatch(getDataForSection1())
        }
    }, [seismogramData, seismogramDataForFilters, stationForSection1])

    useEffect(() => {
        if (seismogramData.length !== 0) {
            dispatch(getDataForSection2())
        }
    }, [seismogramData, seismogramDataForFilters])


    return (
        <div className='principalDiv'>
            {
                isLoadingSeismogramData
                    ? <Spinner />
                    : <Template />
            }
        </div>
    )
}
