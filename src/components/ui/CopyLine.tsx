import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * A shell line you can take with you: prompt, command, copy button.
 * Used for every install command on the site, so the copy affordance and
 * the confirmation read identically everywhere.
 */
export default function CopyLine({
  command,
  display,
  className = '',
  tone = 'ok',
}: {
  /** what lands in the clipboard */
  command: string
  /** what's shown, when the full command is too long for the box */
  display?: string
  className?: string
  tone?: 'ok' | 'accent'
}) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable (insecure context) — the text is selectable */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={t('common.copyTitle')}
      className={`group flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-line bg-panel-deep px-4 py-3 text-left text-xs text-soft transition-colors hover:border-accent sm:text-sm ${className}`}
    >
      <span className={`shrink-0 ${tone === 'ok' ? 'text-ok' : 'text-accent'}`}>❯</span>
      <span className="truncate">{display ?? command}</span>
      <span className="ml-auto shrink-0 text-dim transition-colors group-hover:text-accent-soft">
        {copied ? <span className="text-ok">{t('common.copied')}</span> : '⧉'}
      </span>
    </button>
  )
}
