import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type Seg = { t: string; c?: string }
type Line = { segs: Seg[]; typed?: boolean; pause?: number }

const C = {
  dim: 'text-dim',
  soft: 'text-soft',
  accent: 'text-accent',
  softBlue: 'text-accent-soft',
  ok: 'text-ok',
  warn: 'text-warn',
  err: 'text-err',
}

// A believable pooprusteek session: RAG indexes locally, /goal is armed,
// the worker edits a file (checkpointed), the evaluator signs off. Status
// labels, tool names and badges are the real ones from the TUI.
const SCRIPT: Line[] = [
  { segs: [{ t: '❯ ', c: C.ok }, { t: 'pooprusteek', c: C.softBlue }], typed: true, pause: 420 },
  { segs: [{ t: '  POOPRUSTEEK', c: C.accent }], pause: 110 },
  { segs: [{ t: '  Terminal coding agent · powered by DeepSeek web', c: C.dim }], pause: 420 },
  { segs: [{ t: '  [rag] ', c: C.softBlue }, { t: 'skills 14 · mcp tools 31 · history 4 210 chunks — local', c: C.dim }], pause: 700 },
  { segs: [{ t: ' ' }], pause: 60 },
  { segs: [{ t: '❯ ', c: C.ok }, { t: '/goal ', c: C.accent }, { t: 'make the failing tests pass', c: undefined }], typed: true, pause: 420 },
  { segs: [{ t: '  [GOAL ON]', c: C.warn }, { t: ' worker + evaluator armed', c: C.dim }], pause: 620 },
  { segs: [{ t: '  ~ skill match', c: C.softBlue }, { t: ' rust-testing (0.91) — loaded, +0 tokens idle', c: C.dim }], pause: 780 },
  { segs: [{ t: '  pooprusteek[deepseek-chat]', c: C.accent }, { t: ' bash · cargo test — 2 failed', c: C.soft }], pause: 720 },
  { segs: [{ t: '  ✗ parser::multiline', c: C.err }, { t: ' → edit src/parser.rs  ', c: C.soft }, { t: '+12 ', c: C.ok }, { t: '-4', c: C.err }], pause: 700 },
  { segs: [{ t: '  ⧉ checkpoint saved', c: C.dim }, { t: ' — /undo brings the file back', c: C.dim }], pause: 700 },
  { segs: [{ t: '  [GOAL iter#1]', c: C.warn }, { t: ' re-running suite…', c: C.dim }], pause: 760 },
  { segs: [{ t: '  [EVALUATING]', c: C.softBlue }, { t: ' evaluator reviews the diff', c: C.dim }], pause: 860 },
  { segs: [{ t: '  ✓ 34 passed · 0 failed', c: C.ok }], pause: 460 },
  { segs: [{ t: '  [GOAL DONE]', c: C.ok }, { t: ' · 4 231 tok · 38 t/s · $0.00', c: C.dim }], pause: 3600 },
]

const TYPE_MS = 46
const LINE_MS = 260
const RESTART_MS = 1600

export default function TerminalDemo() {
  const reduced = useReducedMotion()
  const [lineCount, setLineCount] = useState(reduced ? SCRIPT.length : 0)
  const [charCount, setCharCount] = useState(0)
  const timer = useRef<number>(undefined)

  useEffect(() => {
    if (reduced) return
    const line = SCRIPT[lineCount]

    if (!line) {
      timer.current = window.setTimeout(() => {
        setLineCount(0)
        setCharCount(0)
      }, RESTART_MS)
      return () => clearTimeout(timer.current)
    }

    const full = line.segs.map((s) => s.t).join('')
    if (line.typed && charCount < full.length) {
      timer.current = window.setTimeout(
        () => setCharCount((c) => c + 1),
        TYPE_MS,
      )
    } else {
      timer.current = window.setTimeout(() => {
        setLineCount((l) => l + 1)
        setCharCount(0)
      }, line.pause ?? LINE_MS)
    }
    return () => clearTimeout(timer.current)
  }, [lineCount, charCount, reduced])

  const renderLine = (line: Line, idx: number) => {
    const isLast = idx === lineCount
    let budget = isLast && line.typed ? charCount : Infinity
    return (
      <div key={idx} className="min-h-[1.5em] whitespace-pre-wrap break-words">
        {line.segs.map((seg, si) => {
          if (budget <= 0) return null
          const text = seg.t.slice(0, budget)
          budget -= seg.t.length
          return (
            <span key={si} className={seg.c}>
              {text}
            </span>
          )
        })}
        {isLast && (
          <span className="animate-blink bg-accent-soft text-accent-soft">
            ▊
          </span>
        )}
      </div>
    )
  }

  const visible = SCRIPT.slice(0, Math.min(lineCount + 1, SCRIPT.length))

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-line bg-panel-deep shadow-[0_24px_80px_-24px_rgba(96,165,250,0.25)]"
    >
      <div className="flex items-center gap-2 border-b border-line bg-panel px-4 py-2.5">
        <span className="size-3 rounded-full bg-err/80" />
        <span className="size-3 rounded-full bg-warn/80" />
        <span className="size-3 rounded-full bg-ok/80" />
        <span className="ml-3 truncate text-xs text-dim">
          PoopRusteek 🧻 — ~/dev/that-one-project
        </span>
      </div>
      <div className="h-[23rem] overflow-hidden p-4 text-left text-[11px] leading-5 sm:h-[25rem] sm:text-sm sm:leading-6">
        {visible.map(renderLine)}
      </div>
      <div className="relative flex items-center justify-between gap-2 border-t border-line bg-panel px-4 py-1.5 text-[11px] text-dim">
        <span className="truncate">
          deepseek · deepseek-chat{' '}
          <span className="text-warn">[GOAL:tests]</span> chats:3 agents:1
          mcp:2/3
        </span>
        <span className="shrink-0 text-accent">
          <Spinner /> streaming
        </span>
      </div>
    </motion.div>
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
