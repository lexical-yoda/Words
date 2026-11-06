import Link from 'next/link'
import React from 'react'

import { plainText } from '@/components/Body'
import { Win } from '@/components/Win'
import { fmtDate, listWritings } from '@/lib/data'
import { WRITING_TONE } from '@/lib/tones'

export const metadata = { title: 'Writing' }

export default async function WritingIndex() {
  const writings = await listWritings()
  return (
    <div className="wrap page">
      <header className="sec-head">
        <p className="path">~/writing · {writings.length} pieces</p>
        <h1 className="h1">
          All the <b>writing</b>
        </h1>
        <p className="lede">Stories, reflections and the occasional thought that needed somewhere to go.</p>
      </header>
      <Win title="writing/" className="w-folder" status={<><span>{writings.length} objects</span><span>sorted by date</span></>}>
        <ul className="wlist wlist-in">
          {writings.map((w) => (
            <li key={w.id}>
              <Link href={`/w/${w.slug}`} className={`wrow tone-${WRITING_TONE[w.kind || 'essay']}`}>
                <span className="wrow-kind">{w.kind}</span>
                <span className="wrow-title">{w.title}</span>
                <span className="wrow-ex">{w.excerpt || plainText(w.body, 180)}</span>
                <span className="wrow-date">{fmtDate(w.writtenOn)}</span>
              </Link>
            </li>
          ))}
        </ul>
        {writings.length === 0 ? <p className="empty">Nothing published yet.</p> : null}
      </Win>
    </div>
  )
}
