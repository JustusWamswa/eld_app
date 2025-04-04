import { Box, Button, Typography, TextField, Modal, Stack, Table, IconButton } from '@mui/material'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import React, { useEffect, useState, useRef } from 'react'
import { Autocomplete } from '@react-google-maps/api'
import { useModalStore } from '../stores/useModalStore'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CloseButton from './Modals/ModalTitle'
import ModalTitle from './Modals/ModalTitle'
import { createTrip } from '../services/api'
import { useNavigate } from 'react-router'
import { useTripStore } from '../stores/useTripStore'
import { useThemeToggle } from '../App'

function Directions() {

    const map = useMap()
    const routesLibrary = useMapsLibrary("routes")
    const { newTripOpen, setNewTripOpen, setFsLoader } = useModalStore()
    const { tripData, setTripData, locationForRouteDistanceCalculation, setRouteDistanceFromStartPoint  } = useTripStore()

    const [showSave, setShowSave] = useState()
    const [directionsService, setDirectionsService] = useState()
    const [directionsRenderer, setDirectionsRenderer] = useState()
    const [routes, setRoutes] = useState([])
    const [routeIndex, setRouteIndex] = useState(0)
    const { darkMode } = useThemeToggle()

    // Autocomplete refs
    const currentLocationRef = useRef()
    const pickupLocationRef = useRef()
    const dropoffLocationRef = useRef()

    const selected = routes[routeIndex]
    const legs = selected?.legs
    // console.log('selected: ', selected)

    useEffect(() => {
        if (!routesLibrary || !map) return
        setDirectionsService(new routesLibrary.DirectionsService())
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }))
    }, [map, routesLibrary])

    const handleClose = () => setNewTripOpen(false)
    const handleOpen = () => setNewTripOpen(true)

    const navigate = useNavigate()

    const calculateRoute = () => {
        if (!directionsService || !directionsRenderer) return
        const currentLocation = currentLocationRef.current?.value || tripData?.current_location_name
        const pickupLocation = pickupLocationRef.current?.value || tripData?.pickup_location_name
        const dropoffLocation = dropoffLocationRef.current?.value || tripData?.dropoff_location_name


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
                setShowSave(true)
                // handleClose()
            })
            .catch((error) => console.error("Error fetching directions:", error))

    }

    useEffect(() => {
        if (!directionsRenderer) return
        directionsRenderer.setRouteIndex(routeIndex)
    }, [routeIndex, directionsRenderer])

    useEffect(() => {
        if(window.location.pathname.includes('/trip') && Object.keys(tripData).length > 0) {
            calculateRoute()
        }
    }, [directionsRenderer, directionsService, tripData])

    const handleSave = () => {
        setFsLoader(true)
        const payload = {
            'current_location_name': legs[0].start_address,
            'current_location_lat': legs[0].start_location.lat(),
            'current_location_lng': legs[0].start_location.lng(),
            'pickup_location_name': legs[1].start_address,
            'pickup_location_lat': legs[1].start_location.lat(),
            'pickup_location_lng': legs[1].start_location.lng(),
            'dropoff_location_name': legs[1].end_address,
            'dropoff_location_lat': legs[1].end_location.lat(),
            'dropoff_location_lng': legs[1].end_location.lng(),
            'distance_from_current_pickup': legs[0].distance?.value,
            'distance_from_pickup_dropoff': legs[1].distance?.value,
            'duration_from_current_pickup': legs[0].duration?.value,
            'duration_from_pickup_dropoff': legs[1].duration?.value
        }
        createTrip(payload)
            .then((res) => {
                setTripData(res.data)
                setFsLoader(false)
                setShowSave(false)
                handleClose()
                navigate(`/trip/${res.data.id}`)
            })
            .catch((err) => {
                console.log(err)
                setFsLoader(false)
            })
    }

    const getRouteDistance = (origin, destination) => {
        if (!directionsService || !directionsRenderer) return
    
        if (!origin || !destination) {
            alert("Please enter both origin and destination.")
            return
        }
    
        directionsService
            .route({
                origin,
                destination,
                travelMode: google.maps.TravelMode.DRIVING,
            })
            .then((res) => {
                // Extract the distance from the response
                const distance = res.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0) // in meters
                setRouteDistanceFromStartPoint(distance)
            })
            .catch((error) => {
                console.error("Error fetching directions:", error)
            })
    }
    
    useEffect(() => {
        if (locationForRouteDistanceCalculation) {
            getRouteDistance(tripData?.current_location_name, locationForRouteDistanceCalculation)
        }

    }, [locationForRouteDistanceCalculation])


    return (
        <>
            {window.location.pathname == '/' && <Button
                variant='contained'
                sx={{ textTransform: 'capitalize', px: 3, py: 2, borderRadius: 3, fontSize: '1rem', bgcolor: 'secondary.main', position: 'absolute', top: 6, right: 6, zIndex: 50, width: 250, display: !newTripOpen ? 'block' : 'none' }}
                onClick={handleOpen}
            >
                Set Route
            </Button>}

            <Box display={newTripOpen ? 'block' : 'none'} bgcolor={'rgba(0,0,0,0.8)'} p={3} position={'absolute'} top={6} right={6} color={'white'} borderRadius={3} width={350} zIndex={50}>
                <Stack >
                    <ModalTitle title={'Enter Locations'} handleClose={handleClose} />
                    <Autocomplete>
                        <TextField
                            inputRef={currentLocationRef}
                            placeholder="Current Location"
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2, bgcolor: !darkMode ? 'white' : 'black', borderRadius: 1 }}
                        />
                    </Autocomplete>
                    <Autocomplete>
                        <TextField
                            inputRef={pickupLocationRef}
                            placeholder="Pickup Location"
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2, bgcolor: !darkMode ? 'white' : 'black', borderRadius: 1 }}
                        />
                    </Autocomplete>
                    <Autocomplete>
                        <TextField
                            inputRef={dropoffLocationRef}
                            placeholder="Dropoff Location"
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2, bgcolor: !darkMode ? 'white' : 'black', borderRadius: 1 }}
                        />
                    </Autocomplete>
                    {!showSave ? <Button fullWidth variant="contained" onClick={calculateRoute} sx={{ mt: 2, textTransform: 'capitalize' }}>
                        Get Directions
                    </Button>
                        : <Stack direction={'row'} spacing={2}>
                            <Button fullWidth variant="outlined" onClick={() => setShowSave(false)} sx={{ mt: 2, textTransform: 'capitalize', borderColor: 'rgba(255, 255, 255, 0.3)', color: 'white' }}>
                                Cancel
                            </Button>
                            <Button fullWidth variant="contained" onClick={handleSave} sx={{ mt: 2, textTransform: 'capitalize' }}>
                                Save
                            </Button>
                        </Stack>}
                </Stack>
                {/* <Stack display={newTripOpen ? 'none' : 'block'}>
                    {legs &&
                        <>
                            <Typography variant='h6'>{selected?.summary}</Typography>
                            <Typography>{legs[0].start_address.split(',')[0]} to {legs[1].end_address.split(',')[0]} via {legs[1].start_address.split(',')[0]} </Typography>
                            <Typography>Distance: {((legs[0].distance?.value + legs[1].distance?.value) / 1000).toFixed(1)} km</Typography>
                            <Typography>Duration: {Math.floor((legs[0].duration?.value + legs[1].duration?.value) / 60)} min</Typography>
                        </>
                    }
                </Stack> */}

            </Box>
        </>

    )
}

export default Directions
