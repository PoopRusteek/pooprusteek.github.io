import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './index.css'
import './i18n'
import App from './App.tsx'
import { initTheme } from './lib/theme-store'
import { initRouter } from './lib/route-store'

// Both run before the first render: the theme so the page never flashes the
// default palette over a saved one, the router so `useRoute` starts on the
// page the URL actually asked for.
initTheme()
initRouter()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
