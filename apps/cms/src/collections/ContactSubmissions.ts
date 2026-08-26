import type { CollectionConfig } from 'payload'
import { sendContactEmails } from '../hooks/sendContactEmails'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: { useAsTitle: 'name' },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'service', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'referral', type: 'text' },
  ],
  hooks: { afterChange: [sendContactEmails] },
}
