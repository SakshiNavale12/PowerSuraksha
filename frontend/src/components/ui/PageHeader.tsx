import React from 'react'
import { Box, Typography } from '@mui/material'

const PageHeader: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h4">{title}</Typography>
      {right}
    </Box>
  )
}

export default PageHeader


