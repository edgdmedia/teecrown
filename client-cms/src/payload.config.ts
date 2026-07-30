import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Pages } from './collections/Pages'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { ContactSubmissions } from './collections/ContactSubmissions'

export default buildConfig({
  admin: { user: Users.slug },
  collections: [Users, Pages, Media, ContactSubmissions],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? '' },
    push: process.env.NODE_ENV !== 'production',
  }),
  cors: process.env.CORS_ORIGINS?.split(',') ?? [],
  csrf: process.env.CORS_ORIGINS?.split(',') ?? [],
  secret: process.env.PAYLOAD_SECRET ?? '',
})
