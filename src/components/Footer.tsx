import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import Link from './ui/Link'
import { GITHUB_URL, rise, viewportOnce } from '../lib/anim'

const PROJECT = [
  { to: '/download', label: '/download' },
  { to: '/rag', label: '/rag' },
  { to: '/serve', label: '/serve' },
  { to: '/architecture', label: '/architecture' },
  { to: '/faq', label: '/faq' },
]

const COMPARE = [
  { to: '/alternatives', label: '/alternatives' },
  { to: '/vs/claude-code', label: 'vs Claude Code' },
  { to: '/vs/codex', label: 'vs Codex CLI' },
  { to: '/vs/gemini-cli', label: 'vs Gemini CLI' },
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

      <div className="mx-auto mt-20 max-w-5xl border-t border-line pt-8">
        <div className="grid gap-8 text-xs sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-12">
          <div className="min-w-0 text-dim">
            <p>{t('footer.tagline')}</p>
            <p className="mt-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="text-accent-soft hover:text-accent"
              >
                github.com/Aver005/pooprusteek
              </a>{' '}
              · /quit<span className="animate-blink text-accent-soft">▊</span>
            </p>
          </div>
          <FooterLinks title={t('footer.project')} links={PROJECT} />
          <FooterLinks title={t('footer.compare')} links={COMPARE} />
        </div>
      </div>
    </footer>
  )
}

function FooterLinks({
  title,
  links,
}: {
  title: string
  links: Array<{ to: string; label: string }>
}) {
  return (
    <nav aria-label={title} className="min-w-0">
      <p className="tracking-[0.2em] text-dim uppercase">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-soft transition-colors hover:text-accent-soft">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
