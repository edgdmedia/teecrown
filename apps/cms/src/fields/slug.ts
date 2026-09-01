import type { Field } from 'payload'

import { slugify } from './slugify'

export { slugify }

/**
 * A slug that fills itself in from another field (the title, by default).
 *
 * Two layers, deliberately:
 *
 * - SlugField (admin component) mirrors the title as you type on a NEW
 *   document, and backs off as soon as you edit the field yourself.
 * - The `beforeValidate` hook below is the safety net: it normalises whatever
 *   was typed and derives a slug from the title if the field is still blank at
 *   save time. It runs before `required` is enforced, so saving with it empty
 *   still passes, and it covers API writes where no admin UI is involved.
 *
 * Sits in the sidebar: it is a URL detail, not the first thing you should meet
 * when writing a post.
 */
export const slugField = (from: string = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Used in the page URL. Generated from the title — edit if you need to.',
    components: {
      Field: '/fields/SlugField#SlugField',
    },
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)

        const source = data?.[from]
        if (typeof source === 'string' && source.trim()) return slugify(source)

        return value
      },
    ],
  },
})
