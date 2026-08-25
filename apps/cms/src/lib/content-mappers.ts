type RichText = {
  root: {
    type: string
    children: unknown[]
    direction: 'ltr' | 'rtl' | null
    format: string
    indent: number
    version: number
  }
}

type KeyValueRow = {
  label: string
  value: string
}

type DayRow = {
  day: string
  description: string
}

type TourSource = {
  slug: string
  title: string
  location: string
  image: string
  duration: string
  gallery?: string[]
  excerpt: string
  tag: string
  intro?: string | null
  pricing?: KeyValueRow[]
  validUntil?: string | null
  included?: string[]
  highlights?: string[]
  requirements?: string[]
  itinerary?: DayRow[]
  hashtags?: string[]
}

type PostSource = {
  slug: string
  category: string
  title: string
  image: string
  date: string
  author: string
  excerpt: string
  body?: string | null
}

type TestimonialSource = {
  rating?: number | string | null
  name: string
  title: string
  text: string
}

export function mapTour(doc: TourSource) {
  return {
    slug: doc.slug,
    title: doc.title,
    location: doc.location,
    image: doc.image,
    duration: doc.duration,
    gallery: (doc.gallery ?? []).map((src: string) => ({ src })),
    excerpt: doc.excerpt,
    tag: doc.tag,
    intro: toLexical(doc.intro),
    pricing: (doc.pricing ?? []).map((row) => ({ label: row.label, value: row.value })),
    validUntil: doc.validUntil,
    included: (doc.included ?? []).map((item: string) => ({ item })),
    highlights: (doc.highlights ?? []).map((item: string) => ({ item })),
    requirements: (doc.requirements ?? []).map((item: string) => ({ item })),
    itinerary: (doc.itinerary ?? []).map((row) => ({ day: row.day, description: row.description })),
    hashtags: (doc.hashtags ?? []).map((item: string) => ({ item })),
  }
}

export function mapPost(doc: PostSource) {
  return {
    slug: doc.slug,
    category: doc.category,
    title: doc.title,
    image: doc.image,
    date: doc.date,
    author: doc.author,
    excerpt: doc.excerpt,
    body: toLexical(doc.body),
  }
}

export function mapTestimonial(doc: TestimonialSource) {
  return {
    rating: Number(doc.rating ?? 5),
    name: doc.name,
    title: doc.title,
    text: doc.text,
  }
}

export function mediaURL(media?: { url?: string | null } | null, fallback?: string | null) {
  return media?.url || fallback || ''
}

function paragraph(text: string) {
  return {
    type: 'paragraph' as const,
    children: [{ type: 'text' as const, text, format: 0, detail: 0, mode: 'normal' as const, style: '', version: 1 }],
    direction: 'ltr' as const,
    format: '',
    indent: 0,
    version: 1,
  }
}

export function toLexical(text?: string | null): RichText | null {
  if (!text) return null
  const paragraphs = text.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)
  return {
    root: {
      type: 'root' as const,
      children: paragraphs.map(paragraph),
      direction: 'ltr' as const,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}
