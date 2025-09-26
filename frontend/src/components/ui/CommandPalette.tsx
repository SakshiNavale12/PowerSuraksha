import React, { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, Box, InputBase, List, ListItemButton, ListItemText, Typography, alpha } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DashboardIcon from '@mui/icons-material/SpaceDashboard'
import DevicesIcon from '@mui/icons-material/Devices'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import { useNavigate } from 'react-router-dom'

interface Command {
  id: string
  label: string
  hint?: string
  path?: string
}

const commandsBase: Command[] = [
  { id: 'go-dashboard', label: 'Go to Dashboard', path: '/' },
  { id: 'go-devices', label: 'Open Devices', path: '/devices' },
  { id: 'go-alerts', label: 'View Alerts', path: '/alerts' },
  { id: 'go-settings', label: 'Open Settings', path: '/settings' },
]

const CommandPalette: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commandsBase
    return commandsBase.filter(c => c.label.toLowerCase().includes(q))
  }, [query])

  const iconFor = (id: string) => {
    if (id.includes('devices')) return <DevicesIcon fontSize="small" />
    if (id.includes('alerts')) return <NotificationsIcon fontSize="small" />
    if (id.includes('settings')) return <SettingsIcon fontSize="small" />
    return <DashboardIcon fontSize="small" />
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, gap: 1, borderBottom: theme => `1px solid ${theme.palette.divider}`, background: theme => alpha(theme.palette.background.paper, 0.9) }}>
          <SearchIcon color="action" />
          <InputBase autoFocus placeholder="Type a command or search…" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ flex: 1, py: 0.5 }} />
          <Typography variant="caption" color="text.secondary">Ctrl/⌘ K</Typography>
        </Box>
        <List sx={{ maxHeight: 360, overflow: 'auto', py: 0 }}>
          {items.map(item => (
            <ListItemButton key={item.id} onClick={() => { if (item.path) navigate(item.path); onClose(); }}>
              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>{iconFor(item.id)}</Box>
              <ListItemText primary={item.label} secondary={item.hint} />
            </ListItemButton>
          ))}
          {items.length === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">No results</Typography>
            </Box>
          )}
        </List>
      </DialogContent>
    </Dialog>
  )
}

export default CommandPalette


