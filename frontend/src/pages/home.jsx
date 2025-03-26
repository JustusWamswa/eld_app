import React from 'react'
import MapComp from '../components/MapComp'
import TripEntries from '../components/TripEntries'
import { Box, Grid2 } from '@mui/material'


function Home() {
  
  return (
    <Grid2 container spacing={1} >
      <Grid2 size={9} >
        <MapComp />
      </Grid2>
      <Grid2 size={3}>
        <TripEntries />
      </Grid2>
    </Grid2>
  )
}

export default Home