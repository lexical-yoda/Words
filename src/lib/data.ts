import config from '@payload-config'
import { getPayload } from 'payload'

import type { Where } from 'payload'

import type { Author, Media, Quote, Writing } from '../payload-types'

// Every public read goes through access control as an anonymous visitor, so
// drafts and private quotes can never leak into a page.
const anon = { overrideAccess: false } as const

export const payload = async () => getPayload({ config })

// A quote is shown only once it has text (lyric rows wait for theirs).
const shown: Where = { and: [{ public: { equals: true } }, { text: { exists: true } }, { text: { not_equals: '' } }] }

export async function listQuotes() {
  const p = await payload()
  const res = await p.find({ collection: 'quotes', where: shown, sort: 'number', limit: 1000, depth: 2, ...anon })
  return res.docs
}

export async function getQuote(number: number) {
  const p = await payload()
  const res = await p.find({
    collection: 'quotes',
    where: { and: [shown, { number: { equals: number } }] },
    limit: 1,
    depth: 2,
    ...anon,
  })
  return res.docs[0] || null
}

export async function randomQuote(): Promise<Quote | null> {
  const all = await listQuotes()
  return all.length ? all[Math.floor(Math.random() * all.length)] : null
}

export async function listWritings(limit = 100) {
  const p = await payload()
  const res = await p.find({ collection: 'writings', sort: '-writtenOn', limit, depth: 1, ...anon })
  return res.docs
}

export async function getWriting(slug: string) {
  const p = await payload()
  const res = await p.find({ collection: 'writings', where: { slug: { equals: slug } }, limit: 1, depth: 2, ...anon })
  return res.docs[0] || null
}

export async function getAuthor(slug: string) {
  const p = await payload()
  const res = await p.find({ collection: 'authors', where: { slug: { equals: slug } }, limit: 1, depth: 1, ...anon })
  const author = res.docs[0]
  if (!author) return null
  const quotes = await p.find({
    collection: 'quotes',
    where: { and: [shown, { author: { equals: author.id } }] },
    sort: 'number',
    limit: 500,
    depth: 1,
    ...anon,
  })
  return { author, quotes: quotes.docs }
}

// Narrowing helpers for relationship fields, which are ids at depth 0.
export const asAuthor = (a: Quote['author']): Author | null => (a && typeof a === 'object' ? a : null)
export const asMedia = (m: unknown): Media | null => (m && typeof m === 'object' ? (m as Media) : null)

export const num = (n?: number | null) => `#${String(n ?? 0).padStart(3, '0')}`

export const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

export type { Author, Quote, Writing }
