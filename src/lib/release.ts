/**
 * Live release data, straight from the GitHub API — the download buttons
 * name the file, its size and the build they came from instead of pointing
 * at a releases page and wishing you luck.
 *
 * One request per visit (cached in sessionStorage for 30 minutes, since the
 * unauthenticated API allows 60/hour per IP), and a static fallback so the
 * page still hands out working links when the request is rate-limited,
 * blocked or offline.
 *
 * Asset names are a contract with the agent's CI
 * (pooprusteek/scripts/ci/package.sh and collect-assets.sh) — keep them in
 * sync with `platform_asset` in src/update/mod.rs.
 */

export const REPO = 'Aver005/pooprusteek'
export const GITHUB_URL = `https://github.com/${REPO}`
export const RELEASES_URL = `${GITHUB_URL}/releases`

export type PlatformId =
  | 'windows-x86_64'
  | 'windows-arm64'
  | 'macos-arm64'
  | 'linux-x86_64'
  | 'linux-arm64'

export type OsId = 'windows' | 'macos' | 'linux'

export interface Asset {
  name: string
  url: string
  /** 0 when the size is unknown (static fallback) */
  size: number
  /** hex digest, when the API reports one */
  sha256: string | null
}

export interface ReleaseInfo {
  channel: 'stable' | 'dev'
  /** `0.1.0` — without the leading v */
  version: string
  tag: string
  publishedAt: string | null
  htmlUrl: string
  assets: Partial<Record<string, Asset>>
}

export interface ReleaseData {
  stable: ReleaseInfo | null
  dev: ReleaseInfo | null
  /** the channel whose assets the buttons should point at */
  recommended: ReleaseInfo
  /** false = the static fallback, GitHub wasn't reachable */
  live: boolean
}

export const BINARY: Record<PlatformId, string> = {
  'windows-x86_64': 'pooprusteek-windows-x86_64.exe',
  'windows-arm64': 'pooprusteek-windows-arm64.exe',
  'macos-arm64': 'pooprusteek-macos-arm64',
  'linux-x86_64': 'pooprusteek-linux-x86_64',
  'linux-arm64': 'pooprusteek-linux-arm64',
}

export const ARCHIVE: Record<PlatformId, string> = {
  'windows-x86_64': 'pooprusteek-windows-x86_64.zip',
  'windows-arm64': 'pooprusteek-windows-arm64.zip',
  'macos-arm64': 'pooprusteek-macos-arm64.tar.gz',
  'linux-x86_64': 'pooprusteek-linux-x86_64.tar.gz',
  'linux-arm64': 'pooprusteek-linux-arm64.tar.gz',
}

export const INSTALLER = 'pooprusteek-setup.exe'
export const INSTALL_SCRIPT = 'install.sh'
export const CHECKSUMS = 'SHA256SUMS'
export const MANIFEST = 'manifest.json'

/** Everything a complete release carries — a release missing any of it
 *  predates the installers and can't be recommended. */
export const REQUIRED = [INSTALLER, INSTALL_SCRIPT, ...Object.values(BINARY)]

const FALLBACK_TAG = 'dev'

function assetUrl(tag: string, name: string): string {
  return `${RELEASES_URL}/download/${tag}/${name}`
}

/** Links that work without the API: the rolling dev tag, which every CI run
 *  refreshes in place. */
export const FALLBACK: ReleaseData = (() => {
  const names = [...REQUIRED, ...Object.values(ARCHIVE), CHECKSUMS, MANIFEST]
  const assets: Record<string, Asset> = {}
  for (const name of names) {
    assets[name] = { name, url: assetUrl(FALLBACK_TAG, name), size: 0, sha256: null }
  }
  const dev: ReleaseInfo = {
    channel: 'dev',
    version: '',
    tag: FALLBACK_TAG,
    publishedAt: null,
    htmlUrl: `${RELEASES_URL}/tag/${FALLBACK_TAG}`,
    assets,
  }
  return { stable: null, dev, recommended: dev, live: false }
})()

// ── the API shapes we read ───────────────────────────────────────────────

interface ApiAsset {
  name: string
  size: number
  browser_download_url: string
  /** `sha256:…`, present on newer uploads */
  digest?: string | null
}

interface ApiRelease {
  tag_name: string
  name: string | null
  draft: boolean
  prerelease: boolean
  published_at: string | null
  html_url: string
  assets: ApiAsset[]
}

function toInfo(release: ApiRelease, channel: 'stable' | 'dev'): ReleaseInfo {
  const assets: Record<string, Asset> = {}
  for (const a of release.assets) {
    assets[a.name] = {
      name: a.name,
      url: a.browser_download_url,
      size: a.size,
      sha256: a.digest?.replace(/^sha256:/, '') ?? null,
    }
  }
  // A dev build's tag carries no version, so take it from the release name
  // ("Dev build 0.1.0 (af63d20)") and fall back to the tag for stable.
  const fromName = release.name?.match(/\d+\.\d+\.\d+/)?.[0]
  return {
    channel,
    version: fromName ?? release.tag_name.replace(/^v/, ''),
    tag: release.tag_name,
    publishedAt: release.published_at,
    htmlUrl: release.html_url,
    assets,
  }
}

export function isComplete(info: ReleaseInfo | null): info is ReleaseInfo {
  return !!info && REQUIRED.every((name) => name in info.assets)
}

function shape(releases: ApiRelease[]): ReleaseData {
  const stableRaw = releases.find((r) => !r.draft && !r.prerelease) ?? null
  const devRaw = releases.find((r) => r.tag_name === FALLBACK_TAG) ?? null

  const stable = stableRaw ? toInfo(stableRaw, 'stable') : null
  const dev = devRaw ? toInfo(devRaw, 'dev') : null

  // Stable wins the moment it ships installers for every platform; until
  // then the rolling dev build is the only thing anyone can actually
  // install, and pretending otherwise would hand out 404s.
  const recommended =
    (isComplete(stable) ? stable : null) ??
    (isComplete(dev) ? dev : null) ??
    stable ??
    dev ??
    FALLBACK.recommended

  return { stable, dev, recommended, live: true }
}

// ── fetching ─────────────────────────────────────────────────────────────

const CACHE_KEY = 'pooprusteek-releases'
const CACHE_MS = 30 * 60 * 1000

function readCache(): ApiRelease[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { at, data } = JSON.parse(raw) as { at: number; data: ApiRelease[] }
    return Date.now() - at < CACHE_MS ? data : null
  } catch {
    return null
  }
}

function writeCache(data: ApiRelease[]): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* storage blocked — we just refetch next visit */
  }
}

export async function fetchReleases(signal?: AbortSignal): Promise<ReleaseData> {
  const cached = readCache()
  if (cached) return shape(cached)

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases?per_page=10`,
      { headers: { Accept: 'application/vnd.github+json' }, signal },
    )
    if (!res.ok) throw new Error(`github api: ${res.status}`)
    const data = (await res.json()) as ApiRelease[]
    writeCache(data)
    return shape(data)
  } catch {
    return FALLBACK // rate-limited, offline, or blocked — links still work
  }
}

export function asset(info: ReleaseInfo, name: string): Asset {
  return (
    info.assets[name] ?? {
      name,
      url: assetUrl(info.tag, name),
      size: 0,
      sha256: null,
    }
  )
}

export function hasAsset(info: ReleaseInfo | null, name: string): boolean {
  return !!info && name in info.assets
}

// ── formatting ───────────────────────────────────────────────────────────

export function formatSize(bytes: number): string {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function formatDate(iso: string | null, locale: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** `v0.1.0` for stable, `0.1.0-dev` for the rolling build. */
export function versionLabel(info: ReleaseInfo): string {
  if (info.channel === 'dev') return info.version ? `${info.version}-dev` : 'dev'
  return info.version ? `v${info.version}` : info.tag
}
