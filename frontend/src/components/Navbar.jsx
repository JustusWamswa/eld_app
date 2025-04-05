import { Avatar, Box, Button, IconButton, Stack, Switch, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import React, { useState } from 'react'
import { useAuth, useThemeToggle } from "../App"
import { useLocation, useNavigate } from 'react-router'
import { useTripStore } from '../stores/useTripStore'
import { useModalStore } from '../stores/useModalStore'
import { changeUserTheme } from '../services/api'


function Navbar() {

    const { darkMode, setDarkMode } = useThemeToggle()
    const { isAuthenticated, setIsAuthenticated } = useAuth()
    const [loading, setLoading] = useState(false)
    const { status, setStatus, setLogEntries, cycleHoursUsed } = useTripStore()
    const { setStatusOpen, setFsLoader, setEndStatusOpen } = useModalStore()


    const navigate = useNavigate()
    const { pathname } = useLocation()

    const logoutUser = () => {
        setLoading(true)
        localStorage.clear()
        setLoading(false)
        setIsAuthenticated(false)
        navigate('/login')
    }

    const handleStatusOpen = () => setStatusOpen(true)

    const handleDarkMode = () => {
        setDarkMode(!darkMode)
        changeUserTheme({ dark_mode: !darkMode })
            .then((res) => {
                localStorage.setItem("dark_mode", res.data.dark_mode)
            })
            .catch((err) => {
                console.log(err)
            })
    }


    const user = localStorage.getItem("user")

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))


    return (
        <Stack justifyContent={'space-between'} direction={'row'} px={3} py={1} bgcolor={'primary.main'}>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                {!isMobile && <Typography variant="h6" color='white'>ELD APP</Typography>}
                {isAuthenticated &&
                    <>
                        <Button color='white' sx={{ color: 'white', textTransform: 'capitalize', borderBottom: '1px solid white', borderRadius: 0, fontSize: '1rem', ml: isMobile ? 0 : 5 }} onClick={() => navigate('/')}>Home</Button>
                        <Button color='white' sx={{ color: 'white', textTransform: 'capitalize', borderBottom: '1px solid white', borderRadius: 0, fontSize: '1rem', ml: 2 }} onClick={() => navigate('/trips')}>Trips</Button>
                    </>}
            </Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                {isAuthenticated &&
                    <Box display={'flex'} alignItems={'center'}>
                        <Typography variant='caption' color='white' display={!isMobile ? 'block' : 'none'} mr={3}>Cycle Hours Used: {cycleHoursUsed}</Typography>
                        {pathname.includes('/trip/') &&
                            <>
                                {status?.status && <Box border={'1px solid rgba(255,255,255,0.3)'} borderRadius={3} mr={2} px={2} py={0.5} minWidth={120} display={'flex'} alignItems={'center'} position={isMobile ? 'absolute' : 'relative'} left={isMobile && 3} top={isMobile && 70} zIndex={1000} bgcolor={isMobile ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)'}>
                                    <Typography variant='caption' color='white' width={'100%'} display={status?.status ? 'block' : 'none'} mr={1}>Status: {status?.status}</Typography>
                                    <Button variant='contained' sx={{ px: 3, textTransform: 'capitalize', bgcolor: 'coral', borderRadius: 2, width: isMobile ? 150 : 130 }} onClick={() => setEndStatusOpen(true)} size='small'>End Trip</Button>
                                </Box>}
                            </>}
                        {loading ? <Button variant='contained' sx={{ px: 3, textTransform: 'capitalize', borderRadius: 3 }} loading >Logout</Button>
                            : <Button variant='contained' sx={{ px: 3, textTransform: 'capitalize', bgcolor: 'secondary.main', borderRadius: 3 }} onClick={logoutUser} >Logout</Button>}
                        {!isMobile && <Tooltip title={user}>
                            <Avatar sx={{ ml: 2, bgcolor: 'secondary.main', color: 'white' }}>{user[0].toUpperCase()}</Avatar>
                        </Tooltip>}
                        <IconButton
                            onClick={handleDarkMode}
                            color="inherit"
                            sx={{ ml: 3 }}
                        >
                            {darkMode ? <LightModeIcon /> : <DarkModeIcon sx={{ color: 'white' }} />}
                        </IconButton>
                    </Box>
                }

            </Box>
        </Stack>
    )
}

export default Navbar