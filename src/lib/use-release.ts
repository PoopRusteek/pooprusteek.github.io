import { useEffect, useState } from 'react'
import { FALLBACK, fetchReleases, type ReleaseData } from './release'

/**
 * One fetch per visit, shared through a module-level promise so the four
 * components that need release data don't each hit the API.
 *
 * The hook never returns nothing: until the request lands (or if it never
 * does) it serves the static fallback, whose links point at the rolling
 * `dev` tag and are always valid. Buttons are therefore clickable on the
 * first frame — the live data only sharpens the version and the file size.
 */
let inflight: Promise<ReleaseData> | null = null

export function useRelease(): ReleaseData {
  const [data, setData] = useState<ReleaseData>(FALLBACK)

  useEffect(() => {
    let live = true
    inflight ??= fetchReleases()
    inflight.then((result) => {
      if (live) setData(result)
    })
    return () => {
      live = false
    }
  }, [])

  return data
}
