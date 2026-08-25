import fs from 'fs/promises'
import path from 'path'
import { getPayload } from 'payload'

import config from '../src/payload.config.js'
import { mapPost, mapTestimonial, mapTour } from '../src/lib/content-mappers'

const CONTENT_ROOT = path.join(process.cwd(), '../web/src/content')

type SeedDoc = {
  name?: string
  slug?: string
}

async function readDir(slug: string) {
  const dir = path.join(CONTENT_ROOT, slug)
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.json')).sort()
  return Promise.all(files.map((f) => fs.readFile(path.join(dir, f), 'utf8').then(JSON.parse)))
}

async function exists(payload: Awaited<ReturnType<typeof getPayload>>, collection: string, field: string, value: string) {
  const result = await payload.find({
    collection: collection as 'posts' | 'testimonials' | 'tour-packages',
    limit: 1,
    pagination: false,
    where: {
      [field]: {
        equals: value,
      },
    },
  })

  return result.docs.length > 0
}

async function main() {
  const payload = await getPayload({ config })

  let created = 0
  let skipped = 0

  const upsert = async (
    collection: 'posts' | 'testimonials' | 'tour-packages',
    field: string,
    value: string,
    doc: SeedDoc,
  ) => {
    if (await exists(payload, collection, field, value)) {
      skipped++
      return
    }

    await payload.create({
      collection,
      data: doc,
    })

    created++
  }

  for (const tour of (await readDir('tours')).map(mapTour)) {
    await upsert('tour-packages', 'slug', tour.slug, tour)
  }

  for (const post of (await readDir('blog')).map(mapPost)) {
    await upsert('posts', 'slug', post.slug, post)
  }

  for (const testimonial of (await readDir('testimonials')).map(mapTestimonial)) {
    await upsert('testimonials', 'name', testimonial.name, testimonial)
  }

  console.log(`Seed complete: ${created} created, ${skipped} skipped (already present)`)
}

await main()
