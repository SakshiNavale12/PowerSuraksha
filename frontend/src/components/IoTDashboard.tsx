import React, { useState, useEffect, useMemo } from 'react';
import {
  Line,
  Bar,
  Doughnut,
  Scatter,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  Alert,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge,
  Fab,
} from '@mui/material';
import {
  createTheme,
  ThemeProvider,
  styled,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PowerIcon from '@mui/icons-material/Power';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CompressIcon from '@mui/icons-material/Compress';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const StatCard = styled(Paper)(({ theme, $bgColor }: { theme: any; $bgColor: string }) => ({
  padding: theme.spacing(2),
  background: `linear-gradient(145deg, ${$bgColor}10, ${$bgColor}20)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  textAlign: 'center',
}));

// Enhanced theme
const theme = createTheme({
  palette: {
    mode: 'light' as const,
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          overflow: 'hidden',
        },
      },
    },
  },
});

const IoTDashboard: React.FC = () => {
  const [data, setData] = useState({
    current: [] as Array<{ timestamp: string; value: number }>,
    temperature: [] as Array<{ timestamp: string; value: number }>,
    pressure: [] as Array<{ timestamp: string; value: number }>,
    alerts: [] as Array<{ id: number; device: string; type: string; time: string; severity: string }>,
    deviceStatus: [] as Array<{ id: number; name: string; status: string; efficiency: number }>,
    predictions: [] as Array<{ time: string; consumption: number }>,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'optimal' | 'warning' | 'critical'>('optimal');
  const [energySavings, setEnergySavings] = useState(0);

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Simulate real-time data fetching
  useEffect(() => {
    const fetchData = async () => {
      // Simulated data - replace with actual API call
      const mockData = {
        current: Array.from({ length: 20 }, (_, i) => ({
          timestamp: new Date(Date.now() - (19 - i) * 60000).toISOString(),
          value: 10 + Math.random() * 5 + Math.sin(i * 0.5) * 2,
        })),
        temperature: Array.from({ length: 20 }, (_, i) => ({
          timestamp: new Date(Date.now() - (19 - i) * 60000).toISOString(),
          value: 25 + Math.random() * 10 + Math.cos(i * 0.3) * 3,
        })),
        pressure: Array.from({ length: 10 }, (_, i) => ({
          timestamp: `Device ${i + 1}`,
          value: 100 + Math.random() * 20,
        })),
        alerts: [
          { id: 1, device: 'Motor 3', type: 'Overheating', time: '2 min ago', severity: 'high' },
          { id: 2, device: 'Compressor 1', type: 'High Pressure', time: '5 min ago', severity: 'medium' },
        ],
        deviceStatus: [
          { id: 1, name: 'Motor 1', status: 'active', efficiency: 92 },
          { id: 2, name: 'Motor 2', status: 'standby', efficiency: 85 },
          { id: 3, name: 'Compressor 1', status: 'active', efficiency: 78 },
          { id: 4, name: 'Pump 1', status: 'maintenance', efficiency: 0 },
        ],
        predictions: [
          { time: '2023-10-01T10:00:00Z', consumption: 1200 },
          { time: '2023-10-01T11:00:00Z', consumption: 1180 },
          { time: '2023-10-01T12:00:00Z', consumption: 1250 },
        ],
      };
      setData(mockData);

      // Calculate overall status based on data
      const highTemp = mockData.temperature.some(d => d.value > 35);
      const highCurrent = mockData.current.some(d => d.value > 14);
      const alerts = mockData.alerts.length;

      if (alerts > 0 || highTemp || highCurrent) {
        setOverallStatus('warning');
      } else {
        setOverallStatus('optimal');
      }

      // Simulate energy savings calculation
      setEnergySavings(Math.floor(Math.random() * 15) + 5);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    if (data.current.length === 0) return { avgCurrent: 0, maxTemp: 0, totalDevices: 0, activeDevices: 0 };

    const avgCurrent = data.current.reduce((sum, d) => sum + d.value, 0) / data.current.length;
    const maxTemp = Math.max(...data.temperature.map(d => d.value), 0);
    const totalDevices = data.deviceStatus.length;
    const activeDevices = data.deviceStatus.filter(d => d.status === 'active').length;

    return { avgCurrent, maxTemp, totalDevices, activeDevices };
  }, [data]);

  // Chart options with enhanced styling
  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
    },
  };

  const timeChartOptions = {
    ...baseChartOptions,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm',
          },
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
    },
  };

  // Chart data
  const currentData = {
    labels: data.current.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: 'Current (A)',
        data: data.current.map(d => d.value),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const temperatureData = {
    labels: data.temperature.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.temperature.map(d => d.value),
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const pressureData = {
    labels: data.pressure.map(d => d.timestamp),
    datasets: [
      {
        label: 'Pressure (psi)',
        data: data.pressure.map(d => d.value),
        backgroundColor: [
          '#4caf50',
          '#8bc34a',
          '#cddc39',
          '#ffeb3b',
          '#ffc107',
          '#ff9800',
          '#ff5722',
          '#f44336',
          '#e91e63',
          '#9c27b0',
        ],
      },
    ],
  };

  const predictionData = {
    labels: data.predictions.map(d => new Date(d.time).toLocaleTimeString()),
    datasets: [
      {
        label: 'Predicted Consumption (kWh)',
        data: data.predictions.map(d => d.consumption),
        borderColor: '#9c27b0',
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const statusDistribution = {
    labels: ['Active', 'Standby', 'Maintenance'],
    datasets: [
      {
        data: [
          data.deviceStatus.filter(d => d.status === 'active').length,
          data.deviceStatus.filter(d => d.status === 'standby').length,
          data.deviceStatus.filter(d => d.status === 'maintenance').length,
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderWidth: 0,
      },
    ],
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'standby': return '#ff9800';
      case 'maintenance': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon fontSize="small" style={{ color: '#4caf50' }} />;
      case 'standby': return <WarningIcon fontSize="small" style={{ color: '#ff9800' }} />;
      case 'maintenance': return <WarningIcon fontSize="small" style={{ color: '#f44336' }} />;
      default: return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, background: theme.palette.background.default, minHeight: '100vh' }}>
        {/* Enhanced AppBar */}
        <AppBar position="sticky" elevation={4} sx={{ background: 'linear-gradient(90deg, #1976d2, #2196f3)' }}>
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Smart Energy Monitor Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge badgeContent={data.alerts.length} color="error">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Badge>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    color="default"
                  />
                }
                label="Dark Mode"
                labelPlacement="start"
                sx={{ m: 0, color: 'white', '.MuiTypography-root': { fontSize: '0.875rem' } }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Status Bar */}
        <Box sx={{ p: 2, background: theme.palette.background.paper, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Chip
                icon={overallStatus === 'optimal' ? <CheckCircleIcon /> : <WarningIcon />}
                label={overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
                color={overallStatus === 'optimal' ? 'success' : 'warning'}
                variant="outlined"
              />
            </Grid>
            <Grid item xs>
              <LinearProgress
                variant="determinate"
                value={energySavings}
                color={energySavings > 10 ? "success" : "primary"}
              />
            </Grid>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Energy Saved: <strong>{energySavings}%</strong>
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: isMobile ? 1 : 3 }}>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StatCard $bgColor="#1976d2">
                  <PowerIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                  <Typography variant="h6">{stats.avgCurrent.toFixed(2)} A</Typography>
                  <Typography variant="caption" color="text.secondary">Avg. Current</Typography>
                </StatCard>
              </motion.div>
            </Grid>
            <Grid item xs={6} sm={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <StatCard $bgColor="#ff9800">
                  <ThermostatIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                  <Typography variant="h6">{stats.maxTemp.toFixed(1)} °C</Typography>
                  <Typography variant="caption" color="text.secondary">Max Temperature</Typography>
                </StatCard>
              </motion.div>
            </Grid>
            <Grid item xs={6} sm={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <StatCard $bgColor="#4caf50">
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h6">{stats.activeDevices}/{stats.totalDevices}</Typography>
                  <Typography variant="caption" color="text.secondary">Active Devices</Typography>
                </StatCard>
              </motion.div>
            </Grid>
            <Grid item xs={6} sm={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StatCard $bgColor="#9c27b0">
                  <CompressIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                  <Typography variant="h6">{energySavings}%</Typography>
                  <Typography variant="caption" color="text.secondary">Energy Saved</Typography>
                </StatCard>
              </motion.div>
            </Grid>
          </Grid>

          {/* Charts Grid */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <PowerIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                      Current Consumption Trend
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line options={timeChartOptions} data={currentData} />
                    </Box>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <ThermostatIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                      Temperature Monitoring
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line options={timeChartOptions} data={temperatureData} />
                    </Box>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Device Pressure Levels
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Bar options={baseChartOptions} data={pressureData} />
                    </Box>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Device Status Distribution
                    </Typography>
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Doughnut options={{ responsive: true, plugins: { legend: { position: 'right' } } }} data={statusDistribution} />
                    </Box>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          </Grid>

          {/* Alerts and Controls */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Alerts
                    </Typography>
                    {data.alerts.length > 0 ? (
                      <List>
                        {data.alerts.map((alert) => (
                          <React.Fragment key={alert.id}>
                            <ListItem alignItems="flex-start">
                              <ListItemText
                                primary={`${alert.device} - ${alert.type}`}
                                secondary={
                                  <React.Fragment>
                                    <Typography component="span" variant="body2" color="text.primary">
                                      {alert.time}
                                    </Typography>
                                    <Chip
                                      size="small"
                                      label={alert.severity}
                                      color={alert.severity === 'high' ? 'error' : 'warning'}
                                      sx={{ ml: 1 }}
                                    />
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Alert severity="success" sx={{ mt: 2 }}>No active alerts</Alert>
                    )}
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Device Controls
                    </Typography>
                    <Grid container spacing={2}>
                      {data.deviceStatus.map((device) => (
                        <Grid item xs={6} key={device.id}>
                          <Paper
                            elevation={2}
                            sx={{
                              p: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderLeft: `4px solid ${getStatusColor(device.status)}`,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getStatusIcon(device.status)}
                              <Typography variant="body2" sx={{ ml: 1 }}>{device.name}</Typography>
                            </Box>
                            <Chip
                              size="small"
                              label={`${device.efficiency}%`}
                              color={device.efficiency > 80 ? 'success' : device.efficiency > 60 ? 'warning' : 'error'}
                            />
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        System Efficiency
                      </Typography>
                      <LinearProgress variant="determinate" value={stats.avgCurrent > 12 ? 30 : stats.avgCurrent > 10 ? 60 : 90} />
                      <Typography variant="caption" color="text.secondary">
                        Current efficiency level based on consumption patterns
                      </Typography>
                    </Box>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: 'linear-gradient(45deg, #1976d2, #2196f3)',
            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
          }}
        >
          <NotificationsIcon />
        </Fab>
      </Box>
    </ThemeProvider>
  );
};

export default IoTDashboard;
