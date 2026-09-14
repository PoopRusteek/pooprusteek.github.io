import type { MouseEvent, ReactNode } from 'react'
import { href, navigate } from '../../lib/route-store'

/**
 * Internal navigation. A real `<a href>` with a real URL — middle-click,
 * ⌘-click and "copy link" keep working; only a plain left click is
 * intercepted and handed to the router.
 */
export default function Link({
  to,
  className,
  children,
  onNavigate,
  ...rest
}: {
  to: string
  className?: string
  children: ReactNode
  onNavigate?: () => void
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>) {
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(to)
    onNavigate?.()
  }
  return (
    <a href={href(to)} onClick={click} className={className} {...rest}>
      {children}
    </a>
  )
}
