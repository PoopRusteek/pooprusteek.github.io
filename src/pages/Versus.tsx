import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import DownloadCTA from '../components/DownloadCTA'
import Ledger from '../components/ui/Ledger'
import Link from '../components/ui/Link'
import PageHero from '../components/ui/PageHero'
import PageSection from '../components/ui/PageSection'
import FitList from '../components/ui/FitList'
import { rise, stagger } from '../lib/anim'

export type VersusId = 'claudeCode' | 'codex' | 'geminiCli'

const SLUG: Record<VersusId, string> = {
  claudeCode: 'claude-code',
  codex: 'codex',
  geminiCli: 'gemini-cli',
}

/**
 * One head-to-head page, three competitors. All copy lives under
 * `vs.<id>` in the locales with the same shape, so adding a fourth is a
 * locale block, a route and a line in App.tsx.
 */
export default function Versus({ id }: { id: VersusId }) {
  const { t } = useTranslation()
  const v = t(`vs.${id}`, { returnObjects: true })
  const { name, vendor, rows } = v
  const others = (Object.keys(SLUG) as VersusId[]).filter((other) => other !== id)

  return (
    <main>
      <PageHero command={`/vs ${SLUG[id]}`} title={v.title} lede={v.lede}>
        <motion.ul
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-3 md:grid-cols-3"
        >
          {v.tldr.map((line) => (
            <motion.li
              key={line}
              variants={rise}
              className="min-w-0 border border-line bg-panel px-4 py-3 text-[13px] leading-6 text-soft"
            >
              {line}
            </motion.li>
          ))}
        </motion.ul>
      </PageHero>

      <PageSection kicker={t('vs.common.table')} title={`PoopRusteek · ${name}`}>
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[40rem] border-collapse text-left text-xs">
            <thead className="bg-panel text-[11px] tracking-widest text-dim uppercase">
              <tr>
                <th scope="col" className="border-b border-line px-4 py-3 font-normal">
                  {t('vs.common.feature')}
                </th>
                <th scope="col" className="border-b border-line px-4 py-3 font-normal text-accent-soft">
                  PoopRusteek
                </th>
                <th scope="col" className="border-b border-line px-4 py-3 font-normal">
                  {name}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.k} className="border-b border-line bg-panel-deep align-top last:border-b-0">
                  <th scope="row" className="px-4 py-4 text-sm font-bold text-fg">{row.k}</th>
                  <td className="bg-accent/5 px-4 py-4 leading-6 text-soft">{row.us}</td>
                  <td className="px-4 py-4 leading-6 text-dim">{row.them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection tone="panel" kicker={t('vs.common.same')} title={t('vs.common.sameTitle')}>
        <ul className="grid gap-3 md:grid-cols-2">
          {v.same.map((item) => (
            <li key={item} className="flex min-w-0 gap-3 border border-line bg-panel-deep p-4 text-[13px] leading-6 text-soft">
              <span className="shrink-0 text-ok">⇄</span>
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection kicker={t('vs.common.diff')} title={t('vs.common.diffTitle')}>
        <Ledger rows={v.diff} />
      </PageSection>

      <PageSection tone="panel" kicker={t('vs.common.choose')} title={t('vs.common.chooseTitle')}>
        <div className="grid gap-4 lg:grid-cols-2">
          <FitList tone="ok" title={t('vs.common.pickUs')} items={v.pickUs} />
          <FitList
            tone="err"
            title={t('vs.common.pickThem', { name })}
            items={v.pickThem}
          />
        </div>
      </PageSection>

      <PageSection kicker={t('vs.common.switch')} title={t('vs.common.switchTitle')}>
        <ol className="grid gap-4 md:grid-cols-3">
          {v.steps.map((step, i) => (
            <li key={step} className="min-w-0 border border-line bg-panel p-5">
              <p className="text-xs text-accent">{`0${i + 1}`}</p>
              <p className="mt-2 text-[13px] leading-6 text-soft">{step}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <DownloadCTA />
        </div>
      </PageSection>

      <section className="border-t border-line px-4 py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 text-xs leading-6 text-dim">
          <p>
            <span className="text-soft">{t('vs.common.sources')}:</span>{' '}
            {v.sources.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ' · '}
                <a href={s.url} target="_blank" rel="noreferrer" className="text-accent-soft hover:text-accent">
                  {s.label}
                </a>
              </span>
            ))}
          </p>
          <p>{t('vs.common.disclaimer', { name, vendor })}</p>
          <p className="flex flex-wrap gap-x-4 gap-y-2">
            {others.map((other) => (
              <Link key={other} to={`/vs/${SLUG[other]}`} className="text-accent-soft hover:text-accent">
                {t(`vs.${other}`, { returnObjects: true }).title} →
              </Link>
            ))}
            <Link to="/alternatives" className="text-accent-soft hover:text-accent">
              /alternatives →
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
