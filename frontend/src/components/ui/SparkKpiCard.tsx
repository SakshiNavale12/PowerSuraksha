import React from 'react'
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

interface SparkKpiCardProps {
  icon: React.ReactNode
  label: string
  value: string
  delta?: { value: string; positive?: boolean }
  color?: string
  trend?: number[]
}

const SparkKpiCard: React.FC<SparkKpiCardProps> = ({ icon, label, value, delta, color = '#2563eb', trend }) => {
  const data = {
    labels: (trend || Array.from({ length: 10 })).map((_, i) => `${i}`),
    datasets: [
      {
        data: trend || Array.from({ length: 10 }, () => Math.random() * 10 + 10),
        borderColor: color,
        backgroundColor: `${color}22`,
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  } as const

  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
      <CardContent sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 1.5 }}>
        <Box sx={{ fontSize: 28, color }}>{icon}</Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{value}</Typography>
            {delta && <Chip size="small" label={delta.value} color={delta.positive ? 'success' : 'error'} variant="outlined" />}
          </Box>
          <Box sx={{ height: 40, mt: 1 }}>
            <Line data={data} options={options} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SparkKpiCard


