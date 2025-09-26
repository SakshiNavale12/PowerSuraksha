import React from 'react';
import { Grid } from '@mui/material';
import SparkKpiCard from '../ui/SparkKpiCard';
import PowerIcon from '@mui/icons-material/Power';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CompressIcon from '@mui/icons-material/Compress';

const StatCards: React.FC = () => {
  const stats = { avgCurrent: 12.5, maxTemp: 45.2, activeDevices: 80, totalDevices: 100, energySavings: 15 };

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <SparkKpiCard icon={<PowerIcon />} value={`${stats.avgCurrent.toFixed(2)} A`} label="Avg. Current" color="#1976d2" delta={{ value: '+2.1%', positive: true }} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SparkKpiCard icon={<ThermostatIcon />} value={`${stats.maxTemp.toFixed(1)} °C`} label="Max Temperature" color="#ff9800" delta={{ value: '-0.8%', positive: true }} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SparkKpiCard icon={<TrendingUpIcon />} value={`${stats.activeDevices}/${stats.totalDevices}`} label="Active Devices" color="#4caf50" delta={{ value: '+3', positive: true }} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SparkKpiCard icon={<CompressIcon />} value={`${stats.energySavings}%`} label="Energy Saved" color="#9c27b0" delta={{ value: '+1.2%', positive: true }} />
      </Grid>
    </Grid>
  );
};

export default StatCards;
