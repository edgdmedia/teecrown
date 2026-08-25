import type { CollectionConfig } from 'payload'
import { triggerRevalidation } from '../hooks/triggerRevalidation'
import { adminsAndEditors, adminsOnly } from '../lib/access'

export const TourPackages: CollectionConfig = {
  slug: 'tour-packages',
  admin: { useAsTitle: 'title' },
  access: {
    read: () => true,
    create: adminsAndEditors,
    update: adminsAndEditors,
    delete: adminsOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'location', type: 'text', required: true },
    { name: 'image', type: 'text', required: true, admin: { description: 'Legacy image path kept for existing content.' } },
    {
      name: 'imageMedia',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
    { name: 'duration', type: 'text', required: true },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'src', type: 'text', required: true }],
      admin: { description: 'Legacy gallery paths kept for existing content.' },
    },
    {
      name: 'galleryMedia',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            mimeType: { contains: 'image' },
          },
        },
      ],
    },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'tag', type: 'text', required: true },
    { name: 'intro', type: 'richText' },
    { name: 'pricing', type: 'array', fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'value', type: 'text', required: true },
    ] },
    { name: 'validUntil', type: 'text' },
    { name: 'included', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'highlights', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'requirements', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'itinerary', type: 'array', fields: [
      { name: 'day', type: 'text', required: true },
      { name: 'description', type: 'text', required: true },
    ] },
    { name: 'hashtags', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
  ],
  hooks: { afterChange: [triggerRevalidation] },
}
