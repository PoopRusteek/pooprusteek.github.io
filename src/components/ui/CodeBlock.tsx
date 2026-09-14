import type { ReactNode } from 'react'

/** A titled terminal-style block. Content is pre-formatted and scrolls
 *  horizontally on its own so the page never does. */
export default function CodeBlock({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`min-w-0 overflow-hidden border border-line bg-panel-deep ${className}`}
    >
      {title && (
        <p className="truncate border-b border-line bg-panel px-4 py-2 text-[11px] text-dim">
          {title}
        </p>
      )}
      <pre className="overflow-x-auto p-5 text-[11px] leading-6 text-dim sm:text-xs">
        <code>{children}</code>
      </pre>
    </div>
  )
}
