import React, { useEffect, useState } from 'react'
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps'
import { Box, Tooltip } from '@mui/material'
import Directions from './Directions'
import { useThemeToggle } from '../App'
import { useTripStore } from '../stores/useTripStore'
import { statusOptions } from '../constants'
import { useParams } from 'react-router'

function MapComp({ selectedTripId }) {

  const [currentLocation, setCurrentLocation] = useState(null)
  const { darkMode } = useThemeToggle()
  const { logEntries } = useTripStore()
  const { id } = useParams()

  const apiKey = import.meta.env.VITE_GOOGLE_MAP_API
  const position = { lat: 39.76118, lng: -75.62303 }

  // Get the user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        console.error("Error getting location", error)
      }
    )
  }, [])

  return (
    <Box height={'100%'} position={'relative'}>
      <APIProvider apiKey={apiKey} libraries={['places']} >
        <Map defaultCenter={currentLocation || position} defaultZoom={5} mapId="DEMO_MAP_ID" mapTypeControl={false} fullscreenControl={true} colorScheme={darkMode ? 'DARK' : 'LIGHT'} >
          {/* <AdvancedMarker position={currentLocation || position} /> */}
          {logEntries.map((log) => {
            const icon = statusOptions.find((option) => option.option === log.activity)?.icon || "📍";
            const checkId = selectedTripId || id == log.trip
            return (
              <AdvancedMarker key={log.id} position={{ lat: Number(log.location_lat), lng: Number(log.location_lng) }}>
                <Tooltip title={`${log.location_name} [${log.activity}]`}>
                  <span style={{ fontSize: "1.8rem", backgroundColor: 'white', borderRadius: '50%', padding: 5 }}>{icon}</span>
                </Tooltip>
              </AdvancedMarker>
            );
          })}
          <Directions />
        </Map>
      </APIProvider>
    </Box>
  )
}

export default MapComp