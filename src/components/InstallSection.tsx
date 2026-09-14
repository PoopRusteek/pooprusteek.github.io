import { useState } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import CopyLine from './ui/CopyLine'
import Link from './ui/Link'
import SectionTitle from './ui/SectionTitle'
import { rise, viewportOnce } from '../lib/anim'
import { osOf, usePlatform } from '../lib/platform'
import { useRelease } from '../lib/use-release'
import {
  archiveAsset,
  installCommand,
  installerAsset,
  SOURCE_COMMAND,
  windowsCommand,
} from '../lib/install'
import { formatSize, versionLabel, type OsId } from '../lib/release'

const TABS: OsId[] = ['windows', 'macos', 'linux']

/**
 * "How do I actually get it" on the front page, with the tab for the
 * visitor's own OS already open. Every command here is built from the
 * release the site resolved, so the URLs are the ones that exist right now.
 */
export default function InstallSection() {
  const { t } = useTranslation()
  const platform = usePlatform()
  const { recommended } = useRelease()
  const [tab, setTab] = useState<OsId | null>(null)
  const active = tab ?? (platform ? osOf(platform) : 'windows')

  return (
    <section id="install" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          kicker={t('install.kicker')}
          title={t('install.title')}
          sub={t('install.sub')}
        />

        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12"
        >
          <div
            role="tablist"
            aria-label={t('install.kicker')}
            className="flex flex-wrap gap-2"
          >
            {TABS.map((os) => (
              <button
                key={os}
                role="tab"
                aria-selected={active === os}
                onClick={() => setTab(os)}
                className={`rounded border px-4 py-2 text-xs transition-colors sm:text-sm ${
                  active === os
                    ? 'border-accent bg-accent/10 text-accent-soft'
                    : 'border-line bg-panel text-dim hover:border-accent hover:text-soft'
                }`}
              >
                {t(`os.${os}`)}
              </button>
            ))}
          </div>

          <div className="mt-4 border border-line bg-panel-deep p-5 sm:p-7">
            {active === 'windows' ? <Windows /> : <Unix os={active} />}

            <div className="mt-7 flex flex-col gap-2 border-t border-line pt-5 text-xs text-dim sm:flex-row sm:items-center sm:justify-between">
              <p>
                {t('install.updates')}{' '}
                <span className="text-accent-soft">/update</span> ·{' '}
                <span className="text-accent-soft">/autoupdate on</span>
              </p>
              <p>
                <Link to="/download" className="text-accent-soft hover:text-accent">
                  {t('install.more')} →
                </Link>{' '}
                <span className="text-line">·</span>{' '}
                <span className="text-dim">
                  {versionLabel(recommended)}
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Windows() {
  const { t } = useTranslation()
  const { recommended } = useRelease()
  const installer = installerAsset(recommended)
  const size = formatSize(installer.size)
  const steps = t('install.windows.steps', { returnObjects: true })

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <motion.a
          href={installer.url}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-between gap-4 rounded-md border border-accent bg-accent/15 px-5 py-4 text-sm font-bold text-accent-soft"
        >
          <span className="min-w-0 truncate">⤓ {installer.name}</span>
          {size && <span className="shrink-0 text-xs font-normal text-dim">{size}</span>}
        </motion.a>
        <ol className="mt-5 space-y-2 text-[13px] leading-6 text-dim">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 text-accent">{i + 1}.</span>
              <span className="min-w-0">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 border-l-2 border-warn/60 pl-4 text-[13px] leading-6 text-soft">
          <span className="text-warn">!</span> {t('install.windows.smartscreen')}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-xs tracking-[0.2em] text-dim uppercase">
          {t('install.windows.altKicker')}
        </p>
        <p className="mt-3 text-[13px] leading-6 text-dim">
          {t('install.windows.altBody')}
        </p>
        <CopyLine
          className="mt-4"
          tone="accent"
          command={windowsCommand(recommended)}
          display="iwr …/pooprusteek-setup.exe -OutFile $env:TEMP\pooprusteek-setup.exe; & …"
        />
        <p className="mt-4 text-[13px] leading-6 text-dim">
          {t('install.windows.portable')}{' '}
          <a
            className="text-accent-soft hover:text-accent"
            href={archiveAsset(recommended, 'windows-x86_64').url}
          >
            pooprusteek-windows-x86_64.zip
          </a>{' '}
          <span className="text-line">·</span>{' '}
          <a
            className="text-accent-soft hover:text-accent"
            href={archiveAsset(recommended, 'windows-arm64').url}
          >
            arm64
          </a>
        </p>
      </div>
    </div>
  )
}

function Unix({ os }: { os: OsId }) {
  const { t } = useTranslation()
  const { recommended } = useRelease()
  const notes = t(`install.${os === 'macos' ? 'macos' : 'linux'}.notes`, {
    returnObjects: true,
  })

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <CopyLine command={installCommand(recommended)} />
        <ul className="mt-5 space-y-2 text-[13px] leading-6 text-dim">
          {notes.map((note, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 text-ok">›</span>
              <span className="min-w-0 wrap-break-word">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0">
        <p className="text-xs tracking-[0.2em] text-dim uppercase">
          {t('install.flagsKicker')}
        </p>
        <dl className="mt-3 divide-y divide-line border border-line">
          {(t('install.flags', { returnObjects: true })).map((flag) => (
            <div key={flag.k} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 p-3">
              <dt className="min-w-0 truncate text-xs text-accent-soft">{flag.k}</dt>
              <dd className="min-w-0 text-[13px] leading-6 wrap-break-word text-dim">
                {flag.v}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[13px] leading-6 text-dim">
          {t('install.fromSource')}
        </p>
        <CopyLine className="mt-3" tone="accent" command={SOURCE_COMMAND} />
      </div>
    </div>
  )
}
