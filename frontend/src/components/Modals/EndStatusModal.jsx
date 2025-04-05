import { Box, Button, LinearProgress, Modal, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useModalStore } from '../../stores/useModalStore'
import CloseButton from './ModalTitle'
import ModalTitle from './ModalTitle'
import { useTripStore } from '../../stores/useTripStore'
import { Autocomplete } from '@react-google-maps/api'
import { createLogAndUpdateStatus, endTrip } from '../../services/api'
import { useNavigate, useParams } from 'react-router'
import dayjs from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { useThemeToggle } from '../../App'


function EndStatusModal() {

    const { endStatusOpen, setEndStatusOpen } = useModalStore()
    const { status, setStatus, logEntries, setLogEntries, routeDistanceFromStartPoint,
        setRouteDistanceFromStartPoint, locationForRouteDistanceCalculation, setLocationForRouteDistanceCalculation
    } = useTripStore()
    const autocompleteRef = useRef(null)
    const [loading, setLoading] = useState()
    const [modalEntries, setModalEntries] = useState({})
    const { id } = useParams()
    const { darkMode } = useThemeToggle()
    const navigate = useNavigate()

    const handleClose = () => {
        setEndStatusOpen(false)
    }


    const handleChange = (e) => {
        setModalEntries(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleEndTrip = () => {
        setLoading(true)
        const payload = { 
            trip_id: id, 
            end_time: modalEntries?.date 
        }

        endTrip(payload)
            .then((res) => {
                setStatus({ status: res.data.user_status.status, trip: res.data.user_status.trip })
                setLogEntries([])
                setLoading(false)
                setEndStatusOpen(false)
                navigate('/')
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))


    return (
        <Modal
            open={endStatusOpen}
            onClose={handleClose}
            sx={{ display: 'flex', zIndex: 100 }}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '80%' : '25%',
                minHeight: '35%',
                bgcolor: 'rgba(0,0,0,0.8)',
                color: 'white',
                borderRadius: 3,
                p: 3,
                outline: 'none' // Remove default focus outline
            }} >
                <ModalTitle title={'End Trip'} handleClose={handleClose} />
                <Typography>End Time</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                        <DateTimePicker
                            // disablePast
                            value={modalEntries?.date}
                            onChange={(newValue) => setModalEntries(prev => ({ ...prev, date: newValue }))}
                            name='date'
                            sx={{ bgcolor: !darkMode ? 'white' : 'black' }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                {loading ? <Button fullWidth variant="contained" sx={{ mt: 4, textTransform: 'capitalize', bgcolor: 'gray' }} >
                    Loading ...
                </Button>
                    : <Button fullWidth variant="contained" sx={{ mt: 4, textTransform: 'capitalize' }} onClick={handleEndTrip}>
                        End
                    </Button>}
            </Box>

        </Modal>
    )
}

export default EndStatusModal