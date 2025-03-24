import { Box, Typography } from '@mui/material'
import React from 'react'

function PageNotFound() {
  return (
    <Box width={'100%'} height={'70vh'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
    <Typography variant='h1'>404</Typography>
    <Typography variant='h6'>Page Not Found</Typography>
    </Box>
  )
}

export default PageNotFound