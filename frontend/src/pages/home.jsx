import React, { useEffect, useState } from 'react'
import MapComp from '../components/MapComp'
import TripEntries from '../components/TripEntries'
import { Box, Grid2, LinearProgress } from '@mui/material'
import { getUserStatus } from '../services/api'
import { useStateStore } from '../stores/useStateStore'
import FullScreenLoader from '../components/FullScreenLoader'
import { useModalStore } from '../stores/useModalStore'


function Home() {

  const { setStatus } = useStateStore()
  const { setFsLoader } = useModalStore()

  // useEffect(() => {
  //   setFsLoader(true)
  //   getUserStatus()
  //   .then((res) => {
  //     console.log(res)
  //     setStatus(res.data.status)
  //     setFsLoader(false)
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //     setFsLoader(false)
  //   })
  // }, [])

  return (
    <>
    <Grid2 container spacing={1} mt={1}>
      <Grid2 size={12} >
        <MapComp />
      </Grid2>
      {/* <Grid2 size={3}>
        <TripEntries />
      </Grid2> */}
    </Grid2>
    </>
  )
}

export default Home