import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { BeginnerModeProvider } from './context/BeginnerModeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <BeginnerModeProvider>
          <App />
        </BeginnerModeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
