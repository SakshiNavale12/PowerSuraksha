import React from 'react'
import { Box, Container, Grid } from '@mui/material'
import PageHeader from '../components/ui/PageHeader'
import FilterChips from '../components/ui/FilterChips'
import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import AppBar from '../components/layout/AppBar'
import StatCards from '../components/dashboard/StatCards'
import Charts from '../components/dashboard/Charts'
import Alerts from '../components/dashboard/Alerts'
import Controls from '../components/dashboard/Controls'

const Dashboard: React.FC = () => {
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h')

  return (
    <Box sx={{ display: 'flex', height: '100vh', background: theme => `linear-gradient(180deg, ${theme.palette.background.default}, ${theme.palette.background.paper})` }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <AppBar />
        <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <PageHeader
            title="Dashboard"
            right={
              <FilterChips
                options={[{ value: '24h', label: '24h' }, { value: '7d', label: '7d' }, { value: '30d', label: '30d' }]}
                value={range}
                onChange={(v) => setRange(v as any)}
              />
            }
          />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StatCards />
            </Grid>
            <Grid item xs={12} md={6}>
              <Charts />
            </Grid>
            <Grid item xs={12} md={6}>
              <Alerts />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controls />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default Dashboard
