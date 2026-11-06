import Link from 'next/link'
import React from 'react'

import { plainText } from '@/components/Body'
import { PlexusHands } from '@/components/PlexusHands'
import { Credit, toneOf } from '@/components/QuoteCard'
import { Win } from '@/components/Win'
import { fmtDate, listQuotes, listWritings, num } from '@/lib/data'
import { WRITING_TONE } from '@/lib/tones'

export default async function Home() {
  const [writings, quotes] = await Promise.all([listWritings(6), listQuotes()])
  const q = quotes.length ? quotes[Math.floor(Math.random() * quotes.length)] : null

  return (
    <div className="wrap home">
      <section className="hero">
        <Win title="welcome.exe" className="w-hero" status={<><span>{writings.length} pieces · {quotes.length} quotes</span><span>ready</span></>}>
          <div className="hero-body">
            <p className="label label-accent">Lexi · words</p>
            <h1 className="h1">
              Things I wrote, and <b className="iri">words I keep</b>.
            </h1>
            <p className="lede">
              Stories and reflections from the inside of my head, and a collection of lines by other people that stopped me
              mid-scroll. Collected slowly, kept on purpose.
            </p>
            <div className="btns">
              <Link className="btn btn-solid" href="/writing">
                Read the writing →
              </Link>
              <Link className="btn" href="/quotes">
                Open the Word Collector
              </Link>
            </div>
          </div>
          <div className="hero-art screen" aria-hidden="true">
            <PlexusHands />
            <span className="anno a-tl">fig.01 · reaching</span>
            <span className="anno a-br">{quotes.length} words kept</span>
          </div>
        </Win>
      </section>

      {q ? (
        <section className="today" aria-label="A random quote">
          <Win title={`random_quote · ${num(q.number)}`} tone={toneOf(q)} className="w-today">
            <div className="today-body">
              <blockquote className="qtext qtext-xl">{q.text}</blockquote>
              <div className="today-foot">
                <Credit q={q} />
                <div className="btns">
                  <Link className="btn" href={`/quotes/${q.number}`}>
                    Why this one
                  </Link>
                  <a className="btn" href="/quotes/random">
                    Another ↻
                  </a>
                </div>
              </div>
            </div>
          </Win>
        </section>
      ) : null}

      <section className="latest" aria-labelledby="latest-h">
        <header className="sec-head">
          <p className="path">~/writing · latest</p>
          <h2 className="h2" id="latest-h">
            Recent <b>writing</b>
          </h2>
        </header>
        <ul className="wlist">
          {writings.map((w) => (
            <li key={w.id}>
              <Link href={`/w/${w.slug}`} className={`wrow tone-${WRITING_TONE[w.kind || 'essay']}`}>
                <span className="wrow-kind">{w.kind}</span>
                <span className="wrow-title">{w.title}</span>
                <span className="wrow-ex">{w.excerpt || plainText(w.body, 160)}</span>
                <span className="wrow-date">{fmtDate(w.writtenOn)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link className="arrow-link" href="/writing">
          All writing →
        </Link>
      </section>
    </div>
  )
}
