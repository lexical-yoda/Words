import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { KIND_LABEL, KIND_TONE, QuoteCard } from '@/components/QuoteCard'
import { Win } from '@/components/Win'
import { asMedia, getAuthor } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const r = await getAuthor((await params).slug)
  return r ? { title: r.author.name, description: r.author.note || `Quotes by ${r.author.name}` } : {}
}

export default async function AuthorPage({ params }: Props) {
  const r = await getAuthor((await params).slug)
  if (!r) notFound()
  const { author: a, quotes } = r
  const photo = asMedia(a.photo)
  const tone = KIND_TONE[a.kind || 'unknown']
  return (
    <div className="wrap page">
      <p className="path crumbs">
        <Link href="/quotes">~/word_collector</Link> / authors / {a.slug}
      </p>
      <Win title={`${a.slug}.vcf`} tone={tone} className="w-author" status={<><span>{quotes.length} quotes kept</span><span>{KIND_LABEL[a.kind || 'unknown']}</span></>}>
        <div className="author">
          {photo?.url ? (
            <img className="author-photo" src={photo.sizes?.card?.url || photo.url} alt={photo.alt || a.name} />
          ) : (
            <div className={`author-photo author-ph tone-${tone}`} aria-hidden="true">
              {a.name.replace(/\(.*?\)/g, '').trim().slice(0, 1)}
            </div>
          )}
          <div className="author-text">
            <p className="label label-accent">{KIND_LABEL[a.kind || 'unknown']}</p>
            <h1 className="h1">{a.name}</h1>
            {a.note ? <p className="lede">{a.note}</p> : null}
            {a.links?.length ? (
              <div className="btns">
                {a.links.map((l) => (
                  <a key={l.id || l.url} className="btn" href={l.url} target="_blank" rel="noopener">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Win>
      <div className="qgrid">
        {quotes.map((q) => (
          <QuoteCard key={q.id} q={{ ...q, author: a }} />
        ))}
      </div>
    </div>
  )
}
