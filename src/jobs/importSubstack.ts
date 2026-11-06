import type { TaskConfig } from 'payload'

import { importSubstack } from '../lib/substack'

// Runs every hour inside the app (see `jobs.autoRun` in payload.config.ts).
export const ImportSubstackTask: TaskConfig<'importSubstack'> = {
  slug: 'importSubstack',
  retries: 2,
  schedule: [{ cron: '0 5 * * * *', queue: 'hourly' }],
  outputSchema: [
    { name: 'created', type: 'number' },
    { name: 'seen', type: 'number' },
  ],
  handler: async ({ req }) => {
    const output = await importSubstack(req.payload)
    return { output }
  },
}
