import { motion } from 'motion/react'
import { useTheme } from '../lib/theme-store'

// Replicates the TUI landing logo: every letter of POOPRUSTEEK pulses
// through accent_soft → accent → success in a staggered wave; the first,
// middle and last letters are additionally underlined (see tui/landing.rs).
// The three colors come from the active preset, so the wave is whatever the
// chosen theme would show in the terminal.
const WORD = 'POOPRUSTEEK'
const UNDERLINED = new Set([0, Math.floor(WORD.length / 2), WORD.length - 1])

export default function Logo({ className = '' }: { className?: string }) {
  const { colors } = useTheme()
  const wave = [
    colors.accent_soft,
    colors.accent,
    colors.success,
    colors.accent,
    colors.accent_soft,
  ]
  return (
    <div
      role="img"
      className={`font-bold tracking-[0.08em] whitespace-nowrap select-none ${className}`}
      aria-label="PoopRusteek"
    >
      {WORD.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={
            UNDERLINED.has(i)
              ? 'underline decoration-2 underline-offset-8'
              : undefined
          }
          animate={{ color: wave }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.13,
          }}
        >
          {ch}
        </motion.span>
      ))}
    </div>
  )
}
