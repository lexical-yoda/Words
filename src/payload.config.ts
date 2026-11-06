import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { FixedToolbarFeature, HorizontalRuleFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Authors } from './collections/Authors'
import { Media } from './collections/Media'
import { Quotes } from './collections/Quotes'
import { Users } from './collections/Users'
import { Writings } from './collections/Writings'
import { Counters } from './globals/Counters'
import { FillAuthorPhotosTask } from './jobs/fillAuthorPhotos'
import { ImportSubstackTask } from './jobs/importSubstack'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: { titleSuffix: ' · words' },
  },
  collections: [Writings, Quotes, Authors, Media, Users],
  globals: [Counters],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature(), HorizontalRuleFeature()],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
    // Schema changes go through migrations (npm run migrate:create), which
    // the server applies by itself on start; see the runbook.
    push: false,
    prodMigrations: migrations,
  }),
  graphQL: { disable: true },
  jobs: {
    tasks: [ImportSubstackTask, FillAuthorPhotosTask],
    // The scheduler only runs in the long-lived server, never during a build.
    autoRun: [{ cron: '0 * * * * *', queue: 'hourly' }],
    shouldAutoRun: () => process.env.DISABLE_JOBS !== 'true',
    deleteJobOnComplete: true,
  },
  sharp,
  plugins: [],
})
