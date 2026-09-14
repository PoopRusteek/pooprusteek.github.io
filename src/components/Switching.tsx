import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import Corners from './ui/Corners'
import Link from './ui/Link'
import SectionTitle from './ui/SectionTitle'
import { rise, stagger, viewportOnce } from '../lib/anim'

/** "Coming from Claude Code, Codex or Gemini CLI?" — the home page's bridge
 *  into the comparison pages, and the internal links they rank on. */
export default function Switching() {
  const { t } = useTranslation()
  const cards = t('switching.cards', { returnObjects: true })

  return (
    <section id="switching" className="border-y border-line bg-panel/40 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle kicker={t('switching.kicker')} title={t('switching.title')} sub={t('switching.sub')} />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid gap-4 md:grid-cols-3"
        >
          {cards.map((card) => (
            <motion.div key={card.to} variants={rise} whileHover={{ y: -6 }} className="min-w-0">
              <Link
                to={card.to}
                className="group relative flex h-full flex-col border border-line bg-panel p-6 transition-colors hover:border-accent"
              >
                <Corners />
                <p className="text-xs text-dim">
                  <span className="text-accent">{card.name}</span> → PoopRusteek
                </p>
                <p className="mt-4 flex-1 text-[13px] leading-6 text-soft">{card.body}</p>
                <p className="mt-5 text-xs text-accent-soft group-hover:text-accent">/vs{card.to.slice(3)} →</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.p variants={rise} initial="hidden" whileInView="show" viewport={viewportOnce} className="mt-8 text-sm">
          <Link to="/alternatives" className="text-accent-soft hover:text-accent">
            {t('switching.more')} →
          </Link>
        </motion.p>
      </div>
    </section>
  )
}
