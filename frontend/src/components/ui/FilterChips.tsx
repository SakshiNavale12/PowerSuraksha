import React from 'react'
import { Stack, Chip } from '@mui/material'

export interface FilterOption<T extends string> {
  value: T
  label: string
}

interface FilterChipsProps<T extends string> {
  options: Array<FilterOption<T>>
  value: T
  onChange: (val: T) => void
  size?: 'small' | 'medium'
}

function FilterChips<T extends string>({ options, value, onChange, size = 'small' }: FilterChipsProps<T>) {
  return (
    <Stack direction="row" spacing={1}>
      {options.map(opt => (
        <Chip
          key={opt.value}
          size={size}
          label={opt.label}
          color={opt.value === value ? 'primary' : 'default'}
          variant={opt.value === value ? 'filled' : 'outlined'}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </Stack>
  )
}

export default FilterChips


