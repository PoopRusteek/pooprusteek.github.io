import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import CopyLine from './ui/CopyLine'
import Link from './ui/Link'
import SectionTitle from './ui/SectionTitle'
import { rise, stagger, viewportOnce } from '../lib/anim'

/** `/serve on` — the agent as a local OpenAI-compatible endpoint, so every
 *  tool that speaks that dialect inherits the free backend. */
export default function ServeTeaser() {
  const { t } = useTranslation()
  const points = t('serve.teaser.points', { returnObjects: true })

  return (
    <section id="serve" className="border-y border-line bg-panel/40 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          kicker={t('serve.teaser.kicker')}
          title={t('serve.teaser.title')}
          sub={t('serve.teaser.sub')}
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="min-w-0 overflow-hidden border border-line bg-panel-deep"
          >
            <div className="flex items-center gap-2 border-b border-line bg-panel px-4 py-2 text-[11px] text-dim">
              <span className="text-ok">●</span>
              <span className="truncate">127.0.0.1:7667 · openai dialect</span>
            </div>
            <pre className="overflow-x-auto p-5 text-[11px] leading-6 text-dim sm:text-xs">
              <code>
                <span className="text-ok">❯</span>{' '}
                <span className="text-accent">/serve on</span>
                {'\n'}
                <span className="text-soft">
                  API server listening on http://127.0.0.1:7667/v1
                </span>
                {'\n\n'}
                <span className="text-ok">$</span> curl
                http://127.0.0.1:7667/v1/chat/completions \{'\n'}
                {'    '}-H{' '}
                <span className="text-accent-soft">
                  &apos;content-type: application/json&apos;
                </span>{' '}
                \{'\n'}
                {'    '}-d{' '}
                <span className="text-accent-soft">
                  &apos;&#123;&quot;model&quot;:&quot;deepseek-chat&quot;,&quot;stream&quot;:true,
                </span>
                {'\n'}
                {'       '}
                <span className="text-accent-soft">
                  &quot;messages&quot;:[&#123;&quot;role&quot;:&quot;user&quot;,&quot;content&quot;:&quot;hi&quot;&#125;]&#125;&apos;
                </span>
                {'\n\n'}
                <span className="text-dim">data: </span>
                <span className="text-soft">
                  &#123;&quot;choices&quot;:[&#123;&quot;delta&quot;:&#123;&quot;content&quot;:&quot;Hi&quot;&#125;…
                </span>
                {'\n'}
                <span className="text-ok">
                  {'                                    '}$0.00
                </span>
              </code>
            </pre>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid min-w-0 gap-4"
          >
            {points.map((p) => (
              <motion.div
                key={p.k}
                variants={rise}
                className="min-w-0 border border-line bg-panel p-5"
              >
                <p className="text-xs text-accent">{p.k}</p>
                <p className="mt-2 text-[13px] leading-6 text-dim">{p.v}</p>
              </motion.div>
            ))}
            <motion.div variants={rise} className="min-w-0">
              <CopyLine command="pooprusteek --proxy" tone="accent" />
              <p className="mt-3 text-xs text-dim">
                {t('serve.teaser.headless')}{' '}
                <Link to="/serve" className="text-accent-soft hover:text-accent">
                  /serve →
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
