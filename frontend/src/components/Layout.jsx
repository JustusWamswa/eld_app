import React from 'react'
import { Container, Box } from "@mui/material"
import Navbar from './Navbar'
import FullScreenLoader from './FullScreenLoader'
import { useModalStore } from '../stores/useModalStore'

function Layout({ children }) {

    const { fsLoader } = useModalStore()

    return (
        <Box position={'relative'}>
            {fsLoader && <FullScreenLoader />}
            <Navbar />
            {children}
        </Box>
    )
}

export default Layout