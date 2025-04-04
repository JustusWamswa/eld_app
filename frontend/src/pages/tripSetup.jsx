import React, { useEffect, useState } from 'react'
import MapComp from '../components/MapComp'
import TripEntries from '../components/TripEntries'
import { Grid2, useMediaQuery, useTheme } from '@mui/material'
import { getTrip, getUserStatus } from '../services/api'
import { useTripStore } from '../stores/useTripStore'
import { useModalStore } from '../stores/useModalStore'
import { useParams } from 'react-router'


function TripSetup() {

    const { setStatus } = useTripStore()
    const { setFsLoader } = useModalStore()
    const { id } = useParams()
    const { setTripData, setLogEntries } = useTripStore()

    useEffect(() => {
        setFsLoader(true)
        getTrip(id)
            .then((res) => {
                setTripData(res.data.trip)
                setLogEntries(res.data.logs)
                setFsLoader(false)
            })
            .catch((err) => {
                console.log(err)
                setFsLoader(false)
            })
    }, [])

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <>
            <Grid2 container spacing={1} mt={1} height={'90vh'}>
                <Grid2 size={isMobile ? 12 : 9} height={isMobile ? '50%' : '100%'} >
                    <MapComp />
                </Grid2>
                <Grid2 size={isMobile ? 12 : 3}>
                    <TripEntries />
                </Grid2>
            </Grid2>
        </>
    )
}

export default TripSetup