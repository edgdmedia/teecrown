import type { CollectionAfterChangeHook } from 'payload'

export const triggerRevalidation: CollectionAfterChangeHook = async ({ collection }) => {
  const tag = collection.slug === 'tour-packages' ? 'tours' : collection.slug

  await fetch(`${process.env.FRONTEND_REVALIDATE_URL}?secret=${process.env.REVALIDATE_SECRET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag }),
  })
}
