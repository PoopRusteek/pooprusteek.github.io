import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from './components/Nav'
import Footer from './components/Footer'
import StatusBar from './components/StatusBar'
import Home from './pages/Home'
import Download from './pages/Download'
import Rag from './pages/Rag'
import Serve from './pages/Serve'
import Architecture from './pages/Architecture'
import { useRoute, type Route } from './lib/route-store'

const PAGES: Record<Route, () => React.ReactElement> = {
  '/': Home,
  '/download': Download,
  '/rag': Rag,
  '/serve': Serve,
  '/architecture': Architecture,
}

/** i18n key per route — the tab title and the meta description follow the
 *  page, the same way they would on a multi-document site. */
const META = {
  '/': 'home',
  '/download': 'download',
  '/rag': 'rag',
  '/serve': 'serve',
  '/architecture': 'architecture',
} as const satisfies Record<Route, string>

export default function App() {
  const route = useRoute()
  const { t, i18n } = useTranslation()
  const Page = PAGES[route]

  useEffect(() => {
    const key = META[route]
    document.title = t(`meta.${key}.title`)
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t(`meta.${key}.desc`))
    // Both copies of the site (aaaver.ru and GitHub Pages) name one address
    // as canonical, per page — see vite.config.ts.
    const canonical = `${__CANONICAL_URL__}${route === '/' ? '/' : `${route}/`}`
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical)
  }, [route, t, i18n.resolvedLanguage])

  return (
    <div id="top" className="crt pb-8">
      <Nav />
      <Page />
      <Footer />
      <StatusBar />
    </div>
  )
}
