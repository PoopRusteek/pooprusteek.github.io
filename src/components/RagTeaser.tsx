import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import Link from './ui/Link'
import SectionTitle from './ui/SectionTitle'
import { rise, stagger, viewportOnce } from '../lib/anim'

/** The offline retrieval layer, on the front page: two scorers, one fusion,
 *  three corpora. The numbers are the repo's own eval results. */
export default function RagTeaser() {
  const { t } = useTranslation()
  const corpora = t('rag.teaser.corpora', { returnObjects: true })
  const stats = t('rag.teaser.stats', { returnObjects: true })

  return (
    <section id="rag" className="border-y border-line bg-panel/40 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          kicker={t('rag.teaser.kicker')}
          title={t('rag.teaser.title')}
          sub={t('rag.teaser.sub')}
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="min-w-0 border border-line bg-panel-deep p-5 sm:p-7"
          >
            <Pipeline />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-1"
          >
            {corpora.map((c) => (
              <motion.div
                key={c.k}
                variants={rise}
                className="min-w-0 border border-line bg-panel p-5"
              >
                <p className="text-xs text-accent">{c.k}</p>
                <p className="mt-2 text-[13px] leading-6 text-dim">{c.v}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.k}
              variants={rise}
              className="min-w-0 border border-line bg-panel px-5 py-4"
            >
              <p className="text-2xl font-bold text-accent">{s.k}</p>
              <p className="mt-1 text-xs leading-5 text-dim">{s.v}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-8 text-sm text-dim"
        >
          <Link to="/rag" className="text-accent-soft hover:text-accent">
            {t('rag.teaser.more')} →
          </Link>
        </motion.p>
      </div>
    </section>
  )
}

/** ASCII-ish data flow: prompt → two scorers → RRF → hint. */
function Pipeline() {
  const { t } = useTranslation()
  const labels = t('rag.teaser.pipeline', { returnObjects: true })
  return (
    <div className="min-w-0 text-xs leading-6">
      <p className="text-[10px] tracking-[0.2em] text-dim uppercase">
        {t('rag.teaser.pipelineKicker')}
      </p>

      <div className="mt-5 grid gap-3">
        <Row glyph="❯" tone="text-ok" label={labels[0]} value="how do I ship a release?" />
        <Branch />
        <Row
          glyph="▚"
          tone="text-accent-soft"
          label={labels[1]}
          value="e5-small · ONNX · 384-dim · quantized"
        />
        <Row
          glyph="▚"
          tone="text-accent-soft"
          label={labels[2]}
          value="Snowball TF-IDF · ru + en stems"
        />
        <Branch />
        <Row glyph="⊕" tone="text-warn" label={labels[3]} value="reciprocal rank fusion" />
        <Branch />
        <Row
          glyph="✓"
          tone="text-ok"
          label={labels[4]}
          value="skill: releasing (0.93) → loaded on demand"
        />
      </div>

      <p className="mt-6 border-t border-line pt-4 text-[13px] leading-6 text-dim">
        {t('rag.teaser.note')}
      </p>
    </div>
  )
}

function Row({
  glyph,
  tone,
  label,
  value,
}: {
  glyph: string
  tone: string
  label: string
  value: string
}) {
  return (
    <div className="grid min-w-0 grid-cols-[1.25rem_minmax(0,7.5rem)_minmax(0,1fr)] items-baseline gap-2">
      <span className={`${tone}`}>{glyph}</span>
      <span className="min-w-0 truncate text-soft">{label}</span>
      <span className="min-w-0 truncate text-dim">{value}</span>
    </div>
  )
}

function Branch() {
  return (
    <div aria-hidden className="pl-[0.35rem] text-line">
      │
    </div>
  )
}
