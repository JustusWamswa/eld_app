import { Box, Button, LinearProgress, Modal, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useModalStore } from '../../stores/useModalStore'
import CloseButton from './ModalTitle'
import ModalTitle from './ModalTitle'
import { useTripStore } from '../../stores/useTripStore'
import { Autocomplete } from '@react-google-maps/api'
import { createLogAndUpdateStatus } from '../../services/api'
import { useParams } from 'react-router'
import dayjs from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { useThemeToggle } from '../../App'


function StatusModal({ tempStatus }) {

    const { statusOpen, setStatusOpen } = useModalStore()
    const { status, setStatus, logEntries, setLogEntries, routeDistanceFromStartPoint,
        setRouteDistanceFromStartPoint, locationForRouteDistanceCalculation, setLocationForRouteDistanceCalculation
    } = useTripStore()
    const autocompleteRef = useRef(null)
    const [loading, setLoading] = useState()
    const [modalEntries, setModalEntries] = useState({})
    const locationRef = useRef()
    const { id } = useParams()
    const { darkMode } = useThemeToggle()

    const handleClose = () => {
        setStatusOpen(false)
    }

    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete
    }

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace()
            setLocationForRouteDistanceCalculation(place.formatted_address)
        }
    }

    const handleSave = () => {
        if (!locationRef?.current?.value || !modalEntries?.date || routeDistanceFromStartPoint == null) {
            alert("Location and time are required")
            return
        }
        const place = autocompleteRef.current.getPlace()

        const payload = {
            "trip": id,
            "status": tempStatus.status,
            "location_name": place.formatted_address,
            "location_lat": place.geometry.location.lat(),
            "location_lng": place.geometry.location.lng(),
            "start_time": new Date(modalEntries?.date),
            "end_time": new Date(modalEntries?.date),
            "activity": tempStatus.option,
            "route_distance_from_start_point": routeDistanceFromStartPoint,
            "remarks": modalEntries?.remarks || ""
        }

        setLoading(true);
        createLogAndUpdateStatus(payload)
            .then((res) => {
                setLogEntries([...logEntries, res.data.log]);
                setStatus(res.data.user_status);
                setLoading(false);
                setRouteDistanceFromStartPoint(null)
                setLocationForRouteDistanceCalculation('')
                handleClose();
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });

    }

    const handleChange = (e) => {
        setModalEntries(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Modal
            open={statusOpen}
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
                <ModalTitle title={tempStatus.option} handleClose={handleClose} />
                <Typography>Location</Typography>
                <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}
                >
                    <TextField
                        inputRef={locationRef}
                        placeholder="Enter Location"
                        fullWidth
                        variant="outlined"
                        color='black'
                        sx={{ mb: 2, bgcolor: !darkMode ? 'white' : 'black', borderRadius: 1 }}
                    />
                </Autocomplete>
                <Typography>Start Time</Typography>
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
                <Typography sx={{ mt: 2 }}>Remarks</Typography>
                <TextField type='text' fullWidth sx={{ bgcolor: !darkMode ? 'white' : 'black' }} placeholder='Enter Remarks' value={modalEntries?.remarks} onChange={handleChange} name='remarks' />
                {loading ? <Button fullWidth variant="contained" sx={{ mt: 4, textTransform: 'capitalize', bgcolor: 'gray' }} >
                    Loading ...
                </Button>
                    : <Button fullWidth variant="contained" sx={{ mt: 4, textTransform: 'capitalize' }} onClick={handleSave}>
                        Start
                    </Button>}
            </Box>

        </Modal>
    )
}

export default StatusModal