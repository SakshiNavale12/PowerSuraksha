import React, { useMemo } from 'react'
import { Box, Typography, List, ListItem, ListItemText, Chip, Divider, Alert, Paper } from '@mui/material'

const Alerts: React.FC = () => {
  // Demo data; in production, fetch from API/store
  const alerts = useMemo(() => [
    { id: 1, device: 'Motor 3', type: 'Overheating', time: '2 min ago', severity: 'high' as const },
    { id: 2, device: 'Compressor 1', type: 'High Pressure', time: '5 min ago', severity: 'medium' as const },
    { id: 3, device: 'Line A', type: 'Current Spike', time: '12 min ago', severity: 'low' as const },
  ], [])

  const severityColor = (s: 'high' | 'medium' | 'low') => s === 'high' ? 'error' : s === 'medium' ? 'warning' : 'info'

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Recent Alerts</Typography>
      {alerts.length > 0 ? (
        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <List disablePadding>
            {alerts.map((a, idx) => (
              <React.Fragment key={a.id}>
                <ListItem sx={{ py: 1.5 }}>
                  <ListItemText
                    primary={`${a.device} — ${a.type}`}
                    secondary={a.time}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                  <Chip size="small" label={a.severity.toUpperCase()} color={severityColor(a.severity)} />
                </ListItem>
                {idx < alerts.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Alert severity="success">No active alerts</Alert>
      )}
    </Box>
  )
}

export default Alerts
