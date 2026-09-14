import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import CodeBlock from '../components/ui/CodeBlock'
import Ledger from '../components/ui/Ledger'
import Link from '../components/ui/Link'
import PageHero from '../components/ui/PageHero'
import PageSection from '../components/ui/PageSection'
import { rise, stagger, viewportOnce } from '../lib/anim'

/**
 * How the thing is built. The tree and the module list mirror the repo's
 * own README/ARCHITECTURE — when the layout changes there, change it here.
 */
export default function Architecture() {
  const { t } = useTranslation()

  return (
    <main>
      <PageHero
        command="/architecture"
        title={t('arch.title')}
        lede={t('arch.lede')}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t('arch.stats', { returnObjects: true }).map((s) => (
            <div key={s.k} className="min-w-0 border border-line bg-panel px-4 py-3">
              <p className="text-xl font-bold text-accent">{s.k}</p>
              <p className="mt-1 text-[11px] leading-5 text-dim">{s.v}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <PageSection
        kicker={t('arch.loop.kicker')}
        title={t('arch.loop.title')}
        lede={t('arch.loop.lede')}
      >
        <CodeBlock title="one tokio::select! loop">
          <span className="text-accent">{'main'}</span>
          {' ─ '}
          <span className="text-fg">{'App'}</span>
          <span className="text-dim">{' (thin coordinator on a single select! loop)\n'}</span>
          {'        ├─ '}
          <span className="text-accent-soft">{'AppState'}</span>
          {'\n'}
          {'        │    └─ '}
          <span className="text-fg">{'Conversations'}</span>
          <span className="text-dim">{' ── focused + background chats\n'}</span>
          <span className="text-dim">{'         each owns: messages · forked session · agent task\n'}</span>
          {'        ├─ '}
          <span className="text-accent-soft">{'AgentRuntime.spawn(TurnSpec)'}</span>
          <span className="text-dim">{' ── the one place a turn starts\n'}</span>
          {'        │    └─ '}
          <span className="text-fg">{'run_agent_loop'}</span>
          <span className="text-dim">{' ── LLM ↔ tools, events tagged by id\n'}</span>
          {'        │         ├─ '}
          <span className="text-warn">{'semantic hint'}</span>
          <span className="text-dim">{' ── skills + MCP tools per prompt\n'}</span>
          {'        │         └─ '}
          <span className="text-warn">{'task tool'}</span>
          <span className="text-dim">{' ⇒ sub-agent (fg) | detached (bg)\n'}</span>
          {'        ├─ '}
          <span className="text-accent-soft">{'SemanticService'}</span>
          <span className="text-dim">{' ── e5-small ONNX + TF-IDF + RRF\n'}</span>
          {'        ├─ '}
          <span className="text-accent-soft">{'ToolRegistry'}</span>
          <span className="text-dim">{' ── bash · edit · write · task · todo …\n'}</span>
          {'        ├─ '}
          <span className="text-accent-soft">{'MCPManager'}</span>
          <span className="text-dim">{' ── stdio / http / sse, OAuth in the keyring\n'}</span>
          {'        ├─ '}
          <span className="text-accent-soft">{'providers'}</span>
          <span className="text-dim">{' ── DeepSeek web · OpenAI · Anthropic · Gemini\n'}</span>
          {'        └─ '}
          <span className="text-accent-soft">{'TUI render'}</span>
          <span className="text-dim">{' ── reads the focused chat; never mutates\n'}</span>
        </CodeBlock>
        <p className="mt-6 text-[13px] leading-6 text-dim">{t('arch.loop.note')}</p>
      </PageSection>

      <PageSection
        tone="panel"
        kicker={t('arch.turn.kicker')}
        title={t('arch.turn.title')}
        lede={t('arch.turn.lede')}
      >
        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {t('arch.turn.steps', { returnObjects: true }).map((step, i) => (
            <motion.li
              key={step.k}
              variants={rise}
              className="min-w-0 border border-line bg-panel-deep p-5"
            >
              <p className="text-xs text-accent">{`0${i + 1}`}</p>
              <p className="mt-2 text-sm font-bold text-fg">{step.k}</p>
              <p className="mt-2 text-[13px] leading-6 text-dim">{step.v}</p>
            </motion.li>
          ))}
        </motion.ol>
      </PageSection>

      <PageSection
        kicker={t('arch.modules.kicker')}
        title={t('arch.modules.title')}
        lede={t('arch.modules.lede')}
      >
        <Ledger rows={t('arch.modules.rows', { returnObjects: true })} />
      </PageSection>

      <PageSection
        tone="panel"
        kicker={t('arch.safety.kicker')}
        title={t('arch.safety.title')}
        lede={t('arch.safety.lede')}
      >
        <Ledger rows={t('arch.safety.rows', { returnObjects: true })} wide />
      </PageSection>

      <PageSection
        kicker={t('arch.proof.kicker')}
        title={t('arch.proof.title')}
        lede={t('arch.proof.lede')}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Ledger rows={t('arch.proof.rows', { returnObjects: true })} />
          <CodeBlock title="ci">
            <span className="text-ok">{'✓'}</span>
            {' cargo fmt --check\n'}
            <span className="text-ok">{'✓'}</span>
            {' cargo clippy -- -D warnings\n'}
            <span className="text-ok">{'✓'}</span>
            {' cargo test --bin pooprusteek        '}
            <span className="text-dim">{'~900 tests, no network\n'}</span>
            <span className="text-ok">{'✓'}</span>
            {' cargo test semantic::eval -- --ignored\n'}
            <span className="text-dim">{'    skills    MRR 0.927\n'}</span>
            <span className="text-dim">{'    mcp tools MRR 0.836\n'}</span>
            <span className="text-ok">{'✓'}</span>
            {' build: windows x64/arm64 · linux x64/arm64 · macos arm64\n'}
            <span className="text-ok">{'✓'}</span>
            {' package: pooprusteek-setup.exe + install.sh + manifest\n'}
          </CodeBlock>
        </div>
        <p className="mt-8 text-sm text-dim">
          <Link to="/download" className="text-accent-soft hover:text-accent">
            {t('arch.next')} →
          </Link>
        </p>
      </PageSection>
    </main>
  )
}
