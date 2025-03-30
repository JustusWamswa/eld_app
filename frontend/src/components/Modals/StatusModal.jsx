import { Box, Button, LinearProgress, Modal, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useModalStore } from '../../stores/useModalStore'
import CloseButton from './ModalTitle'
import ModalTitle from './ModalTitle'
import { useStateStore } from '../../stores/useStateStore'
import { Autocomplete } from '@react-google-maps/api'
import { changeUserStatus } from '../../services/api'


function StatusModal({ tempStatus }) {

    const { statusOpen, setStatusOpen } = useModalStore()
    const { status, setStatus } = useStateStore()
    const autocompleteRef = useRef(null)
    const [loading, setLoading] = useState()

    const handleClose = () => {
        setStatusOpen(false)
    }

    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete
    }

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace()
            console.log(place)
            console.log(place.formatted_address)
            console.log(place.geometry.location.lat())
            console.log(place.geometry.location.lng())
            // Handle the selected place
        }
    }

    const handleStartCurrentStatus = () => {
        setLoading(true)
        changeUserStatus({status: tempStatus})
        .then((res) => {
            setStatus(res.data.status)
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
        changeUserStatus({ status: '' })
            .then((res) => {
                setStatus(res.data.status)
                setLoading(false)
                handleClose()
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }



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
                <ModalTitle title={tempStatus} handleClose={handleClose} />
                <Typography>Location</Typography>
                <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}
                >
                    <TextField
                        // inputRef={currentLocationRef}
                        placeholder="Enter Location"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
                    />
                </Autocomplete>
                <Typography>Start Time</Typography>
                <TextField type='datetime-local' fullWidth sx={{ bgcolor: 'white' }} />
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