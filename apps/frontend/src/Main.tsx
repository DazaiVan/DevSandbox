// Main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainPages from './pages/MainPages/MainPages'
import GlobalStyles from './GlobalStyles'

const rootElement = document.getElementById('root')

if (rootElement) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <GlobalStyles />
      <MainPages />
    </StrictMode>
  )
} else {
  console.error('Root element not found')
}