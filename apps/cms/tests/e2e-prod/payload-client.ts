/**
 * Minimal Payload REST client for the live propagation test.
 * Credentials come from the environment - never hardcode them here.
 */

export const CMS_URL = process.env.CMS_URL || 'https://dash.teecrownconsult.org'
export const SITE_URL = process.env.SITE_URL || 'https://teecrownconsult.org'

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy apps/cms/.env.e2e.example to apps/cms/.env.e2e and fill it in.`,
    )
  }
  return value
}

export async function login(): Promise<string> {
  const res = await fetch(`${CMS_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: required('PAYLOAD_EMAIL'),
      password: required('PAYLOAD_PASSWORD'),
    }),
  })
  if (!res.ok) throw new Error(`Payload login failed: ${res.status} ${await res.text()}`)
  const { token } = (await res.json()) as { token: string }
  if (!token) throw new Error('Payload login returned no token')
  return token
}

function auth(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `JWT ${token}` }
}

export async function firstMediaId(token: string): Promise<number | string> {
  const res = await fetch(`${CMS_URL}/api/media?limit=1`, { headers: auth(token) })
  if (!res.ok) throw new Error(`Media lookup failed: ${res.status}`)
  const { docs } = (await res.json()) as { docs: Array<{ id: number | string }> }
  if (!docs?.length) throw new Error('No media found - the probe needs an existing image to link')
  return docs[0].id
}

export async function createTourPackage(token: string, doc: Record<string, unknown>) {
  const res = await fetch(`${CMS_URL}/api/tour-packages`, {
    method: 'POST',
    headers: auth(token),
    body: JSON.stringify(doc),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(`Create failed: ${res.status} ${JSON.stringify(body).slice(0, 400)}`)
  return body.doc as { id: number | string; slug: string; title: string }
}

export async function deleteTourPackage(token: string, id: number | string) {
  const res = await fetch(`${CMS_URL}/api/tour-packages/${id}`, {
    method: 'DELETE',
    headers: auth(token),
  })
  if (!res.ok) throw new Error(`Delete failed: ${res.status} ${await res.text()}`)
}

/**
 * The `triggerRevalidation` hook is registered as `afterChange` only, so a
 * DELETE never purges the frontend cache. To clean up after ourselves we have
 * to invalidate the `tours` tag by hand.
 *
 * Preferred path: POST the frontend revalidate route directly (needs
 * REVALIDATE_SECRET). Fallback: re-save an untouched existing tour package with
 * its own current title, which fires `afterChange` without altering content.
 */
export async function purgeToursTag(token: string): Promise<'secret' | 'no-op-save'> {
  const secret = process.env.REVALIDATE_SECRET
  if (secret) {
    const res = await fetch(`${SITE_URL}/api/revalidate?secret=${encodeURIComponent(secret)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag: 'tours' }),
    })
    if (res.ok) return 'secret'
    throw new Error(`Direct revalidate failed: ${res.status} ${await res.text()}`)
  }

  const list = await fetch(`${CMS_URL}/api/tour-packages?limit=1`, { headers: auth(token) })
  const { docs } = (await list.json()) as { docs: Array<{ id: number | string; title: string }> }
  if (!docs?.length) throw new Error('No tour package left to re-save for cache purge')

  const res = await fetch(`${CMS_URL}/api/tour-packages/${docs[0].id}`, {
    method: 'PATCH',
    headers: auth(token),
    body: JSON.stringify({ title: docs[0].title }),
  })
  if (!res.ok) throw new Error(`No-op re-save failed: ${res.status} ${await res.text()}`)
  return 'no-op-save'
}
