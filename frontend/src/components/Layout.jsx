import React from 'react'
import { Container, Box } from "@mui/material"
import Navbar from './Navbar'

function Layout({ children }) {

    return (
        <Box>
            <Navbar />
            <Container>
                {children}
            </Container>
        </Box>
    )
}

export default Layout