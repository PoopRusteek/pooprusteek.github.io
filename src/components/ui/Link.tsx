import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import type { Lang } from '../../i18n'
import { href, navigate, useLang } from '../../lib/route-store'

/**
 * Internal navigation. A real `<a href>` with a real URL — middle-click,
 * ⌘-click and "copy link" keep working, and crawlers follow it; only a
 * plain left click is intercepted and handed to the router.
 */
export default function Link({
  to,
  lang,
  className,
  children,
  onNavigate,
  ...rest
}: {
  to: string
  /** defaults to the current page's language */
  lang?: Lang
  className?: string
  children: ReactNode
  onNavigate?: () => void
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>) {
  const currentLang = useLang()
  const target = lang ?? currentLang
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(to, target)
    onNavigate?.()
  }
  return (
    <a
      href={href(to, target)}
      hrefLang={lang && lang !== currentLang ? lang : undefined}
      onClick={click}
      className={className}
      {...rest}
    >
      {children}
    </a>
  )
}
