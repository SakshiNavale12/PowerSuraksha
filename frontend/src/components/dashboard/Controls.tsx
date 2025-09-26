import React, { useMemo, useState } from 'react'
import { Grid, Paper, Typography, Box, Switch, Chip, useTheme } from '@mui/material'

interface Device {
  id: string
  name: string
  status: 'active' | 'standby' | 'maintenance'
  enabled: boolean
  efficiency: number
}

const Controls: React.FC = () => {
  const theme = useTheme()
  const initialDevices = useMemo<Device[]>(() => ([
    { id: 'dev-1', name: 'Motor 1', status: 'active', enabled: true, efficiency: 92 },
    { id: 'dev-2', name: 'Pump A', status: 'standby', enabled: false, efficiency: 81 },
    { id: 'dev-3', name: 'Compressor 1', status: 'maintenance', enabled: false, efficiency: 0 },
    { id: 'dev-4', name: 'Line-B', status: 'active', enabled: true, efficiency: 88 },
  ]), [])

  const [devices, setDevices] = useState<Device[]>(initialDevices)

  const statusColor = (s: Device['status']) =>
    s === 'active' ? theme.palette.success.main : s === 'standby' ? theme.palette.warning.main : theme.palette.error.main

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, enabled: !d.enabled, status: d.enabled ? 'standby' : 'active' } : d))
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Device Controls</Typography>
      <Grid container spacing={2}>
        {devices.map((device) => (
          <Grid item xs={12} sm={6} key={device.id}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderLeft: `4px solid ${statusColor(device.status)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{device.name}</Typography>
                <Chip size="small" label={device.status.toUpperCase()} sx={{ color: statusColor(device.status) }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip size="small" label={`${device.efficiency}%`} color={device.efficiency > 80 ? 'success' : device.efficiency > 60 ? 'warning' : 'error'} />
                <Switch checked={device.enabled} onChange={() => toggleDevice(device.id)} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Controls
