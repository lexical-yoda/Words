import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { Body } from '@/components/Body'
import { Avatar, KIND_LABEL, toneOf } from '@/components/QuoteCard'
import { Win } from '@/components/Win'
import { asAuthor, fmtDate, getQuote, listQuotes, num } from '@/lib/data'

type Props = { params: Promise<{ n: string }> }

const load = async (params: Props['params']) => {
  const n = Number.parseInt((await params).n, 10)
  return Number.isFinite(n) ? getQuote(n) : null
}

export async function generateMetadata({ params }: Props) {
  const q = await load(params)
  if (!q) return {}
  const who = asAuthor(q.author)?.name
  return { title: `${num(q.number)}${who ? ` · ${who}` : ''}`, description: q.text?.slice(0, 160) }
}

export default async function QuotePage({ params }: Props) {
  const q = await load(params)
  if (!q) notFound()
  const a = asAuthor(q.author)
  const n = q.number || 0
  // Neighbours among the quotes on show, so a hidden one is skipped.
  const numbers = (await listQuotes()).map((x) => x.number || 0)
  const at = numbers.indexOf(n)
  const prev = at > 0 ? numbers[at - 1] : null
  const next = at >= 0 && at < numbers.length - 1 ? numbers[at + 1] : null
  return (
    <div className="wrap page">
      <p className="path crumbs">
        <Link href="/quotes">~/word_collector</Link> / {num(n)}.txt
      </p>
      <Win
        title={`${num(n)}.txt`}
        tone={toneOf(q)}
        className="w-quote"
        status={
          <>
            <span>kept on {fmtDate(q.added)}</span>
            <span>{KIND_LABEL[a?.kind || 'unknown']}</span>
          </>
        }
      >
        <div className="qpage">
          <span className="qmark qmark-xl" aria-hidden="true">
            “
          </span>
          <blockquote className="qtext qtext-xxl">{q.text}</blockquote>
          <div className="qpage-credit">
            <Avatar q={q} size={56} />
            <div>
              {a ? (
                <Link href={`/authors/${a.slug}`} className="qpage-name">
                  {a.name}
                </Link>
              ) : (
                <span className="qpage-name">Uncredited</span>
              )}
              {q.sourceTitle ? (
                <p className="muted">
                  {q.sourceUrl ? (
                    <a href={q.sourceUrl} target="_blank" rel="noopener">
                      {q.sourceTitle} ↗
                    </a>
                  ) : (
                    q.sourceTitle
                  )}
                </p>
              ) : null}
            </div>
          </div>
          {q.why ? (
            <section className="why">
              <p className="label">why I love it</p>
              <Body data={q.why} className="prose prose-why" />
            </section>
          ) : null}
          {q.tags?.length ? (
            <ul className="tags">
              {q.tags.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Win>
      <nav className="qnav" aria-label="More quotes">
        {prev ? (
          <Link className="btn" href={`/quotes/${prev}`}>
            ← {num(prev)}
          </Link>
        ) : (
          <span />
        )}
        <a className="btn" href="/quotes/random">
          Random ↻
        </a>
        {next ? (
          <Link className="btn" href={`/quotes/${next}`}>
            {num(next)} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
