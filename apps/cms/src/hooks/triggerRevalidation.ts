import type { CollectionAfterChangeHook } from 'payload'

export const triggerRevalidation: CollectionAfterChangeHook = async ({ collection }) => {
  const url = process.env.FRONTEND_REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET
  if (!url || !secret) return

  const tag = collection.slug === 'tour-packages' ? 'tours' : collection.slug

  try {
    await fetch(`${url}?secret=${secret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag }),
    })
  } catch (err) {
    console.error('Revalidation failed:', err)
  }
}
