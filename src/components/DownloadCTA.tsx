import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import CopyLine from './ui/CopyLine'
import Link from './ui/Link'
import { GITHUB_URL } from '../lib/anim'
import { osOf, usePlatform } from '../lib/platform'
import { useRelease } from '../lib/use-release'
import {
  archiveAsset,
  installCommand,
  installerAsset,
} from '../lib/install'
import { formatSize, versionLabel } from '../lib/release'

/**
 * The hero's call to action, aimed at whatever the visitor is running.
 *
 * Windows gets a button, because there the answer is a file you double
 * click. macOS and Linux get the `curl … | sh` line first, because there
 * the answer is a command — and it goes on the clipboard in one click.
 * Everything else stays one link away on /download; nothing is hidden
 * behind the guess.
 */
export default function DownloadCTA() {
  const { t } = useTranslation()
  const platform = usePlatform()
  const { recommended } = useRelease()
  const os = platform ? osOf(platform) : null
  const version = versionLabel(recommended)

  const installer = installerAsset(recommended)
  const size = formatSize(installer.size)

  return (
    <div className="flex w-full max-w-2xl flex-col items-stretch gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        {os === 'windows' ? (
          <motion.a
            href={installer.url}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="min-w-0 rounded-md border border-accent bg-accent/15 px-6 py-3 text-center text-sm font-bold text-accent-soft transition-colors hover:bg-accent/25"
          >
            ⤓ {t('cta.windows')}
          </motion.a>
        ) : os === null ? (
          <Link
            to="/download"
            className="min-w-0 rounded-md border border-accent bg-accent/15 px-6 py-3 text-center text-sm font-bold text-accent-soft transition-colors hover:bg-accent/25"
          >
            ⤓ {t('cta.downloads')}
          </Link>
        ) : (
          <CopyLine command={installCommand(recommended)} className="sm:flex-1" />
        )}

        <motion.a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="shrink-0 rounded-md border border-line bg-panel px-6 py-3 text-center text-sm font-bold text-soft transition-colors hover:border-accent hover:text-accent-soft"
        >
          ★ GitHub
        </motion.a>
      </div>

      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[11px] text-dim">
        {os === 'windows' && (
          <>
            <span className="text-soft">{installer.name}</span>
            {size && <Dot>{size}</Dot>}
            <Dot>{version}</Dot>
            <Dot>{t('cta.noAdmin')}</Dot>
            {platform && (
              <Dot>
                <a
                  href={archiveAsset(recommended, platform).url}
                  className="text-accent-soft hover:text-accent"
                >
                  {t('cta.portableZip')}
                </a>
              </Dot>
            )}
          </>
        )}
        {os !== 'windows' && os !== null && (
          <>
            <span className="text-soft">{t(`os.${os}`)}</span>
            <Dot>{version}</Dot>
            <Dot>{t('cta.intoPath')}</Dot>
          </>
        )}
        {os === null && <span>{t('cta.unknown')}</span>}
        <Dot>
          <Link to="/download" className="text-accent-soft hover:text-accent">
            {t('cta.allPlatforms')} →
          </Link>
        </Dot>
      </p>
    </div>
  )
}

function Dot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span aria-hidden className="text-line">·</span>
      <span>{children}</span>
    </>
  )
}
