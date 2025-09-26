import React from 'react'
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'

interface KpiCardProps {
  icon: React.ReactNode
  label: string
  value: string
  delta?: { value: string; positive?: boolean }
  color?: string
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, label, value, delta, color }) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ fontSize: 28, color: color || 'inherit' }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{value}</Typography>
            {delta && (
              <Chip size="small" label={delta.value} color={delta.positive ? 'success' : 'error'} variant="outlined" />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default KpiCard


