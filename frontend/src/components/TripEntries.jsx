import { Box, Button, Divider, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useModalStore } from '../stores/useModalStore'
import { useThemeToggle } from '../App'
import { useTripStore } from '../stores/useTripStore'
import StatusModal from './Modals/StatusModal'
import { statusOptions } from '../constants'
import EndStatusModal from './Modals/EndStatusModal'

function TripEntries() {

    const { darkMode } = useThemeToggle()
    const { setNewTripOpen, setStatusOpen } = useModalStore()
    const { status, setStatus, onDuty } = useTripStore()
    const [tempStatus, setTempStatus] = useState({})
    const handleStatusOpen = (status) => {
        setStatusOpen(true)
        setTempStatus(status)
    }

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Stack maxHeight={isMobile ? '45vh' : '90vh'} p={2} sx={{ overflowY: 'scroll' }}>
            {statusOptions.map((statusOption) => (
                <Button key={statusOption.option} variant='contained' sx={{
                    textTransform: 'capitalize', p: 3, fontSize: '1rem',
                    bgcolor: darkMode && status?.status == statusOption.option ? 'white' : darkMode ? 'primary.main' : !darkMode && status?.status == statusOption.option ? 'primary.main' : 'white',
                    color: darkMode && status?.status == statusOption.option ? 'black' : darkMode ? 'white' : !darkMode && status?.status == statusOption.option ? 'white' : 'black', mt: 1
                }}
                    onClick={() => handleStatusOpen(statusOption)}
                >
                    {statusOption.option}
                </Button>
            ))}
            <StatusModal tempStatus={tempStatus} />
            <EndStatusModal tempStatus={tempStatus} />
        </Stack>
    )
}

export default TripEntries