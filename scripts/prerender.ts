/**
 * Post-build: turns the client bundle into a static site crawlers can read.
 *
 * For every route × language it renders the React tree to HTML (the same
 * tree main.tsx hydrates), writes `<lang>/<route>/index.html` with a
 * page-specific <head> — title, description, canonical, hreflang, Open
 * Graph, JSON-LD — and, for the primary build only, the files search
 * engines look for at the site root: sitemap.xml, robots.txt, llms.txt and
 * the IndexNow key.
 *
 *   bun run build   # runs this last; see package.json
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import {
  CANONICAL_URL,
  INDEXNOW_KEY,
  IS_PRIMARY,
  SITE_BASE,
  SITE_URL,
} from '../site.config.ts'

type Lang = 'en' | 'ru'
interface Place { route: string; lang: Lang; known: boolean }
interface Ssr {
  render: (place: Place) => string
  i18n: { getFixedT: (lang: string) => (key: string, opts?: object) => unknown }
  LANGS: readonly Lang[]
  LANG_LOCALE: Record<Lang, string>
  ROUTES: readonly string[]
  PAGE_META: Record<string, { key: string; schema: 'home' | 'software' | 'article' | 'faq' }>
}

const ROOT = join(import.meta.dir, '..')
const DIST = join(ROOT, 'dist')
const ssr = (await import(join(ROOT, 'dist-ssr', 'entry-server.js'))) as Ssr
const { render, i18n, LANGS, LANG_LOCALE, ROUTES, PAGE_META } = ssr

const REPO_URL = 'https://github.com/Aver005/pooprusteek'
const ORG_URL = 'https://github.com/PoopRusteek'
const TODAY = new Date().toISOString().slice(0, 10)

/** `/vs/codex` in `ru` → `/ru/vs/codex/` (no base, trailing slash). */
function path(route: string, lang: Lang): string {
  const prefix = lang === 'en' ? '' : `/${lang}`
  return `${prefix}${route === '/' ? '/' : `${route}/`}`
}
const canonical = (route: string, lang: Lang) => `${CANONICAL_URL}${path(route, lang)}`

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** JSON inside <script> must not be able to close the tag. */
function jsonLd(data: unknown): string {
  const body = JSON.stringify(data).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${body}</script>`
}

function schemaFor(route: string, lang: Lang): object {
  const t = i18n.getFixedT(lang)
  const meta = PAGE_META[route]
  const url = canonical(route, lang)
  const title = String(t(`meta.${meta.key}.title`))
  const desc = String(t(`meta.${meta.key}.desc`))

  const organization = {
    '@type': 'Organization',
    '@id': `${CANONICAL_URL}/#org`,
    name: 'PoopRusteek',
    url: `${CANONICAL_URL}/`,
    logo: `${CANONICAL_URL}/favicon.svg`,
    sameAs: [ORG_URL, REPO_URL],
  }
  const software = {
    '@type': 'SoftwareApplication',
    '@id': `${CANONICAL_URL}/#software`,
    name: 'PoopRusteek',
    alternateName: 'Пупрастик',
    description: String(t('meta.home.desc')),
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'AI coding agent',
    operatingSystem: 'Windows, macOS, Linux',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    license: 'https://opensource.org/licenses/MIT',
    downloadUrl: canonical('/download', lang),
    installUrl: canonical('/download', lang),
    screenshot: `${CANONICAL_URL}/og.png`,
    url: canonical('/', lang),
    sameAs: [REPO_URL],
    publisher: { '@id': organization['@id'] },
    keywords: String(t('seo.keywords')),
  }
  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'PoopRusteek', item: canonical('/', lang) },
      ...(route === '/'
        ? []
        : [{ '@type': 'ListItem', position: 2, name: String(t(`meta.${meta.key}.crumb`)), item: url }]),
    ],
  }

  const graph: object[] = [organization]
  if (meta.schema === 'home') {
    graph.push(
      {
        '@type': 'WebSite',
        '@id': `${CANONICAL_URL}/#website`,
        url: `${CANONICAL_URL}/`,
        name: 'PoopRusteek',
        inLanguage: LANGS,
        publisher: { '@id': organization['@id'] },
      },
      software,
    )
  } else {
    graph.push(breadcrumbs)
    if (meta.schema === 'software') graph.push(software)
    if (meta.schema === 'article') {
      graph.push({
        '@type': 'TechArticle',
        headline: title,
        description: desc,
        url,
        inLanguage: lang,
        dateModified: TODAY,
        author: { '@id': organization['@id'] },
        publisher: { '@id': organization['@id'] },
        about: { '@id': software['@id'] },
        image: `${CANONICAL_URL}/og.png`,
      })
    }
    if (meta.schema === 'faq') {
      const items = t('faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>
      graph.push({
        '@type': 'FAQPage',
        url,
        inLanguage: lang,
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      })
    }
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

function headFor(template: string, route: string, lang: Lang): string {
  const t = i18n.getFixedT(lang)
  const { key } = PAGE_META[route]
  const title = esc(String(t(`meta.${key}.title`)))
  const desc = esc(String(t(`meta.${key}.desc`)))
  const url = canonical(route, lang)

  const alternates = [
    ...LANGS.map((code) => `<link rel="alternate" hreflang="${code}" href="${canonical(route, code)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${canonical(route, 'en')}" />`,
  ]
  const locales = [
    `<meta property="og:locale" content="${LANG_LOCALE[lang]}" />`,
    ...LANGS.filter((code) => code !== lang).map(
      (code) => `<meta property="og:locale:alternate" content="${LANG_LOCALE[code]}" />`,
    ),
  ]
  const extra = [
    ...alternates,
    ...locales,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    jsonLd(schemaFor(route, lang)),
  ]

  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, `$1${desc}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${title}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${desc}"`)
    .replace(/(<meta property="og:type" content=")[^"]*"/, `$1${route === '/' ? 'website' : 'article'}"`)
    .replace('</head>', `    ${extra.join('\n    ')}\n  </head>`)
}

async function write(file: string, contents: string): Promise<void> {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, contents)
}

// ── pages ────────────────────────────────────────────────────────────────

const template = (await readFile(join(DIST, 'index.html'), 'utf8'))
  .replaceAll('__CANONICAL_URL__', CANONICAL_URL)
  .replaceAll('__SITE_URL__', SITE_URL)

let pages = 0
for (const lang of LANGS) {
  for (const route of ROUTES) {
    const html = render({ route, lang, known: true })
    const page = headFor(template, route, lang).replace(
      '<div id="root"></div>',
      `<div id="root" data-route="${route}" data-lang="${lang}">${html}</div>`,
    )
    await write(join(DIST, `.${path(route, lang)}index.html`), page)
    pages++
  }
}

// Unknown paths on hosts without a fallback: the client renders from an
// empty root, and nothing about this file should be indexed.
await write(
  join(DIST, '404.html'),
  template
    .replace(/<title>[^<]*<\/title>/, '<title>404 — PoopRusteek</title>')
    .replace('<head>', '<head>\n    <meta name="robots" content="noindex" />')
    .replace(/\s*<link rel="canonical"[^>]*>/, ''),
)

// ── root files, primary build only ───────────────────────────────────────
// robots.txt and sitemap.xml only mean anything at a host's root; on the
// aaaver.ru copy they'd sit under /pooprusteek/ and be ignored at best.

if (IS_PRIMARY) {
  const urls = ROUTES.flatMap((route) =>
    LANGS.map((lang) => {
      const links = [
        ...LANGS.map(
          (code) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${canonical(route, code)}" />`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${canonical(route, 'en')}" />`,
      ]
      const priority = route === '/' ? '1.0' : ['/download', '/alternatives'].includes(route) ? '0.9' : route.startsWith('/vs/') ? '0.8' : '0.6'
      return [
        '  <url>',
        `    <loc>${canonical(route, lang)}</loc>`,
        `    <lastmod>${TODAY}</lastmod>`,
        `    <priority>${priority}</priority>`,
        ...links,
        '  </url>',
      ].join('\n')
    }),
  )
  await write(
    join(DIST, 'sitemap.xml'),
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      ...urls,
      '</urlset>',
      '',
    ].join('\n'),
  )

  await write(
    join(DIST, 'robots.txt'),
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${CANONICAL_URL}/sitemap.xml`, ''].join('\n'),
  )

  // llms.txt (llmstxt.org): a plain map of the site for AI assistants and
  // AI search, which increasingly answer "what can replace Claude Code".
  const en = i18n.getFixedT('en')
  const ru = i18n.getFixedT('ru')
  const line = (t: typeof en, route: string, lang: Lang) => {
    const { key } = PAGE_META[route]
    return `- [${String(t(`meta.${key}.title`))}](${canonical(route, lang)}): ${String(t(`meta.${key}.desc`))}`
  }
  await write(
    join(DIST, 'llms.txt'),
    [
      '# PoopRusteek',
      '',
      `> ${String(en('seo.llms'))}`,
      '',
      String(en('seo.llmsBody')),
      '',
      '## Pages',
      '',
      ...ROUTES.map((route) => line(en, route, 'en')),
      '',
      '## Source and releases',
      '',
      `- [Source code (MIT)](${REPO_URL})`,
      `- [Releases and installers](${REPO_URL}/releases)`,
      '',
      '## На русском',
      '',
      ...ROUTES.map((route) => line(ru, route, 'ru')),
      '',
    ].join('\n'),
  )

  await write(join(DIST, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY)
}

await rm(join(ROOT, 'dist-ssr'), { recursive: true, force: true })
console.log(
  `prerendered ${pages} pages (base ${SITE_BASE}, site ${SITE_URL})${IS_PRIMARY ? ' + sitemap, robots, llms.txt, indexnow key' : ''}`,
)
