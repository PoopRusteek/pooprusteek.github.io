import { useSyncExternalStore } from 'react'
import {
  applyTheme,
  DEFAULT_THEME,
  themeByName,
  type ThemePreset,
} from './themes'

/**
 * The page wears the agent's themes. A three-line external store instead of
 * context: nothing here renders, so no provider has to wrap the tree and
 * every component can read the live palette with one hook.
 */

const STORAGE_KEY = 'pooprusteek-theme'

function load(): ThemePreset {
  try {
    return themeByName(localStorage.getItem(STORAGE_KEY))
  } catch {
    return DEFAULT_THEME // private mode / storage blocked
  }
}

let current: ThemePreset = DEFAULT_THEME
const listeners = new Set<() => void>()

function emit(): void {
  for (const fn of listeners) fn()
}

export function setTheme(name: string): void {
  const next = themeByName(name)
  if (next.name === current.name) return
  current = next
  applyTheme(next)
  try {
    localStorage.setItem(STORAGE_KEY, next.name)
  } catch {
    /* nothing to persist to — the choice still holds for this visit */
  }
  emit()
}

/** Called once from main.tsx, before the first paint of the tree. */
export function initTheme(): void {
  current = load()
  applyTheme(current)
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useTheme(): ThemePreset {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => DEFAULT_THEME, // no localStorage on the server / in a prerender
  )
}
