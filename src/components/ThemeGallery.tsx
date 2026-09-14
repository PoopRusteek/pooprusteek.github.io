import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import SectionTitle from './ui/SectionTitle'
import { rise, stagger, viewportOnce } from '../lib/anim'
import { setTheme, useTheme } from '../lib/theme-store'
import { THEMES, type ThemePreset } from '../lib/themes'

/**
 * `/themes` on a web page: ten real presets from src/tui/theme.rs, each
 * previewed in its own palette. Clicking one repaints this entire site,
 * because the CSS tokens the page is built on are the TUI's color roles.
 */
export default function ThemeGallery() {
  const { t } = useTranslation()
  const active = useTheme()

  return (
    <section id="themes" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          kicker={t('themes.kicker')}
          title={t('themes.title')}
          sub={t('themes.sub')}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {THEMES.map((preset) => (
            <motion.button
              key={preset.name}
              variants={rise}
              whileHover={{ y: -4 }}
              onClick={() => setTheme(preset.name)}
              aria-pressed={preset.name === active.name}
              className={`group min-w-0 overflow-hidden border text-left transition-colors ${
                preset.name === active.name
                  ? 'border-accent'
                  : 'border-line hover:border-accent'
              }`}
            >
              <Preview preset={preset} />
              <div className="flex items-baseline gap-2 bg-panel px-4 py-3">
                <span className="min-w-0 truncate text-sm font-bold text-fg">
                  {preset.label}
                </span>
                <span className="ml-auto shrink-0 text-[11px] text-dim">
                  {preset.name === active.name ? (
                    <span className="text-ok">✓ active</span>
                  ) : (
                    `/themes ${preset.name}`
                  )}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.p
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-8 text-sm leading-7 text-dim"
        >
          {t('themes.note')}
        </motion.p>
      </div>
    </section>
  )
}

/** A three-line TUI in the preset's own colors — never the active theme's. */
function Preview({ preset }: { preset: ThemePreset }) {
  const c = preset.colors
  return (
    <div
      className="min-w-0 px-4 py-4 text-[11px] leading-5"
      style={{ background: c.bg, color: c.text_dim }}
    >
      <div
        className="flex items-center gap-2 border-b pb-2"
        style={{ borderColor: c.border }}
      >
        <span style={{ color: c.accent }}>POOPRUSTEEK</span>
        <span className="ml-auto truncate" style={{ color: c.text_dim }}>
          {preset.description}
        </span>
      </div>
      <p className="mt-2 truncate">
        <span style={{ color: c.success }}>❯ </span>
        <span style={{ color: c.fg }}>/goal ship the landing</span>
      </p>
      <p className="truncate">
        <span style={{ color: c.warning }}>[GOAL iter#1]</span>{' '}
        <span style={{ color: c.text_soft }}>worker + evaluator</span>
      </p>
      <p className="truncate">
        <span style={{ color: c.error }}>✗ 2 failed</span>{' '}
        <span style={{ color: c.accent_soft }}>→ edit src/parser.rs</span>
      </p>
      <p className="truncate">
        <span style={{ color: c.success }}>[GOAL DONE]</span>{' '}
        <span style={{ color: c.text_dim }}>· 38 t/s · $0.00</span>
      </p>
    </div>
  )
}
