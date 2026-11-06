import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { loggedIn, publicOrLoggedIn } from '../access'

export const SOURCE_TYPES = [
  { label: 'Book', value: 'book' },
  { label: 'Poem', value: 'poem' },
  { label: 'Video', value: 'video' },
  { label: 'Song', value: 'song' },
  { label: 'Album', value: 'album' },
  { label: 'TV show', value: 'tv' },
  { label: 'Anime or manga', value: 'anime' },
  { label: 'Film', value: 'film' },
  { label: 'Interview or talk', value: 'talk' },
  { label: 'Social post', value: 'post' },
  { label: 'Conversation', value: 'conversation' },
  { label: 'Writing', value: 'writing' },
  { label: 'Other', value: 'other' },
] as const

const firstWords = (text: unknown, n = 8) => {
  const words = String(text || '').replace(/\s+/g, ' ').trim().split(' ')
  return words.slice(0, n).join(' ') + (words.length > n ? '…' : '')
}

// A new quote takes the next number after the highest ever used. Numbers
// are permanent: editing keeps them, deleting retires them.
const assignNumber: CollectionBeforeChangeHook = async ({ data, operation, req, originalDoc }) => {
  if (operation === 'create' && !data.number) {
    const counters = await req.payload.findGlobal({ slug: 'counters', req, overrideAccess: true })
    const top = await req.payload.find({
      collection: 'quotes',
      sort: '-number',
      limit: 1,
      depth: 0,
      req,
      overrideAccess: true,
    })
    const highest = Math.max(counters.lastQuoteNumber || 0, top.docs[0]?.number || 0)
    data.number = highest + 1
  }
  if (operation === 'update' && originalDoc?.number) data.number = originalDoc.number
  const n = String(data.number).padStart(3, '0')
  data.label = `#${n} · ${firstWords(data.text) || '(text to add)'}`
  return data
}

export const Quotes: CollectionConfig = {
  slug: 'quotes',
  labels: { singular: 'Quote', plural: 'Quotes' },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'author', 'public', 'added'],
    listSearchableFields: ['text', 'label', 'sourceTitle'],
    group: 'Word Collector',
  },
  defaultSort: 'number',
  access: {
    read: publicOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  hooks: {
    beforeChange: [assignNumber],
    afterChange: [
      async ({ doc, req }) => {
        const counters = await req.payload.findGlobal({ slug: 'counters', req, overrideAccess: true })
        if ((doc.number || 0) > (counters.lastQuoteNumber || 0)) {
          await req.payload.updateGlobal({
            slug: 'counters',
            data: { lastQuoteNumber: doc.number },
            req,
            overrideAccess: true,
          })
        }
      },
    ],
  },
  fields: [
    {
      name: 'number',
      type: 'number',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Given automatically and never reused.',
      },
    },
    { name: 'label', type: 'text', admin: { hidden: true } },
    {
      name: 'text',
      type: 'textarea',
      admin: {
        rows: 6,
        description: 'Line breaks are kept. A quote with no text yet stays off the site.',
      },
    },
    { name: 'author', type: 'relationship', relationTo: 'authors' },
    {
      type: 'row',
      fields: [
        { name: 'sourceTitle', type: 'text', label: 'Source' },
        { name: 'sourceType', type: 'select', options: [...SOURCE_TYPES], label: 'Source type' },
      ],
    },
    { name: 'sourceUrl', type: 'text', label: 'Source link' },
    {
      name: 'why',
      type: 'richText',
      label: 'Why I love it',
    },
    {
      name: 'added',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    {
      name: 'public',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Untick to keep it off the site.' },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
}
