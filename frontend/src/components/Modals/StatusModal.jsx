import { Box, Button, LinearProgress, Modal, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useModalStore } from '../../stores/useModalStore'
import CloseButton from './ModalTitle'
import ModalTitle from './ModalTitle'
import { useTripStore } from '../../stores/useTripStore'
import { Autocomplete } from '@react-google-maps/api'
import { changeUserStatus, createLog } from '../../services/api'
import { useParams } from 'react-router'
import dayjs from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'


function StatusModal({ tempStatus }) {

    const { statusOpen, setStatusOpen } = useModalStore()
    const { status, setStatus, logEntries, setLogEntries } = useTripStore()
    const autocompleteRef = useRef(null)
    const [loading, setLoading] = useState()
    const [modalEntries, setModalEntries] = useState({})
    const locationRef = useRef()
    const { id } = useParams()

    const handleClose = () => {
        setStatusOpen(false)
    }

    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete
    }

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace()
            // Handle the selected place
        }
    }

    const handleSave = () => {
        if (!locationRef?.current?.value || !modalEntries?.date) {
            alert("Location and time are required")
            return false
        }
        const place = autocompleteRef.current.getPlace()
        console.log(modalEntries?.date)

        const payload = {
            "trip": id,
            "status": tempStatus.status,
            "location_name": place.formatted_address,
            "location_lat": place.geometry.location.lat(),
            "location_lng": place.geometry.location.lng(),
            "start_time": new Date(modalEntries?.date),
            "end_time": new Date(),
            "activity": tempStatus.option,
            "remarks": modalEntries?.remarks || ""
        }

        createLog(payload)
            .then((res) => {
                console.log(res)
                setLogEntries([...logEntries, res.data.log])
            })
            .catch((err) => {
                console.log(err)
                return false
            })

        return true

    }

    const handleStartCurrentStatus = () => {
        setLoading(true)
        if (!handleSave()) {
            setLoading(false)
            return
        }
        changeUserStatus({ status: tempStatus.option, trip: id })
            .then((res) => {
                setStatus(res.data)
                setLoading(false)
                handleClose()
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const handleEndCurrentStatus = () => {
        setLoading(true)
        changeUserStatus({ status: '', trip: null })
            .then((res) => {
                setStatus(res.data)
                setLoading(false)
                handleClose()
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const handleChange = (e) => {
        setModalEntries(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    console.log(modalEntries)



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
                width: '25%',
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
                        sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
                    />
                </Autocomplete>
                <Typography>Start Time</Typography>
                {/* <TextField type='datetime-local' fullWidth sx={{ bgcolor: 'white' }} value={modalEntries?.date} onChange={handleChange} name='date' /> */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                        <DateTimePicker
                            disablePast

                            value={modalEntries?.date}
                            onChange={(newValue) => setModalEntries(prev => ({ ...prev, date: newValue }))}
                            name='date'
                            sx={{ bgcolor: 'white' }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <Typography sx={{ mt: 2 }}>Remarks</Typography>
                <TextField type='text' fullWidth sx={{ bgcolor: 'white' }} placeholder='Enter Remarks' value={modalEntries?.remarks} onChange={handleChange} name='remarks' />
                {/* <Typography mt={2}>End Time</Typography>
                <TextField type='datetime-local' fullWidth sx={{ bgcolor: 'white' }} /> */}
                {loading ? <Button fullWidth variant="contained" sx={{ mt: 4, textTransform: 'capitalize', bgcolor: 'red' }} loading >
                    Start
                </Button>
                    : <Button fullWidth variant="contained" sx={{ mt: 4, textTransform: 'capitalize' }} onClick={handleStartCurrentStatus}>
                        Start
                    </Button>}
            </Box>

        </Modal>
    )
}

export default StatusModal