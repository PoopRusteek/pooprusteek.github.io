import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../lib/theme-store'
import SectionTitle from './ui/SectionTitle'

// The real status labels the TUI cycles through in GOAL mode — verbatim in
// every language. The explanatory log lines live in src/i18n/locales/*
// (goal.logs), one entry per state, same order.
const STATES = [
  { badge: '[GOAL ON]', cls: 'text-warn border-warn/40 bg-warn/10', hold: 1500 },
  { badge: '[WAITING FOR GOAL]', cls: 'text-warn border-warn/40 bg-warn/10', hold: 1500 },
  { badge: '[GOAL iter#1]', cls: 'text-accent-soft border-accent/40 bg-accent/10', hold: 1700 },
  { badge: '[EVALUATING]', cls: 'text-accent border-accent/40 bg-accent/10', hold: 1700 },
  { badge: '[GOAL iter#2]', cls: 'text-accent-soft border-accent/40 bg-accent/10', hold: 1700 },
  { badge: '[EVALUATING]', cls: 'text-accent border-accent/40 bg-accent/10', hold: 1700 },
  { badge: '[GOAL DONE]', cls: 'text-ok border-ok/40 bg-ok/10', hold: 3600 },
]

export default function GoalLoop() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const logs = t('goal.logs', { returnObjects: true })
  const reduced = useReducedMotion()
  const [i, setI] = useState(reduced ? STATES.length - 1 : 0)

  useEffect(() => {
    if (reduced) return
    const id = window.setTimeout(
      () => setI((v) => (v + 1) % STATES.length),
      STATES[i].hold,
    )
    return () => clearTimeout(id)
  }, [i, reduced])

  const s = STATES[i]

  return (
    <section id="goal" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          kicker={t('goal.kicker')}
          title={t('goal.title')}
          sub={t('goal.sub')}
        />

        <div className="mt-14 flex flex-col items-center gap-8">
          <div className="flex h-20 items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={`${i}-${s.badge}`}
                initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
                transition={{ duration: 0.3 }}
                className={`rounded border px-6 py-3 text-xl font-bold sm:text-3xl ${s.cls}`}
              >
                {s.badge}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex h-6 items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-center text-sm text-dim"
              >
                {logs[i]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex gap-2" aria-hidden>
            {STATES.map((_, d) => (
              <motion.span
                key={d}
                animate={{
                  backgroundColor: d === i ? colors.accent : colors.border,
                  scale: d === i ? 1.3 : 1,
                }}
                transition={{ duration: 0.25 }}
                className="size-2 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
