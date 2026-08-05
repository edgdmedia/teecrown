# teecrownconsult: Payload on Cloudflare — Migration Plan v2
### (Option B: live REST fetch + on-demand tag revalidation)

**Fresh installation.** No existing Payload package/deployment is being ported from — `apps/cms` is built new, from the official Cloudflare template, with collections defined fresh rather than copied from any prior codebase. This reflects Option B — `apps/web` fetches from Payload's REST API with ISR + `revalidateTag()`, not a static-JSON-at-build-time approach.

**Locked decision:** Option B. Near-instant (seconds) content updates via targeted cache invalidation, at the cost of `apps/web` having a genuine runtime dependency on Payload's API (not fully static).

**No live database migration.** All content already lives in the repo (`apps/web/src/content/**`, JSON), and any additional content will be provided directly. This is a one-time **seed** step, not a **migration** — no cross-database-engine risk, no legacy data to protect.

---

## Phase 0 — Setup decisions

1. **Workers Paid plan required** — confirmed in the official template's own README: D1 bundle size exceeds the Free tier's limit.
2. **REST only, no GraphQL** — confirmed clean (`apps/web` has no GraphQL usage today; stays that way going forward).
3. **Monorepo wiring:** add `apps/cms` as a proper pnpm workspace member — but note this is **new work**, not a formality. The repo root only pins `packageManager: pnpm@10.33.2`; there is **no `pnpm-workspace.yaml`** today, and both `apps/admin` and `apps/web` have their own lockfiles/`node_modules`. Making `apps/cms` a workspace member means creating `pnpm-workspace.yaml` (`packages: ["apps/*"]`) and reconciling the existing apps' installs. Decide whether to convert `apps/admin`/`apps/web` to workspace members at the same time or keep them standalone — do not assume the workspace already exists.

---

## Phase 1 — Scaffold from the official template (not hand-assembled)

```bash
cd apps
npx create-payload-app@latest cms --template with-cloudflare-d1
```

**Note:** the valid template name is `with-cloudflare-d1`, not `cloudflare-d1` (valid names per `create-payload-app` source: `blank`, `blank-tanstack`, `website`, `ecommerce`, `with-cloudflare-d1`, `plugin`).

This gives you, correctly pre-wired, the pieces that were wrong or missing in v1:
- `@payloadcms/db-d1-sqlite` (the real D1 adapter — **not** `@payloadcms/db-sqlite` with a URL, which can't work on Workers)
- A **custom console-based logger** (Payload's default `pino-pretty` calls Node filesystem APIs that throw on Workers — the template avoids this from the start)
- The correct Cloudflare context pattern for accessing bindings in both Workers runtime and CLI/local execution

---

## Phase 2 — Define collections fresh, with corrections applied from the start

Define the collections this site actually needs — `Users`, `Posts`, `TourPackages`, `Testimonials`, `Media`, `ContactSubmissions` (or whatever set matches the current content model — confirm field shapes against `apps/web/src/content/**`'s existing structure, since that's the real source of truth for what the schema needs to support). These are written new for `apps/cms`; apply these fixes as part of the original implementation, not as corrections to something pre-existing:

**`payload.config.ts` — bindings via context, not `process.env`:**

The template's pattern is critical to get right: `getCloudflareContext({ async: true })` **throws outside a Workers request** (i.e. running `payload migrate:create` or any CLI command). The template branches on `isCLI || !isProduction` and falls back to Wrangler's `getPlatformProxy`. Copy the template's full resolver — this is non-negotiable or Phase 3 breaks:

```typescript
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { r2Storage } from '@payloadcms/storage-r2'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => {
  try {
    return fs.existsSync(value) ? fs.realpathSync(value) : undefined
  } catch {
    return undefined
  }
}

const isCLI = process.argv.some((value) => {
  const resolved = realpath(value)
  if (!resolved) return false
  return (
    resolved.endsWith(path.join('payload', 'bin.js')) ||
    resolved.endsWith(path.join('next', 'dist', 'bin', 'next'))
  )
})
const isProduction = process.env.NODE_ENV === 'production'

// Payload's default logger uses pino-pretty, which calls Node fs APIs that throw
// on Workers (`fs.write is not implemented`). The template ships a console-based
// logger that outputs JSON for Cloudflare observability — keep it.
const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as any // Use PayloadLogger type when it's exported

const cloudflare =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
  telemetry: false,   // kept from v1 — this cost a full debugging day last time, non-negotiable
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  // NOTE: no `push` option at all — that was a Postgres-era pattern, doesn't apply to D1
  logger: isProduction ? cloudflareLogger : undefined,   // dev keeps pino-pretty for DX
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,   // binding, not API keys — confirmed against current source
      collections: { media: true },
    }),
  ],
  // ... collections, editor, etc.
})

// Adapted from the template — https://github.com/payloadcms/payload/tree/main/templates/with-cloudflare-d1
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

**`Media` collection — Workers-specific flags:**
```typescript
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Not supported on Workers yet due to lack of sharp — disable these.
    // Avoid imageSizes/formatOptions too (sharp-dependent) — not usable on Workers.
    crop: false,
    focalPoint: false,
    // Use native fetch instead of undici for file uploads — avoids "Failed to publish
    // diagnostic channel message" errors. NOTE: despite the template README claiming this
    // is included, the actual template Media.ts does NOT set it — add it manually.
    skipSafeFetch: true,
  },
}
```

**SMTP — same explicit opt-in pattern from the VPS fix, carried forward:**
```typescript
email: process.env.PAYLOAD_ENABLE_SMTP === 'true'
  ? nodemailerAdapter({ /* real config */ })
  : undefined,
```

---

## Phase 3 — Seed content into D1 from the repo's existing JSON

**First, create the schema (empty tables) — still needed, just not a data migration:**
```bash
pnpm payload migrate:create   # generate D1/SQLite-dialect migrations from collection defs
pnpm run deploy               # template script: applies migrations, builds, deploys
```
This generates and applies D1/SQLite-dialect migrations for your collection definitions — structural only, no data involved, since the target D1 database starts empty. **Follow the template's flow**: `migrate:create` generates the files, and the deploy script (Phase 8) applies them against the remote binding — don't run a bare local `npx payload migrate` expecting it to hit production D1 (it needs the wrangler proxy for local, the deploy script for remote).

**Then seed content — not a database migration.** Since the actual content values already exist as JSON in `apps/web/src/content/**`, the fastest and lowest-risk path is a small script that reads that existing JSON and creates the corresponding records directly via Payload's own REST API (goes through normal validation/hooks, same as any other create).

**Content source shape:** content does **not** live in single files like `tours.json` — it's per-record directories: `apps/web/src/content/tours/*.json` (currently just `custom.json`), `apps/web/src/content/blog/*.json`, `apps/web/src/content/testimonials/*.json`, plus the `site.json` and `contact.json` singletons. Read them by walking the directories, and expect a **field-name mapping step**: the repo JSON is the Keystatic-era site schema (e.g. blog `body` is Keystatic document format), which does not match Payload's collection schema (blog `body` is lexical rich text). A blind `POST` of the JSON will fail validation — write an explicit mapper per collection.

```typescript
// apps/cms/scripts/seed-from-repo-json.ts
import fs from 'fs/promises'
import path from 'path'

const CONTENT_ROOT = path.join(process.cwd(), '../web/src/content')

async function readDir(slug: string) {
  const dir = path.join(CONTENT_ROOT, slug)
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.json')).sort()
  return Promise.all(files.map((f) => fs.readFile(path.join(dir, f), 'utf8').then(JSON.parse)))
}

const PAYLOAD_URL = process.env.PAYLOAD_URL! // staging first, always
const TOKEN = process.env.SEED_ADMIN_TOKEN!

// mapTour/toPayloadShape etc. — REQUIRED, do not POST raw repo JSON
for (const tour of (await readDir('tours')).map(mapTour)) {
  await fetch(`${PAYLOAD_URL}/api/tour-packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(tour),
  })
}
// repeat per collection (blog, testimonials) and for the site/contact singletons
```

Run this against **staging first**, then spot-check the admin panel matches what's in the repo before doing anything with production. Any additional content beyond what's currently in the repo gets entered directly through the Payload admin UI once it's live, or added to the seed script if you'd rather provide it as data upfront — your call on whichever's more convenient when the time comes.

**Why this is low-risk:** no `pg_dump`, no rehearsal-on-a-throwaway-database step, no cross-database-engine schema translation — none of that applies here. Worst case, a bad seed run just means re-running it against an empty collection, not any risk of losing real content.

---

## Phase 4 — Media assets to R2

Create the bucket, bulk-copy any existing media assets that need to be available, verify the `Media` collection's records match what's actually in R2 after the copy.

```bash
npx wrangler r2 bucket create teecrownconsult-media
```

**Bind it in `apps/cms`'s `wrangler.jsonc`** — the binding name must be `R2` to match `cloudflare.env.R2` in the config (from the template):

```jsonc
"d1_databases": [
  { "binding": "D1", "database_id": "DATABASE_ID", "database_name": "teecrownconsult-cms", "remote": true }
],
"r2_buckets": [
  { "binding": "R2", "bucket_name": "teecrownconsult-media" }
],
// staging env: separate D1 database + separate R2 bucket, e.g. teecrownconsult-media-staging
```

Note the CMS worker's R2 bucket (`R2` = media) is **separate** from `apps/web`'s incremental-cache bucket (`NEXT_INC_CACHE_R2_BUCKET` = rendered page cache) — don't reuse one for both.

---

## Phase 5 — Wire both cache layers — this is the piece that makes revalidation actually work

Option B's whole premise (near-instant updates) depends on this: `revalidateTag()` needs **two** components configured together, not one — `incrementalCache` alone leaves tag-based revalidation silently broken (confirmed directly from the earlier VPS-era R2-caching debugging session, before the move to Cloudflare-native).

`open-next.config.ts`:
```typescript
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
// NOTE: correct path is overrides/incremental-cache/... — the short form
// '@opennextjs/cloudflare/r2-incremental-cache' does not exist as an export
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import doShardedTagCache from '@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache'

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,      // where rendered pages/data are stored
  tagCache: doShardedTagCache({ baseShardSize: 12 }),  // what makes revalidateTag() find the right entry
})
```

`wrangler.jsonc` (for `apps/web`) — the exact DO binding shape, from the official `@opennextjs/cloudflare` docs (your existing file already has the R2 cache bucket + `WORKER_SELF_REFERENCE`; this is additive):

```jsonc
{
  // ...existing config...
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
}
```

**Note on `baseShardSize`:** the default is `4` — each shard is a separate Durable Object, so `12` spawns 12 DOs. That's fine, but be deliberate about it; start with the default unless you have traffic reasons to shard further.

---

## Phase 6 — Rewire `apps/web`'s content layer from local JSON to Payload REST

This is the real architectural change from v1/Option A. Replace `readJsonDirectory('tours')` (currently at `apps/web/src/lib/cms.ts:110`) and equivalent calls for other collections with fetches against the new Payload API, tagged for targeted revalidation:

```typescript
// apps/web/src/lib/cms.ts
// NOTE: use a plain runtime env var, NOT NEXT_PUBLIC_* — NEXT_PUBLIC_ vars are
// inlined at build time, so a runtime Worker binding would never reach this fetch.
// Use PAYLOAD_URL (server-only) or NEXT_PUBLIC_PAYLOAD_URL set at BUILD time.
const PAYLOAD_URL = process.env.PAYLOAD_URL!

export async function getTours() {
  const res = await fetch(`${PAYLOAD_URL}/api/tour-packages`, {
    next: { revalidate: 3600, tags: ['tours'] },   // fallback interval + tag for targeted invalidation
  })
  return (await res.json()).docs
}
```

Repeat this pattern per collection currently read from local JSON. Set `PAYLOAD_URL` as a server-side environment variable in `apps/web`'s Cloudflare Workers settings (a runtime binding — this works because the var is read at runtime, not inlined).

---

## Phase 7 — The revalidation webhook (Payload → Next.js)

Same pattern as the original VPS-era design, unchanged in shape — only the hosting location of both ends has changed.

```typescript
// apps/web/app/api/revalidate/route.ts
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

```typescript
// apps/cms/src/hooks/triggerRevalidation.ts
export const triggerRevalidation: CollectionAfterChangeHook = async ({ doc, collection }) => {
  const tag = collection.slug === 'tour-packages' ? 'tours' : collection.slug
  await fetch(`${process.env.FRONTEND_REVALIDATE_URL}?secret=${process.env.REVALIDATE_SECRET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag }),
  })
}
```

---

## Phase 8 — Deploy via the template's own command, staging first

**Use the template's deploy script, not a raw `wrangler deploy`** — it handles migrations correctly as part of the sequence:

```bash
CLOUDFLARE_ENV=staging pnpm run deploy
```

**Test thoroughly against staging before anything touches production:**
- Admin panel loads, CRUD works on each collection
- Media uploads land in R2 correctly
- `apps/web` (also pointed at staging) renders all content correctly
- **Explicitly test the full revalidation loop**: edit content in Payload admin → confirm the live staging site reflects it within seconds, not minutes. This is the entire point of choosing Option B — verify it actually delivers before cutover.

---

## Phase 9 — Go live

Lower-stakes than v1's cutover, since there's no live client data to protect — but still worth a clean, deliberate switch rather than rushing:

1. Confirm staging has been verified end-to-end (Phase 8) — admin panel, media, and critically, the full edit-to-live revalidation loop.
2. Re-run the seed script (Phase 3) against the **production** D1 database, or enter final content directly via the admin UI if that's easier at this point.
3. Deploy `apps/cms` to production.
4. Update `apps/web`'s production `PAYLOAD_URL`, deploy.
5. Verify the live site renders correctly, and do one real test edit in production to confirm the revalidation loop works there too, not just in staging.

## Phase 10 — Old VPS deployment

Since there's no production data tying you to it, this can be decommissioned on your own timeline — whenever you're satisfied the new Cloudflare-native setup is stable, not gated on any data-safety concern. `pm2 stop teecrown-cms` and clean up the old deploy workflow/secrets when ready.

---

## Summary of key implementation details, in one place

| Concern | Correct approach |
|---|---|
| Template | `create-payload-app@latest cms --template with-cloudflare-d1` (not `cloudflare-d1`) |
| DB adapter | `sqliteD1Adapter` + D1 binding — a connection-string-based adapter can't work on Workers |
| Bindings access | `getCloudflareContext()`, with the `isCLI \|\| !isProduction` → `getPlatformProxy()` fallback for local/CLI use — calling it bare at module scope throws outside a live Worker request |
| R2 storage | `@payloadcms/storage-r2` + R2 binding (name it `R2`, matching `cloudflare.env.R2`) |
| Logger | Template's console-based JSON logger in production — Payload's default `pino-pretty` crashes on Workers |
| Media uploads | `crop: false`, `focalPoint: false` (no `sharp` on Workers), `skipSafeFetch: true` — all three under `upload`, not `custom` |
| Frontend content source | `apps/web` fetches Payload REST at request time, with `revalidate` + `tags` — not local JSON at build time |
| Frontend env var | Plain `PAYLOAD_URL` (server-side, runtime) — `NEXT_PUBLIC_*` vars are inlined at build time and won't see a runtime Worker binding |
| Cache config | Both `incrementalCache` (correct import: `@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache`) **and** `tagCache` (`doShardedTagCache`, with its Durable Objects binding) — either alone leaves `revalidateTag()` silently broken |
| Deploy command | Template's `pnpm run deploy` — not a raw `wrangler deploy` |
| Monorepo | No `pnpm-workspace.yaml` exists yet — creating one and reconciling `apps/admin`/`apps/web` is real Phase 0 work, not a formality |
| Seed data | Repo JSON needs an explicit per-collection mapping layer (Keystatic document format ≠ Payload Lexical) — not a blind POST of raw files |
