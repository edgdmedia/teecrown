import type { CollectionConfig } from 'payload'
import { adminsOnly, adminsOrSelf } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: adminsOnly,
    update: adminsOrSelf,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      required: true,
      saveToJWT: true,
      access: {
        create: adminsOnly,
        read: adminsOnly,
        update: adminsOnly,
      },
    },
  ],
  versions: false,
}
