import type { Access } from 'payload'

// The only account is the owner's, so "logged in" means "may edit".
export const loggedIn: Access = ({ req }) => Boolean(req.user)

export const anyone: Access = () => true

// Visitors see published writings only; the owner sees drafts too.
export const publishedOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }

// Visitors see quotes marked public only.
export const publicOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { public: { equals: true } }
