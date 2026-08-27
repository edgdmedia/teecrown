import path from 'path'
import { sql } from '@payloadcms/db-postgres'
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
  endpoints: [
    {
      path: '/contact',
      method: 'post',
      handler: async (req) => {
        try {
          const body = await req.json()
          const { name, email, message } = body as {
            name?: string
            email?: string
            message?: string
          }

          if (!name || !email || !message) {
            return Response.json(
              { ok: false, error: 'Name, email and message are required' },
              { status: 400 },
            )
          }

          await req.payload.db.drizzle.execute(sql`
            insert into "contact_submissions" ("name", "email", "message")
            values (${name}, ${email}, ${message})
          `)

          return Response.json({ ok: true })
        } catch (error) {
          console.error('CMS contact endpoint failed:', error)
          return Response.json({ ok: false, error: 'Something went wrong.' }, { status: 500 })
        }
      },
    },
  ],
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
      tls: {
        rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
      },
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
