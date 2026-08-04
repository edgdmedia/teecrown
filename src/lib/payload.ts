const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL!

export async function getPage(slug: string) {
  const res = await fetch(
    `${PAYLOAD_URL}/api/pages?where[slug][equals]=${slug}`,
    { next: { revalidate: 3600, tags: [`page-${slug}`] } }
  )
  const data = await res.json()
  return data.docs[0]
}

export async function getCollection(slug: string, options?: { depth?: number; limit?: number }) {
  const params = new URLSearchParams()
  if (options?.depth) params.set('depth', String(options.depth))
  if (options?.limit) params.set('limit', String(options.limit))
  const res = await fetch(
    `${PAYLOAD_URL}/api/${slug}?${params}`,
    { next: { revalidate: 3600, tags: [slug] } }
  )
  const data = await res.json()
  return data.docs
}
