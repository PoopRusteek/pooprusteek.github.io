import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * false during the prerender and the hydrating render, true afterwards.
 * Anything that depends on the browser (the user agent, a media query) must
 * wait for it, or the first client render disagrees with the HTML it is
 * hydrating and React throws the markup away.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

/**
 * `useReducedMotion`, but always `false` until hydration is done. Motion's
 * own hook reads the media query during render, so a reduced-motion visitor
 * would otherwise get a first render (e.g. the terminal demo fully typed)
 * that differs from the prerendered one.
 */
export function useReducedMotionSafe(): boolean {
  const prefers = useReducedMotion()
  return useHydrated() && !!prefers
}
