import { plainText } from '@/components/Body'
import { listWritings } from '@/lib/data'

export const dynamic = 'force-dynamic'

const x = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!)

export async function GET() {
  const site = process.env.SITE_URL || 'https://words.l3xj.com'
  const writings = await listWritings(50)
  const items = writings
    .map(
      (w) => `    <item>
      <title>${x(w.title)}</title>
      <link>${site}/w/${w.slug}</link>
      <guid isPermaLink="true">${site}/w/${w.slug}</guid>
      <pubDate>${new Date(w.writtenOn || w.createdAt).toUTCString()}</pubDate>
      <description>${x(w.excerpt || plainText(w.body, 300))}</description>
    </item>`,
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>words · Lexi</title>
    <link>${site}</link>
    <description>Stories, reflections and words worth keeping.</description>
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
