import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

import { anyone, loggedIn } from '../access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Uploaded images: author photos, covers and pictures inside writings.
// Files live next to the database so one folder holds all the site's data.
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Library',
  },
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'What the image shows, for screen readers.' },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    staticDir: process.env.MEDIA_DIR || path.resolve(dirname, '../../data/media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 240, height: 240, position: 'centre' },
      { name: 'card', width: 720 },
      { name: 'wide', width: 1440 },
    ],
    adminThumbnail: 'thumb',
  },
}
