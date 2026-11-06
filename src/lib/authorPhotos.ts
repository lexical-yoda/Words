import type { Payload } from 'payload'

import type { Author } from '../payload-types'

// Fills in missing author photos with the free-licensed lead image of the
// author's Wikipedia article, credited in the image caption as its licence
// requires. Only empty photos are filled, so an uploaded photo always wins.
// Friends and Lexi's own entries are never looked up.

const UA = { 'user-agent': 'words.l3xj.com author photos (https://words.l3xj.com)' }
const RECHECK_DAYS = 14

// Articles for authors whose seed entry carries no Wikipedia link.
const ARTICLE_BY_SLUG: Record<string, string> = {
  'roo-panes': 'Roo_Panes',
  'shawn-james': 'Shawn_James_(musician)',
  'mark-manson': 'Mark_Manson',
  'peter-mckinnon': 'Peter_McKinnon',
  veritasium: 'Veritasium',
}

const getJSON = async (url: string) => {
  const res = await fetch(url, { headers: UA })
  if (!res.ok) throw new Error(`${res.status} from ${new URL(url).host}`)
  return res.json()
}

const stripTags = (html: string) =>
  html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()

function articleOf(a: Author): string | null {
  const wiki = a.links?.find((l) => /wikipedia\.org\/wiki\//.test(l.url))
  if (wiki) return decodeURIComponent(wiki.url.split('/wiki/')[1])
  return ARTICLE_BY_SLUG[a.slug || ''] || null
}

type FreeImage = { url: string; credit: string; page: string }

// `pilicense=free` makes Wikipedia return only a freely licensed page image.
export async function freeImageFor(article: string): Promise<FreeImage | null> {
  const p = await getJSON(
    `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages&piprop=name&pilicense=free&titles=${encodeURIComponent(article)}`,
  )
  const name = (Object.values(p.query?.pages || {})[0] as any)?.pageimage
  if (!name) return null
  for (const host of ['commons.wikimedia.org', 'en.wikipedia.org']) {
    const q = await getJSON(
      `https://${host}/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata%7Curl&iiurlwidth=800&titles=${encodeURIComponent('File:' + name)}`,
    )
    const ii = (Object.values(q.query?.pages || {})[0] as any)?.imageinfo?.[0]
    if (!ii?.thumburl) continue
    const m = ii.extmetadata || {}
    const artist = stripTags(m.Artist?.value || '') || 'Unknown author'
    const licence = m.LicenseShortName?.value || 'see source'
    const where = host.startsWith('commons') ? 'Wikimedia Commons' : 'Wikipedia'
    return { url: ii.thumburl, credit: `Photo: ${artist.slice(0, 80)}, ${licence}, via ${where}`, page: ii.descriptionurl }
  }
  return null
}

export async function fillAuthorPhotos(payload: Payload) {
  const since = new Date(Date.now() - RECHECK_DAYS * 864e5).toISOString()
  const res = await payload.find({
    collection: 'authors',
    where: {
      and: [
        { photo: { exists: false } },
        { kind: { not_in: ['friend', 'self'] } },
        { or: [{ photoLookedUpAt: { exists: false } }, { photoLookedUpAt: { less_than: since } }] },
      ],
    },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })
  let filled = 0
  for (const a of res.docs) {
    const article = articleOf(a)
    let photo: number | undefined
    if (article) {
      try {
        const img = await freeImageFor(article)
        if (img) {
          const r = await fetch(img.url, { headers: UA })
          if (r.ok) {
            const mimetype = r.headers.get('content-type')?.split(';')[0] || 'image/jpeg'
            const data = Buffer.from(await r.arrayBuffer())
            const ext = mimetype === 'image/png' ? 'png' : 'jpg'
            const media = await payload.create({
              collection: 'media',
              data: { alt: `Portrait of ${a.name}`, caption: img.credit },
              file: { data, mimetype, name: `author-${a.slug}.${ext}`, size: data.length },
              overrideAccess: true,
            })
            photo = media.id as number
          }
        }
      } catch (err) {
        payload.logger.warn({ err, author: a.slug }, 'Author photo lookup failed')
      }
    }
    const links = a.links || []
    const addWiki =
      article && !links.some((l) => /wikipedia\.org/.test(l.url))
        ? [{ label: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${article}` }]
        : []
    await payload.update({
      collection: 'authors',
      id: a.id,
      data: {
        photoLookedUpAt: new Date().toISOString(),
        ...(photo ? { photo } : {}),
        ...(photo && addWiki.length ? { links: [...links, ...addWiki] } : {}),
      },
      overrideAccess: true,
    })
    if (photo) filled++
  }
  payload.logger.info(`Author photos: ${filled} added, ${res.docs.length} authors checked`)
  return { filled, checked: res.docs.length }
}
