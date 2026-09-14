import type { ReactNode } from 'react'
import { motion } from 'motion/react'

/** Every sub-page opens like a command being run: the slash command that
 *  does the same thing in the TUI, then the answer. */
export default function PageHero({
  command,
  title,
  lede,
  children,
}: {
  command: string
  title: string
  lede: string
  children?: ReactNode
}) {
  return (
    <header className="grid-bg relative overflow-hidden border-b border-line px-4 pt-28 pb-16 sm:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-[24rem] w-[48rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-5xl"
      >
        <p className="text-sm">
          <span className="text-ok">❯ </span>
          <span className="text-accent">{command}</span>
          <span className="animate-blink text-accent-soft">▊</span>
        </p>
        <h1 className="mt-5 text-3xl font-bold text-fg sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-soft sm:text-base">
          {lede}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </motion.div>
    </header>
  )
}
