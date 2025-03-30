import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useModalStore } from '../stores/useModalStore'
import { useThemeToggle } from '../App'
import { offDutyOptions, onDutyOptions } from '../constants'
import { useStateStore } from '../stores/useStateStore'
import StatusModal from './Modals/StatusModal'

function TripEntries() {

    const { darkMode } = useThemeToggle()
    const { setNewTripOpen, setStatusOpen } = useModalStore()
    const { status, setStatus, onDuty } = useStateStore()
    const [tempStatus, setTempStatus] = useState('')
    const handleStatusOpen = (status) => {
        setStatusOpen(true)
        setTempStatus(status)
    }
    const statusOptions = onDuty ? onDutyOptions : offDutyOptions

    return (
        <Stack maxHeight={'90vh'} minHeight={'85vh'} p={2} sx={{overflowY: 'scroll'}}>
            {statusOptions.map((statusOption) => (
                <Button key={statusOption} variant='contained' sx={{
                    textTransform: 'capitalize', p: 3, fontSize: '1rem',
                    bgcolor: darkMode && status == statusOption ? 'white' : darkMode ? 'primary.main' : !darkMode && status == statusOption ? 'primary.main' : 'white',
                    color: darkMode && status == statusOption ? 'black' : darkMode ? 'white' : !darkMode && status == statusOption ? 'white' : 'black', mt: 1
                }}
                    onClick={() => handleStatusOpen(statusOption)}
                >
                    {statusOption}
                </Button>
            ))}
            <StatusModal tempStatus={tempStatus} />
        </Stack>
    )
}

export default TripEntries