import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from './components/Nav'
import Footer from './components/Footer'
import StatusBar from './components/StatusBar'
import Home from './pages/Home'
import Download from './pages/Download'
import Alternatives from './pages/Alternatives'
import Versus from './pages/Versus'
import Rag from './pages/Rag'
import Serve from './pages/Serve'
import Architecture from './pages/Architecture'
import Faq from './pages/Faq'
import { BASE, href, usePlace, type Route } from './lib/route-store'
import { PAGE_META } from './lib/pages'

const PAGES: Record<Route, () => React.ReactElement> = {
  '/': Home,
  '/download': Download,
  '/alternatives': Alternatives,
  '/vs/claude-code': () => <Versus id="claudeCode" />,
  '/vs/codex': () => <Versus id="codex" />,
  '/vs/gemini-cli': () => <Versus id="geminiCli" />,
  '/rag': Rag,
  '/serve': Serve,
  '/architecture': Architecture,
  '/faq': Faq,
}

export default function App() {
  const { route, lang } = usePlace()
  const { t } = useTranslation()
  const Page = PAGES[route]

  // The prerendered HTML already carries all of this for the first page;
  // the effect keeps <head> truthful after client-side navigation.
  useEffect(() => {
    const { key } = PAGE_META[route]
    document.title = t(`meta.${key}.title`)
    const set = (selector: string, attr: string, value: string) =>
      document.querySelector(selector)?.setAttribute(attr, value)
    const canonical = `${__CANONICAL_URL__}${href(route, lang).slice(BASE.length)}`
    set('meta[name="description"]', 'content', t(`meta.${key}.desc`))
    set('link[rel="canonical"]', 'href', canonical)
    set('meta[property="og:url"]', 'content', canonical)
    set('meta[property="og:title"]', 'content', t(`meta.${key}.title`))
    set('meta[property="og:description"]', 'content', t(`meta.${key}.desc`))
  }, [route, lang, t])

  return (
    <div id="top" className="crt pb-8">
      <Nav />
      <Page key={`${lang}${route}`} />
      <Footer />
      <StatusBar />
    </div>
  )
}
