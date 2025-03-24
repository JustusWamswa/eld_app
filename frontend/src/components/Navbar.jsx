import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import React, { useState } from 'react'
import { useAuth, useThemeToggle } from "../App"
import { useNavigate } from 'react-router'


function Navbar() {

    const { darkMode, setDarkMode } = useThemeToggle()
    const { isAuthenticated, setIsAuthenticated } = useAuth()
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const logoutUser = () => {
        setLoading(true)
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        setLoading(false)
        setIsAuthenticated(false)
        navigate('/login')
    }

    return (
        <Stack justifyContent={'space-between'} direction={'row'} px={3} py={1} bgcolor={'primary.main'}>
            <Typography variant="h6" color='white'>ELD APP</Typography>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                {isAuthenticated && (loading ? <Button fullWidth variant='contained' sx={{ textTransform: 'capitalize'}} loading >Logout</Button>
                    : <Button fullWidth variant='contained' sx={{ textTransform: 'capitalize', bgcolor: 'secondary.main' }} onClick={logoutUser} >Logout</Button>)
                }

                <IconButton
                    onClick={() => setDarkMode(!darkMode)}
                    color="inherit"
                    sx={{ml: 3}}
                >
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon sx={{ color: 'white' }} />}
                </IconButton>
            </Box>
        </Stack>
    )
}

export default Navbar