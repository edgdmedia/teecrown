import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { Posts } from './collections/Posts.js'
import { TourPackages } from './collections/TourPackages.js'
import { Testimonials } from './collections/Testimonials.js'
import { Media } from './collections/Media.js'
import { Users } from './collections/Users.js'
import { ContactSubmissions } from './collections/ContactSubmissions.js'

const config: Parameters<typeof buildConfig>[0] = {
  admin: { user: Users.slug },
  collections: [Users, Posts, TourPackages, Testimonials, Media, ContactSubmissions],
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

const smtpHost = process.env.SMTP_HOST?.trim()
const smtpEnabled = process.env.PAYLOAD_ENABLE_SMTP !== 'false'

if (smtpEnabled && smtpHost) {
  config.email = nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM ?? 'noreply@teecrownconsult.org',
    defaultFromName: process.env.EMAIL_FROM_NAME ?? "Tee'Crown Consult",
    transportOptions: {
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER ?? '', pass: process.env.SMTP_PASS ?? '' },
    },
  })
}

export default buildConfig(config)
