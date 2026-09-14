import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './index.css'
import './i18n'
import App from './App.tsx'
import { initTheme } from './lib/theme-store'
import { initRouter } from './lib/route-store'

// Both run before the first render: the theme so the page never flashes the
// default palette over a saved one, the router so the first render (and the
// i18n language) describe the page the URL actually asks for.
initTheme()
const place = initRouter()

const tree = (
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>
)

// Every page ships prerendered (scripts/prerender.ts stamps which one on the
// root). Hydrate only when that is the page the URL resolves to: a host that
// falls back to the root index.html for an unknown path (aaaver-app does)
// hands us markup for a different page, and hydrating over it would fail.
const root = document.getElementById('root')!
const prerendered =
  root.hasChildNodes() &&
  root.dataset.route === place.route &&
  root.dataset.lang === place.lang

if (prerendered) {
  hydrateRoot(root, tree)
} else {
  root.textContent = ''
  createRoot(root).render(tree)
}
