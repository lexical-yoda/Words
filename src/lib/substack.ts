import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import type { Payload } from 'payload'

export const SUBSTACK_FEED = process.env.SUBSTACK_FEED || 'https://lexicalyoda.substack.com/feed'

type FeedItem = { title: string; link: string; pubDate: string; description: string; html: string }

export async function fetchFeed(url = SUBSTACK_FEED): Promise<FeedItem[]> {
  const res = await fetch(url, { headers: { 'user-agent': 'words.l3xj.com importer' } })
  if (!res.ok) throw new Error(`Substack feed answered ${res.status}`)
  const xml = await res.text()
  const doc = new JSDOM(xml, { contentType: 'text/xml' }).window.document
  return [...doc.querySelectorAll('item')].map((item) => {
    const text = (tag: string) => item.getElementsByTagName(tag)[0]?.textContent?.trim() || ''
    return {
      title: text('title'),
      link: text('link'),
      pubDate: text('pubDate'),
      description: text('description'),
      html: text('content:encoded'),
    }
  })
}

const MARK = (id: number | string) => `@@media:${id}@@`

// Substack wraps images in figures and adds subscribe buttons; images are
// copied into the media library so the site never depends on Substack's CDN.
async function prepareHTML(payload: Payload, html: string, title: string) {
  const dom = new JSDOM(`<body>${html}</body>`)
  const body = dom.window.document.body
  body
    .querySelectorAll('.subscription-widget-wrap, .button-wrapper, .captioned-button-wrap, .share-dialog, script, style')
    .forEach((el) => el.remove())

  for (const img of [...body.querySelectorAll('img')]) {
    const src = img.getAttribute('src')
    const holder = img.closest('figure') || img.closest('picture') || img
    const caption = holder.querySelector?.('figcaption')?.textContent?.trim() || ''
    let marker = ''
    if (src) {
      try {
        const res = await fetch(src)
        if (res.ok) {
          const mimetype = res.headers.get('content-type')?.split(';')[0] || 'image/jpeg'
          const data = Buffer.from(await res.arrayBuffer())
          const ext = mimetype.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
          const media = await payload.create({
            collection: 'media',
            data: { alt: img.getAttribute('alt') || caption || `Image from ${title}`, caption: caption || undefined },
            file: { data, mimetype, name: `substack-${Date.now()}.${ext}`, size: data.length },
            overrideAccess: true,
          })
          marker = MARK(media.id)
        }
      } catch (err) {
        payload.logger.warn({ err, src }, 'Substack image could not be copied')
      }
    }
    const p = dom.window.document.createElement('p')
    p.textContent = marker
    holder.replaceWith(p)
  }
  return body.innerHTML
}

// Replaces the marker paragraphs left by prepareHTML with upload nodes.
function swapMarkers(state: any) {
  const children = state?.root?.children || []
  state.root.children = children
    .map((node: any) => {
      const text = node?.type === 'paragraph' ? (node.children || []).map((c: any) => c.text || '').join('') : ''
      const m = text.match(/^@@media:(\d+)@@$/)
      if (m) return { type: 'upload', relationTo: 'media', value: Number(m[1]), fields: null, format: '', version: 3 }
      if (node?.type === 'paragraph' && !text.trim() && !(node.children || []).length) return null
      return node
    })
    .filter(Boolean)
  return state
}

export async function htmlToBody(payload: Payload, html: string, title: string) {
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const prepared = await prepareHTML(payload, html, title)
  return swapMarkers(convertHTMLToLexical({ editorConfig, html: prepared, JSDOM }))
}

// Adds every Substack post not yet on the site as a published writing.
// Posts already imported (matched by their Substack link) are left alone, so
// edits made in /admin are never overwritten.
export async function importSubstack(payload: Payload) {
  const items = await fetchFeed()
  let created = 0
  for (const item of items) {
    if (!item.link) continue
    const existing = await payload.find({
      collection: 'writings',
      where: { substackUrl: { equals: item.link } },
      limit: 1,
      depth: 0,
      draft: true,
      overrideAccess: true,
    })
    if (existing.docs.length) continue
    await payload.create({
      collection: 'writings',
      data: {
        title: item.title,
        kind: 'essay',
        excerpt: item.description,
        writtenOn: new Date(item.pubDate || Date.now()).toISOString(),
        origin: 'substack',
        substackUrl: item.link,
        body: await htmlToBody(payload, item.html, item.title),
        _status: 'published',
      },
      overrideAccess: true,
    })
    created++
  }
  payload.logger.info(`Substack import: ${created} new of ${items.length} in the feed`)
  return { created, seen: items.length }
}
