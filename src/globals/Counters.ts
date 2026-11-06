import type { GlobalConfig } from 'payload'

import { loggedIn } from '../access'

// Remembers the highest quote number ever handed out, so the number of a
// deleted quote is never reused.
export const Counters: GlobalConfig = {
  slug: 'counters',
  admin: {
    group: 'Settings',
    hidden: true,
  },
  access: {
    read: loggedIn,
    update: loggedIn,
  },
  fields: [{ name: 'lastQuoteNumber', type: 'number', defaultValue: 0, required: true }],
}
