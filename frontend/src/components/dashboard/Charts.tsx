import React, { useMemo } from 'react'
import { Grid, Box, useTheme, Paper, Typography } from '@mui/material'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { ensureChartsRegistered } from '../../utils/charts'

ensureChartsRegistered()

const Charts: React.FC = () => {
  const theme = useTheme()

  const baseOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { usePointStyle: true },
      },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: { color: theme.palette.text.secondary },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      y: {
        ticks: { color: theme.palette.text.secondary },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
    },
  }), [theme])

  const labels = useMemo(() => Array.from({ length: 12 }, (_, i) => `${i + 1}:00`), [])

  const currentData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Current (A)',
        data: labels.map((_, i) => 10 + Math.sin(i * 0.5) * 2 + Math.random() * 1.5),
        borderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
      },
    ],
  }), [labels, theme])

  const temperatureData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: labels.map((_, i) => 24 + Math.cos(i * 0.4) * 3 + Math.random() * 1.2),
        borderColor: theme.palette.warning.main,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
      },
    ],
  }), [labels, theme])

  const pressureData = useMemo(() => ({
    labels: ['D1','D2','D3','D4','D5','D6','D7','D8'],
    datasets: [
      {
        label: 'Pressure (psi)',
        data: Array.from({ length: 8 }, () => 95 + Math.random() * 20),
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.success.light,
          theme.palette.success.dark,
          theme.palette.warning.main,
          theme.palette.warning.light,
          theme.palette.warning.dark,
          theme.palette.error.main,
          theme.palette.error.light,
        ],
        borderWidth: 0,
      },
    ],
  }), [theme])

  const statusDistribution = useMemo(() => ({
    labels: ['Active', 'Standby', 'Maintenance'],
    datasets: [
      {
        label: 'Devices',
        data: [56, 32, 12],
        backgroundColor: [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
        borderWidth: 0,
      },
    ],
  }), [])

  const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Paper elevation={0} sx={{
      p: 2,
      height: 330,
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
      background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.mode === 'light' ? '#f9fafb' : '#0b1220'})`,
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
    }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>{title}</Typography>
      <Box sx={{ height: 280, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {children}
        </Box>
      </Box>
    </Paper>
  )

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12} lg={6}>
        <ChartCard title="Current Consumption Trend">
          <Line data={currentData} options={baseOptions} />
        </ChartCard>
      </Grid>
      <Grid item xs={12} lg={6}>
        <ChartCard title="Temperature Monitoring">
          <Line data={temperatureData} options={baseOptions} />
        </ChartCard>
      </Grid>
      <Grid item xs={12} lg={6}>
        <ChartCard title="Device Pressure Levels">
          <Bar data={pressureData} options={baseOptions} />
        </ChartCard>
      </Grid>
      <Grid item xs={12} lg={6}>
        <ChartCard title="Device Status Distribution">
          <Doughnut data={statusDistribution} options={{
            responsive: true,
            plugins: { legend: { position: 'right' as const } },
          }} />
        </ChartCard>
      </Grid>
    </Grid>
  )
}

export default Charts
