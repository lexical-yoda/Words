import React from 'react'

import { QuoteBrowser } from '@/components/QuoteBrowser'
import { QuoteCard } from '@/components/QuoteCard'
import { asAuthor, listQuotes } from '@/lib/data'

export const metadata = {
  title: 'Word Collector',
  description: 'Lines by other people that I could not let go of, collected one at a time.',
}

export default async function Quotes() {
  const quotes = await listQuotes()
  const counts: Record<string, number> = {}
  quotes.forEach((q) => {
    const k = asAuthor(q.author)?.kind || 'unknown'
    counts[k] = (counts[k] || 0) + 1
  })
  return (
    <div className="wrap page">
      <header className="sec-head">
        <p className="path">~/word_collector · {quotes.length} kept</p>
        <h1 className="h1">
          The <b className="iri">Word Collector</b>
        </h1>
        <p className="lede">
          Some people collect stamps. I collect sentences: from books, videos, friends, anime, and the odd post that
          showed up at exactly the right time. Each one has a number, and the number never changes.
        </p>
      </header>
      <QuoteBrowser counts={counts} total={quotes.length}>
        {quotes.map((q) => (
          <QuoteCard key={q.id} q={q} />
        ))}
      </QuoteBrowser>
    </div>
  )
}
