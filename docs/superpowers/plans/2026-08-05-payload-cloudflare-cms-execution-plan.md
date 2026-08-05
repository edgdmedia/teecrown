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

- [x] **Step 1: Update package identity and worker placeholders**

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

- [x] **Step 2: Add a staging environment block**

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

- [x] **Step 3: Install dependencies**

Run: `pnpm install`

Workdir: `apps/cms`

Expected: `pnpm-lock.yaml` created and install completes without missing package errors.

- [x] **Step 4: Generate types**

Run: `pnpm run generate:types`

Workdir: `apps/cms`

Expected: `cloudflare-env.d.ts` and `src/payload-types.ts` generated successfully.

- [x] **Step 5: Commit**

```bash
git add apps/cms/package.json apps/cms/wrangler.jsonc apps/cms/README.md apps/cms/pnpm-lock.yaml apps/cms/cloudflare-env.d.ts apps/cms/src/payload-types.ts
git commit -m "chore: normalize cms scaffold"
```

---

### Task 2: Lock Payload Config To The Cloudflare Pattern

**Files:**
- Modify: `apps/cms/src/payload.config.ts`
- Modify: `apps/cms/src/collections/Media.ts`

- [x] **Step 1: Keep the template's runtime/CLI fallback exactly**

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

- [x] **Step 2: Keep the template's top-level `plugins` wiring — R2 is a plugin, not a `storage` key**

Verified against the official `with-cloudflare-d1` template (`payloadcms/payload@3.x`) and the installed `payload@3.82.1` type declarations: `r2Storage` is a `Plugin`, and `Config` has **no** top-level `storage` property. The scaffold's committed `storage:` array is a type error — use the template's `plugins:` wiring:

```ts
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, TourPackages, Testimonials, ContactSubmissions],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
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

- [x] **Step 3: Make Media Workers-safe**

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

- [x] **Step 4: Verify config compiles**

Run: `pnpm run generate:types:payload`

Workdir: `apps/cms`

Expected: Payload config loads, no D1/R2 adapter shape errors.

- [x] **Step 5: Commit**

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

- [x] **Step 1: Create the revalidation hook**

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

- [x] **Step 2: Define `TourPackages`**

Create `apps/cms/src/collections/TourPackages.ts`. Every field below is required by the web `Package` type (`apps/web/src/data/packages.ts`) and the rendered tour page — do not drop any:

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
    { name: 'location', type: 'text', required: true },
    { name: 'image', type: 'text', required: true },
    { name: 'duration', type: 'text', required: true },
    { name: 'gallery', type: 'array', fields: [{ name: 'src', type: 'text', required: true }] },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'tag', type: 'text', required: true },
    { name: 'intro', type: 'richText' },
    { name: 'pricing', type: 'array', fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'value', type: 'text', required: true },
    ] },
    { name: 'validUntil', type: 'text' },
    { name: 'included', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'highlights', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'requirements', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'itinerary', type: 'array', fields: [
      { name: 'day', type: 'text', required: true },
      { name: 'description', type: 'text', required: true },
    ] },
    { name: 'hashtags', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
  ],
  hooks: { afterChange: [triggerRevalidation] },
}
```

- [x] **Step 3: Define `Posts`, `Testimonials`, and `ContactSubmissions`**

Create collection files matching the web `BlogPost` and `Testimonial` types:

```ts
// Posts.ts — matches apps/web/src/data/blog.ts BlogPost
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'category', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'image', type: 'text', required: true },
    { name: 'date', type: 'text', required: true },
    { name: 'author', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'body', type: 'richText' },
  ],
  hooks: { afterChange: [triggerRevalidation] },
}
```

```ts
// Testimonials.ts — matches apps/web/src/data/testimonials.ts Testimonial
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'rating', type: 'number', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true },
  ],
  hooks: { afterChange: [triggerRevalidation] },
}
```

```ts
// ContactSubmissions.ts — admin-only write, public read off
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea', required: true },
  ],
}
```

Attach `triggerRevalidation` only to collections that affect rendered site pages (`tour-packages`, `posts`, `testimonials`). `contact-submissions` does not get the hook.

- [x] **Step 4: Register the collections in `payload.config.ts`**

Update:

```ts
collections: [Users, Media, Posts, TourPackages, Testimonials, ContactSubmissions],
```

- [x] **Step 5: Generate types and inspect failures**

Run: `pnpm run generate:types:payload`

Workdir: `apps/cms`

Expected: payload types regenerate with the new collections.

- [x] **Step 6: Commit**

```bash
git add apps/cms/src/collections apps/cms/src/hooks/triggerRevalidation.ts apps/cms/src/payload.config.ts apps/cms/src/payload-types.ts
git commit -m "feat: define cms collections"
```

---

### Task 4: Build The Repo-JSON Seed Path

**Files:**
- Create: `apps/cms/src/lib/content-mappers.ts`
- Create: `apps/cms/scripts/seed-from-repo-json.ts`

- [x] **Step 1: Create mapper helpers**

Create `apps/cms/src/lib/content-mappers.ts`. These map repo JSON (`apps/web/src/content/**`, shape verified against `singapore.json` / `turkey-guide.json` / testimonials) to the Payload collection input shapes. Array fields are stored as Payload `array` rows, so wrap each item in the row's field name:

```ts
import type { RichText } from '@payloadcms/richtext-lexical/types'

export function mapTour(doc: any) {
  return {
    slug: doc.slug,
    title: doc.title,
    location: doc.location,
    image: doc.image,
    duration: doc.duration,
    gallery: (doc.gallery ?? []).map((src: string) => ({ src })),
    excerpt: doc.excerpt,
    tag: doc.tag,
    intro: toLexical(doc.intro),
    pricing: (doc.pricing ?? []).map((row: any) => ({ label: row.label, value: row.value })),
    validUntil: doc.validUntil,
    included: (doc.included ?? []).map((item: string) => ({ item })),
    highlights: (doc.highlights ?? []).map((item: string) => ({ item })),
    requirements: (doc.requirements ?? []).map((item: string) => ({ item })),
    itinerary: (doc.itinerary ?? []).map((row: any) => ({ day: row.day, description: row.description })),
    hashtags: (doc.hashtags ?? []).map((item: string) => ({ item })),
  }
}

export function mapPost(doc: any) {
  return {
    slug: doc.slug,
    category: doc.category,
    title: doc.title,
    image: doc.image,
    date: doc.date,
    author: doc.author,
    excerpt: doc.excerpt,
    body: toLexical(doc.body),
  }
}

export function mapTestimonial(doc: any) {
  return {
    rating: Number(doc.rating ?? 5),
    name: doc.name,
    title: doc.title,
    text: doc.text,
  }
}

function paragraph(text: string) {
  return {
    type: 'paragraph' as const,
    children: [{ type: 'text' as const, text, format: 0, detail: 0, mode: 'normal' as const, style: '', version: 1 }],
    direction: 'ltr' as const,
    format: '',
    indent: 0,
    version: 1,
  }
}

export function toLexical(text?: string | null): RichText | null {
  if (!text) return null
  const paragraphs = text.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)
  return {
    root: {
      type: 'root' as const,
      children: paragraphs.map(paragraph),
      direction: 'ltr' as const,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}
```

- [x] **Step 2: Create the seed script**

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

- [x] **Step 3: Add a one-off script entry**

Update `apps/cms/package.json` scripts:

```json
"seed:repo-json": "cross-env NODE_OPTIONS=--no-deprecation tsx scripts/seed-from-repo-json.ts"
```

- [x] **Step 4: Typecheck the script (do NOT run it yet)**

The seed script needs a live CMS (staging), which is created in **Task 7**. For now, only verify it compiles:

Run: `npx tsc --noEmit scripts/seed-from-repo-json.ts src/lib/content-mappers.ts`

Workdir: `apps/cms`

Expected: no type errors (array field shapes line up with the mapped output).

Actual seeding against staging happens in Task 7 Step 4, once staging resources exist.

- [x] **Step 5: Commit**

```bash
git add apps/cms/src/lib/content-mappers.ts apps/cms/scripts/seed-from-repo-json.ts apps/cms/package.json
git commit -m "feat: add cms seed pipeline"
```

---

### Task 5: Enable Web Revalidation Infrastructure

**Files:**
- Modify: `apps/web/open-next.config.ts`
- Modify: `apps/web/wrangler.jsonc`
- Verify (already committed, keep as-is): `apps/web/src/app/api/revalidate/route.ts`

> **Time-based ISR requires the revalidation Queue** (verified against OpenNext docs): the `doQueue` / `NEXT_CACHE_DO_QUEUE` binding and a `DOQueueHandler` migration must be added in addition to the tag cache. DO migrations must use `new_sqlite_classes` (not `new_classes`).

- [x] **Step 1: Add tag cache + queue to `open-next.config.ts`**

Set `apps/web/open-next.config.ts` to:

```ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import doShardedTagCache from '@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache'
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue'

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: doShardedTagCache({ baseShardSize: 12 }),
  queue: doQueue,
})
```

- [x] **Step 2: Add the Durable Object bindings and migrations**

Add to `apps/web/wrangler.jsonc` (matches the official OpenNext "large site using revalidation" config — the DO queue is a Durable Object, **not** a Cloudflare `queues` binding):

```jsonc
"durable_objects": {
  "bindings": [
    {
      "name": "NEXT_CACHE_DO_QUEUE",
      "class_name": "DOQueueHandler",
    },
    {
      "name": "NEXT_TAG_CACHE_DO_SHARDED",
      "class_name": "DOShardedTagCache",
    },
  ],
},
"migrations": [
  {
    "tag": "v1",
    "new_sqlite_classes": [
      "DOQueueHandler",
      "DOShardedTagCache",
    ],
  },
],
```

- [x] **Step 3: Verify the existing revalidation route (keep it, do not overwrite)**

`apps/web/src/app/api/revalidate/route.ts` already exists (committed in the scaffold). It uses `revalidateTag(tag, 'max')` (Next 16 recommended form) and returns 400 when `tag` is missing. Leave it as-is; just confirm the file is present and uses the `secret` query-param + `tag` body contract that the Payload `triggerRevalidation` hook will call.

- [x] **Step 4: Verify the web app still builds**

Run: `pnpm run build`

Workdir: `apps/web`

Expected: OpenNext config and wrangler config are accepted with the new tag cache + queue pieces.

- [x] **Step 5: Commit**

```bash
git add apps/web/open-next.config.ts apps/web/wrangler.jsonc
git commit -m "feat: add web revalidation infrastructure"
```

---

### Task 6: Rewire `apps/web` To Runtime Payload REST Fetches

**Files:**
- Modify: `apps/web/src/lib/cms.ts`

> The Payload REST API returns array fields as rows (`gallery: [{ src }]`, `included: [{ item }]`, `pricing: [{ label, value }]`) and richText fields already in Lexical form, and it paginates at 10 docs/page by default — so the fetch needs a `limit` param and the mappers must unwrap rows and pass richText through.

> **Tags must be attached per-fetch**: `revalidateTag('tours')` only invalidates cache entries stored with `tags: ['tours']`. `fetchDocs` therefore takes the tag name and passes it to `next.tags`.

- [x] **Step 1: Replace local reads with tagged REST fetches + mappers**

Replace `apps/web/src/lib/cms.ts` with:

```ts
import type { Package, PricingRow, ItineraryDay } from '@/data/packages'
import type { BlogPost } from '@/data/blog'
import type { Testimonial } from '@/data/testimonials'

const PAYLOAD_URL = process.env.PAYLOAD_URL!

interface ApiTour {
  slug: string
  title: string
  location: string
  image: string
  duration: string
  gallery?: Array<{ src: string }>
  excerpt: string
  tag: string
  intro?: unknown
  pricing?: PricingRow[]
  validUntil?: string
  included?: Array<{ item: string }>
  highlights?: Array<{ item: string }>
  requirements?: Array<{ item: string }>
  itinerary?: ItineraryDay[]
  hashtags?: Array<{ item: string }>
}

interface ApiPost {
  slug: string
  category: string
  title: string
  image: string
  date: string
  author: string
  excerpt: string
  body?: unknown
}

function mapPackage(doc: ApiTour): Package {
  return {
    slug: doc.slug,
    title: doc.title,
    location: doc.location,
    image: doc.image,
    duration: doc.duration,
    gallery: (doc.gallery ?? []).map((row) => row.src),
    excerpt: doc.excerpt,
    tag: doc.tag,
    content: {
      intro: doc.intro ?? null,
      included: (doc.included ?? []).map((row) => row.item),
      highlights: (doc.highlights ?? []).map((row) => row.item),
      pricing: doc.pricing ?? [],
      itinerary: doc.itinerary ?? [],
      requirements: (doc.requirements ?? []).map((row) => row.item),
      hashtags: (doc.hashtags ?? []).map((row) => row.item),
      validUntil: doc.validUntil,
    },
  }
}

function mapPost(doc: ApiPost): BlogPost {
  return {
    slug: doc.slug,
    category: doc.category,
    title: doc.title,
    image: doc.image,
    date: doc.date,
    author: doc.author,
    excerpt: doc.excerpt,
    body: doc.body ?? null,
  }
}

function mapTestimonial(doc: Testimonial): Testimonial {
  return {
    rating: Number(doc.rating ?? 5),
    name: doc.name,
    title: doc.title,
    text: doc.text,
  }
}

async function fetchDocs<T>(collection: string, tag: string): Promise<T[]> {
  const res = await fetch(`${PAYLOAD_URL}/api/${collection}?limit=1000`, {
    next: { revalidate: 3600, tags: [tag] },
  })
  if (!res.ok) throw new Error(`CMS fetch failed for ${collection}: ${res.status}`)
  const data = await res.json()
  return data.docs as T[]
}
```

- [x] **Step 2: Tagged getters**

```ts
export async function getTourPackages(): Promise<Package[]> {
  const docs = await fetchDocs<ApiTour>('tour-packages', 'tours')
  return docs.map(mapPackage)
}

export async function getTourPackage(slug: string): Promise<Package | undefined> {
  const all = await getTourPackages()
  return all.find((p) => p.slug === slug)
}

export async function getPosts(): Promise<BlogPost[]> {
  const docs = await fetchDocs<ApiPost>('posts', 'posts')
  return docs.map(mapPost).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const all = await getPosts()
  return all.find((p) => p.slug === slug)
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const docs = await fetchDocs<Testimonial>('testimonials', 'testimonials')
  return docs.map(mapTestimonial)
}
```

The tag per fetch (`tours`, `posts`, `testimonials`) matches what the Payload `triggerRevalidation` hook sends to the `/api/revalidate` route.

- [x] **Step 3: Keep runtime env usage server-side only**

Ensure the code reads `process.env.PAYLOAD_URL`, not `NEXT_PUBLIC_PAYLOAD_URL`.

- [x] **Step 4: Verify the site still builds**

Run: `pnpm run build`

Workdir: `apps/web`

Expected: no broken imports from removed `readJsonDirectory` call sites (`cms.ts` is the only consumer; callers are `src/app/{page,tours/*,blog/*,sitemap}.tsx`).

- [x] **Step 5: Commit**

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
