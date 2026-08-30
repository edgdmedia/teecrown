import { sql } from '@payloadcms/db-postgres'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
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

    const payload = await getPayload({ config: configPromise })

    await payload.db.drizzle.execute(sql`
      insert into "contact_submissions" ("name", "email", "message")
      values (${name}, ${email}, ${message})
    `)

    return Response.json({ ok: true })
  } catch (error) {
    console.error('CMS contact submit route failed:', error)
    return Response.json({ ok: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
