import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react'
import { useRelease } from '../lib/use-release'
import { versionLabel } from '../lib/release'

// The TUI keeps its status bar at the bottom — so does the landing.
// Scroll progress doubles as a fake context meter.
export default function StatusBar() {
  const { scrollYProgress } = useScroll()
  const { recommended } = useRelease()
  const [pct, setPct] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) =>
    setPct(Math.round(v * 100)),
  )

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-panel/95 backdrop-blur">
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="h-px origin-left bg-accent"
      />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-[11px] text-dim">
        <span className="truncate">
          <span className="text-accent-soft">deepseek</span> · deepseek-chat
          <span className="hidden sm:inline">
            {' '}
            <span className="text-warn">[GOAL:ship-landing]</span> mcp:2/3
            agents:1 chats:3 · {versionLabel(recommended)}
          </span>
        </span>
        <span className="shrink-0">
          ctx:{pct}% · <Spinner /> <span className="text-accent">[streaming]</span>
        </span>
      </div>
    </div>
  )
}

function Spinner() {
  const FRAMES = ['|', '/', '-', '\\']
  const [i, setI] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setI((v) => (v + 1) % 4), 140)
    return () => clearInterval(id)
  }, [reduced])
  return <span className="inline-block w-[1ch]">{FRAMES[i]}</span>
}
