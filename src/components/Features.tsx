import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import Corners from './ui/Corners'
import SectionTitle from './ui/SectionTitle'
import { rise, stagger, viewportOnce } from '../lib/anim'

// Real TUI slash commands and tool names — verbatim in every language.
// Titles/bodies live in src/i18n/locales/* (features.cards), one entry per
// line below, same order.
const CMDS = [
  '/new · /chats',
  '/agent · task',
  '/goal',
  '/rag · /search',
  '/mcp',
  '/skills',
  '/providers · /models',
  '/serve',
  'edit · write · /undo',
  'bash · /jobs · /ps',
  '/whitelist',
  '/update · /themes',
]

export default function Features() {
  const { t } = useTranslation()
  const cards = t('features.cards', { returnObjects: true })
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          kicker={t('features.kicker')}
          title={t('features.title')}
          sub={t('features.sub')}
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {CMDS.map((cmd, i) => (
            <motion.article
              key={cmd}
              variants={rise}
              whileHover={{ y: -6 }}
              className="group relative flex min-w-0 flex-col border border-line bg-panel p-5 transition-colors hover:border-accent"
            >
              <Corners />
              <p className="truncate text-xs text-accent">{cmd}</p>
              <h3 className="mt-2 text-base font-bold text-fg">
                {cards[i].title}
              </h3>
              <p className="mt-3 text-[13px] leading-6 text-dim">
                {cards[i].body}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
