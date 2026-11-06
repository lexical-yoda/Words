'use client'

import React, { useEffect, useRef, useState } from 'react'

import { KIND_LABEL, KIND_TONE } from '../lib/tones'

// Search and kind filters over the server-rendered quote cards. Cards stay in
// the HTML, so the page works without JavaScript; this only hides some.
export function QuoteBrowser({ counts, total, children }: { counts: Record<string, number>; total: number; children: React.ReactNode }) {
  const grid = useRef<HTMLDivElement>(null)
  const [q, setQ] = useState('')
  const [kind, setKind] = useState('all')
  const [shown, setShown] = useState(total)

  useEffect(() => {
    const cards = [...(grid.current?.querySelectorAll<HTMLElement>('.qcard') || [])]
    const needle = q.trim().toLowerCase()
    let n = 0
    cards.forEach((c) => {
      const on = (kind === 'all' || c.dataset.kind === kind) && (!needle || (c.dataset.search || '').includes(needle))
      c.hidden = !on
      if (on) n++
    })
    setShown(n)
  }, [q, kind])

  const kinds = Object.keys(KIND_LABEL).filter((k) => counts[k])
  return (
    <>
      <div className="qtools" role="search">
        <label className="qsearch">
          <span className="label">find</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="a word, a name, a source…" />
        </label>
        <div className="qkinds" role="group" aria-label="Filter by who said it">
          <button type="button" aria-pressed={kind === 'all'} onClick={() => setKind('all')}>
            all <span className="n">{total}</span>
          </button>
          {kinds.map((k) => (
            <button key={k} type="button" className={`tone-${KIND_TONE[k]}`} aria-pressed={kind === k} onClick={() => setKind(k)}>
              <span className="kdot" aria-hidden="true" />
              {KIND_LABEL[k]} <span className="n">{counts[k]}</span>
            </button>
          ))}
        </div>
        <p className="path" aria-live="polite">
          {shown} of {total} shown
        </p>
      </div>
      <div className="qgrid" ref={grid}>
        {children}
      </div>
      {shown === 0 ? <p className="empty">Nothing matches. Try another word.</p> : null}
    </>
  )
}
