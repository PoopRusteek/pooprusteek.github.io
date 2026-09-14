import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { setTheme, useTheme } from '../lib/theme-store'
import { THEMES, type ThemePreset } from '../lib/themes'

/**
 * The agent's `/themes` gallery, in the nav bar. Picking one repaints the
 * whole page — the palettes are the real ones from src/tui/theme.rs, so
 * what you see here is what the TUI looks like.
 */
export default function ThemePicker() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={t('nav.themes')}
        className="flex items-center gap-2 rounded border border-line px-2 py-1 text-xs text-dim transition-colors hover:border-accent hover:text-accent-soft"
      >
        <Swatch theme={theme} />
        <span className="hidden md:inline">{theme.label}</span>
        <span aria-hidden className="text-[10px]">▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-50 mt-2 max-h-[70vh] w-64 overflow-y-auto border border-line bg-panel-deep py-1 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
          >
            <li className="px-3 py-2 text-[10px] tracking-[0.2em] text-dim uppercase">
              /themes
            </li>
            {THEMES.map((preset) => {
              const active = preset.name === theme.name
              return (
                <li key={preset.name}>
                  <button
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setTheme(preset.name)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-xs transition-colors ${
                      active ? 'bg-sel text-accent-soft' : 'text-soft hover:bg-sel'
                    }`}
                  >
                    <Swatch theme={preset} />
                    <span className="min-w-0 flex-1 truncate">{preset.label}</span>
                    {active && <span className="shrink-0 text-ok">✓</span>}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Three bars of a preset's real palette — bg, accent, success. */
function Swatch({ theme }: { theme: ThemePreset }) {
  return (
    <span
      aria-hidden
      className="flex h-3.5 w-8 shrink-0 overflow-hidden rounded-[2px] border border-line"
    >
      <span className="flex-1" style={{ background: theme.colors.bg }} />
      <span className="flex-1" style={{ background: theme.colors.accent }} />
      <span className="flex-1" style={{ background: theme.colors.success }} />
    </span>
  )
}
