import type { CollectionConfig } from 'payload'
import { triggerRevalidation } from '../hooks/triggerRevalidation'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'publishedAt', type: 'date' },
  ],
  hooks: {
    afterChange: [triggerRevalidation],
  },
}
