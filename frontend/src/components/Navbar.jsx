import { Box, Button, IconButton, Stack, Switch, Typography } from '@mui/material'
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import React, { useState } from 'react'
import { useAuth, useThemeToggle } from "../App"
import { useLocation, useNavigate } from 'react-router'
import { useStateStore } from '../stores/useStateStore'
import { useModalStore } from '../stores/useModalStore'


function Navbar() {

    const { darkMode, setDarkMode } = useThemeToggle()
    const { isAuthenticated, setIsAuthenticated } = useAuth()
    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState(false)
    const { status, setStatus, onDuty, setOnDuty } = useStateStore()
    const { setStatusOpen } = useModalStore()

    const handleChange = (event) => {
        setChecked(event.target.checked)
        setOnDuty(!onDuty)
    }

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


    return (
        <Stack justifyContent={'space-between'} direction={'row'} px={3} py={1} bgcolor={'primary.main'}>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <Typography variant="h6" color='white'>ELD APP</Typography>
                <Button color='white' sx={{ color: 'white', textTransform: 'capitalize', borderBottom: '1px solid white', borderRadius: 0, fontSize: '1rem', ml: 5 }} onClick={() => navigate('/')}>Home</Button>
                <Button color='white' sx={{ color: 'white', textTransform: 'capitalize', borderBottom: '1px solid white', borderRadius: 0, fontSize: '1rem', ml: 2 }} onClick={() => navigate('/trips')}>Trips</Button>

            </Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                {isAuthenticated &&
                    <Box display={'flex'} alignItems={'center'}>
                        {pathname.includes('/trip/') &&
                            <>
                                {status && <Box border={'1px solid rgba(255,255,255,0.3)'} borderRadius={3} mr={2} px={2} py={0.5} minWidth={120} display={'flex'} alignItems={'center'}>
                                    <Typography variant='caption' color='white' width={'100%'} display={status ? 'block' : 'none'} mr={1}>Status: {status}</Typography>
                                    <Button variant='contained' sx={{ px: 3, textTransform: 'capitalize', bgcolor: 'coral', borderRadius: 3 }} onClick={handleStatusOpen} size='small'>End</Button>
                                </Box>}
                                <Box border={'1px solid rgba(255,255,255,0.3)'} borderRadius={3} mr={2} px={2} py={0.5} minWidth={120} display={'flex'} alignItems={'center'}>
                                    {checked ? <Typography variant='caption' color='white' width={'100%'}>On Duty</Typography>
                                        : <Typography variant='caption' color='white' width={'100%'}>Off Duty</Typography>}
                                    <Switch
                                        color='warning'
                                        size='small'
                                        checked={checked}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </>}
                        {loading ? <Button variant='contained' sx={{ px: 3, textTransform: 'capitalize', borderRadius: 3 }} loading >Logout</Button>
                            : <Button variant='contained' sx={{ px: 3, textTransform: 'capitalize', bgcolor: 'secondary.main', borderRadius: 3 }} onClick={logoutUser} >Logout</Button>}
                    </Box>
                }

                <IconButton
                    onClick={() => setDarkMode(!darkMode)}
                    color="inherit"
                    sx={{ ml: 3 }}
                >
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon sx={{ color: 'white' }} />}
                </IconButton>
            </Box>
        </Stack>
    )
}

export default Navbar