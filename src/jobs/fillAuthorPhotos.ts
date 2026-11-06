import type { TaskConfig } from 'payload'

import { fillAuthorPhotos } from '../lib/authorPhotos'

// Hourly, but each author is looked up at most once every two weeks, so this
// costs a handful of requests at most once the photos are in.
export const FillAuthorPhotosTask: TaskConfig<'fillAuthorPhotos'> = {
  slug: 'fillAuthorPhotos',
  retries: 1,
  schedule: [{ cron: '0 35 * * * *', queue: 'hourly' }],
  outputSchema: [
    { name: 'filled', type: 'number' },
    { name: 'checked', type: 'number' },
  ],
  handler: async ({ req }) => {
    const output = await fillAuthorPhotos(req.payload)
    return { output }
  },
}
