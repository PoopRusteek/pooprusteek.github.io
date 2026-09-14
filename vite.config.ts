import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import en from './src/i18n/locales/en.ts'

// One source, two homes:
//   aaaver.ru/pooprusteek/  — demo slot of aaaver-app, base must equal the
//                             sites/<slug>/ folder name (the default build)
//   pooprusteek.github.io   — GitHub Pages, served from the root
// .github/workflows/pages.yml sets SITE_BASE=/ and SITE_URL for the latter.
const base = process.env.SITE_BASE ?? '/pooprusteek/'
/** Where this particular build is served — og:image must resolve here. */
const siteUrl = (process.env.SITE_URL ?? 'https://aaaver.ru/pooprusteek').replace(/\/$/, '')
/** The address search engines and link previews should treat as primary. */
const canonicalUrl = (process.env.CANONICAL_URL ?? 'https://pooprusteek.github.io').replace(/\/$/, '')

const ROUTES = {
  download: en.meta.download,
  rag: en.meta.rag,
  serve: en.meta.serve,
  architecture: en.meta.architecture,
} as const

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

/**
 * Static hosts without an SPA fallback (GitHub Pages) answer `/download`
 * only if `download/index.html` exists, so every route gets a copy of the
 * shell with its own title, description and canonical URL. Crawlers and
 * link previews see the right page without running JS; the app itself
 * boots identically from any of them. `404.html` catches everything else.
 */
function siteShells(): Plugin {
  return {
    name: 'pooprusteek-site-shells',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.replaceAll('__SITE_URL__', siteUrl).replaceAll('__CANONICAL_URL__', canonicalUrl),
    },
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const entry = bundle['index.html']
        if (!entry || entry.type !== 'asset') return
        const shell = String(entry.source)

        for (const [route, meta] of Object.entries(ROUTES)) {
          const title = escapeAttr(meta.title)
          const desc = escapeAttr(meta.desc)
          const url = `${canonicalUrl}/${route}/` // Pages redirects /route → /route/
          const html = shell
            .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
            .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, `$1${desc}"`)
            .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${title}"`)
            .replace(/(<meta\s+property="og:description"\s+content=")[^"]*"/, `$1${desc}"`)
            .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
            .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
          this.emitFile({ type: 'asset', fileName: `${route}/index.html`, source: html })
        }

        this.emitFile({
          type: 'asset',
          fileName: '404.html',
          source: shell.replace('<head>', '<head>\n    <meta name="robots" content="noindex" />'),
        })
      },
    },
  }
}

export default defineConfig({
  base,
  define: {
    __CANONICAL_URL__: JSON.stringify(canonicalUrl),
  },
  plugins: [react(), tailwindcss(), siteShells()],
})
