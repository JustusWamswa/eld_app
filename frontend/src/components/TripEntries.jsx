import { Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { useModalStore } from '../stores/useModalStore'

function TripEntries() {

    const { setNewTripOpen } = useModalStore()
    const handleOpen = () => setNewTripOpen(true)

  return (
    <Stack bgcolor={'rgba(0,0,0,0.2)'} height={'100%'} p={2}>
        <Button variant='contained' sx={{textTransform: 'capitalize', p: 3, fontSize: '1rem', bgcolor: 'white', color: 'black'}} onClick={handleOpen}>Start a new trip</Button>
        {/* <Typography bgcolor={'white'} >Start a new trip</Typography> */}
    </Stack>
  )
}

export default TripEntries