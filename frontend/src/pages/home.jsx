import React, { useEffect, useState } from 'react'
import MapComp from '../components/MapComp'
import TripEntries from '../components/TripEntries'
import { Box, Grid2, LinearProgress } from '@mui/material'
import { getUserStatus } from '../services/api'
import { useTripStore } from '../stores/useTripStore'
import FullScreenLoader from '../components/FullScreenLoader'
import { useModalStore } from '../stores/useModalStore'
import { useNavigate } from 'react-router'


function Home() {

  const { setStatus, setLogEntries } = useTripStore()
  const { setFsLoader } = useModalStore()

  const navigate = useNavigate()

  useEffect(() => {
    setFsLoader(true)
    getUserStatus()
    .then((res) => {
      setStatus(res.data)
      setFsLoader(false)
      setLogEntries([])
      if(res.data.status) navigate(`/trip/${res.data.trip}`)
    })
    .catch((err) => {
      console.log(err)
      setFsLoader(false)
    })
  }, [])

  return (
    <>
      <Box height={'90vh'} p={1}>
          <MapComp />
      </Box>
    </>
  )
}

export default Home