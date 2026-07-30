import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { TourPackages } from './collections/TourPackages'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { ContactSubmissions } from './collections/ContactSubmissions'

const config: Parameters<typeof buildConfig>[0] = {
  admin: { user: Users.slug },
  collections: [Users, Pages, Posts, TourPackages, Services, Testimonials, Media, ContactSubmissions],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? '' },
    push: process.env.NODE_ENV !== 'production',
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  cookiePrefix: 'payload',
  cors: process.env.CORS_ORIGINS?.split(',') ?? [],
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
    ...(process.env.CORS_ORIGINS?.split(',') ?? []),
  ],
  secret: process.env.PAYLOAD_SECRET ?? '',
}

if (process.env.SMTP_HOST) {
  config.email = nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM ?? 'noreply@teecrownconsult.org',
    defaultFromName: process.env.EMAIL_FROM_NAME ?? "Tee'Crown Consult",
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER ?? '', pass: process.env.SMTP_PASS ?? '' },
    },
  })
}

export default buildConfig(config)
