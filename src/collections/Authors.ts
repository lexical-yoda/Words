import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access'
import { slugFrom } from '../lib/slug'

export const AUTHOR_KINDS = [
  { label: 'Public figure', value: 'public' },
  { label: 'Creator', value: 'creator' },
  { label: 'Fictional character', value: 'character' },
  { label: 'Friend', value: 'friend' },
  { label: 'Me', value: 'self' },
  { label: 'Unknown', value: 'unknown' },
] as const

// The people (and characters) behind the quotes, credited with a photo and
// links on their own page.
export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'updatedAt'],
    group: 'Word Collector',
  },
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Filled in from the name if left empty.' },
      hooks: { beforeValidate: [slugFrom('name')] },
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'public',
      options: [...AUTHOR_KINDS],
      admin: { position: 'sidebar' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Upload one, or leave empty: public figures get their free Wikipedia photo, with its credit, within the hour.',
      },
    },
    { name: 'photoLookedUpAt', type: 'date', admin: { hidden: true } },
    {
      name: 'note',
      type: 'textarea',
      admin: { description: 'A line or two about who they are.' },
    },
    {
      name: 'links',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'quotes',
      type: 'join',
      collection: 'quotes',
      on: 'author',
      admin: { allowCreate: false },
    },
  ],
}
