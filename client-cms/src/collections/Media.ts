import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'alt' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.roles?.includes('admin') ?? false,
  },
  upload: true,
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
}
