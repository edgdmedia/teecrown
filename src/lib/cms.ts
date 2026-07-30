// CMS-backed data layer — fetches from Payload, falls back to static data.
// Pages import from here instead of directly from @/data/*.

import { packages as staticPackages } from '@/data/packages'
import { blogPosts as staticPosts } from '@/data/blog'
import { services as staticServices } from '@/data/services'
import type { Package, PricingRow, ItineraryDay, PackageContent } from '@/data/packages'
import type { BlogPost } from '@/data/blog'
import type { Service } from '@/data/services'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || ''

interface CmsMedia {
  id: string
  url?: string
  filename?: string
  alt?: string
}

function imgUrl(media: CmsMedia | string | undefined | null): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  if (media.url?.startsWith('http')) return media.url
  return `${PAYLOAD_URL}${media.url || '/api/media/file/' + media.filename}`
}

function mapCmsPackage(doc: Record<string, unknown>): Package {
  const image = doc.image as CmsMedia | undefined
  const gallery = (doc.gallery as CmsMedia[] | undefined)?.map(imgUrl).filter(Boolean) ?? []
  const c = (doc.content as Record<string, unknown>) ?? {}
  const intro = (c.intro as { root: { children: unknown[] } }) ?? null
  const included = (c.included as { item?: string }[] | undefined)?.map(i => i.item ?? '') ?? undefined
  const highlights = (c.highlights as { item?: string }[] | undefined)?.map(i => i.item ?? '') ?? undefined
  const pricing = (c.pricing as PricingRow[] | undefined) ?? undefined
  const itinerary = (c.itinerary as ItineraryDay[] | undefined) ?? undefined
  const requirements = (c.requirements as { item?: string }[] | undefined)?.map(i => i.item ?? '') ?? undefined
  const hashtags = (c.hashtags as { tag?: string }[] | undefined)?.map(i => i.tag ?? '') ?? undefined
  return {
    slug: doc.slug as string,
    title: doc.title as string,
    location: doc.location as string,
    image: imgUrl(image),
    duration: doc.duration as string,
    gallery,
    excerpt: doc.excerpt as string,
    tag: doc.tag as string,
    content: { intro, included, highlights, pricing, itinerary, requirements, hashtags, validUntil: c.validUntil as string | undefined },
  }
}

function mapCmsPost(doc: Record<string, unknown>): BlogPost {
  return {
    slug: doc.slug as string,
    category: doc.category as string,
    title: doc.title as string,
    image: imgUrl(doc.image as CmsMedia | undefined),
    date: doc.date as string,
    author: doc.author as string,
    excerpt: doc.excerpt as string,
    body: (doc.body as { root: { children: unknown[] } }) ?? null,
  }
}

function mapCmsService(doc: Record<string, unknown>): Service {
  return {
    icon: '',
    title: doc.title as string,
    image: imgUrl(doc.image as CmsMedia | undefined),
    description: doc.description as string,
    details: ((doc.details as { item?: string }[] | undefined)?.map(d => d.item ?? '') ?? []),
  }
}

async function fetchCms<T>(slug: string, params?: string): Promise<T[] | null> {
  if (!PAYLOAD_URL) return null
  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/${slug}${params ? '?' + params : ''}`,
      { next: { revalidate: 300, tags: [slug] } }
    )
    if (!res.ok) return null
    const { docs } = await res.json()
    return docs ?? null
  } catch { return null }
}

// ── Exports ──────────────────────────────────────────────────────

export async function getTourPackages(): Promise<Package[]> {
  const docs = await fetchCms<Record<string, unknown>>('tour-packages', 'depth=2')
  if (!docs) return staticPackages
  return docs.map(mapCmsPackage)
}

export async function getTourPackage(slug: string): Promise<Package | undefined> {
  const all = await getTourPackages()
  return all.find(p => p.slug === slug)
}

export async function getPosts(): Promise<BlogPost[]> {
  const docs = await fetchCms<Record<string, unknown>>('posts', 'depth=1')
  if (!docs) return staticPosts
  return docs.map(mapCmsPost)
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const all = await getPosts()
  return all.find(p => p.slug === slug)
}

export async function getServices(): Promise<Service[]> {
  const docs = await fetchCms<Record<string, unknown>>('services', 'depth=1')
  if (!docs) return staticServices
  return docs.map(mapCmsService)
}
