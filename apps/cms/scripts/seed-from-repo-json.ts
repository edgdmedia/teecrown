import fs from 'fs/promises'
import path from 'path'
import { mapPost, mapTestimonial, mapTour } from '../src/lib/content-mappers'

const CONTENT_ROOT = path.join(process.cwd(), '../web/src/content')
const PAYLOAD_URL = process.env.PAYLOAD_URL!
const TOKEN = process.env.SEED_ADMIN_TOKEN!

async function readDir(slug: string) {
  const dir = path.join(CONTENT_ROOT, slug)
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.json')).sort()
  return Promise.all(files.map((f) => fs.readFile(path.join(dir, f), 'utf8').then(JSON.parse)))
}

async function request(collection: string, body: unknown, method = 'POST') {
  const res = await fetch(`${PAYLOAD_URL}/api/${collection}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Failed to ${method} ${collection}: ${res.status} ${await res.text()}`)
  }
}

async function exists(collection: string, field: string, value: string) {
  const res = await fetch(
    `${PAYLOAD_URL}/api/${collection}?where[${field}][equals]=${encodeURIComponent(value)}&limit=1`,
    { headers: { Authorization: `Bearer ${TOKEN}` } },
  )
  if (!res.ok) throw new Error(`Failed to query ${collection}: ${res.status} ${await res.text()}`)
  const data = (await res.json()) as { docs: unknown[] }
  return data.docs.length > 0
}

type SeedDoc = {
  name?: string
  slug?: string
}

let created = 0
let skipped = 0

async function upsert(collection: string, field: string, value: string, doc: SeedDoc) {
  if (await exists(collection, field, value)) {
    skipped++
    return
  }
  await request(collection, doc)
  created++
}

for (const tour of (await readDir('tours')).map(mapTour)) await upsert('tour-packages', 'slug', tour.slug, tour)
for (const postDoc of (await readDir('blog')).map(mapPost)) await upsert('posts', 'slug', postDoc.slug, postDoc)
for (const testimonial of (await readDir('testimonials')).map(mapTestimonial)) {
  await upsert('testimonials', 'name', testimonial.name, testimonial)
}

console.log(`Seed complete: ${created} created, ${skipped} skipped (already present)`)
