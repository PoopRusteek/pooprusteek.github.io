import { useTranslation } from 'react-i18next'
import DownloadCTA from '../components/DownloadCTA'
import Link from '../components/ui/Link'
import PageHero from '../components/ui/PageHero'
import { GITHUB_URL } from '../lib/anim'

/**
 * Plain <details> on purpose: the answers are in the HTML whether or not
 * they are expanded, work without JavaScript, and match the FAQPage JSON-LD
 * that scripts/prerender.ts builds from the same locale entries.
 */
export default function Faq() {
  const { t } = useTranslation()
  const items = t('faq.items', { returnObjects: true })

  return (
    <main>
      <PageHero command="/faq" title={t('faq.title')} lede={t('faq.lede')} />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl divide-y divide-line border border-line bg-panel-deep">
          {items.map((item, i) => (
            <details key={item.q} className="group" open={i < 3}>
              <summary className="flex cursor-pointer list-none items-baseline gap-3 px-5 py-4 text-sm font-bold text-fg transition-colors hover:bg-sel [&::-webkit-details-marker]:hidden">
                <span className="shrink-0 text-accent transition-transform group-open:rotate-90">›</span>
                <h2 className="min-w-0">{item.q}</h2>
              </summary>
              <p className="px-5 pb-5 pl-11 text-[13px] leading-7 text-soft">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl flex-col items-start gap-4">
          <h2 className="text-xl font-bold text-fg">{t('faq.more')}</h2>
          <p className="text-sm leading-7 text-dim">
            {t('faq.moreBody')}{' '}
            <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noreferrer" className="text-accent-soft hover:text-accent">
              GitHub issues
            </a>{' '}
            · <Link to="/alternatives" className="text-accent-soft hover:text-accent">/alternatives</Link>
          </p>
          <DownloadCTA />
        </div>
      </section>
    </main>
  )
}
