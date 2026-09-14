import { motion } from 'motion/react'
import { rise, viewportOnce } from '../../lib/anim'

/** Kicker + heading + lede, the way every section on the site opens. */
export default function SectionTitle({
  kicker,
  title,
  sub,
  center = false,
}: {
  kicker: string
  title: string
  sub?: string
  center?: boolean
}) {
  return (
    <motion.div
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
    >
      <p className="text-xs tracking-[0.3em] text-dim uppercase">
        <span className="text-accent">──</span> {kicker}
        {center && <span className="text-accent"> ──</span>}
      </p>
      <h2 className="mt-3 text-2xl font-bold text-fg sm:text-4xl">{title}</h2>
      {sub && <p className="mt-4 text-sm leading-7 text-soft">{sub}</p>}
    </motion.div>
  )
}
