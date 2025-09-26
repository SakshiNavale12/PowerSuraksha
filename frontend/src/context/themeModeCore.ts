import { createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark'

export interface ThemeModeContextValue {
  mode: ThemeMode
  toggleMode: () => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined)

export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider')
  return ctx
}


