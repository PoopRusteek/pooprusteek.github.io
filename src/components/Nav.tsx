import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Link from './ui/Link'
import ThemePicker from './ThemePicker'
import { GITHUB_URL } from '../lib/anim'
import { LANGS, LANG_LABEL } from '../i18n'
import { usePlace, useRoute } from '../lib/route-store'

/** The site map is a command list — every page reads like the slash
 *  command that would open it. */
const PAGES = [
  { to: '/download', label: '/download' },
  { to: '/alternatives', label: '/alternatives' },
  { to: '/rag', label: '/rag' },
  { to: '/serve', label: '/serve' },
  { to: '/architecture', label: '/architecture' },
  { to: '/faq', label: '/faq' },
] as const

export default function Nav() {
  const route = useRoute()
  const [menu, setMenu] = useState(false)

  useEffect(() => setMenu(false), [route])

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/85 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 text-sm">
        <Link to="/" className="font-bold whitespace-nowrap text-fg">
          PoopRusteek{' '}
          <span aria-hidden className="max-[350px]:hidden">
            🧻
          </span>
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {PAGES.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className={`rounded px-2 py-1 text-xs transition-colors hover:bg-sel hover:text-accent-soft ${
                route === p.to ? 'bg-sel text-accent-soft' : 'text-dim'
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemePicker />
          <LangSwitch />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-line px-3 py-1 text-xs whitespace-nowrap text-accent-soft transition-colors hover:border-accent max-[350px]:px-2"
          >
            <span className="max-[350px]:hidden">★ </span>GitHub
          </a>
          <button
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-label="menu"
            className="rounded border border-line px-2 py-1 text-xs text-dim transition-colors hover:border-accent hover:text-accent-soft xl:hidden"
          >
            ≡
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line bg-panel-deep xl:hidden"
          >
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-3">
              {PAGES.map((p) => (
                <Link
                  key={p.to}
                  to={p.to}
                  className={`rounded px-3 py-2 text-xs transition-colors hover:bg-sel ${
                    route === p.to ? 'bg-sel text-accent-soft' : 'text-soft'
                  }`}
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

/** Same page, other language — a real link, so crawlers find both. */
function LangSwitch() {
  const { route, lang } = usePlace()
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center overflow-hidden rounded border border-line text-xs"
    >
      {LANGS.map((code) => {
        const active = lang === code
        return (
          <Link
            key={code}
            to={route}
            lang={code}
            aria-current={active ? 'true' : undefined}
            className={`px-2 py-1 transition-colors ${
              active
                ? 'bg-sel text-accent-soft'
                : 'text-dim hover:text-accent-soft'
            }`}
          >
            {LANG_LABEL[code]}
          </Link>
        )
      })}
    </div>
  )
}
