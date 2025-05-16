import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Main.css'
import MainPages from './pages/MainPages/MainPages'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainPages/>
  </StrictMode>,
)
