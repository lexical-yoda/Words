import type { CollectionConfig } from 'payload'

import { loggedIn } from '../access'

// The admin login. Only a logged-in user can create another, so there is no
// public sign-up; repeated wrong passwords lock the account for 15 minutes.
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Settings',
  },
  access: {
    create: loggedIn,
    read: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  auth: {
    useAPIKey: true,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 7 * 24 * 60 * 60,
    cookies: {
      sameSite: 'Strict',
      secure: process.env.SECURE_COOKIES === 'true',
    },
  },
  fields: [],
}
