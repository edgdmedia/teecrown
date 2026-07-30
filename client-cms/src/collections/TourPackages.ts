import type { CollectionConfig } from 'payload'

export const TourPackages: CollectionConfig = {
  slug: 'tour-packages',
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'location', type: 'text' },
    { name: 'duration', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    { name: 'excerpt', type: 'textarea' },
    {
      name: 'tag',
      type: 'select',
      options: ['Popular', 'Safari', 'City', 'Local', 'Romance', 'Faith', 'Wellness', 'Bespoke', 'Leisure'],
      defaultValue: 'Popular',
    },
    {
      name: 'content',
      type: 'group',
      fields: [
        {
          name: 'intro',
          type: 'richText',
        },
        {
          name: 'included',
          type: 'array',
          fields: [{ name: 'item', type: 'text' }],
        },
        {
          name: 'highlights',
          type: 'array',
          fields: [{ name: 'item', type: 'text' }],
        },
        {
          name: 'pricing',
          type: 'array',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'value', type: 'text' },
          ],
        },
        {
          name: 'itinerary',
          type: 'array',
          fields: [
            { name: 'day', type: 'text' },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          name: 'requirements',
          type: 'array',
          fields: [{ name: 'item', type: 'text' }],
        },
        {
          name: 'hashtags',
          type: 'array',
          fields: [{ name: 'tag', type: 'text' }],
        },
        { name: 'validUntil', type: 'text' },
      ],
    },
  ],
}
