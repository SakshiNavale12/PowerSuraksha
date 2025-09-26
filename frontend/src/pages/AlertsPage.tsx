import React from 'react'
import { Box, Container, Typography, Paper } from '@mui/material'
import Sidebar from '../components/layout/Sidebar'
import AppBar from '../components/layout/AppBar'
import Alerts from '../components/dashboard/Alerts'

const AlertsPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <AppBar />
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 2 }}>Alerts</Typography>
          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <Alerts />
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}

export default AlertsPage


