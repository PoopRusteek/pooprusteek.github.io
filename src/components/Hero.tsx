import { motion } from 'motion/react'
import { Trans, useTranslation } from 'react-i18next'
import Logo from './Logo'
import TerminalDemo from './TerminalDemo'
import DownloadCTA from './DownloadCTA'

export default function Hero() {
  const { t } = useTranslation()
  return (
    <header className="grid-bg relative overflow-hidden px-4 pt-24 pb-20 sm:pt-32">
      {/* soft accent glow behind the logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-[32rem] w-[54rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 rounded-full border border-line bg-panel px-4 py-1.5 text-xs text-soft"
        >
          <span className="text-ok">●</span> {t('hero.pill')}
        </motion.p>

        <Logo className="text-4xl max-[350px]:text-3xl sm:text-6xl lg:text-7xl" />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 text-sm tracking-wide text-soft sm:text-base"
        >
          {t('hero.tagline')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-4 max-w-2xl text-sm leading-7 text-dim sm:text-base"
        >
          <Trans
            i18nKey="hero.desc"
            components={{ goal: <span className="text-warn" /> }}
          />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 mb-16 flex w-full justify-center"
        >
          <DownloadCTA />
        </motion.div>

        <TerminalDemo />
      </div>
    </header>
  )
}
