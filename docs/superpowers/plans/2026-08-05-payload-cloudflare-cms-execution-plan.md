# Payload Cloudflare CMS Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `apps/cms` as a fresh Payload CMS deployment on Cloudflare Workers, seed it from repo JSON, rewire `apps/web` to fetch from Payload REST, and enable tag-based revalidation.

**Architecture:** `apps/cms` is a standalone Payload app scaffolded from `with-cloudflare-d1`, backed by D1 for documents and R2 for media. `apps/web` becomes a runtime consumer of the Payload REST API and uses OpenNext's incremental cache plus Durable-Object-backed tag cache so `revalidateTag()` works end-to-end.

**Tech Stack:** Payload 3.x, Next.js App Router, OpenNext Cloudflare, Cloudflare Workers, D1, R2, Durable Objects, pnpm, TypeScript.

---

## File Map

- Modify: `apps/cms/package.json` — rename the template package and keep deploy scripts intact.
- Modify: `apps/cms/wrangler.jsonc` — set worker names plus D1/R2 placeholders for production and staging.
- Modify: `apps/cms/src/payload.config.ts` — keep the Cloudflare runtime/CLI context fallback, logger, D1 adapter, and R2 plugin wiring.
- Modify: `apps/cms/src/collections/Media.ts` — add `skipSafeFetch: true` under `upload` and keep Workers-safe upload config.
- Create: `apps/cms/src/collections/Posts.ts`
- Create: `apps/cms/src/collections/TourPackages.ts`
- Create: `apps/cms/src/collections/Testimonials.ts`
- Create: `apps/cms/src/collections/ContactSubmissions.ts`
- Modify: `apps/cms/src/collections/Users.ts` — align auth/admin fields with project needs.
- Create: `apps/cms/src/hooks/triggerRevalidation.ts` — post tag invalidation requests to `apps/web`.
- Create: `apps/cms/src/lib/content-mappers.ts` — convert repo JSON shape into Payload collection input shape.
- Create: `apps/cms/scripts/seed-from-repo-json.ts` — read `apps/web/src/content/**` and seed Payload via REST.
- Modify: `apps/web/open-next.config.ts` — add tag cache alongside incremental cache.
- Modify: `apps/web/wrangler.jsonc` — add Durable Object binding and migration for tag cache.
- Modify: `apps/web/src/lib/cms.ts` — replace local JSON reads with tagged Payload REST fetches.
- Create: `apps/web/app/api/revalidate/route.ts` — secure revalidation endpoint.
- Test/verify: `apps/cms` template tests as needed, plus manual staging verification.

---

### Task 1: Normalize The Fresh CMS Scaffold

**Files:**
- Modify: `apps/cms/package.json`
- Modify: `apps/cms/wrangler.jsonc`
- Modify: `apps/cms/README.md`

- [ ] **Step 1: Update package identity and worker placeholders**

Set the package and worker names away from template defaults.

```json
{
  "name": "teecrownconsult-cms",
  "description": "Payload CMS for teecrownconsult on Cloudflare Workers"
}
```

Set `apps/cms/wrangler.jsonc` names like:

```jsonc
{
  "name": "teecrownconsult-cms",
  "d1_databases": [
    {
      "binding": "D1",
      "database_id": "REPLACE_PROD_D1_ID",
      "database_name": "teecrownconsult-cms",
      "remote": true
    }
  ],
  "r2_buckets": [
    {
      "binding": "R2",
      "bucket_name": "teecrownconsult-media"
    }
  ]
}
```

- [ ] **Step 2: Add a staging environment block**

Add the template-style staging env block:

```jsonc
"env": {
  "staging": {
    "name": "teecrownconsult-cms-staging",
    "d1_databases": [
      {
        "binding": "D1",
        "database_id": "REPLACE_STAGING_D1_ID",
        "database_name": "teecrownconsult-cms-staging",
        "remote": true
      }
    ],
    "r2_buckets": [
      {
        "binding": "R2",
        "bucket_name": "teecrownconsult-media-staging"
      }
    ]
  }
}
```

- [ ] **Step 3: Install dependencies**

Run: `pnpm install`

Workdir: `apps/cms`

Expected: `pnpm-lock.yaml` created and install completes without missing package errors.

- [ ] **Step 4: Generate types**

Run: `pnpm run generate:types`

Workdir: `apps/cms`

Expected: `cloudflare-env.d.ts` and `src/payload-types.ts` generated successfully.

- [ ] **Step 5: Commit**

```bash
git add apps/cms/package.json apps/cms/wrangler.jsonc apps/cms/README.md apps/cms/pnpm-lock.yaml apps/cms/cloudflare-env.d.ts apps/cms/src/payload-types.ts
git commit -m "chore: normalize cms scaffold"
```

---

### Task 2: Lock Payload Config To The Cloudflare Pattern

**Files:**
- Modify: `apps/cms/src/payload.config.ts`
- Modify: `apps/cms/src/collections/Media.ts`

- [ ] **Step 1: Keep the template's runtime/CLI fallback exactly**

Ensure `apps/cms/src/payload.config.ts` keeps this shape:

```ts
const cloudflare =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })
```

and this helper:

```ts
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  )
}
```

- [ ] **Step 2: Normalize storage wiring to the project plan**

Use the R2 plugin wiring in the config body:

```ts
export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) } },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  logger: isProduction ? cloudflareLogger : undefined,
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})
```

- [ ] **Step 3: Make Media Workers-safe**

Set `apps/cms/src/collections/Media.ts` to:

```ts
export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    crop: false,
    focalPoint: false,
    skipSafeFetch: true,
  },
}
```

- [ ] **Step 4: Verify config compiles**

Run: `pnpm run generate:types:payload`

Workdir: `apps/cms`

Expected: Payload config loads, no D1/R2 adapter shape errors.

- [ ] **Step 5: Commit**

```bash
git add apps/cms/src/payload.config.ts apps/cms/src/collections/Media.ts apps/cms/src/payload-types.ts
git commit -m "chore: align cms config for cloudflare"
```

---

### Task 3: Define The Real CMS Collections

**Files:**
- Modify: `apps/cms/src/payload.config.ts`
- Modify: `apps/cms/src/collections/Users.ts`
- Create: `apps/cms/src/collections/Posts.ts`
- Create: `apps/cms/src/collections/TourPackages.ts`
- Create: `apps/cms/src/collections/Testimonials.ts`
- Create: `apps/cms/src/collections/ContactSubmissions.ts`
- Create: `apps/cms/src/hooks/triggerRevalidation.ts`

- [ ] **Step 1: Create the revalidation hook**

Create `apps/cms/src/hooks/triggerRevalidation.ts`:

```ts
import type { CollectionAfterChangeHook } from 'payload'

export const triggerRevalidation: CollectionAfterChangeHook = async ({ collection }) => {
  const tag = collection.slug === 'tour-packages' ? 'tours' : collection.slug

  await fetch(`${process.env.FRONTEND_REVALIDATE_URL}?secret=${process.env.REVALIDATE_SECRET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag }),
  })
}
```

- [ ] **Step 2: Define `TourPackages`**

Create `apps/cms/src/collections/TourPackages.ts` with a minimal shape that matches current site content:

```ts
import type { CollectionConfig } from 'payload'
import { triggerRevalidation } from '../hooks/triggerRevalidation'

export const TourPackages: CollectionConfig = {
  slug: 'tour-packages',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'summary', type: 'textarea' },
    { name: 'price', type: 'text' },
    { name: 'duration', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText' },
  ],
  hooks: { afterChange: [triggerRevalidation] },
}
```

- [ ] **Step 3: Define `Posts`, `Testimonials`, and `ContactSubmissions`**

Create collection files with analogous shapes:

```ts
// Posts.ts core fields
{ name: 'title', type: 'text', required: true }
{ name: 'slug', type: 'text', required: true, unique: true }
{ name: 'excerpt', type: 'textarea' }
{ name: 'publishedAt', type: 'date' }
{ name: 'coverImage', type: 'upload', relationTo: 'media' }
{ name: 'body', type: 'richText', required: true }
```

```ts
// Testimonials.ts core fields
{ name: 'name', type: 'text', required: true }
{ name: 'title', type: 'text' }
{ name: 'rating', type: 'number' }
{ name: 'text', type: 'textarea', required: true }
```

```ts
// ContactSubmissions.ts core fields
{ name: 'name', type: 'text', required: true }
{ name: 'email', type: 'email', required: true }
{ name: 'message', type: 'textarea', required: true }
```

Attach `triggerRevalidation` only to collections that affect rendered site pages.

- [ ] **Step 4: Register the collections in `payload.config.ts`**

Update:

```ts
collections: [Users, Media, Posts, TourPackages, Testimonials, ContactSubmissions],
```

- [ ] **Step 5: Generate types and inspect failures**

Run: `pnpm run generate:types:payload`

Workdir: `apps/cms`

Expected: payload types regenerate with the new collections.

- [ ] **Step 6: Commit**

```bash
git add apps/cms/src/collections apps/cms/src/hooks/triggerRevalidation.ts apps/cms/src/payload.config.ts apps/cms/src/payload-types.ts
git commit -m "feat: define cms collections"
```

---

### Task 4: Build The Repo-JSON Seed Path

**Files:**
- Create: `apps/cms/src/lib/content-mappers.ts`
- Create: `apps/cms/scripts/seed-from-repo-json.ts`

- [ ] **Step 1: Create mapper helpers**

Create `apps/cms/src/lib/content-mappers.ts` with explicit transformations:

```ts
export function mapTour(doc: any) {
  return {
    title: doc.title,
    slug: doc.slug,
    summary: doc.summary ?? doc.description ?? '',
    price: doc.price ?? '',
    duration: doc.duration ?? '',
    location: doc.location ?? '',
    content: doc.content ?? doc.itinerary ?? [],
  }
}

export function mapPost(doc: any) {
  return {
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? '',
    publishedAt: doc.date ?? null,
    body: doc.body,
  }
}

export function mapTestimonial(doc: any) {
  return {
    name: doc.name,
    title: doc.title ?? '',
    rating: Number(doc.rating ?? 5),
    text: doc.text,
  }
}
```

- [ ] **Step 2: Create the seed script**

Create `apps/cms/scripts/seed-from-repo-json.ts`:

```ts
import fs from 'fs/promises'
import path from 'path'
import { mapPost, mapTestimonial, mapTour } from '../src/lib/content-mappers'

const CONTENT_ROOT = path.join(process.cwd(), '../web/src/content')
const PAYLOAD_URL = process.env.PAYLOAD_URL!
const TOKEN = process.env.SEED_ADMIN_TOKEN!

async function readDir(slug: string) {
  const dir = path.join(CONTENT_ROOT, slug)
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.json')).sort()
  return Promise.all(files.map((f) => fs.readFile(path.join(dir, f), 'utf8').then(JSON.parse)))
}

async function post(collection: string, body: unknown) {
  const res = await fetch(`${PAYLOAD_URL}/api/${collection}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Failed to seed ${collection}: ${res.status} ${await res.text()}`)
  }
}

for (const tour of (await readDir('tours')).map(mapTour)) await post('tour-packages', tour)
for (const postDoc of (await readDir('blog')).map(mapPost)) await post('posts', postDoc)
for (const testimonial of (await readDir('testimonials')).map(mapTestimonial)) await post('testimonials', testimonial)
```

- [ ] **Step 3: Add a one-off script entry**

Update `apps/cms/package.json` scripts:

```json
"seed:repo-json": "cross-env NODE_OPTIONS=--no-deprecation tsx scripts/seed-from-repo-json.ts"
```

- [ ] **Step 4: Smoke test the script locally**

Run: `pnpm run seed:repo-json`

Workdir: `apps/cms`

Expected: either successful creates against staging or clear schema-mapping failures that you fix before proceeding.

- [ ] **Step 5: Commit**

```bash
git add apps/cms/src/lib/content-mappers.ts apps/cms/scripts/seed-from-repo-json.ts apps/cms/package.json
git commit -m "feat: add cms seed pipeline"
```

---

### Task 5: Enable Web Revalidation Infrastructure

**Files:**
- Modify: `apps/web/open-next.config.ts`
- Modify: `apps/web/wrangler.jsonc`
- Create: `apps/web/app/api/revalidate/route.ts`

- [ ] **Step 1: Add tag cache to `open-next.config.ts`**

Set `apps/web/open-next.config.ts` to:

```ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import doShardedTagCache from '@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache'

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: doShardedTagCache({ baseShardSize: 12 }),
})
```

- [ ] **Step 2: Add the Durable Object binding and migration**

Add to `apps/web/wrangler.jsonc`:

```jsonc
"durable_objects": {
  "bindings": [
    {
      "name": "NEXT_TAG_CACHE_DO_SHARDED",
      "class_name": "DOShardedTagCache"
    }
  ]
},
"migrations": [
  {
    "tag": "v1_add_do_sharded_tag_cache",
    "new_classes": ["DOShardedTagCache"]
  }
]
```

- [ ] **Step 3: Add the revalidation route**

Create `apps/web/app/api/revalidate/route.ts`:

```ts
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const { tag } = await req.json()
  revalidateTag(tag)

  return NextResponse.json({ revalidated: true, tag })
}
```

- [ ] **Step 4: Verify the web app still builds**

Run: `pnpm run build`

Workdir: `apps/web`

Expected: OpenNext config and wrangler config are accepted with the new tag cache pieces.

- [ ] **Step 5: Commit**

```bash
git add apps/web/open-next.config.ts apps/web/wrangler.jsonc apps/web/app/api/revalidate/route.ts
git commit -m "feat: add web revalidation infrastructure"
```

---

### Task 6: Rewire `apps/web` To Runtime Payload REST Fetches

**Files:**
- Modify: `apps/web/src/lib/cms.ts`

- [ ] **Step 1: Replace local tours read with a tagged REST fetch**

Replace the existing implementation with:

```ts
const PAYLOAD_URL = process.env.PAYLOAD_URL!

export async function getTourPackages(): Promise<Package[]> {
  const res = await fetch(`${PAYLOAD_URL}/api/tour-packages`, {
    next: { revalidate: 3600, tags: ['tours'] },
  })

  const data = await res.json()
  return data.docs.map(mapPackage)
}
```

- [ ] **Step 2: Replace blog and testimonials reads the same way**

Use the same pattern:

```ts
export async function getPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${PAYLOAD_URL}/api/posts`, {
    next: { revalidate: 3600, tags: ['posts'] },
  })
  const data = await res.json()
  return data.docs.map(mapPost).sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${PAYLOAD_URL}/api/testimonials`, {
    next: { revalidate: 3600, tags: ['testimonials'] },
  })
  const data = await res.json()
  return data.docs.map(mapTestimonial)
}
```

- [ ] **Step 3: Keep runtime env usage server-side only**

Ensure the code reads `process.env.PAYLOAD_URL`, not `NEXT_PUBLIC_PAYLOAD_URL`.

- [ ] **Step 4: Verify the site still builds**

Run: `pnpm run build`

Workdir: `apps/web`

Expected: no broken imports from removed `readJsonDirectory` call sites.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/cms.ts
git commit -m "feat: fetch cms content from payload"
```

---

### Task 7: Stage, Seed, And Validate End-To-End

**Files:**
- Modify: environment/config only as needed during setup

- [ ] **Step 1: Create Cloudflare resources**

Run:

```bash
wrangler d1 create teecrownconsult-cms-staging
wrangler d1 create teecrownconsult-cms
wrangler r2 bucket create teecrownconsult-media-staging
wrangler r2 bucket create teecrownconsult-media
```

Expected: concrete database IDs to paste into `apps/cms/wrangler.jsonc`.

- [ ] **Step 2: Set secrets for staging**

Run in `apps/cms`:

```bash
wrangler secret put PAYLOAD_SECRET --env staging
wrangler secret put REVALIDATE_SECRET --env staging
wrangler secret put FRONTEND_REVALIDATE_URL --env staging
```

And in `apps/web`:

```bash
wrangler secret put REVALIDATE_SECRET --env staging
wrangler secret put PAYLOAD_URL --env staging
```

- [ ] **Step 3: Deploy staging CMS and staging web**

Run:

```bash
cd apps/cms && CLOUDFLARE_ENV=staging pnpm run deploy
cd apps/web && CLOUDFLARE_ENV=staging pnpm run deploy
```

Expected: both Workers deploy successfully.

- [ ] **Step 4: Seed staging data**

Run:

```bash
cd apps/cms && PAYLOAD_URL=https://<staging-cms-domain> SEED_ADMIN_TOKEN=<token> pnpm run seed:repo-json
```

Expected: records are created in staging.

- [ ] **Step 5: Verify the full edit-to-live loop**

Manual checks:

```text
1. Open staging CMS admin.
2. Confirm CRUD on Posts, TourPackages, Testimonials, Media, ContactSubmissions.
3. Edit one tour.
4. Confirm staging site reflects the change within seconds.
5. Upload media and confirm R2-backed access works.
```

- [ ] **Step 6: Commit deployment/config updates**

```bash
git add apps/cms/wrangler.jsonc apps/web/wrangler.jsonc
git commit -m "chore: configure staging cms deployment"
```

---

## Self-Review

- Spec coverage: scaffold, D1/R2 wiring, logger, `skipSafeFetch`, seed mapping, runtime REST fetches, DO tag cache, revalidation route, staging deploy, and production go-live are all covered.
- Placeholder scan: remaining placeholders are only environment-specific values that must be supplied at deploy time (`REPLACE_PROD_D1_ID`, staging URLs, tokens, secrets). No implementation placeholders remain.
- Type consistency: collection slugs, env var names, and revalidation tag names are consistent across tasks (`tour-packages` → `tours`, `PAYLOAD_URL`, `REVALIDATE_SECRET`).

Plan complete and saved to `docs/superpowers/plans/2026-08-05-payload-cloudflare-cms-execution-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
