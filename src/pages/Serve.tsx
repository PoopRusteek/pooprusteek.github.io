import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import CodeBlock from '../components/ui/CodeBlock'
import CopyLine from '../components/ui/CopyLine'
import Ledger from '../components/ui/Ledger'
import Link from '../components/ui/Link'
import PageHero from '../components/ui/PageHero'
import PageSection from '../components/ui/PageSection'
import { rise, stagger, viewportOnce } from '../lib/anim'

/**
 * `/serve` — the agent as a local OpenAI-compatible gateway. Everything
 * here mirrors src/server/: catalog routing, the two implemented endpoints,
 * loopback + bearer defaults, and the stateless-fork session strategy.
 */
export default function Serve() {
  const { t } = useTranslation()

  return (
    <main>
      <PageHero
        command="/serve on"
        title={t('serve.page.title')}
        lede={t('serve.page.lede')}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t('serve.page.stats', { returnObjects: true }).map((s) => (
            <div key={s.k} className="min-w-0 border border-line bg-panel px-4 py-3">
              <p className="truncate text-xl font-bold text-accent">{s.k}</p>
              <p className="mt-1 text-[11px] leading-5 text-dim">{s.v}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <PageSection
        kicker={t('serve.page.start.kicker')}
        title={t('serve.page.start.title')}
        lede={t('serve.page.start.lede')}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <CodeBlock title="pooprusteek">
            <span className="text-ok">{'❯ '}</span>
            <span className="text-accent">{'/serve on'}</span>
            {'\n'}
            <span className="text-soft">
              {'  API server listening on http://127.0.0.1:7667/v1\n'}
            </span>
            <span className="text-dim">
              {'  dialect openai · auth off (loopback) · backends: 4\n\n'}
            </span>
            <span className="text-ok">{'❯ '}</span>
            <span className="text-accent">{'/serve'}</span>
            {'\n'}
            <span className="text-dim">{'  running · 12 requests · 0 errors\n'}</span>
            <span className="text-dim">{'  models: deepseek-chat, deepseek-reasoner,\n'}</span>
            <span className="text-dim">{'          lmstudio/qwen2.5-coder, gemini/…\n'}</span>
          </CodeBlock>
          <div className="min-w-0">
            <Ledger rows={t('serve.page.start.rows', { returnObjects: true })} />
            <p className="mt-4 text-[13px] leading-6 text-dim">
              {t('serve.page.start.headless')}
            </p>
            <CopyLine className="mt-3" tone="accent" command="pooprusteek --proxy" />
          </div>
        </div>
      </PageSection>

      <PageSection
        tone="panel"
        kicker={t('serve.page.routing.kicker')}
        title={t('serve.page.routing.title')}
        lede={t('serve.page.routing.lede')}
      >
        <Ledger rows={t('serve.page.routing.rows', { returnObjects: true })} wide />
      </PageSection>

      <PageSection
        kicker={t('serve.page.clients.kicker')}
        title={t('serve.page.clients.title')}
        lede={t('serve.page.clients.lede')}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {t('serve.page.clients.items', { returnObjects: true }).map((item) => (
            <motion.article
              key={item.k}
              variants={rise}
              className="min-w-0 border border-line bg-panel p-6"
            >
              <h3 className="text-base font-bold text-fg">{item.k}</h3>
              <p className="mt-3 text-[13px] leading-6 text-dim">{item.v}</p>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <CodeBlock title="python — openai sdk">
            <span className="text-dim">{'from openai import OpenAI\n\n'}</span>
            {'client = OpenAI(\n'}
            {'    base_url='}
            <span className="text-accent-soft">{'"http://127.0.0.1:7667/v1"'}</span>
            {',\n'}
            {'    api_key='}
            <span className="text-accent-soft">{'"not-needed"'}</span>
            <span className="text-dim">{'  # unless [server] api_key is set\n'}</span>
            {')\n'}
            {'client.chat.completions.create(\n'}
            {'    model='}
            <span className="text-accent-soft">{'"deepseek-chat"'}</span>
            {', messages=[…], stream=True)\n'}
          </CodeBlock>
          <CodeBlock title="env — anything that reads OPENAI_BASE_URL">
            <span className="text-accent">{'OPENAI_BASE_URL'}</span>
            {'='}
            <span className="text-accent-soft">{'http://127.0.0.1:7667/v1'}</span>
            {'\n'}
            <span className="text-accent">{'OPENAI_API_KEY'}</span>
            {'='}
            <span className="text-accent-soft">{'whatever'}</span>
            {'\n\n'}
            <span className="text-dim">
              {'# aider --model deepseek-chat\n'}
              {'# continue / open-webui / any OpenAI-shaped client\n'}
            </span>
          </CodeBlock>
        </div>
      </PageSection>

      <PageSection
        tone="panel"
        kicker={t('serve.page.safety.kicker')}
        title={t('serve.page.safety.title')}
        lede={t('serve.page.safety.lede')}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Ledger rows={t('serve.page.safety.rows', { returnObjects: true })} />
          <CodeBlock title="config.toml">
            <span className="text-accent">{'[server]\n'}</span>
            {'host '}
            <span className="text-dim">{'= '}</span>
            <span className="text-accent-soft">{'"127.0.0.1"'}</span>
            <span className="text-dim">{'   # loopback by default\n'}</span>
            {'port '}
            <span className="text-dim">{'= '}</span>
            <span className="text-warn">{'7667'}</span>
            <span className="text-dim">{'           # /server <port>\n'}</span>
            {'api '}
            <span className="text-dim">{'= '}</span>
            <span className="text-accent-soft">{'"openai"'}</span>
            <span className="text-dim">{'       # anthropic/gemini reserved\n'}</span>
            <span className="text-dim">{'# api_key = "…"     '}</span>
            <span className="text-dim">{'# required bearer + CORS gate\n'}</span>
          </CodeBlock>
        </div>
        <p className="mt-8 text-sm text-dim">
          <Link to="/architecture" className="text-accent-soft hover:text-accent">
            {t('serve.page.next')} →
          </Link>
        </p>
      </PageSection>
    </main>
  )
}
