import type { CollectionConfig } from 'payload'
import { triggerRevalidation, triggerRevalidationOnDelete } from '../hooks/triggerRevalidation'
import { adminsAndEditors, adminsOnly } from '../lib/access'
import { slugField } from '../fields/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  access: {
    read: () => true,
    create: adminsAndEditors,
    update: adminsAndEditors,
    delete: adminsOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'text', required: true },
    slugField(),
    {
      name: 'imageMedia',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
    { name: 'date', type: 'text', required: true },
    { name: 'author', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'body', type: 'richText' },
  ],
  hooks: {
    afterChange: [triggerRevalidation],
    afterDelete: [triggerRevalidationOnDelete],
  },
}
