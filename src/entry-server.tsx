import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { MotionConfig } from 'motion/react'
import App from './App'
import i18n, { LANGS, LANG_LOCALE } from './i18n'
import { ROUTES, setPlace, type Place } from './lib/route-store'
import { PAGE_META } from './lib/pages'

/**
 * Prerender entry, built with `vite build --ssr` and driven by
 * scripts/prerender.ts. Renders exactly the tree main.tsx hydrates.
 */
export function render(place: Place): string {
  setPlace(place)
  return renderToString(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </StrictMode>,
  )
}

export { i18n, LANGS, LANG_LOCALE, ROUTES, PAGE_META }
