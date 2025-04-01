import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, LinearProgress, Grid2, AccordionActions } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getTrip, getUserTrips } from '../services/api'
import { useModalStore } from '../stores/useModalStore'
import { dateFormatter } from '../utils/utils'
import MapComp from '../components/MapComp'
import { useTripStore } from '../stores/useTripStore'

function Trips() {
    const { setFsLoader } = useModalStore()
    const { setTripData } = useTripStore()
    const [loading, setLoading] = useState(false)
    const [myTrips, setMyTrips] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [sortOrder, setSortOrder] = useState('desc')
    const [sortBy, setSortBy] = useState('date') // 'date' or 'location'
    const [expanded, setExpanded] = useState(false)
    const [selectedTripId, setSelectedTripId] = useState(null)

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    useEffect(() => {
        setFsLoader(true)
        getUserTrips()
            .then((res) => {
                setMyTrips(res.data)
                setFsLoader(false)
            })
            .catch((err) => {
                console.log(err)
                setFsLoader(false)
            })
    }, [])

    // Filter Trips based on search query (date or location)
    const filteredTrips = myTrips?.filter((trip) => {
        const formattedDate = dateFormatter(trip.created_at).toLowerCase()
        const locations = [
            trip.current_location_name,
            trip.pickup_location_name,
            trip.dropoff_location_name
        ].join(' ').toLowerCase()

        return formattedDate.includes(searchQuery.toLowerCase()) || locations.includes(searchQuery.toLowerCase())
    })

    // Sort Trips based on date or location
    const sortedTrips = [...filteredTrips].sort((a, b) => {
        if (sortBy === 'date') {
            return sortOrder === 'asc'
                ? new Date(a.created_at) - new Date(b.created_at)
                : new Date(b.created_at) - new Date(a.created_at)
        } else {
            return sortOrder === 'asc'
                ? a.pickup_location_name.localeCompare(b.pickup_location_name)
                : b.pickup_location_name.localeCompare(a.pickup_location_name)
        }
    })

    // Fetch trip by id
    const handleFetchTrip = (id) => {
        setLoading(true)
        getTrip(id)
            .then((res) => {
                setTripData(res.data)
                setSelectedTripId(id)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    return (
        <Box width={'90%'} mx={'auto'} mt={3} spacing={2}>
            <Stack direction={'row'} spacing={2} mb={2}>
                {/* Search Input */}
                <TextField
                    label="Search by Date or Location"
                    variant="outlined"
                    sx={{ width: '50%' }}
                    size='small'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Sorting Controls */}
                <Stack direction="row" spacing={2} width={'50%'}>
                    <FormControl fullWidth>
                        <Select size='small' value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <MenuItem value="date">Sort By Date</MenuItem>
                            <MenuItem value="location">Sort By Location</MenuItem>
                        </Select>
                    </FormControl>

                    <Button sx={{ width: 150 }} variant="contained" size='small' onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        Sort ({sortOrder === 'asc' ? 'Desc' : 'Asc'})
                    </Button>
                </Stack>
            </Stack>

            {/* Display Filtered and Sorted Trips */}
            {sortedTrips.map((trip) => (
                <Accordion key={trip.id} expanded={expanded === trip.id} onChange={handleChange(trip.id)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => handleFetchTrip(trip.id)}>
                        <Typography component="span">
                            {dateFormatter(trip.created_at)} {`(`}
                            {trip.current_location_name.split(',')[0]} →
                            {trip.pickup_location_name.split(',')[0]} →
                            {trip.dropoff_location_name.split(',')[0]}
                            {`)`}
                        </Typography>
                    </AccordionSummary>
                    {loading && <LinearProgress />}
                    <AccordionDetails>
                        <Typography>Created At: {dateFormatter(trip.created_at)}</Typography>
                        <Typography>Pickup: {trip.pickup_location_name}</Typography>
                        <Typography>Dropoff: {trip.dropoff_location_name}</Typography>
                        <Grid2 container spacing={2} height={'50vh'}>
                            <Grid2 size={6}>
                                {selectedTripId == trip.id && <MapComp />}
                            </Grid2>
                        </Grid2>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button>Cancel</Button>
                        <Button>Agree</Button>
                    </AccordionActions>
                </Accordion>
            ))}
        </Box>
    )
}

export default Trips
