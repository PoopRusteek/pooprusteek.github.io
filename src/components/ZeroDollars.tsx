import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useReducedMotionSafe } from '../lib/use-hydrated'
import { useTranslation } from 'react-i18next'
import { rise, stagger, viewportOnce } from '../lib/anim'

export default function ZeroDollars() {
  const { t } = useTranslation()
  const ledger = t('zero.ledger', { returnObjects: true })
  return (
    <section id="free" className="border-y border-line bg-panel/40 px-4 py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="min-w-0"
        >
          <p className="text-xs tracking-[0.3em] text-dim uppercase">
            {t('zero.kicker')}
          </p>
          <p className="mt-4 text-7xl font-bold text-ok sm:text-8xl lg:text-9xl">
            $0<span className="text-5xl text-ok/60 sm:text-6xl">.00</span>
          </p>
          <p className="mt-4 text-sm leading-7 text-soft">
            {t('zero.blurb')}
          </p>
          <PowTicker />
        </motion.div>

        <motion.dl
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="min-w-0 divide-y divide-line border border-line bg-panel-deep"
        >
          {ledger.map((row) => (
            <motion.div
              key={row.k}
              variants={rise}
              className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 p-5 sm:grid-cols-[9rem_minmax(0,1fr)]"
            >
              <dt className="text-sm font-bold text-accent-soft">{row.k}</dt>
              <dd className="min-w-0 text-sm leading-6 wrap-break-word text-dim">{row.v}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}

// Fake-but-honest PoW readout: cycles hex nonces like the real solver does.
function PowTicker() {
  const { t } = useTranslation()
  const reduced = useReducedMotionSafe()
  const [nonce, setNonce] = useState(48213)
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(
      () => setNonce((n) => n + 1 + Math.floor(Math.random() * 97)),
      120,
    )
    return () => clearInterval(id)
  }, [reduced])
  const hash = (nonce * 2654435761 % 0xffffff).toString(16).padStart(6, '0')
  return (
    <p className="mt-8 truncate rounded border border-line bg-ink px-4 py-3 text-xs text-dim">
      <span className="text-warn">pow</span> sha3(nonce={nonce}) →{' '}
      <span className="text-accent-soft">000{hash}…</span>{' '}
      <span className="text-ok">{t('zero.powSolved')}</span>
    </p>
  )
}
