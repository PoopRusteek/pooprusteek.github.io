import { useEffect, useState } from 'react'
import type { OsId, PlatformId } from './release'

/**
 * Which build to offer first. The user agent is a guess, never a gate —
 * every other platform stays one click away on /download.
 */

export function osOf(platform: PlatformId): OsId {
  return platform.startsWith('windows')
    ? 'windows'
    : platform.startsWith('macos')
      ? 'macos'
      : 'linux'
}

export const OS_LABEL: Record<OsId, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
}

export const ARCH_LABEL: Record<PlatformId, string> = {
  'windows-x86_64': 'x86_64',
  'windows-arm64': 'arm64',
  'macos-arm64': 'Apple Silicon',
  'linux-x86_64': 'x86_64',
  'linux-arm64': 'arm64',
}

/** UA-CH, where it exists — `navigator.platform` has been frozen for years. */
interface UAData {
  platform: string
  getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>
}

function uaData(): UAData | undefined {
  return (navigator as Navigator & { userAgentData?: UAData }).userAgentData
}

/** Phones and tablets get no binary — say so instead of offering one. */
export function isMobile(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/** Synchronous best guess from the UA string; null when it isn't a desktop. */
export function detectPlatform(): PlatformId | null {
  const ua = navigator.userAgent
  const hinted = uaData()?.platform ?? ''

  if (isMobile()) return null
  if (/Win/i.test(hinted) || /Windows/i.test(ua)) {
    return /ARM|aarch64/i.test(ua) ? 'windows-arm64' : 'windows-x86_64'
  }
  if (/macOS|Mac/i.test(hinted) || /Mac OS X|Macintosh/i.test(ua)) {
    return 'macos-arm64' // Intel Macs have no build — the page says why
  }
  if (/Linux|X11|CrOS/i.test(hinted) || /Linux|X11|CrOS/i.test(ua)) {
    return /aarch64|arm64/i.test(ua) ? 'linux-arm64' : 'linux-x86_64'
  }
  return null
}

/**
 * `undefined` until the browser has been asked (the prerender and the
 * hydrating render can't know the visitor's OS), then the detected
 * platform or `null`. The UA string rarely admits to arm64 on Windows and
 * Linux, so the guess is refined with a high-entropy hint when available.
 */
export function usePlatform(): PlatformId | null | undefined {
  const [platform, setPlatform] = useState<PlatformId | null | undefined>(undefined)

  useEffect(() => {
    setPlatform(detectPlatform())
    const data = uaData()
    if (!data?.getHighEntropyValues) return
    let live = true
    data
      .getHighEntropyValues(['architecture'])
      .then(({ architecture }) => {
        if (!live || !architecture) return
        const arm = /arm/i.test(architecture)
        setPlatform((current) => {
          if (!current || current.startsWith('macos')) return current
          return `${osOf(current)}-${arm ? 'arm64' : 'x86_64'}` as PlatformId
        })
      })
      .catch(() => {
        /* hint refused — the UA guess stands */
      })
    return () => {
      live = false
    }
  }, [])

  return platform
}
