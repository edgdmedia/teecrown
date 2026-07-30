import type { CollectionAfterChangeHook } from 'payload'

export const triggerRevalidation: CollectionAfterChangeHook = async ({ doc, collection }) => {
  const tag = collection.slug === 'pages' ? `page-${doc.slug}` : collection.slug

  try {
    await fetch(
      `${process.env.FRONTEND_REVALIDATE_URL}?secret=${process.env.REVALIDATE_SECRET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag }),
      }
    )
  } catch (err) {
    console.error('Revalidation webhook failed:', err)
  }

  return doc
}
