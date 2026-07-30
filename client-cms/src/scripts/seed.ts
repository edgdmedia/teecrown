// Seed Payload CMS with existing content from the frontend static data.
// Run: PAYLOAD_EMAIL=... PAYLOAD_PASSWORD=... npx tsx src/scripts/seed.ts
// Requires PAYLOAD_EMAIL and PAYLOAD_PASSWORD in .env (set for local dev).
// Images are read from ../../../public/images/ relative to this file.
// Note: extra fields (alt, etc.) must be JSON-stringified in a `_payload` form field.

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMAGE_DIR = resolve(__dirname, '../../../public/images')
const PAYLOAD_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3000'

interface MediaEntry { id: string; filename: string; url: string }
interface MediaMap { [originalFilename: string]: MediaEntry }

// ── helpers ──────────────────────────────────────────────────────────

async function login(headers: Record<string, string>) {
  const email = process.env.PAYLOAD_EMAIL
  const password = process.env.PAYLOAD_PASSWORD
  if (!email || !password) {
    console.log('PAYLOAD_EMAIL/PAYLOAD_PASSWORD not set — skipping login (using existing token)')
    return
  }
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const { token } = await res.json()
  if (token) headers['Authorization'] = `Bearer ${token}`
  else console.error('Login failed — will try without auth')
}

async function uploadImage(filename: string, headers: Record<string, string>): Promise<MediaEntry | null> {
  const filePath = resolve(IMAGE_DIR, filename)
  try {
    const buffer = readFileSync(filePath)
    const blob = new Blob([buffer], { type: `image/${filename.endsWith('.png') ? 'png' : 'webp'}` })
    const form = new FormData()
    form.append('file', blob, filename)
    form.append('_payload', JSON.stringify({
      alt: filename.replace(/\.\w+$/, '').replace(/[-_]/g, ' '),
    }))
    // Need to fetch without Content-Type header so browser sets multipart boundary
    const res = await fetch(`${PAYLOAD_URL}/api/media`, {
      method: 'POST',
      headers: { Authorization: headers['Authorization'] ?? '' },
      body: form,
    })
    if (!res.ok) { console.error(`  FAIL upload ${filename}:`, res.status); return null }
    const data = await res.json()
    return { id: data.doc.id, filename, url: data.doc.url ?? `/api/media/file/${data.doc.filename}` }
  } catch {
    console.warn(`  SKIP ${filename} — not found at ${filePath}`)
    return null
  }
}

async function dropCollection(slug: string, headers: Record<string, string>) {
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/${slug}?depth=0&limit=100`, { headers })
    if (!res.ok) { console.error(`  FAIL fetch ${slug}:`, res.status); break }
    const { docs } = await res.json()
    if (!docs?.length) break
    for (const doc of docs) {
      await fetch(`${PAYLOAD_URL}/api/${slug}/${doc.id}`, { method: 'DELETE', headers })
    }
  }
}

function getFilename(path: string): string {
  return path.split('/').pop()?.split('?')[0] ?? ''
}

function lexicalBody(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map(text => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [{ type: 'text', format: 0, detail: 0, mode: 'normal', style: '', text, version: 1 }],
      })),
    },
  }
}

// ── main ─────────────────────────────────────────────────────────────

async function main() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  await login(headers)

  // Determine which collections to seed
  const args = process.argv.slice(2)
  const seedAll = args.length === 0
  const seedPosts = seedAll || args.includes('posts')
  const seedPackages = seedAll || args.includes('packages')
  const seedServices = seedAll || args.includes('services')

  // 1. Upload all images first ──────────────────────────────────────
  const mediaMap: MediaMap = {}

  const { blogPosts } = await import('../../../src/data/blog')
  const { packages } = await import('../../../src/data/packages')
  const { services } = await import('../../../src/data/services')

  const allImages: string[] = [
    ...blogPosts.map(p => getFilename(p.image)),
    ...packages.flatMap(p => [getFilename(p.image), ...p.gallery.map(getFilename)]),
    ...services.map(s => getFilename(s.image)),
  ].filter(Boolean)

  const uniqueImages = [...new Set(allImages)]
  console.log(`\nUploading ${uniqueImages.length} images to CMS media...`)
  // Upload sequentially to avoid overwhelming the server
  for (const img of uniqueImages) {
    const entry = await uploadImage(img, headers)
    if (entry) mediaMap[img] = entry
  }
  console.log(`Media uploads: ${Object.keys(mediaMap).length}/${uniqueImages.length}`)

  // 2. Seed blog posts ──────────────────────────────────────────────
  if (seedPosts) {
    console.log(`\nSeeding ${blogPosts.length} blog posts...`)
    await dropCollection('posts', headers)
    for (const p of blogPosts) {
      const imageId = mediaMap[getFilename(p.image)]?.id ?? null
      const raw = (p.body as { root?: { children?: { children?: { text?: string }[] }[] } }) ?? {}
      const paragraphs = raw.root?.children?.map(c => c.children?.[0]?.text ?? '') ?? []
      const body = paragraphs.length ? lexicalBody(paragraphs) : undefined
      const res = await fetch(`${PAYLOAD_URL}/api/posts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: p.title,
          slug: p.slug,
          category: p.category,
          image: imageId,
          date: new Date(p.date).toISOString(),
          author: p.author,
          excerpt: p.excerpt,
          body,
        }),
      })
      if (!res.ok) console.error(`  FAIL post ${p.slug}:`, res.status, await res.text())
      else console.log(`  OK   post: ${p.slug}`)
    }
  }

  // 3. Seed tour packages ───────────────────────────────────────────
  if (seedPackages) {
    console.log(`\nSeeding ${packages.length} tour packages...`)
    await dropCollection('tour-packages', headers)
    for (const p of packages) {
      const imageId = mediaMap[getFilename(p.image)]?.id ?? null
      const galleryIds = p.gallery
        .map(g => mediaMap[getFilename(g)]?.id)
        .filter(Boolean)

      const content: Record<string, unknown> = {}
      if (p.content.intro) content.intro = p.content.intro
      if (p.content.included?.length) content.included = p.content.included.map(item => ({ item }))
      if (p.content.highlights?.length) content.highlights = p.content.highlights.map(item => ({ item }))
      if (p.content.pricing?.length) content.pricing = p.content.pricing
      if (p.content.itinerary?.length) content.itinerary = p.content.itinerary
      if (p.content.requirements?.length) content.requirements = p.content.requirements.map(item => ({ item }))
      if (p.content.hashtags?.length) content.hashtags = p.content.hashtags.map(tag => ({ tag }))
      if (p.content.validUntil) content.validUntil = p.content.validUntil

      const payload: Record<string, unknown> = {
        title: p.title,
        slug: p.slug,
        location: p.location,
        duration: p.duration,
        image: imageId,
        gallery: galleryIds,
        excerpt: p.excerpt,
        tag: p.tag,
        content,
      }

      const res = await fetch(`${PAYLOAD_URL}/api/tour-packages`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })
      if (!res.ok) console.error(`  FAIL package ${p.slug}:`, res.status, await res.text())
      else console.log(`  OK   package: ${p.slug}`)
    }
  }

  // 4. Seed services ────────────────────────────────────────────────
  if (seedServices) {
    console.log(`\nSeeding ${services.length} services...`)
    await dropCollection('services', headers)
    for (const s of services) {
      const imageId = mediaMap[getFilename(s.image)]?.id ?? null
      const res = await fetch(`${PAYLOAD_URL}/api/services`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: s.title,
          image: imageId,
          description: s.description,
          details: s.details.map(item => ({ item })),
        }),
      })
      if (!res.ok) console.error(`  FAIL service ${s.title}:`, res.status, await res.text())
      else console.log(`  OK   service: ${s.title}`)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
