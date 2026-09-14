import type { Route } from './route-store'

/**
 * Per-route identity: the locale key under `meta.*` that holds the page's
 * title and description, and the JSON-LD type it is published as. Shared by
 * App.tsx (runtime <head>) and scripts/prerender.ts (static <head>, sitemap,
 * llms.txt), so both always describe a page the same way.
 */
export const PAGE_META = {
  '/': { key: 'home', schema: 'home' },
  '/download': { key: 'download', schema: 'software' },
  '/alternatives': { key: 'alternatives', schema: 'article' },
  '/vs/claude-code': { key: 'vsClaudeCode', schema: 'article' },
  '/vs/codex': { key: 'vsCodex', schema: 'article' },
  '/vs/gemini-cli': { key: 'vsGeminiCli', schema: 'article' },
  '/rag': { key: 'rag', schema: 'article' },
  '/serve': { key: 'serve', schema: 'article' },
  '/architecture': { key: 'architecture', schema: 'article' },
  '/faq': { key: 'faq', schema: 'faq' },
} as const satisfies Record<Route, { key: string; schema: 'home' | 'software' | 'article' | 'faq' }>

export type PageKey = (typeof PAGE_META)[Route]['key']
