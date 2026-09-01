import type { Field } from 'payload'

/** "Turkey Tour 2026!" -> "turkey-tour-2026", "Zürich" -> "zurich" */
export function slugify(input: string): string {
  return input
    .normalize('NFD') // split accented letters into base + combining mark
    .replace(/[̀-ͯ]/g, '') // drop the marks, keeping the base letter
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // drop remaining punctuation
    .replace(/[\s_-]+/g, '-') // whitespace and underscores become dashes
    .replace(/^-+|-+$/g, '') // no leading or trailing dashes
}

/**
 * A slug that fills itself in from another field (the title, by default) when
 * left blank, and normalises whatever is typed otherwise.
 *
 * `beforeValidate` runs before `required` is enforced, so an editor can save
 * with the slug empty and still pass validation.
 *
 * Lives in the sidebar: it is a URL detail, not something to meet before the
 * title when writing a post.
 */
export const slugField = (from: string = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Used in the page URL. Leave blank to generate it from the title.',
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
