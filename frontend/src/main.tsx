import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CssBaseline } from '@mui/material'
import ThemeModeProvider from './context/ThemeModeContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <CssBaseline />
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </ThemeModeProvider>
  </StrictMode>,
)
