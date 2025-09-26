import React from 'react'
import { Box, Container, Typography, Paper, FormGroup, FormControlLabel, Switch, Divider } from '@mui/material'
import Sidebar from '../components/layout/Sidebar'
import AppBar from '../components/layout/AppBar'
import { useThemeMode } from '../context/themeModeCore'

const Settings: React.FC = () => {
  const { mode, toggleMode } = useThemeMode()

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <AppBar />
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 2 }}>Settings</Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6">Appearance</Typography>
            <Divider sx={{ my: 2 }} />
            <FormGroup>
              <FormControlLabel control={<Switch checked={mode === 'dark'} onChange={toggleMode} />} label="Dark mode" />
            </FormGroup>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}

export default Settings


