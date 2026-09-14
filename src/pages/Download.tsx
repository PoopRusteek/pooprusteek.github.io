import { useState } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import InstallSection from '../components/InstallSection'
import CopyLine from '../components/ui/CopyLine'
import PageHero from '../components/ui/PageHero'
import PageSection from '../components/ui/PageSection'
import Ledger from '../components/ui/Ledger'
import Corners from '../components/ui/Corners'
import { rise, staggerTight, viewportOnce, GITHUB_URL } from '../lib/anim'
import { ARCH_LABEL, OS_LABEL, isMobile, osOf, usePlatform } from '../lib/platform'
import { useRelease } from '../lib/use-release'
import {
  ARCHIVE,
  BINARY,
  CHECKSUMS,
  formatDate,
  formatSize,
  INSTALL_SCRIPT,
  INSTALLER,
  MANIFEST,
  REQUIRED,
  versionLabel,
  type Asset,
  type PlatformId,
  type ReleaseInfo,
} from '../lib/release'
import {
  binaryAsset,
  installCommand,
  installerAsset,
  SOURCE_COMMAND,
  uninstallCommand,
} from '../lib/install'

const PLATFORMS = Object.keys(BINARY) as PlatformId[]

export default function Download() {
  const { t, i18n } = useTranslation()
  const release = useRelease()
  const platform = usePlatform()
  const [channel, setChannel] = useState<'stable' | 'dev' | null>(null)
  const shown =
    (channel === 'stable' ? release.stable : channel === 'dev' ? release.dev : null) ??
    release.recommended

  return (
    <main>
      <PageHero
        command="/download"
        title={t('download.title')}
        lede={t('download.lede')}
      >
        <div className="flex flex-col gap-5">
          <ReleaseBadge info={release.recommended} live={release.live} />
          <Recommended platform={platform} info={release.recommended} />
        </div>
      </PageHero>

      <InstallSection />

      <PageSection
        id="builds"
        tone="panel"
        kicker={t('download.assets.kicker')}
        title={t('download.assets.title')}
        lede={t('download.assets.lede')}
      >
        <div className="flex flex-wrap items-center gap-2">
          {(['stable', 'dev'] as const).map((c) => {
            const info = c === 'stable' ? release.stable : release.dev
            const active = shown.channel === c
            return (
              <button
                key={c}
                disabled={!info}
                onClick={() => setChannel(c)}
                className={`rounded border px-4 py-2 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm ${
                  active
                    ? 'border-accent bg-accent/10 text-accent-soft'
                    : 'border-line bg-panel text-dim hover:border-accent hover:text-soft'
                }`}
              >
                {t(`download.channels.${c}.name`)}
                {info && (
                  <span className="ml-2 text-[11px] text-dim">
                    {versionLabel(info)}
                  </span>
                )}
              </button>
            )
          })}
          <a
            href={shown.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-xs text-accent-soft hover:text-accent"
          >
            {t('download.assets.onGithub')} →
          </a>
        </div>

        <p className="mt-4 text-[13px] leading-6 text-dim">
          {t(`download.channels.${shown.channel}.body`)}
          {shown.publishedAt && (
            <>
              {' '}
              <span className="text-soft">
                {t('download.assets.published', {
                  date: formatDate(shown.publishedAt, i18n.resolvedLanguage ?? 'en'),
                })}
              </span>
            </>
          )}
        </p>

        {/* Keyed by tag: the table reveals its rows through the parent's
            whileInView variants, which fire once. Rows mounted by a later
            channel switch would inherit `hidden` and never animate in, so
            each release gets a fresh table that plays its own reveal. */}
        {REQUIRED.every((name) => name in shown.assets) ? (
          <AssetTable key={shown.tag} info={shown} />
        ) : (
          <PendingRelease
            key={shown.tag}
            info={shown}
            fallback={release.dev}
            onFallback={() => setChannel('dev')}
          />
        )}
      </PageSection>

      <PageSection
        id="verify"
        kicker={t('download.verify.kicker')}
        title={t('download.verify.title')}
        lede={t('download.verify.lede')}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="min-w-0 border border-line bg-panel p-5">
            <p className="text-xs text-accent">{CHECKSUMS}</p>
            <p className="mt-2 text-[13px] leading-6 text-dim">
              {t('download.verify.sums')}
            </p>
            <CopyLine
              className="mt-4"
              tone="accent"
              command={`curl -fsSLO ${assetUrlOf(shown, CHECKSUMS)} && shasum -a 256 -c ${CHECKSUMS} --ignore-missing`}
              display={`curl -fsSLO …/${CHECKSUMS} && shasum -a 256 -c ${CHECKSUMS}`}
            />
          </div>
          <div className="min-w-0 border border-line bg-panel p-5">
            <p className="text-xs text-accent">{MANIFEST}</p>
            <p className="mt-2 text-[13px] leading-6 text-dim">
              {t('download.verify.manifest')}
            </p>
            <CopyLine
              className="mt-4"
              tone="accent"
              command={`curl -fsSL ${assetUrlOf(shown, MANIFEST)} | jq`}
              display={`curl -fsSL …/${MANIFEST} | jq`}
            />
          </div>
        </div>
        <p className="mt-6 border-l-2 border-warn/60 pl-4 text-[13px] leading-6 text-soft">
          <span className="text-warn">!</span> {t('download.verify.signing')}
        </p>
      </PageSection>

      <PageSection
        id="updates"
        tone="panel"
        kicker={t('download.update.kicker')}
        title={t('download.update.title')}
        lede={t('download.update.lede')}
      >
        <Ledger rows={t('download.update.rows', { returnObjects: true })} />
      </PageSection>

      <PageSection
        id="first-run"
        kicker={t('download.firstRun.kicker')}
        title={t('download.firstRun.title')}
        lede={t('download.firstRun.lede')}
      >
        <ol className="grid gap-4 sm:grid-cols-3">
          {t('download.firstRun.steps', { returnObjects: true }).map((step, i) => (
            <li key={i} className="min-w-0 border border-line bg-panel p-5">
              <p className="text-xs text-accent">{`0${i + 1}`}</p>
              <p className="mt-2 text-sm font-bold text-fg">{step.k}</p>
              <p className="mt-2 text-[13px] leading-6 text-dim">{step.v}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection
        id="requirements"
        tone="panel"
        kicker={t('download.requirements.kicker')}
        title={t('download.requirements.title')}
        lede={t('download.requirements.lede')}
      >
        <Ledger rows={t('download.requirements.rows', { returnObjects: true })} />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="min-w-0">
            <p className="text-[13px] leading-6 text-dim">
              {t('download.requirements.source')}
            </p>
            <CopyLine className="mt-3" tone="accent" command={SOURCE_COMMAND} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] leading-6 text-dim">
              {t('download.uninstall.unix')}
            </p>
            <CopyLine
              className="mt-3"
              tone="accent"
              command={uninstallCommand(shown)}
              display="curl -fsSL …/install.sh | sh -s -- --uninstall"
            />
          </div>
        </div>
        <p className="mt-6 text-[13px] leading-6 text-dim">
          {t('download.uninstall.windows')}
        </p>
      </PageSection>
    </main>
  )
}

function assetUrlOf(info: ReleaseInfo, name: string): string {
  return info.assets[name]?.url ?? `${GITHUB_URL}/releases/download/${info.tag}/${name}`
}

/** Which build the buttons are pointing at, and whether GitHub answered. */
function ReleaseBadge({ info, live }: { info: ReleaseInfo; live: boolean }) {
  const { t, i18n } = useTranslation()
  const date = formatDate(info.publishedAt, i18n.resolvedLanguage ?? 'en')
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dim">
      <span className="rounded border border-line bg-panel px-2 py-1 text-accent-soft">
        {versionLabel(info)}
      </span>
      <span>{t(`download.channels.${info.channel}.name`)}</span>
      {date && (
        <>
          <span className="text-line">·</span>
          <span>{date}</span>
        </>
      )}
      <span className="text-line">·</span>
      <span className={live ? 'text-ok' : 'text-warn'}>
        {live ? t('download.live') : t('download.offline')}
      </span>
    </p>
  )
}

/** The one file this visitor most likely wants, named and sized. */
function Recommended({
  platform,
  info,
}: {
  platform: PlatformId | null
  info: ReleaseInfo
}) {
  const { t } = useTranslation()

  if (!platform) {
    return (
      <p className="max-w-xl text-sm leading-7 text-dim">
        {isMobile() ? t('download.mobile') : t('download.unknownOs')}
      </p>
    )
  }

  const os = osOf(platform)
  const primary = os === 'windows' ? installerAsset(info) : binaryAsset(info, platform)
  const size = formatSize(primary.size)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <p className="text-xs text-dim">
        {t('download.detected', {
          os: OS_LABEL[os],
          arch: ARCH_LABEL[platform],
        })}
      </p>
      {os === 'windows' ? (
        <motion.a
          href={primary.url}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-between gap-4 rounded-md border border-accent bg-accent/15 px-5 py-4 text-sm font-bold text-accent-soft"
        >
          <span className="min-w-0 truncate">⤓ {primary.name}</span>
          {size && (
            <span className="shrink-0 text-xs font-normal text-dim">{size}</span>
          )}
        </motion.a>
      ) : (
        <CopyLine command={installCommand(info)} />
      )}
    </div>
  )
}

/**
 * A release that predates the current build matrix — today that is stable
 * v0.1.0, tagged before the installers existed. Instead of a near-empty
 * table it shows what the next release has to carry, ticked against what
 * this one actually has, and offers the channel that already ships it all.
 */
function PendingRelease({
  info,
  fallback,
  onFallback,
}: {
  info: ReleaseInfo
  fallback: ReleaseInfo | null
  onFallback: () => void
}) {
  const { t } = useTranslation()
  const labels: Record<string, string> = {
    [INSTALLER]: t('download.assets.kinds.installer'),
    [INSTALL_SCRIPT]: t('download.assets.kinds.script'),
    [MANIFEST]: t('download.pending.manifest'),
  }
  for (const p of PLATFORMS) labels[BINARY[p]] = `${OS_LABEL[osOf(p)]} · ${ARCH_LABEL[p]}`

  const wanted = [...REQUIRED, MANIFEST]
  const ready = wanted.filter((name) => name in info.assets).length
  const legacy = Object.values(info.assets).filter(
    (a): a is Asset => !!a && !wanted.includes(a.name),
  )

  return (
    <motion.div
      data-pending
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative mt-6 overflow-hidden border border-line bg-panel-deep"
    >
      <Corners />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-warn/10 blur-[90px]"
      />

      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded border border-warn/40 bg-warn/10 px-2 py-1 font-bold text-warn">
              [STABLE PENDING]
            </span>
            <span className="text-dim">{versionLabel(info)}</span>
          </p>
          <h3 className="mt-5 text-xl font-bold text-fg sm:text-2xl">
            {t('download.pending.title')}
          </h3>
          <p className="mt-4 text-[13px] leading-7 text-soft">
            {t('download.pending.body')}
          </p>

          {fallback && (
            <motion.button
              onClick={onFallback}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-7 rounded-md border border-accent bg-accent/15 px-5 py-3 text-left text-sm font-bold text-accent-soft"
            >
              ❯ {t('download.pending.cta')}{' '}
              <span className="font-normal text-dim">{versionLabel(fallback)}</span>
            </motion.button>
          )}

          {legacy.length > 0 && (
            <p className="mt-6 text-xs leading-6 text-dim">
              {t('download.pending.legacy')}{' '}
              {legacy.map((a, i) => (
                <span key={a.name}>
                  {i > 0 && ', '}
                  <a href={a.url} className="text-accent-soft hover:text-accent">
                    {a.name}
                  </a>
                  {a.size ? ` (${formatSize(a.size)})` : ''}
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="min-w-0 border border-line bg-ink/60 p-5 text-xs">
          <div className="flex items-center justify-between gap-3 text-dim">
            <span className="tracking-[0.2em] uppercase">{t('download.pending.checklist')}</span>
            <span className={ready === wanted.length ? 'text-ok' : 'text-warn'}>
              {ready}/{wanted.length}
            </span>
          </div>
          <div aria-hidden className="mt-3 flex gap-1">
            {wanted.map((name) => (
              <span
                key={name}
                className={`h-1.5 flex-1 ${name in info.assets ? 'bg-ok' : 'bg-line'}`}
              />
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {wanted.map((name) => {
              const has = name in info.assets
              return (
                <li key={name} className="grid min-w-0 grid-cols-[1rem_minmax(0,1fr)_auto] items-baseline gap-2">
                  <span className={has ? 'text-ok' : 'text-line'}>{has ? '✓' : '○'}</span>
                  <span className="min-w-0 truncate">
                    <span className={has ? 'text-soft' : 'text-dim'}>{name}</span>
                    <span className="hidden text-line sm:inline"> · {labels[name]}</span>
                  </span>
                  <span className={has ? 'text-ok' : 'text-dim'}>
                    {has ? t('download.pending.ready') : t('download.pending.waiting')}
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="mt-5 border-t border-line pt-4 text-dim">
            <span className="text-ok">❯</span> scripts/release.sh minor
            <span className="animate-blink text-accent-soft">▊</span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/** Sort order: installer, script, per-platform, metadata, then the rest. */
function assetRank(name: string): number {
  const order = [
    INSTALLER,
    INSTALL_SCRIPT,
    ...PLATFORMS.flatMap((p) => [BINARY[p], ARCHIVE[p]]),
    CHECKSUMS,
    MANIFEST,
  ]
  const i = order.indexOf(name)
  return i === -1 ? order.length : i
}

/**
 * Whatever this release actually carries — never a guessed URL. An older
 * release that predates the current asset names (v0.1.0 shipped one zip)
 * therefore shows one row, not twelve links to 404s.
 */
function AssetTable({ info }: { info: ReleaseInfo }) {
  const { t } = useTranslation()

  // Named labels for the files a complete release ships; anything else the
  // release happens to carry is still listed, just without a target.
  const labels: Record<string, string> = {
    [INSTALLER]: t('download.assets.kinds.installer'),
    [INSTALL_SCRIPT]: t('download.assets.kinds.script'),
    [CHECKSUMS]: t('download.assets.kinds.meta'),
    [MANIFEST]: t('download.assets.kinds.meta'),
  }
  for (const p of PLATFORMS) {
    const target = `${OS_LABEL[osOf(p)]} · ${ARCH_LABEL[p]}`
    labels[BINARY[p]] = target
    labels[ARCHIVE[p]] = `${target} · ${t('download.assets.kinds.archive')}`
  }

  const rows = Object.values(info.assets)
    .filter((a): a is Asset => !!a)
    .sort((a, b) => assetRank(a.name) - assetRank(b.name))

  if (!rows.length) {
    return (
      <p className="mt-6 border border-line bg-panel-deep p-5 text-[13px] text-dim">
        {t('download.assets.empty')}
      </p>
    )
  }

  return (
    <motion.div
      variants={staggerTight}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="mt-6 overflow-hidden border border-line"
    >
      <div className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_5rem_minmax(0,1fr)] gap-4 border-b border-line bg-panel px-4 py-2 text-[11px] tracking-widest text-dim uppercase sm:grid">
        <span>{t('download.assets.cols.file')}</span>
        <span>{t('download.assets.cols.target')}</span>
        <span>{t('download.assets.cols.size')}</span>
        <span>{t('download.assets.cols.sha')}</span>
      </div>
      {rows.map((asset) => (
        <motion.div
          key={asset.name}
          variants={rise}
          className="grid grid-cols-1 gap-1 border-b border-line bg-panel-deep px-4 py-3 text-xs last:border-b-0 sm:grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_5rem_minmax(0,1fr)] sm:items-center sm:gap-4"
        >
          <a
            href={asset.url}
            className="min-w-0 truncate text-accent-soft hover:text-accent"
          >
            ⤓ {asset.name}
          </a>
          <span className="min-w-0 truncate text-dim">{labels[asset.name] ?? '—'}</span>
          <span className="text-dim">{formatSize(asset.size) || '—'}</span>
          <Sha sha={asset.sha256} />
        </motion.div>
      ))}
    </motion.div>
  )
}

function Sha({ sha }: { sha: string | null }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  if (!sha) return <span className="text-line">—</span>
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(sha)
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        } catch {
          /* clipboard unavailable */
        }
      }}
      title={t('download.assets.copySha')}
      className="min-w-0 truncate text-left text-dim transition-colors hover:text-accent-soft"
    >
      {copied ? <span className="text-ok">{t('common.copied')}</span> : `${sha.slice(0, 12)}…`}
    </button>
  )
}
