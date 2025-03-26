import React from 'react'
import { Container, Box } from "@mui/material"
import Navbar from './Navbar'

function Layout({ children }) {

    return (
        <>
            <Navbar />
            <Box>
                {children}
            </Box>
        </>
    )
}

export default Layout