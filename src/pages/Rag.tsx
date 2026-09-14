import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import CodeBlock from '../components/ui/CodeBlock'
import Ledger from '../components/ui/Ledger'
import Link from '../components/ui/Link'
import PageHero from '../components/ui/PageHero'
import PageSection from '../components/ui/PageSection'
import { rise, stagger, viewportOnce } from '../lib/anim'

/**
 * The local RAG layer explained end to end: two scorers, one fusion, three
 * corpora, and what happens when any of it is unavailable. Numbers here are
 * the repo's own (MRR eval harness, model size, config defaults) — don't
 * invent new ones.
 */
export default function Rag() {
  const { t } = useTranslation()

  return (
    <main>
      <PageHero command="/rag" title={t('rag.page.title')} lede={t('rag.page.lede')}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t('rag.page.stats', { returnObjects: true }).map((s) => (
            <div key={s.k} className="min-w-0 border border-line bg-panel px-4 py-3">
              <p className="text-xl font-bold text-accent">{s.k}</p>
              <p className="mt-1 text-[11px] leading-5 text-dim">{s.v}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <PageSection
        kicker={t('rag.page.pipeline.kicker')}
        title={t('rag.page.pipeline.title')}
        lede={t('rag.page.pipeline.lede')}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {t('rag.page.pipeline.stages', { returnObjects: true }).map((stage, i) => (
            <motion.div
              key={stage.k}
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="group relative min-w-0 border border-line bg-panel p-6"
            >
              <p className="text-xs text-dim">{`0${i + 1}`}</p>
              <h3 className="mt-2 text-base font-bold text-accent-soft">{stage.k}</h3>
              <p className="mt-3 text-[13px] leading-6 text-dim">{stage.v}</p>
            </motion.div>
          ))}
        </div>

        <CodeBlock className="mt-4" title="semantic/index.rs — the shape of a hit">
          <span className="text-dim">{'// dense + lexical, fused by reciprocal rank\n'}</span>
          <span className="text-accent-soft">{'skill'}</span>
          {'      releasing            '}
          <span className="text-ok">{'dense 0.93'}</span>
          {'  '}
          <span className="text-warn">{'kw 0.71'}</span>
          {'  → rrf 1\n'}
          <span className="text-accent-soft">{'mcp'}</span>
          {'        playwright.click     '}
          <span className="text-ok">{'dense 0.88'}</span>
          {'  '}
          <span className="text-warn">{'kw 0.55'}</span>
          {'  → rrf 2\n'}
          <span className="text-accent-soft">{'history'}</span>
          {'    2026-08-29 checkpoints  '}
          <span className="text-ok">{'dense 0.81'}</span>
          {'  '}
          <span className="text-warn">{'kw 0.64'}</span>
          {'  → rrf 3\n'}
        </CodeBlock>
      </PageSection>

      <PageSection
        tone="panel"
        kicker={t('rag.page.corpora.kicker')}
        title={t('rag.page.corpora.title')}
        lede={t('rag.page.corpora.lede')}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-4 lg:grid-cols-3"
        >
          {t('rag.page.corpora.items', { returnObjects: true }).map((item) => (
            <motion.article
              key={item.k}
              variants={rise}
              className="min-w-0 border border-line bg-panel-deep p-6"
            >
              <p className="text-xs text-accent">{item.cmd}</p>
              <h3 className="mt-2 text-base font-bold text-fg">{item.k}</h3>
              <p className="mt-3 text-[13px] leading-6 text-dim">{item.v}</p>
            </motion.article>
          ))}
        </motion.div>
      </PageSection>

      <PageSection
        kicker={t('rag.page.deferred.kicker')}
        title={t('rag.page.deferred.title')}
        lede={t('rag.page.deferred.lede')}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock title={t('rag.page.deferred.before')}>
            <span className="text-dim">
              {'tools: [\n'}
              {'  {"name":"playwright__browser_click",\n'}
              {'   "description":"Perform click on a web page…",\n'}
              {'   "inputSchema":{"type":"object","properties":{…}}},\n'}
              {'  {"name":"playwright__browser_type", …},\n'}
              {'  {"name":"playwright__browser_navigate", …},\n'}
              {'  … 22 more, every request, whether or not\n'}
              {'    this turn has anything to do with a browser\n'}
              {']'}
            </span>
          </CodeBlock>
          <CodeBlock title={t('rag.page.deferred.after')}>
            <span className="text-soft">{'mcp servers:\n'}</span>
            <span className="text-accent-soft">{'  playwright'}</span>
            <span className="text-dim">{' (25 tools)\n'}</span>
            <span className="text-accent-soft">{'  github'}</span>
            <span className="text-dim">{' (18 tools)\n\n'}</span>
            <span className="text-dim">{'// the turn mentions a browser →\n'}</span>
            <span className="text-ok">{'  + playwright__browser_click'}</span>
            <span className="text-dim">{' (full schema, inlined)\n'}</span>
            <span className="text-dim">{'// or the model asks for more:\n'}</span>
            <span className="text-warn">{'  tool_search("scrape a page")'}</span>
          </CodeBlock>
        </div>
        <p className="mt-6 text-[13px] leading-6 text-dim">
          {t('rag.page.deferred.note')}
        </p>
      </PageSection>

      <PageSection
        tone="panel"
        kicker={t('rag.page.history.kicker')}
        title={t('rag.page.history.title')}
        lede={t('rag.page.history.lede')}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <CodeBlock title="/search compaction">
            <span className="text-ok">{'❯ '}</span>
            <span className="text-accent">{'/search '}</span>
            {'how did we fix the PoW stall\n\n'}
            <span className="text-dim">{'  sort: relevance   role: any   unique: on\n\n'}</span>
            <span className="text-accent-soft">{'  1. 2026-08-29 · checkpoints'}</span>
            <span className="text-dim">{'   0.91\n'}</span>
            {'     "…the solver moved to a blocking thread so the\n'}
            {'      event loop never waits on SHA-3…"\n'}
            <span className="text-accent-soft">{'  2. 2026-08-14 · deepseek auth'}</span>
            <span className="text-dim">{'  0.78\n'}</span>
            <span className="text-dim">{'\n  ↵ opens that session   s sort   r role   u unique'}</span>
          </CodeBlock>
          <Ledger rows={t('rag.page.history.rows', { returnObjects: true })} />
        </div>
      </PageSection>

      <PageSection
        kicker={t('rag.page.control.kicker')}
        title={t('rag.page.control.title')}
        lede={t('rag.page.control.lede')}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Ledger rows={t('rag.page.control.rows', { returnObjects: true })} />
          <CodeBlock title="config.toml">
            <span className="text-accent">{'[semantic]\n'}</span>
            {'enabled '}
            <span className="text-dim">{'= '}</span>
            <span className="text-ok">{'true'}</span>
            <span className="text-dim">{'          # /rag on|off flips this\n'}</span>
            {'top_k '}
            <span className="text-dim">{'= '}</span>
            <span className="text-warn">{'3'}</span>
            <span className="text-dim">{'               # hints per corpus per turn\n'}</span>
            {'min_dense_score '}
            <span className="text-dim">{'= '}</span>
            <span className="text-warn">{'0.80'}</span>
            <span className="text-dim">{'  # cosine floor without keyword overlap\n'}</span>
            {'mcp_schemas '}
            <span className="text-dim">{'= '}</span>
            <span className="text-accent-soft">{'"auto"'}</span>
            <span className="text-dim">{'    # auto | full | deferred\n'}</span>
          </CodeBlock>
        </div>
      </PageSection>

      <PageSection
        tone="panel"
        kicker={t('rag.page.fallback.kicker')}
        title={t('rag.page.fallback.title')}
        lede={t('rag.page.fallback.lede')}
      >
        <Ledger rows={t('rag.page.fallback.rows', { returnObjects: true })} wide />
        <p className="mt-8 text-sm text-dim">
          <Link to="/architecture" className="text-accent-soft hover:text-accent">
            {t('rag.page.next')} →
          </Link>
        </p>
      </PageSection>
    </main>
  )
}
