import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { rise, stagger, viewportOnce } from '../lib/anim'

// Labels live in src/i18n/locales/* (tech.stats), one entry per number.
const NUMBERS = ['1', '62k', '0', '5']

export default function TechStrip() {
  const { t } = useTranslation()
  const labels = t('tech.stats', { returnObjects: true })
  return (
    <section className="border-y border-line bg-panel/40 px-4 py-20">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto grid max-w-5xl gap-10 text-center sm:grid-cols-2 lg:grid-cols-4"
      >
        {NUMBERS.map((n, i) => (
          <motion.div key={n} variants={rise}>
            <p className="text-5xl font-bold text-accent">{n}</p>
            <p className="mx-auto mt-3 max-w-[16rem] text-xs leading-5 text-dim">
              {labels[i]}
            </p>
          </motion.div>
        ))}
      </motion.div>
      <motion.p
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-14 text-center text-xs text-dim"
      >
        {t('tech.meta')} ·{' '}
        <span className="text-soft">{t('tech.metaTail')}</span>
      </motion.p>
    </section>
  )
}
