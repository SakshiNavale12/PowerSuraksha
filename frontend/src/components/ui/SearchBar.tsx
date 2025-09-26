import React from 'react'
import { InputBase, alpha, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search…', value, onChange }) => {
  return (
    <Box sx={{ position: 'relative', borderRadius: 1, backgroundColor: theme => alpha(theme.palette.common.white, 0.15), '&:hover': { backgroundColor: theme => alpha(theme.palette.common.white, 0.25) } }}>
      <Box sx={{ padding: '0 12px', height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SearchIcon />
      </Box>
      <InputBase
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search' }}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        sx={{ color: 'inherit', pl: '40px', width: { xs: 160, sm: 240, md: 320 }, height: 36 }}
      />
    </Box>
  )
}

export default SearchBar


