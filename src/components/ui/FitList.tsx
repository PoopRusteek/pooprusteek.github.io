import { motion } from 'motion/react'
import { rise, viewportOnce } from '../../lib/anim'

/** A ✓ or ✗ list — "choose this if" / "look elsewhere if". */
export default function FitList({
  tone,
  title,
  items,
}: {
  tone: 'ok' | 'err'
  title: string
  items: string[]
}) {
  return (
    <motion.div
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="min-w-0 border border-line bg-panel-deep p-6"
    >
      <p className={`text-xs tracking-[0.2em] uppercase ${tone === 'ok' ? 'text-ok' : 'text-err'}`}>
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[13px] leading-6 text-soft">
            <span className={`shrink-0 ${tone === 'ok' ? 'text-ok' : 'text-err'}`}>
              {tone === 'ok' ? '✓' : '✗'}
            </span>
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
