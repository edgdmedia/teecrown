import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  SanitizedCollectionConfig,
} from 'payload'

/**
 * Tells the Cloudflare frontend to drop its cached copy of a collection.
 *
 * The frontend renders its pages with `dynamic = "force-static"` and fetches
 * with `next: { revalidate: 3600, tags: [tag] }`, so without this ping a change
 * here is invisible on the live site until the hour-long window lapses.
 */
async function revalidate(collection: SanitizedCollectionConfig): Promise<void> {
  const url = process.env.FRONTEND_REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET
  if (!url || !secret) return

  const tag = collection.slug === 'tour-packages' ? 'tours' : collection.slug

  try {
    await fetch(`${url}?secret=${encodeURIComponent(secret)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag }),
    })
  } catch (err) {
    console.error('Revalidation failed:', err)
  }
}

/** Fires on create and update. */
export const triggerRevalidation: CollectionAfterChangeHook = async ({ collection }) => {
  await revalidate(collection)
}

/**
 * Fires on delete. Registered separately because `afterChange` does not run for
 * deletions - without this, deleted records stay live for up to an hour.
 */
export const triggerRevalidationOnDelete: CollectionAfterDeleteHook = async ({ collection }) => {
  await revalidate(collection)
}
