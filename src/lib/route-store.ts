import { useSyncExternalStore } from 'react'

/**
 * A router in forty lines, because the whole app is five static pages.
 *
 * Paths are stored without the Vite base (`/pooprusteek/`): the store speaks
 * `/`, `/download`, `/rag`… and only `href()` ever adds the prefix back.
 * Deep links work because aaaver-app falls back to the site's index.html for
 * any path that doesn't look like a file (server/lib/static/sites.ts).
 */

export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export const ROUTES = ['/', '/download', '/rag', '/serve', '/architecture'] as const
export type Route = (typeof ROUTES)[number]

/** Absolute href for a route — what goes into an `<a>`. */
export function href(to: string): string {
  const [path, hash] = to.split('#')
  const suffix = path === '/' ? '/' : path
  return `${BASE}${suffix}${hash ? `#${hash}` : ''}`
}

function read(): Route {
  return clean(location.pathname.slice(BASE.length) || '/')
}

let current: Route = '/'
const listeners = new Set<() => void>()

function emit(): void {
  current = read()
  for (const fn of listeners) fn()
}

/** Normalizes `/download/` and `/download` to the same thing. */
function clean(path: string): Route {
  const trimmed = path.length > 1 ? path.replace(/\/$/, '') : path
  return (ROUTES.includes(trimmed as Route) ? trimmed : '/') as Route
}

/**
 * Scrolls to `#hash` once the new page has mounted, or to the top.
 * Two frames, not one: the first lets React commit the new page, the second
 * runs after its layout, so `getElementById` can't miss.
 */
function restoreScroll(hash: string | undefined): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash) : null
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    })
  })
}

export function navigate(to: string): void {
  const [raw = '/', hash] = to.split('#')
  const path = clean(raw)
  if (path !== current) {
    history.pushState(null, '', href(hash ? `${path}#${hash}` : path))
    emit()
  }
  restoreScroll(hash)
}

export function initRouter(): void {
  current = read()
  window.addEventListener('popstate', () => {
    emit()
    restoreScroll(location.hash.slice(1) || undefined)
  })
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, () => current, () => '/' as Route)
}
