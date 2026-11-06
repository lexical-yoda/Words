import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { Media } from '../payload-types'

// Images inside a piece render as a figure with their caption, using the
// resized copies Payload made on upload.
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }: any) => {
    const m = node.value as Media
    if (!m || typeof m !== 'object' || !m.url) return null
    const wide = m.sizes?.wide?.url || m.sizes?.card?.url || m.url
    return (
      <figure className="fig">
        <img src={wide} alt={m.alt || ''} width={m.width || undefined} height={m.height || undefined} loading="lazy" />
        {m.caption ? <figcaption>{m.caption}</figcaption> : null}
      </figure>
    )
  },
})

export function Body({ data, className = 'prose' }: { data: any; className?: string }) {
  if (!data?.root?.children?.length) return null
  return <RichText data={data} converters={converters} className={className} disableContainer={false} />
}

// The opening words of a rich-text body, for lists.
export function plainText(data: any, max = 220): string {
  const out: string[] = []
  const walk = (n: any) => {
    if (out.join(' ').length > max) return
    if (typeof n?.text === 'string') out.push(n.text)
    ;(n?.children || []).forEach(walk)
  }
  walk(data?.root)
  const s = out.join(' ').replace(/\s+/g, ' ').trim()
  return s.length > max ? s.slice(0, max).replace(/\s\S*$/, '') + '…' : s
}
