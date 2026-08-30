import { sql } from '@payloadcms/db-postgres'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name') || undefined
    const email = searchParams.get('email') || undefined
    const message = searchParams.get('message') || undefined

    if (!name || !email || !message) {
      return Response.json({ message: 'This is an example of a custom route.' })
    }

    const payload = await getPayload({
      config: configPromise,
    })

    await payload.db.drizzle.execute(sql`
      insert into "contact_submissions" ("name", "email", "message")
      values (${name}, ${email}, ${message})
    `)

    return Response.json({ ok: true })
  } catch (error) {
    console.error('CMS my-route contact submit failed:', error)
    return Response.json({ ok: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
