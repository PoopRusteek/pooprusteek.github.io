// Build-time site settings, shared by vite.config.ts and scripts/prerender.ts.
//
// One source, two homes:
//   pooprusteek.github.io   — GitHub Pages, served from the root (primary)
//   aaaver.ru/pooprusteek/  — demo slot of aaaver-app; the default base must
//                             equal the sites/<slug>/ folder name there
// .github/workflows/pages.yml sets SITE_BASE=/ and SITE_URL for Pages.

const trim = (url: string) => url.replace(/\/$/, '')

export const SITE_BASE = process.env.SITE_BASE ?? '/pooprusteek/'

/** Where this particular build is served — assets in previews resolve here. */
export const SITE_URL = trim(process.env.SITE_URL ?? 'https://aaaver.ru/pooprusteek')

/** The address search engines should treat as primary, for both builds. */
export const CANONICAL_URL = trim(process.env.CANONICAL_URL ?? 'https://pooprusteek.github.io')

/** Only the primary build publishes sitemap/robots/llms/IndexNow files. */
export const IS_PRIMARY = SITE_URL === CANONICAL_URL

/**
 * IndexNow (Bing, Yandex, Seznam, Naver): the key is public by design — it
 * is served as /<key>.txt to prove the pings come from the site owner.
 * Changing it invalidates earlier submissions, so leave it alone.
 */
export const INDEXNOW_KEY = 'e188b35d6d9cb66b3fb2bfa2cd4cdedb'
