import { Box, Button, FilledInput, FormControl, IconButton, Input, InputAdornment, InputLabel, Link, OutlinedInput, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { createUser } from '../services/api'
import { useNavigate } from 'react-router'
import { useAuth } from '../App'

function SignUp() {

    const [signUpData, setSignUpData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [signUpRes, setSignUpRes] = useState('')
    const [signUpErr, setSignUpErr] = useState({})
    const { isAuthenticated, setIsAuthenticated } = useAuth()

    const navigate = useNavigate()

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleChange = (e) => {
        setSignUpData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const signup = (credentials) => {
        setLoading(true)
        createUser(credentials)
            .then((res) => {
                const token = res.data.token
                const user = res.data.user.email
                if (token) {
                    localStorage.setItem("access_token", token)
                    localStorage.setItem("user", user)
                }
                setLoading(false)
                setIsAuthenticated(true)
                navigate('/')
            })
            .catch((err) => {
                console.log(err)
                setSignUpErr(err.response.data)
                setLoading(false)
            })
    }


    return (
        <Box border={'1px solid rgba(0,0,0,0.4)'} borderRadius={5} px={3} py={5} width={'35%'} marginLeft={'50%'} sx={{ translate: '-50%' }} mt={5} >
            <Typography variant='h5' align='center' mb={4}>Create Account</Typography>
            <FormControl sx={{ width: '100%' }} variant="outlined" size='small'>
                <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-email"
                    type={showPassword ? 'text' : 'email'}
                    onChange={handleChange}
                    value={signUpData.email}
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
                    value={signUpData.password}
                    name='password'
                    label="Password"
                />
            </FormControl>
            {loading ? <Button fullWidth variant='contained' sx={{ textTransform: 'capitalize', mb: 3 }} loading >Create</Button>
            : <Button fullWidth variant='contained' sx={{ textTransform: 'capitalize', mb: 3 }} onClick={() => signup(signUpData)}>Create</Button>}
            {signUpErr?.error && <Typography variant='caption' color='red'>{signUpErr.error}</Typography>} <br />
            <Link href='/login' variant='caption'>Already have an account? Sign in</Link>
        </Box>
    )
}

export default SignUp