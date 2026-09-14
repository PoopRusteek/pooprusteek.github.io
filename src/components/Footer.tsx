import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import Link from './ui/Link'
import { GITHUB_URL, rise, viewportOnce } from '../lib/anim'

const PAGES = [
  { to: '/download', label: '/download' },
  { to: '/rag', label: '/rag' },
  { to: '/serve', label: '/serve' },
  { to: '/architecture', label: '/architecture' },
]

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="px-4 pt-24 pb-16">
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <p className="text-6xl">🧻</p>
        <h2 className="mt-6 text-2xl font-bold text-fg sm:text-4xl">
          {t('footer.title')}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-dim">
          {t('footer.blurb')}
        </p>
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Link
            to="/download"
            className="rounded-md border border-accent bg-accent/15 px-8 py-3.5 text-center text-sm font-bold text-accent-soft transition-colors hover:bg-accent/25"
          >
            ⤓ {t('footer.cta')}
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-line bg-panel px-8 py-3.5 text-center text-sm font-bold text-soft transition-colors hover:border-accent hover:text-accent-soft"
          >
            ★ GitHub
          </a>
        </div>
      </motion.div>

      <div className="mx-auto mt-20 max-w-5xl border-t border-line pt-6">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-dim sm:flex-row">
          <p className="order-2 text-center sm:order-1 sm:text-left">
            {t('footer.tagline')}
          </p>
          <nav className="order-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:order-2">
            {PAGES.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                className="text-dim transition-colors hover:text-accent-soft"
              >
                {p.label}
              </Link>
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-accent-soft hover:text-accent"
            >
              github.com/Aver005/pooprusteek
            </a>
            <span>
              /quit<span className="animate-blink text-accent-soft">▊</span>
            </span>
          </nav>
        </div>
      </div>
    </footer>
  )
}
