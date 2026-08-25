import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import mime from 'mime/lite'
import { getPayload } from 'payload'

import config from '../src/payload.config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const REPO_ROOT = path.resolve(dirname, '../../..')
const CONTENT_ROOT = path.join(REPO_ROOT, 'apps/web/src/content')
const IMAGES_ROOT = path.join(REPO_ROOT, 'apps/web/public/images')

type MediaDoc = {
  id: number
  alt: string
  filename?: string | null
  url?: string | null
}

type TourDoc = {
  id: number
  slug: string
  title: string
  image: string
  gallery?: Array<{ src: string }> | null
  imageMedia?: number | MediaDoc | null
  galleryMedia?: Array<{ image: number | MediaDoc }> | null
}

type PostDoc = {
  id: number
  slug: string
  title: string
  image: string
  imageMedia?: number | MediaDoc | null
}

function fileNameFromLegacyPath(legacyPath: string) {
  return legacyPath.replace(/^\/images\//, '')
}

function altFromFilename(name: string) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function ensureMedia(payload: Awaited<ReturnType<typeof getPayload>>, legacyPath: string) {
  const fileName = fileNameFromLegacyPath(legacyPath)
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    pagination: false,
    where: {
      filename: {
        equals: fileName,
      },
    },
  })

  if (existing.docs[0]) {
    return existing.docs[0] as MediaDoc
  }

  const filePath = path.join(IMAGES_ROOT, fileName)
  const buffer = await fs.readFile(filePath)
  const media = await payload.create({
    collection: 'media',
    data: {
      alt: altFromFilename(fileName),
    },
    file: {
      data: buffer,
      mimetype: mime.getType(fileName) || 'application/octet-stream',
      name: fileName,
      size: buffer.byteLength,
    },
  })

  return media as MediaDoc
}

async function main() {
  const payload = await getPayload({ config })

  let uploaded = 0
  let linked = 0

  const mediaBefore = await payload.find({
    collection: 'media',
    limit: 1000,
    pagination: false,
  })
  const existingNames = new Set(mediaBefore.docs.map((doc) => doc.filename).filter(Boolean))

  const imageFiles = (await fs.readdir(IMAGES_ROOT)).filter((name) => /\.(avif|jpe?g|png|webp)$/i.test(name)).sort()

  for (const name of imageFiles) {
    if (existingNames.has(name)) continue
    await ensureMedia(payload, `/images/${name}`)
    uploaded++
  }

  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
    pagination: false,
  })

  for (const post of posts.docs as PostDoc[]) {
    if (post.imageMedia || !post.image?.startsWith('/images/')) continue
    const media = await ensureMedia(payload, post.image)
    await payload.update({
      id: post.id,
      collection: 'posts',
      data: {
        imageMedia: media.id,
      },
    })
    linked++
  }

  const tours = await payload.find({
    collection: 'tour-packages',
    limit: 1000,
    pagination: false,
  })

  for (const tour of tours.docs as TourDoc[]) {
    const data: Record<string, unknown> = {}

    if (!tour.imageMedia && tour.image?.startsWith('/images/')) {
      const media = await ensureMedia(payload, tour.image)
      data.imageMedia = media.id
    }

    const gallery = (tour.gallery ?? []).map((item) => item.src).filter((src) => src.startsWith('/images/'))
    if (gallery.length && !(tour.galleryMedia && tour.galleryMedia.length)) {
      data.galleryMedia = []
      for (const src of gallery) {
        const media = await ensureMedia(payload, src)
        ;(data.galleryMedia as Array<{ image: number }>).push({ image: media.id })
      }
    }

    if (Object.keys(data).length) {
      await payload.update({
        id: tour.id,
        collection: 'tour-packages',
        data,
      })
      linked++
    }
  }

  console.log(`Media migration complete: ${uploaded} uploaded, ${linked} linked`)
}

await main()
