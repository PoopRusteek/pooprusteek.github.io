import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { rise, viewportOnce } from '../../lib/anim'

/** A titled block on a sub-page. `tone="panel"` gives it the tinted band
 *  that separates it from its neighbours. */
export default function PageSection({
  id,
  kicker,
  title,
  lede,
  tone = 'plain',
  children,
}: {
  id?: string
  kicker?: string
  title: string
  lede?: string
  tone?: 'plain' | 'panel'
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={`px-4 py-20 ${tone === 'panel' ? 'border-y border-line bg-panel/40' : ''}`}
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-3xl"
        >
          {kicker && (
            <p className="text-xs tracking-[0.3em] text-dim uppercase">
              <span className="text-accent">──</span> {kicker}
            </p>
          )}
          <h2 className="mt-3 text-xl font-bold text-fg sm:text-3xl">{title}</h2>
          {lede && <p className="mt-4 text-sm leading-7 text-soft">{lede}</p>}
        </motion.div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}
