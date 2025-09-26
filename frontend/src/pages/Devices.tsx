import React from 'react'
import { Box, Container, Typography, Paper, Chip } from '@mui/material'
import PageHeader from '../components/ui/PageHeader'
import SearchBar from '../components/ui/SearchBar'
import Sidebar from '../components/layout/Sidebar'
import AppBar from '../components/layout/AppBar'

const Devices: React.FC = () => {
  const devices = Array.from({ length: 24 }, (_, i) => ({
    id: `device-${i + 1}`,
    name: `Device ${i + 1}`,
    status: i % 5 === 0 ? 'maintenance' : i % 3 === 0 ? 'standby' : 'active',
    efficiency: Math.max(0, Math.min(100, 60 + Math.round(Math.random() * 40))),
  }))

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <AppBar />
        <Container maxWidth="xl">
          <PageHeader title="Devices" right={<SearchBar placeholder="Search devices" />} />
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr',
              lg: '1fr 1fr 1fr 1fr',
            },
            gap: 2,
          }}>
            {devices.map(d => (
              <Paper key={d.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{d.name}</Typography>
                <Chip size="small" label={d.status.toUpperCase()} sx={{ mt: 1, mr: 1 }} color={d.status === 'active' ? 'success' : d.status === 'standby' ? 'warning' : 'error'} />
                <Chip size="small" label={`${d.efficiency}%`} color={d.efficiency > 80 ? 'success' : d.efficiency > 60 ? 'warning' : 'error'} />
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Devices


