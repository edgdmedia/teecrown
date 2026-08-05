import type { CollectionConfig } from 'payload'
import { triggerRevalidation } from '../hooks/triggerRevalidation'

export const TourPackages: CollectionConfig = {
  slug: 'tour-packages',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'location', type: 'text', required: true },
    { name: 'image', type: 'text', required: true },
    { name: 'duration', type: 'text', required: true },
    { name: 'gallery', type: 'array', fields: [{ name: 'src', type: 'text', required: true }] },
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
