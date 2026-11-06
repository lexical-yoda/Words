// First seed: authors, the 74 quotes from Lexi's note, and the Substack posts.
//
//   QUOTES_NOTE="/path/to/Quote collection.md" \
//     DISABLE_JOBS=true npm run seed
//
// Safe to run again: authors and quotes that already exist are skipped.
import fs from 'fs'
import { getPayload } from 'payload'

import config from '../payload.config'
import { importSubstack } from '../lib/substack'
import { AUTHORS } from './authors'
import { QUOTES_META, TEXT_FIXES } from './quotes-meta'

const ADDED = '2026-11-06T00:00:00.000Z'

// Mirrors the parse used for docs/quotes-plan.md: entries are separated by
// blank lines, and a line starting with "\-" or "-" is the credit.
export function parseNote(md: string): string[] {
  return md
    .trim()
    .split(/\n\s*\n/)
    .filter((b) => b.trim())
    .map((block) =>
      block
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !/^\\?\s*\\?\s*-\s/.test(l) && !/^\\-/.test(l))
        .map((l) => l.replace(/^[*"]+|[*"]+$/g, '').trim())
        .join('\n'),
    )
}

async function run() {
  const notePath = process.env.QUOTES_NOTE
  if (!notePath || !fs.existsSync(notePath)) throw new Error('Set QUOTES_NOTE to the quote collection note')
  const payload = await getPayload({ config })

  const authorIds: Record<string, number> = {}
  for (const a of AUTHORS) {
    const found = await payload.find({ collection: 'authors', where: { slug: { equals: a.slug } }, limit: 1 })
    authorIds[a.slug] = found.docs[0]
      ? (found.docs[0].id as number)
      : ((await payload.create({ collection: 'authors', data: a })).id as number)
  }

  const texts = parseNote(fs.readFileSync(notePath, 'utf8'))
  if (texts.length !== 74) throw new Error(`Expected 74 quotes in the note, found ${texts.length}`)

  let made = 0
  for (let i = 0; i < texts.length; i++) {
    const number = i + 1
    const meta = QUOTES_META[number] || {}
    const exists = await payload.find({ collection: 'quotes', where: { number: { equals: number } }, limit: 1 })
    if (exists.docs.length) continue
    const text = meta.lyric ? '' : TEXT_FIXES.reduce((t, [re, s]) => t.replace(re, s), texts[i])
    await payload.create({
      collection: 'quotes',
      data: {
        number,
        text,
        author: meta.author ? authorIds[meta.author] : undefined,
        sourceTitle: meta.sourceTitle,
        sourceType: meta.sourceType,
        sourceUrl: meta.sourceUrl,
        added: ADDED,
        public: true,
      },
    })
    made++
  }
  payload.logger.info(`Seed: ${AUTHORS.length} authors checked, ${made} quotes created`)

  if (process.env.SKIP_SUBSTACK !== 'true') await importSubstack(payload)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
