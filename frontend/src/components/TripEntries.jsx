import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useModalStore } from '../stores/useModalStore'
import { useThemeToggle } from '../App'
import { useTripStore } from '../stores/useTripStore'
import StatusModal from './Modals/StatusModal'
import { statusOptions } from '../constants'

function TripEntries() {

    const { darkMode } = useThemeToggle()
    const { setNewTripOpen, setStatusOpen } = useModalStore()
    const { status, setStatus, onDuty } = useTripStore()
    const [tempStatus, setTempStatus] = useState({})
    const handleStatusOpen = (status) => {
        setStatusOpen(true)
        setTempStatus(status)
    }

    return (
        <Stack maxHeight={'90vh'} minHeight={'85vh'} p={2} sx={{ overflowY: 'scroll' }}>
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
        </Stack>
    )
}

export default TripEntries