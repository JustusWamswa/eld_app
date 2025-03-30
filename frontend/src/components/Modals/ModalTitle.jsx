import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'


function ModalTitle({ title, handleClose }) {
    return (
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
            <Typography variant='h6' textTransform={'capitalize'}>{title}</Typography>
            <IconButton size='large' sx={{ color: 'white' }} onClick={handleClose}>
                <HighlightOffIcon sx={{ color: 'white' }} />
            </IconButton>
        </Box>
    )
}

export default ModalTitle