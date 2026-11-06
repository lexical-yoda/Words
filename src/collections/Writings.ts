import type { CollectionConfig } from 'payload'

import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugFrom } from '../lib/slug'

export const WRITING_KINDS = [
  { label: 'Story', value: 'story' },
  { label: 'Essay', value: 'essay' },
  { label: 'Reflection', value: 'reflection' },
  { label: 'Poem', value: 'poem' },
  { label: 'Note', value: 'note' },
] as const

// Stories, essays and reflections. Drafts stay private until published.
export const Writings: CollectionConfig = {
  slug: 'writings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'origin', '_status', 'writtenOn'],
    group: 'Writing',
  },
  defaultSort: '-writtenOn',
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 50,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'The web address; filled in from the title if empty.' },
      hooks: { beforeValidate: [slugFrom('title')] },
    },
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'essay',
      options: [...WRITING_KINDS],
      admin: { position: 'sidebar' },
    },
    {
      name: 'writtenOn',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'One or two sentences shown in lists. Left empty, the opening of the piece is used.' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    {
      name: 'origin',
      type: 'select',
      defaultValue: 'site',
      options: [
        { label: 'Written here', value: 'site' },
        { label: 'Imported from Substack', value: 'substack' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'substackUrl',
      type: 'text',
      label: 'Substack link',
      index: true,
      admin: { position: 'sidebar' },
    },
  ],
}
