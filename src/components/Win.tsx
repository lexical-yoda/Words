import React from 'react'

// Retro window chrome from l3xj.com: a title bar with pinstripe grip and the
// _ □ × controls, then the body. `tone` tints the title bar.
export function Win({
  title,
  tone,
  status,
  className = '',
  children,
  as: Tag = 'article',
}: {
  title: string
  tone?: string
  status?: React.ReactNode
  className?: string
  children: React.ReactNode
  as?: 'article' | 'section' | 'aside' | 'div'
}) {
  return (
    <Tag className={`win ${tone ? `tone-${tone}` : ''} ${className}`}>
      <div className="win-bar">
        <span className="win-title">{title}</span>
        <span className="win-grip" aria-hidden="true" />
        <span className="win-ctrls" aria-hidden="true">
          <i>_</i>
          <i>□</i>
          <i>×</i>
        </span>
      </div>
      {children}
      {status ? <div className="win-status">{status}</div> : null}
    </Tag>
  )
}
