import type { MetadataRoute } from "next"
import { getPosts, getTourPackages } from "@/lib/cms"

const siteUrl = "https://teecrownconsult.org"

const staticPages = [
  { url: siteUrl, changeFrequency: "weekly" as const, priority: 1 },
  { url: `${siteUrl}/about`, changeFrequency: "monthly" as const, priority: 0.8 },
  { url: `${siteUrl}/services`, changeFrequency: "monthly" as const, priority: 0.8 },
  { url: `${siteUrl}/tours`, changeFrequency: "weekly" as const, priority: 0.9 },
  { url: `${siteUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.7 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [packages, blogPosts] = await Promise.all([getTourPackages(), getPosts()])

  const tours = packages.map((p) => ({
    url: `${siteUrl}/tours/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: new Date(),
  }))

  const blog = blogPosts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    changeFrequency: "never" as const,
    priority: 0.6,
    lastModified: new Date(p.date),
  }))

  return [...staticPages, ...tours, ...blog]
}
