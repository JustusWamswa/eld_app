import { Box, Button, FilledInput, FormControl, IconButton, Input, InputAdornment, InputLabel, Link, OutlinedInput, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { loginUser } from '../services/api'
import { useNavigate } from 'react-router'
import { useAuth } from '../App'

function Login() {

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loginRes, setLoginRes] = useState('')
    const [loginErr, setLoginErr] = useState({})
    const { isAuthenticated, setIsAuthenticated } = useAuth()

    const navigate = useNavigate()

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleChange = (e) => {
        setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const login = (credentials) => {
        setLoading(true)
        loginUser(credentials)
            .then((res) => {
                const token = res.data.token
                const user = res.data.user.email
                const refresh_token = res.data.refresh_token
                if (token) {
                    localStorage.setItem("access_token", token)
                    localStorage.setItem("user", user)
                    localStorage.setItem("refresh_token", refresh_token)
                }
                setLoading(false)
                setIsAuthenticated(true)
                navigate('/')
            })
            .catch((err) => {
                console.log(err)
                setLoginErr(err.response.data)
                setLoading(false)
            })
    }

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Box border={'1px solid rgba(0,0,0,0.4)'} borderRadius={5} px={3} py={5} width={isMobile ? '80%' : '35%'} marginLeft={'50%'} sx={{ translate: '-50%' }} mt={5} >
            <Typography variant='h5' align='center' mb={4}>Login</Typography>
            <FormControl sx={{ width: '100%' }} variant="outlined" size='small'>
                <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-email"
                    type={showPassword ? 'text' : 'email'}
                    onChange={handleChange}
                    value={loginData.email}
                    name='email'
                    label="Email"
                />
            </FormControl>
            <FormControl sx={{ my: 3, width: '100%' }} variant="outlined" size='small'>
                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                <OutlinedInput
                    id="standard-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={
                                    showPassword ? 'hide the password' : 'display the password'
                                }
                                onClick={handleClickShowPassword}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    onChange={handleChange}
                    value={loginData.password}
                    name='password'
                    label="Password"
                />
            </FormControl>
            {loading ? <Button fullWidth variant='contained' sx={{ textTransform: 'capitalize', mb: 3 }} loading >Login</Button>
                : <Button fullWidth variant='contained' sx={{ textTransform: 'capitalize', mb: 3 }} onClick={() => login(loginData)} >Login</Button>}
            {loginErr?.error && <Typography variant='caption' color='red'>{loginErr.error}</Typography>} <br />
            <Link href='/signUp' variant='caption'>Don't have an account? Sign Up</Link>
        </Box>
    )
}

export default Login