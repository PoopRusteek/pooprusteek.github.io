import { useSyncExternalStore } from 'react'
import i18n, { LANGS, type Lang } from '../i18n'

/**
 * The router: pages × languages, on top of the History API.
 *
 * URLs carry the language (`/download/` is English, `/ru/download/` is
 * Russian) because search engines index URLs, not localStorage — a language
 * that only exists after a click on a switch is invisible to Yandex.
 *
 * Paths in the store never include the Vite base (`/pooprusteek/` on
 * aaaver.ru, `/` on GitHub Pages); only `href()` adds it back. Every
 * non-root URL the app produces ends in a slash, matching the prerendered
 * `<route>/index.html` files and the canonical URLs, so no link costs a
 * redirect.
 */

export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export const ROUTES = [
  '/',
  '/download',
  '/alternatives',
  '/vs/claude-code',
  '/vs/codex',
  '/vs/gemini-cli',
  '/rag',
  '/serve',
  '/architecture',
  '/faq',
] as const
export type Route = (typeof ROUTES)[number]

export interface Place {
  route: Route
  lang: Lang
  /** false when the path matched no route and fell back to home */
  known: boolean
}

/** `/ru/vs/codex/` → { route: '/vs/codex', lang: 'ru' }, base already stripped. */
export function parse(path: string): Place {
  let rest = path.replace(/\/+$/, '') || '/'
  let lang: Lang = 'en'
  for (const code of LANGS) {
    if (code === 'en') continue
    if (rest === `/${code}` || rest.startsWith(`/${code}/`)) {
      lang = code
      rest = rest.slice(code.length + 1) || '/'
    }
  }
  const known = (ROUTES as readonly string[]).includes(rest)
  return { route: known ? (rest as Route) : '/', lang, known }
}

/** Absolute href for a route in a language — what goes into an `<a>`. */
export function href(to: string, lang: Lang): string {
  const [path = '/', hash] = to.split('#')
  const prefix = lang === 'en' ? '' : `/${lang}`
  const tail = path === '/' ? '/' : `${path.replace(/\/$/, '')}/`
  return `${BASE}${prefix}${tail}${hash ? `#${hash}` : ''}`
}

function fromLocation(): Place {
  return parse(location.pathname.slice(BASE.length) || '/')
}

let current: Place = { route: '/', lang: 'en', known: true }
const listeners = new Set<() => void>()

function commit(next: Place): void {
  current = next
  // Switch copy before anything re-renders, so no frame shows the old
  // language under the new URL.
  if (i18n.language !== next.lang) void i18n.changeLanguage(next.lang)
  for (const fn of listeners) fn()
}

/**
 * Scrolls to `#hash` once the new page has mounted, or to the top.
 * Two frames: the first lets React commit the page, the second runs after
 * its layout, so `getElementById` can't miss.
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

export function navigate(to: string, lang: Lang = current.lang): void {
  const [raw = '/', hash] = to.split('#')
  const next = parse(lang === 'en' ? raw : `/${lang}${raw}`)
  if (next.route !== current.route || next.lang !== current.lang) {
    history.pushState(null, '', href(hash ? `${next.route}#${hash}` : next.route, next.lang))
    commit(next)
  }
  restoreScroll(hash)
}

/** Browser entry: read the URL once, then follow back/forward. */
export function initRouter(): Place {
  commit(fromLocation())
  window.addEventListener('popstate', () => {
    commit(fromLocation())
    restoreScroll(location.hash.slice(1) || undefined)
  })
  return current
}

/** Prerender entry: pin the place the HTML is being rendered for. */
export function setPlace(place: Place): void {
  commit(place)
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// Server and client snapshots are the same value on purpose: the client's
// first (hydrating) render must describe exactly the page that was
// prerendered, and `current` is set before either render happens.
const snapshot = () => current

export function usePlace(): Place {
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}

export function useRoute(): Route {
  return usePlace().route
}

export function useLang(): Lang {
  return usePlace().lang
}
