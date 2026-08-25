import type { CollectionConfig } from 'payload'
import { adminsAndEditors, adminsOnly } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: adminsAndEditors,
    update: adminsAndEditors,
    delete: adminsOnly,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
  },
}
