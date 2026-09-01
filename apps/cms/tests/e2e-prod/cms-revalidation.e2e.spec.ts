import { test, expect, type Page } from '@playwright/test'
import {
  CMS_URL,
  SITE_URL,
  createTourPackage,
  deleteTourPackage,
  firstMediaId,
  login,
  purgeToursTag,
} from './payload-client'

/**
 * Proves the live pipeline end to end:
 *
 *   Payload write -> afterChange hook -> POST /api/revalidate -> revalidateTag('tours')
 *   -> Cloudflare frontend serves the new content
 *
 * IMPORTANT: as of the last run this pipeline is NOT what actually keeps the
 * site fresh. apps/web/open-next.config.ts is `defineCloudflareConfig({})` with
 * no `incrementalCache`, so OpenNext has no cache backend: every request is
 * `x-nextjs-cache: MISS` and re-renders against Payload. Content therefore
 * looks instantly fresh whether or not revalidation fires.
 *
 * The `caching state` test below pins that down, so if caching is ever enabled
 * the propagation tests start meaning what their names say.
 */

const STAMP = Date.now()
const PROBE_SLUG = `e2e-revalidation-probe-${STAMP}`
const PROBE_TITLE = `E2E Revalidation Probe ${STAMP}`

let token: string
let probeId: number | string | undefined

/** Reload `path` until `text` is present/absent in the served HTML. */
async function pollSite(
  page: Page,
  path: string,
  text: string,
  shouldBePresent: boolean,
  timeoutMs = 120_000,
): Promise<number> {
  const deadline = Date.now() + timeoutMs
  let attempts = 0

  while (Date.now() < deadline) {
    attempts++
    await page.goto(`${SITE_URL}${path}`, { waitUntil: 'domcontentloaded' })
    const present = (await page.content()).includes(text)
    if (present === shouldBePresent) return attempts
    await page.waitForTimeout(4000)
  }

  throw new Error(
    `Timed out after ${timeoutMs}ms / ${attempts} reloads waiting for ${SITE_URL}${path} ` +
      `to ${shouldBePresent ? 'contain' : 'stop containing'} "${text}".`,
  )
}

test.beforeAll(async () => {
  token = await login()
})

test.afterAll(async () => {
  // Always remove the probe, even if an assertion failed mid-run.
  if (probeId === undefined) return
  try {
    await deleteTourPackage(token, probeId)
    await purgeToursTag(token)
  } catch (err) {
    console.error('CLEANUP FAILED - remove this manually in the admin:', PROBE_SLUG, err)
    throw err
  }
})

test('caching state: records whether OpenNext has a cache backend', async ({ request }) => {
  const res = await request.get(`${SITE_URL}/tours`)
  const state = res.headers()['x-nextjs-cache']
  console.log(`x-nextjs-cache: ${state}`)

  if (state === 'MISS') {
    console.warn(
      'No incremental cache configured (open-next.config.ts has no incrementalCache). ' +
        'Every request re-renders against Payload, so the propagation tests below pass ' +
        'trivially and do NOT exercise revalidateTag.',
    )
  }
  expect(['HIT', 'MISS', 'STALE']).toContain(state)
})

test('revalidate route is deployed and rejects a bad secret', async ({ request }) => {
  const res = await request.post(`${SITE_URL}/api/revalidate?secret=definitely-not-the-secret`, {
    data: { tag: 'tours' },
  })
  expect(res.status()).toBe(401)
  expect(await res.json()).toMatchObject({ message: 'Invalid secret' })
})

test('a new tour package in Payload propagates to the live frontend', async ({ page }) => {
  // Baseline: the probe must not already be on the site.
  await page.goto(`${SITE_URL}/tours`, { waitUntil: 'domcontentloaded' })
  expect(await page.content()).not.toContain(PROBE_TITLE)

  // 1. Write to the live CMS. This fires the afterChange hook.
  const mediaId = await firstMediaId(token)
  const created = await createTourPackage(token, {
    title: PROBE_TITLE,
    slug: PROBE_SLUG,
    location: 'E2E Test Harness',
    imageMedia: mediaId,
    duration: '1 Day',
    excerpt: 'Temporary record created by the automated revalidation test. Safe to delete.',
    tag: 'E2E',
  })
  probeId = created.id

  // 2. The CMS API should show it immediately (no caching there).
  const apiRes = await page.request.get(`${CMS_URL}/api/tour-packages?where[slug][equals]=${PROBE_SLUG}`)
  expect(apiRes.ok()).toBeTruthy()
  expect((await apiRes.json()).totalDocs).toBe(1)

  // 3. The statically-rendered frontend should pick it up via revalidateTag.
  const attempts = await pollSite(page, '/tours', PROBE_TITLE, true)
  console.log(`Propagated to /tours after ${attempts} reload(s)`)

  await expect(page.getByText(PROBE_TITLE, { exact: false }).first()).toBeVisible()
})

test('deleting in Payload propagates to the live frontend', async ({
  page,
}) => {
  test.skip(probeId === undefined, 'creation test did not run')

  // Delete and then wait WITHOUT purging by hand. If the afterDelete hook is
  // live this clears on its own; if it is not, the probe lingers until the
  // 3600s `revalidate` window lapses.
  await deleteTourPackage(token, probeId!)

  let propagated = false
  try {
    const attempts = await pollSite(page, '/tours', PROBE_TITLE, false, 60_000)
    propagated = true
    console.log(`Delete propagated on its own after ${attempts} reload(s)`)
  } finally {
    // Whatever happened above, do not leave a dead record on the live site.
    if (!propagated) {
      const method = await purgeToursTag(token)
      await pollSite(page, '/tours', PROBE_TITLE, false, 60_000)
      console.warn(`Delete did NOT self-purge; forced cleanup via ${method}.`)
    }
    probeId = undefined // afterAll has nothing left to do
  }

  expect(
    propagated,
    'Deleted record still served by the frontend. The afterDelete hook is not ' +
      'registered on the deployed CMS - redeploy apps/cms so the fix takes effect.',
  ).toBe(true)
})
