/**
 * "Turkey Tour 2026!" -> "turkey-tour-2026", "Zürich" -> "zurich"
 *
 * Kept free of any payload imports so the admin client component can use it
 * without pulling server config into the browser bundle.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD') // split accented letters into base + combining mark
    .replace(/[̀-ͯ]/g, '') // drop the marks, keep the base letter
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // drop remaining punctuation
    .replace(/[\s_-]+/g, '-') // whitespace and underscores become dashes
    .replace(/^-+|-+$/g, '') // no leading or trailing dashes
}
