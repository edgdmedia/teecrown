import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    group: 'Admin',
    defaultColumns: ['name', 'service', 'createdAt', 'read'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => req.user?.roles?.includes('admin') ?? false,
    delete: ({ req }) => req.user?.roles?.includes('admin') ?? false,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'service', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'referral', type: 'text' },
    { name: 'read', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
