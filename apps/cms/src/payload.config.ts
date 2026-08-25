import path from 'path'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { pino } from 'pino'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { TourPackages } from './collections/TourPackages'
import { Testimonials } from './collections/Testimonials'
import { ContactSubmissions } from './collections/ContactSubmissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const logger = pino({ level: process.env.PAYLOAD_LOG_LEVEL || 'info' })

export default buildConfig({
  admin: {
    components: {
      beforeDashboard: ['@/components/admin/BeforeDashboard'],
      beforeLogin: ['@/components/admin/BeforeLogin'],
      graphics: {
        Icon: '@/components/admin/Icon',
        Logo: '@/components/admin/Icon',
      },
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, TourPackages, Testimonials, ContactSubmissions],
  editor: lexicalEditor(),
  email: nodemailerAdapter({
    defaultFromAddress: process.env.FROM_EMAIL || 'noreply@teecrownconsult.org',
    defaultFromName: process.env.EMAIL_FROM_NAME || "Tee'Crown Consult",
    transportOptions: {
      auth: {
        pass: process.env.SMTP_PASS,
        user: process.env.SMTP_USER,
      },
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
    },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  logger,
  plugins: [],
})
