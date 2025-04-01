import React, { useEffect, useState } from 'react'
import MapComp from '../components/MapComp'
import TripEntries from '../components/TripEntries'
import { Grid2 } from '@mui/material'
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
                console.log("From trip setup: ", res)
                setTripData(res.data.trip)
                setLogEntries(res.data.logs)
                setFsLoader(false)
            })
            .catch((err) => {
                console.log(err)
                setFsLoader(false)
            })
    }, [])

    return (
        <>
            <Grid2 container spacing={1} mt={1} height={'90vh'}>
                <Grid2 size={9} >
                    <MapComp />
                </Grid2>
                <Grid2 size={3}>
                    <TripEntries />
                </Grid2>
            </Grid2>
        </>
    )
}

export default TripSetup