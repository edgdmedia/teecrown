import type { CollectionConfig } from 'payload'
import { triggerRevalidation, triggerRevalidationOnDelete } from '../hooks/triggerRevalidation'
import { adminsAndEditors, adminsOnly } from '../lib/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: adminsAndEditors,
    update: adminsAndEditors,
    delete: adminsOnly,
  },
  fields: [
    { name: 'rating', type: 'number', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true },
  ],
  hooks: {
    afterChange: [triggerRevalidation],
    afterDelete: [triggerRevalidationOnDelete],
  },
}
