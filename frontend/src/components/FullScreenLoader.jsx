import React from 'react'
import { Box, CircularProgress } from '@mui/material'

function FullScreenLoader() {
  return (
    <Box width={'100vw'} height={'100vh'} position={'absolute'} zIndex={2000} display={'flex'} justifyContent={'center'} alignItems={'center'} bgcolor={'rgba(0,0,0,0.8)'}>
        <CircularProgress color='info' />
    </Box>
  )
}

export default FullScreenLoader