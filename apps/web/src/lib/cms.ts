import type { Package, PricingRow, ItineraryDay } from '@/data/packages'
import type { BlogPost } from '@/data/blog'
import type { Testimonial } from '@/data/testimonials'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://dash.teecrownconsult.org'

interface ApiMedia {
  url?: string | null
}

function absoluteCMSURL(url?: string | null) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return `${PAYLOAD_URL}${url}`
  return `${PAYLOAD_URL}/${url}`
}

interface LexicalDocument {
  root: {
    type: string
    children: unknown[]
    direction: 'ltr' | 'rtl' | null
    format: string
    indent: number
    version: number
  }
}

interface ApiTour {
  slug: string
  title: string
  location: string
  imageMedia: ApiMedia | null
  duration: string
  galleryMedia?: Array<{ image?: ApiMedia | null }>
  excerpt: string
  tag: string
  intro?: LexicalDocument | null
  pricing?: PricingRow[]
  validUntil?: string
  included?: Array<{ item: string }>
  highlights?: Array<{ item: string }>
  requirements?: Array<{ item: string }>
  itinerary?: ItineraryDay[]
  hashtags?: Array<{ item: string }>
}

interface ApiPost {
  slug: string
  category: string
  title: string
  imageMedia: ApiMedia | null
  date: string
  author: string
  excerpt: string
  body?: LexicalDocument | null
}

function mapPackage(doc: ApiTour): Package {
  const gallery = (doc.galleryMedia ?? []).map((row) => absoluteCMSURL(row.image?.url)).filter(Boolean)

  return {
    slug: doc.slug,
    title: doc.title,
    location: doc.location,
    image: absoluteCMSURL(doc.imageMedia?.url),
    duration: doc.duration,
    gallery,
    excerpt: doc.excerpt,
    tag: doc.tag,
    content: {
      intro: doc.intro ?? null,
      included: (doc.included ?? []).map((row) => row.item),
      highlights: (doc.highlights ?? []).map((row) => row.item),
      pricing: doc.pricing ?? [],
      itinerary: doc.itinerary ?? [],
      requirements: (doc.requirements ?? []).map((row) => row.item),
      hashtags: (doc.hashtags ?? []).map((row) => row.item),
      validUntil: doc.validUntil,
    },
  }
}

function mapPost(doc: ApiPost): BlogPost {
  return {
    slug: doc.slug,
    category: doc.category,
    title: doc.title,
    image: absoluteCMSURL(doc.imageMedia?.url),
    date: doc.date,
    author: doc.author,
    excerpt: doc.excerpt,
    body: doc.body ?? null,
  }
}

function mapTestimonial(doc: Testimonial): Testimonial {
  return {
    rating: Number(doc.rating ?? 5),
    name: doc.name,
    title: doc.title,
    text: doc.text,
  }
}

async function fetchDocs<T>(collection: string, tag: string): Promise<T[]> {
  const res = await fetch(`${PAYLOAD_URL}/api/${collection}?limit=1000`, {
    next: { revalidate: 3600, tags: [tag] },
  })
  if (!res.ok) throw new Error(`CMS fetch failed for ${collection}: ${res.status}`)
  const data = await res.json()
  return data.docs as T[]
}

// ── Exports ──────────────────────────────────────────────────────

export async function getTourPackages(): Promise<Package[]> {
  const docs = await fetchDocs<ApiTour>('tour-packages', 'tours')
  return docs.map(mapPackage)
}

export async function getTourPackage(slug: string): Promise<Package | undefined> {
  const all = await getTourPackages()
  return all.find((p) => p.slug === slug)
}

export async function getPosts(): Promise<BlogPost[]> {
  const docs = await fetchDocs<ApiPost>('posts', 'posts')
  return docs.map(mapPost).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const all = await getPosts()
  return all.find((p) => p.slug === slug)
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const docs = await fetchDocs<Testimonial>('testimonials', 'testimonials')
  return docs.map(mapTestimonial)
}
