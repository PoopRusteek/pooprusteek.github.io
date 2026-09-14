import { motion } from 'motion/react'
import { rise, staggerTight, viewportOnce } from '../../lib/anim'

/** term → definition rows in a bordered panel; the site's default way of
 *  explaining a list of named things. Stacks to one column on phones. */
export default function Ledger({
  rows,
  wide = false,
}: {
  rows: Array<{ k: string; v: string }>
  /** wider term column, for `config.toml`-shaped keys */
  wide?: boolean
}) {
  return (
    <motion.dl
      variants={staggerTight}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="divide-y divide-line border border-line bg-panel-deep"
    >
      {rows.map((row) => (
        <motion.div
          key={row.k}
          variants={rise}
          className={`grid gap-1 p-5 sm:gap-4 ${
            wide
              ? 'sm:grid-cols-[14rem_minmax(0,1fr)]'
              : 'sm:grid-cols-[11rem_minmax(0,1fr)]'
          }`}
        >
          <dt className="min-w-0 text-sm font-bold wrap-break-word text-accent-soft">
            {row.k}
          </dt>
          <dd className="min-w-0 text-[13px] leading-6 wrap-break-word text-dim">
            {row.v}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  )
}
