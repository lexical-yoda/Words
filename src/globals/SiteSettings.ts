import type { GlobalConfig } from 'payload'

import { anyone, loggedIn } from '../access'

// Site-wide pictures and settings that belong to the content, not the code,
// so they can change without a redeploy.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: {
    read: anyone,
    update: loggedIn,
  },
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Home page image',
      admin: {
        description:
          'Shown on the home page as an animated pixel drawing: light parts become dots. Works best with white art on a black background. Left empty, the plexus hands are drawn instead.',
      },
    },
  ],
}
