import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { rise, viewportOnce } from '../lib/anim'
import Link from './ui/Link'

// Every slash command the TUI registers (src/commands/mod.rs
// ::register_defaults), split into two counter-scrolling rows.
const ROW_A = [
  '/new', '/chats', '/btw', '/agent', '/agents', '/goal', '/timers', '/jobs',
  '/ps', '/attach', '/compact', '/undo', '/search', '/rag', '/tools',
  '/whitelist', '/skills', '/mcp', '/instructions', '/themes', '/serve',
  '/server', '/update', '/autoupdate', '/help',
]
const ROW_B = [
  '/providers', '/models', '/rate', '/retry', '/sessions', '/session',
  '/load', '/last', '/export', '/import', '/cwd', '/delete', '/delete-local',
  '/reset', '/clear', '/home', '/debug', '/logout', '/wipe', '/version',
  '/rag-limit', '/refetch-providers', '/cache-providers', '/default-compact',
  '/quit',
]

export default function Commands() {
  const { t } = useTranslation()
  return (
    <section id="commands" className="overflow-hidden px-0 py-24">
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-3xl px-4 text-center"
      >
        <p className="text-xs tracking-[0.3em] text-dim uppercase">
          <span className="text-accent">──</span> {t('commands.kicker')}{' '}
          <span className="text-accent">──</span>
        </p>
        <h2 className="mt-3 text-2xl font-bold text-fg sm:text-4xl">
          {t('commands.title')}
        </h2>
        <p className="mt-4 text-sm leading-7 text-soft">{t('commands.sub')}</p>
      </motion.div>

      <div className="relative mt-14 flex flex-col gap-4">
        {/* edge fades so rows dissolve instead of clipping */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
        <MarqueeRow items={ROW_A} className="animate-marquee" />
        <MarqueeRow items={ROW_B} className="animate-marquee-rev" />
      </div>

      <p className="mx-auto mt-12 max-w-3xl px-4 text-center text-xs text-dim">
        {t('commands.tail')}{' '}
        <Link to="/architecture" className="text-accent-soft hover:text-accent">
          /architecture →
        </Link>
      </p>
    </section>
  )
}

function MarqueeRow({
  items,
  className,
}: {
  items: string[]
  className: string
}) {
  const doubled = [...items, ...items]
  return (
    <div className="flex overflow-hidden" aria-hidden>
      <div className={`flex w-max shrink-0 gap-4 pr-4 ${className}`}>
        {doubled.map((cmd, i) => (
          <span
            key={i}
            className="rounded border border-line bg-panel px-4 py-2 text-sm whitespace-nowrap text-accent-soft transition-colors hover:border-accent"
          >
            {cmd}
          </span>
        ))}
      </div>
    </div>
  )
}
