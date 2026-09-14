import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import DownloadCTA from '../components/DownloadCTA'
import Link from '../components/ui/Link'
import PageHero from '../components/ui/PageHero'
import PageSection from '../components/ui/PageSection'
import FitList from '../components/ui/FitList'
import { rise, stagger, viewportOnce } from '../lib/anim'

const VERSUS = [
  { to: '/vs/claude-code', id: 'claudeCode' },
  { to: '/vs/codex', id: 'codex' },
  { to: '/vs/gemini-cli', id: 'geminiCli' },
] as const

/**
 * The page for "Claude Code alternative"-shaped searches: every serious
 * terminal agent in one table, then a fit guide that says when *not* to use
 * PoopRusteek. Competitor facts live in the locales with a checked date and
 * links — keep them sourced, never guessed.
 */
export default function Alternatives() {
  const { t } = useTranslation()
  const rows = t('alt.table.rows', { returnObjects: true })
  const cols = t('alt.table.cols', { returnObjects: true })

  return (
    <main>
      <PageHero command="/alternatives" title={t('alt.title')} lede={t('alt.lede')}>
        <p className="max-w-2xl border-l-2 border-line pl-4 text-xs leading-6 text-dim">
          {t('alt.checked')}
        </p>
      </PageHero>

      <PageSection
        kicker={t('alt.table.kicker')}
        title={t('alt.table.title')}
        lede={t('alt.table.lede')}
      >
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[56rem] border-collapse text-left text-xs">
            <thead className="bg-panel text-[11px] tracking-widest text-dim uppercase">
              <tr>
                {(['tool', 'licence', 'cost', 'models', 'runs'] as const).map((c) => (
                  <th key={c} scope="col" className="border-b border-line px-4 py-3 font-normal">
                    {cols[c]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.tool}
                  className={`border-b border-line align-top last:border-b-0 ${
                    i === 0 ? 'bg-accent/10' : 'bg-panel-deep'
                  }`}
                >
                  <th scope="row" className={`px-4 py-4 text-sm font-bold ${i === 0 ? 'text-accent-soft' : 'text-fg'}`}>
                    {row.tool}
                  </th>
                  <td className="px-4 py-4 text-soft">{row.licence}</td>
                  <td className="px-4 py-4 leading-6 text-dim">{row.cost}</td>
                  <td className="px-4 py-4 leading-6 text-dim">{row.models}</td>
                  <td className="px-4 py-4 leading-6 text-dim">{row.runs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection
        tone="panel"
        kicker={t('alt.fit.kicker')}
        title={t('alt.fit.title')}
        lede={t('alt.fit.lede')}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <FitList tone="ok" title={t('alt.fit.yesTitle')} items={t('alt.fit.yes', { returnObjects: true })} />
          <FitList tone="err" title={t('alt.fit.noTitle')} items={t('alt.fit.no', { returnObjects: true })} />
        </div>
      </PageSection>

      <PageSection kicker={t('alt.deep.kicker')} title={t('alt.deep.title')}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-4 md:grid-cols-3"
        >
          {VERSUS.map((v) => (
            <motion.div key={v.to} variants={rise} className="min-w-0">
              <Link
                to={v.to}
                className="group flex h-full flex-col border border-line bg-panel p-6 transition-colors hover:border-accent"
              >
                <p className="text-xs text-accent">/vs{v.to.slice(3)}</p>
                <h3 className="mt-2 text-lg font-bold text-fg">{t(`vs.${v.id}`, { returnObjects: true }).title}</h3>
                <p className="mt-3 flex-1 text-[13px] leading-6 text-dim">{t(`vs.${v.id}`, { returnObjects: true }).tldr[0]}</p>
                <p className="mt-5 text-xs text-accent-soft group-hover:text-accent">
                  {t('alt.deep.read')} →
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </PageSection>

      <PageSection tone="panel" title={t('alt.cta.title')} lede={t('alt.cta.body')}>
        <DownloadCTA />
      </PageSection>
    </main>
  )
}
