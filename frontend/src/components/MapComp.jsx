import React, { useEffect, useState } from 'react'
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps'
import { Box } from '@mui/material'
import Directions from './Directions'
import { useThemeToggle } from '../App'

function MapComp() {

  const [currentLocation, setCurrentLocation] = useState(null)
  const { darkMode } = useThemeToggle()

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
    <Box height={'90vh'} position={'relative'}>
      <APIProvider apiKey={apiKey} libraries={['places']}>
        <Map defaultCenter={currentLocation || position} defaultZoom={5} mapId="DEMO_MAP_ID" fullscreenControl={false} colorScheme={darkMode ? 'DARK' : 'LIGHT'}>
          <AdvancedMarker position={currentLocation || position} />
          <Directions />
        </Map>
      </APIProvider>
    </Box>
  )
}

export default MapComp