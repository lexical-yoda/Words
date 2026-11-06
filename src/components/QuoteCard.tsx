import Link from 'next/link'
import React from 'react'

import { asAuthor, asMedia, num, type Quote } from '../lib/data'
import { KIND_LABEL, KIND_TONE } from '../lib/tones'

export { KIND_LABEL, KIND_TONE }

export const toneOf = (q: Quote) => KIND_TONE[asAuthor(q.author)?.kind || 'unknown']

export function Avatar({ q, size = 34 }: { q: Quote; size?: number }) {
  const a = asAuthor(q.author)
  const photo = asMedia(a?.photo)
  const src = photo?.sizes?.thumb?.url || photo?.url
  const initials = (a?.name || '?')
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return src ? (
    <img className="avatar" src={src} alt="" width={size} height={size} style={{ width: size, height: size }} />
  ) : (
    <span className={`avatar avatar-ph tone-${toneOf(q)}`} style={{ width: size, height: size }} aria-hidden="true">
      {initials || '·'}
    </span>
  )
}

export function Credit({ q, link = true }: { q: Quote; link?: boolean }) {
  const a = asAuthor(q.author)
  const name = a?.name || 'Uncredited'
  return (
    <span className="credit">
      <Avatar q={q} />
      <span className="credit-text">
        {a && link ? (
          <Link href={`/authors/${a.slug}`} className="credit-name">
            {name}
          </Link>
        ) : (
          <span className="credit-name">{name}</span>
        )}
        {q.sourceTitle ? <span className="credit-src">{q.sourceTitle}</span> : null}
      </span>
    </span>
  )
}

export function QuoteCard({ q, big = false }: { q: Quote; big?: boolean }) {
  const a = asAuthor(q.author)
  return (
    <article
      className={`win qcard tone-${toneOf(q)}${big ? ' qcard-big' : ''}`}
      data-kind={a?.kind || 'unknown'}
      data-search={`${q.text} ${a?.name || ''} ${q.sourceTitle || ''}`.toLowerCase()}
    >
      <div className="win-bar">
        <span className="win-title">{num(q.number)}.txt</span>
        <span className="win-grip" aria-hidden="true" />
        <span className="win-ctrls" aria-hidden="true">
          <i>_</i>
          <i>□</i>
          <i>×</i>
        </span>
      </div>
      <Link href={`/quotes/${q.number}`} className="qcard-body">
        <span className="qmark" aria-hidden="true">
          “
        </span>
        <blockquote className="qtext">{q.text}</blockquote>
      </Link>
      <footer className="qcard-foot">
        <Credit q={q} />
        {q.why ? <span className="why-dot" title="Has a note on why I love it" /> : null}
      </footer>
    </article>
  )
}
