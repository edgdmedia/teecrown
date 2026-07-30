// Bootstrap Payload CMS with existing content from src/data/
// Run: npx ts-node scripts/seed.ts
// Requires PAYLOAD_URL and PAYLOAD_API_KEY in .env

const PAYLOAD_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3000'
const API_KEY = process.env.PAYLOAD_API_KEY ?? ''
const headers = { 'Content-Type': 'application/json', ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}) }

async function post(collection: string, data: unknown) {
  const res = await fetch(`${PAYLOAD_URL}/api/${collection}`, {
    method: 'POST', headers, body: JSON.stringify(data),
  })
  if (!res.ok) console.error(`  FAIL ${collection}:`, res.status, await res.text())
  else console.log(`  OK   ${collection}: ${(data as any).title ?? (data as any).slug ?? (data as any).name}`)
}

async function main() {
  // Blog posts
  const { blogPosts } = require('../../src/data/blog')
  console.log(`\nSeeding ${blogPosts.length} blog posts...`)
  for (const p of blogPosts) await post('posts', {
    title: p.title, slug: p.slug, excerpt: p.excerpt,
    content: p.body.map((b: string) => ({ children: [{ text: b }] })),
    publishedAt: new Date(p.date).toISOString(),
  })

  // Tour packages
  const { packages } = require('../../src/data/packages')
  console.log(`\nSeeding ${packages.length} tour packages...`)
  for (const p of packages) await post('packages', {
    title: p.title, slug: p.slug, location: p.location,
    duration: p.duration, excerpt: p.excerpt, tag: p.tag,
  })

  // Services
  const { services } = require('../../src/data/services')
  console.log(`\nSeeding ${services.length} services...`)
  for (const s of services) await post('services', {
    title: s.title, description: s.description, details: s.details,
  })

  console.log('\nDone.')
}

main().catch(console.error)
