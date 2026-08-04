import { readJsonDirectory } from '@/content/config'
import type { Package, PricingRow, ItineraryDay } from '@/data/packages'
import type { BlogPost } from '@/data/blog'
import type { Testimonial } from '@/data/testimonials'

interface ContentPackage {
  slug: string
  title: string
  location: string
  image: string
  duration: string
  gallery: string[]
  excerpt: string
  tag: string
  intro?: string
  included?: string[]
  highlights?: string[]
  pricing?: PricingRow[]
  itinerary?: ItineraryDay[]
  requirements?: string[]
  hashtags?: string[]
  validUntil?: string
}

interface ContentPost {
  slug: string
  category: string
  title: string
  image: string
  date: string
  author: string
  excerpt: string
  body?: string
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

function toLexicalDocument(text?: string | null) {
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

function mapPackage(pkg: ContentPackage): Package {
  return {
    slug: pkg.slug,
    title: pkg.title,
    location: pkg.location,
    image: pkg.image,
    duration: pkg.duration,
    gallery: pkg.gallery,
    excerpt: pkg.excerpt,
    tag: pkg.tag,
    content: {
      intro: toLexicalDocument(pkg.intro),
      included: pkg.included,
      highlights: pkg.highlights,
      pricing: pkg.pricing,
      itinerary: pkg.itinerary,
      requirements: pkg.requirements,
      hashtags: pkg.hashtags,
      validUntil: pkg.validUntil,
    },
  }
}

function mapPost(post: ContentPost): BlogPost {
  return {
    slug: post.slug,
    category: post.category,
    title: post.title,
    image: post.image,
    date: post.date,
    author: post.author,
    excerpt: post.excerpt,
    body: toLexicalDocument(post.body),
  }
}

function mapTestimonial(doc: Testimonial & { slug?: string }): Testimonial {
  return {
    rating: Number(doc.rating ?? 5),
    name: doc.name,
    title: doc.title,
    text: doc.text,
  }
}

// ── Exports ──────────────────────────────────────────────────────

export async function getTourPackages(): Promise<Package[]> {
  const packages = await readJsonDirectory<ContentPackage>('tours')
  return packages.map(mapPackage)
}

export async function getTourPackage(slug: string): Promise<Package | undefined> {
  const all = await getTourPackages()
  return all.find(p => p.slug === slug)
}

export async function getPosts(): Promise<BlogPost[]> {
  const posts = await readJsonDirectory<ContentPost>('blog')
  return posts
    .map(mapPost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const all = await getPosts()
  return all.find(p => p.slug === slug)
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const testimonials = await readJsonDirectory<Testimonial & { slug?: string }>('testimonials')
  return testimonials.map(mapTestimonial)
}
