import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'category',
      type: 'select',
      options: ['Blog', 'Guide', 'Impact', 'Adventure', 'Tourism'],
      defaultValue: 'Blog',
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'date', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'author', type: 'text', defaultValue: "Tee'Crown Consult" },
    { name: 'excerpt', type: 'textarea' },
    {
      name: 'body',
      type: 'richText',
    },
  ],
}
