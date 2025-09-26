import React, { useState } from 'react'
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse, Box, Typography } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import BarChartIcon from '@mui/icons-material/BarChart'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useTheme } from '@mui/material/styles'

const Sidebar: React.FC = () => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const location = useLocation()

  const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; inset?: boolean }> = ({ to, icon, label, inset }) => {
    const selected = location.pathname === to
    return (
      <ListItemButton component={Link} to={to} selected={selected} sx={inset ? { pl: 4 } : undefined}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
        },
      }}
    >
      <Box sx={{ p: 2, background: theme.palette.primary.main, color: 'white' }}>
        <Typography variant="h6">IoT Dashboard</Typography>
      </Box>
      <List>
        <NavItem to="/" icon={<HomeIcon />} label="Dashboard" />
        <ListItemButton onClick={() => setOpen(!open)}>
          <ListItemIcon><BarChartIcon /></ListItemIcon>
          <ListItemText primary="Analytics" />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavItem to="/devices" icon={<BarChartIcon />} label="Real-time" inset />
            <NavItem to="/analytics" icon={<BarChartIcon />} label="Historical" inset />
          </List>
        </Collapse>
        <NavItem to="/alerts" icon={<NotificationsIcon />} label="Alerts" />
        <NavItem to="/settings" icon={<SettingsIcon />} label="Settings" />
      </List>
    </Drawer>
  )
}

export default Sidebar
