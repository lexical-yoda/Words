import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { Body, plainText } from '@/components/Body'
import { Win } from '@/components/Win'
import { asMedia, fmtDate, getWriting } from '@/lib/data'
import { WRITING_TONE } from '@/lib/tones'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const w = await getWriting((await params).slug)
  if (!w) return {}
  const cover = asMedia(w.cover)
  return {
    title: w.title,
    description: w.excerpt || plainText(w.body, 160),
    openGraph: cover?.url ? { images: [cover.sizes?.wide?.url || cover.url] } : undefined,
  }
}

export default async function WritingPage({ params }: Props) {
  const w = await getWriting((await params).slug)
  if (!w) notFound()
  const cover = asMedia(w.cover)
  const words = plainText(w.body, 1e9).split(/\s+/).filter(Boolean).length
  return (
    <div className="wrap page">
      <p className="path crumbs">
        <Link href="/writing">~/writing</Link> / {w.slug}.md
      </p>
      <Win
        title={`${w.slug}.md`}
        tone={WRITING_TONE[w.kind || 'essay']}
        className="w-doc"
        status={
          <>
            <span>
              {words} words · {Math.max(1, Math.round(words / 220))} min read
            </span>
            <span>{w.kind}</span>
          </>
        }
      >
        <div className="doc">
          <header className="doc-head">
            <p className="label label-accent">
              {w.kind} · {fmtDate(w.writtenOn)}
            </p>
            <h1 className="h1 doc-title">{w.title}</h1>
            {w.excerpt ? <p className="lede">{w.excerpt}</p> : null}
          </header>
          {cover?.url ? (
            <figure className="fig fig-cover">
              <img src={cover.sizes?.wide?.url || cover.url} alt={cover.alt || ''} />
              {cover.caption ? <figcaption>{cover.caption}</figcaption> : null}
            </figure>
          ) : null}
          <Body data={w.body} />
          {w.substackUrl ? (
            <p className="doc-also">
              <span className="spark-dot" aria-hidden="true" /> Also on{' '}
              <a href={w.substackUrl} target="_blank" rel="noopener">
                Substack ↗
              </a>
            </p>
          ) : null}
        </div>
      </Win>
      <Link className="arrow-link back" href="/writing">
        ← All writing
      </Link>
    </div>
  )
}
