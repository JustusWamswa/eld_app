import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, LinearProgress, Grid2, AccordionActions, Skeleton, CircularProgress, useTheme, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { generateComplianceLog, getTrip, getUserTrips } from '../services/api'
import { useModalStore } from '../stores/useModalStore'
import { dateFormatter } from '../utils/utils'
import MapComp from '../components/MapComp'
import { useTripStore } from '../stores/useTripStore'
import Chart from '../components/Chart'
import { useThemeToggle } from '../App'

function Trips() {
    const { setFsLoader } = useModalStore()
    const { setTripData, setLogEntries } = useTripStore()
    const [loading, setLoading] = useState(false)
    const [myTrips, setMyTrips] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [sortOrder, setSortOrder] = useState('desc')
    const [sortBy, setSortBy] = useState('date') // 'date' or 'location'
    const [expanded, setExpanded] = useState(false)
    const [selectedTripId, setSelectedTripId] = useState(null)
    const [logGenerated, setLogGenerated] = useState(false)
    const [eldDataByDay, setEldDataByDay] = useState([])
    const [violations, setViolations] = useState([])
    const { darkMode } = useThemeToggle()

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

    console.log(myTrips)

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
        setLogGenerated(false)
        getTrip(id)
            .then((res) => {
                setTripData(res.data.trip)
                setLogEntries(res.data.logs)
                setSelectedTripId(id)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const handleGenerateLog = (id) => {
        setLogGenerated(true)
        setLoading(true)
        generateComplianceLog(id)
            .then((res) => {
                console.log(res)
                setEldDataByDay(res.data.eld_data_by_day)
                setViolations(res.data.violations)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))


    return (
        <Box width={'90%'} mx={'auto'} mt={3} spacing={2}>
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2} mb={2}>
                {/* Search Input */}
                <TextField
                    label="Search by Date or Location"
                    variant="outlined"
                    sx={{ width: isMobile ? '100%' : '50%' }}
                    size='small'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Sorting Controls */}
                <Stack direction="row" spacing={2} width={isMobile ? '100%' : '50%'}>
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
            {sortedTrips.length > 0 ? (sortedTrips.map((trip) => (
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
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <Box mb={1}>
                                <Typography>Pickup: {trip.pickup_location_name}</Typography>
                                <Typography>Dropoff: {trip.dropoff_location_name}</Typography>
                                <Typography>Distance: {((trip.distance_from_current_pickup + trip.distance_from_pickup_dropoff) / 1609.34).toFixed(2)} miles</Typography>
                                <Typography>Estimated driving duration: {((trip.duration_from_current_pickup + trip.duration_from_pickup_dropoff) / 3600).toFixed(2)} hrs</Typography>
                            </Box>
                            <Box>
                                <Button color='white' onClick={() => handleGenerateLog(trip.id)}>Generate logs</Button>
                            </Box>
                        </Stack>
                        <Grid2 container spacing={2} height={logGenerated && isMobile ? '65vh' : isMobile ? '30vh' : '50vh'}>
                            <Grid2 size={logGenerated && isMobile ? 12 : logGenerated ? 6 : 12} borderRadius={3} overflow={'hidden'} height={isMobile ? '30vh' : '50vh'}>
                                {selectedTripId == trip.id && <MapComp selectedTripId={selectedTripId} />}
                            </Grid2>
                            <Grid2 size={isMobile ? 12 : 6} height={isMobile ? '30vh' : '50vh'} display={logGenerated ? 'block' : 'none'} bgcolor={'rgba(0,0,0,0.05)'} borderRadius={3} sx={{ overflowY: 'scroll' }}>
                                {!loading &&
                                    (selectedTripId == trip.id &&
                                        eldDataByDay.length > 0 &&
                                        <>
                                            {eldDataByDay.map((eldData, index) => (
                                                <Chart key={index} eldData={eldData} />
                                            ))}
                                            <Box my={2} px={5}>
                                                <Typography variant="h6">Violations</Typography>
                                                {violations.length > 0 ? (
                                                    violations.map((violation, index) => (
                                                        <Typography key={index} variant="body1">
                                                            {violation}
                                                        </Typography>
                                                    ))
                                                ) : (
                                                    <Typography variant="body1">None</Typography>
                                                )}
                                            </Box>

                                        </>
                                    )}
                            </Grid2>
                        </Grid2>
                    </AccordionDetails>
                </Accordion>

            ))) : <Box height={'50vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}> No trips yet</Box>
            }
        </Box >
    )
}

export default Trips
