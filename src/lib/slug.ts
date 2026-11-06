import type { FieldHook } from 'payload'

export const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

// Fills an empty slug from another field (title, name) before validation.
export const slugFrom =
  (field: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[field]
    return typeof source === 'string' ? slugify(source) : value
  }
