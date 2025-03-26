import { Box, Button, Typography, TextField, Modal, Stack, Table, IconButton } from '@mui/material'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import React, { useEffect, useState, useRef } from 'react'
import { Autocomplete, LoadScript } from '@react-google-maps/api'
import { useModalStore } from '../stores/useModalStore'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

function Directions() {

    const apiKey = import.meta.env.VITE_GOOGLE_MAP_API

    const map = useMap()
    const routesLibrary = useMapsLibrary("routes")
    const { newTripOpen, setNewTripOpen } = useModalStore()

    const [directionsService, setDirectionsService] = useState()
    const [directionsRenderer, setDirectionsRenderer] = useState()
    const [routes, setRoutes] = useState([])
    const [routeIndex, setRouteIndex] = useState(0)

    // Autocomplete refs
    const currentLocationRef = useRef()
    const pickupLocationRef = useRef()
    const dropoffLocationRef = useRef()

    const selected = routes[routeIndex]
    const legs = selected?.legs
    console.log('selected: ', selected)

    useEffect(() => {
        if (!routesLibrary || !map) return
        setDirectionsService(new routesLibrary.DirectionsService())
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }))
    }, [map, routesLibrary])

    const calculateRoute = () => {
        if (!directionsService || !directionsRenderer) return

        const currentLocation = currentLocationRef.current?.value
        const pickupLocation = pickupLocationRef.current?.value
        const dropoffLocation = dropoffLocationRef.current?.value

        if (!currentLocation || !pickupLocation || !dropoffLocation) {
            alert("Please enter all locations.")
            return
        }

        directionsService
            .route({
                origin: currentLocation,
                destination: dropoffLocation,
                waypoints: [{ location: pickupLocation, stopover: true }],
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true,
            })
            .then((res) => {
                directionsRenderer.setDirections(res)
                setRoutes(res.routes)
                handleClose()
            })
            .catch((error) => console.error("Error fetching directions:", error))

    }

    useEffect(() => {
        if (!directionsRenderer) return
        directionsRenderer.setRouteIndex(routeIndex)
    }, [routeIndex, directionsRenderer])

    const handleClose = () => setNewTripOpen(false)

    return (
        <Box bgcolor={'rgba(0,0,0,0.8)'} p={3} position={'absolute'} top={6} right={6} color={'white'} borderRadius={3} width={350} zIndex={0}>
            <Stack display={newTripOpen ? 'block' : 'none'}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant='h6' mb={2}>Enter Locations</Typography>
                    <IconButton color='white' size='large' sx={{ mb: 2, color: 'white' }} onClick={handleClose}>
                        <HighlightOffIcon color='white' sx={{ color: 'white' }} />
                    </IconButton>
                </Box>
                <Autocomplete>
                    <TextField
                        inputRef={currentLocationRef}
                        label="Current Location"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
                    />
                </Autocomplete>
                <Autocomplete>
                    <TextField
                        inputRef={pickupLocationRef}
                        label="Pickup Location"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
                    />
                </Autocomplete>
                <Autocomplete>
                    <TextField
                        inputRef={dropoffLocationRef}
                        label="Dropoff Location"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
                    />
                </Autocomplete>
                <Button fullWidth variant="contained" color="primary" onClick={calculateRoute} sx={{ mt: 2 }}>
                    Get Directions
                </Button>
            </Stack>
            <Stack display={newTripOpen ? 'none' : 'block'}>
                {legs && 
                <>
                <Typography variant='h6'>{selected?.summary}</Typography>
                <Typography>{legs[0].start_address.split(',')[0]} to {legs[1].end_address.split(',')[0]} via {legs[1].start_address.split(',')[0]} </Typography>
                <Typography>Distance: {((legs[0].distance?.value + legs[1].distance?.value) / 1000).toFixed(1)} km</Typography>
                <Typography>Duration: {Math.floor((legs[0].duration?.value + legs[1].duration?.value) / 60)} min</Typography>

                {/* <Typography variant='h6' mt={3}>Other routes</Typography>
                    {routes.map((route, index) => (
                        <Button
                            key={route.summary}
                            color='white'
                            fullWidth
                            sx={{ textTransform: 'capitalize', bgcolor: 'rgba(255,255,255,0.1)', mt: 1 }}
                            onClick={() => setRouteIndex(index)}
                        >
                            {route.summary}
                        </Button>
                    ))} */}
                </>
                    }
            </Stack>

        </Box>
    )
}

export default Directions
