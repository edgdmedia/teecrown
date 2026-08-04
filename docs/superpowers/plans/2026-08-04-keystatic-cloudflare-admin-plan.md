# Keystatic Cloudflare Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Payload CMS dependency with a Git-backed Keystatic editor hosted at `dash.teecrownconsult.org`, while keeping the public frontend on Cloudflare Workers at `teecrownconsult.org`.

**Architecture:** The public site remains a Next.js app deployed to Cloudflare Workers via OpenNext. Content moves from Payload/API fetches into repo-owned files plus optional R2-backed media references. A second lightweight Next.js deployment hosts Keystatic's admin UI in GitHub mode, writing content changes back to the repo through the GitHub API.

**Tech Stack:** Next.js 16, Cloudflare Workers/OpenNext, Keystatic, GitHub OAuth/App credentials, optional Cloudflare R2 for media.

---

## File Structure

### Public site app
- Modify: `package.json` — add Keystatic dependencies/scripts only if they belong in the main app, otherwise keep main app minimal.
- Modify: `src/lib/cms.ts` — remove Payload fetch fallback logic and read from file-based content modules.
- Modify: `src/lib/payload.ts` — delete or replace with file-based content helpers.
- Create: `src/content/config.ts` — shared content schema types/helpers for site-side reads.
- Create: `src/content/site.ts` — top-level site settings content.
- Create: `src/content/blog/*.mdoc` or `*.mdx` — blog entries moved from static arrays / Payload.
- Create: `src/content/tours/*.json` or `*.yaml` — tours/packages content in structured files.
- Create: `src/content/testimonials.json` — testimonial content.
- Modify: page components under `src/app/**` and `src/components/**` — switch to file-based reads.
- Modify: `wrangler.jsonc` — add any bindings needed for media or admin split, if the public app still needs them.

### Admin app
- Create: `apps/admin/package.json` — second app package for admin-only deployment.
- Create: `apps/admin/next.config.ts` — Next config for Keystatic Studio deployment.
- Create: `apps/admin/src/app/layout.tsx` — admin layout shell.
- Create: `apps/admin/src/app/keystatic/[[...params]]/page.tsx` — Keystatic route.
- Create: `apps/admin/keystatic.config.ts` — GitHub mode config and content collections.
- Create: `apps/admin/wrangler.jsonc` — Cloudflare Worker config for `dash.teecrownconsult.org`.
- Create: `apps/admin/open-next.config.ts` if needed by OpenNext.

### Shared ops/docs
- Modify: `README.md` — document new architecture, dev flow, and deploy flow.
- Modify: `docs/Payload-VPS-Cloudflare-Install-Guide.md` or replace with a new migration doc.
- Create: `docs/keystatic-content-model.md` — editor-facing content model and file layout.
- Create: `.github/workflows/deploy-admin.yml` — deploy admin studio to Cloudflare.
- Modify: existing frontend deploy workflow — ensure public site deploy remains separate and unchanged except content-source updates.

---

### Task 1: Audit current content model and map it to file-backed content

**Files:**
- Modify: `src/data/site.ts`
- Modify: `src/data/packages.ts`
- Modify: `src/data/blog.ts`
- Modify: `src/data/testimonials.ts`
- Create: `docs/keystatic-content-model.md`

- [ ] **Step 1: Inventory the current content sources**

Read and list the structures from these files:

```text
src/data/site.ts
src/data/packages.ts
src/data/blog.ts
src/data/testimonials.ts
src/data/contact.ts
src/data/services.ts
src/data/reasons.ts
src/data/stats.ts
src/data/steps.ts
```

Record for each dataset:
- shape
- whether it is singleton vs collection
- whether it references images
- whether it needs rich text

- [ ] **Step 2: Write the content-model decision doc**

Create `docs/keystatic-content-model.md` with sections like:

```md
# Keystatic Content Model

## Singletons
- Site settings
- Contact details

## Collections
- Blog posts
- Tours
- Testimonials

## Field choices
- `blog`: title, slug, category, date, author, excerpt, body, image
- `tours`: title, slug, location, duration, excerpt, tag, gallery, intro, included, highlights, pricing, itinerary, requirements, hashtags, validUntil
```

- [ ] **Step 3: Verify every current page can be satisfied by the planned content model**

Check these routes:

```text
src/app/page.tsx
src/app/about/page.tsx
src/app/services/page.tsx
src/app/blog/page.tsx
src/app/blog/[slug]/page.tsx
src/app/tours/page.tsx
src/app/tours/[slug]/page.tsx
```

Expected: every route's content dependencies are accounted for in the doc.

- [ ] **Step 4: Commit**

```bash
git add docs/keystatic-content-model.md
git commit -m "docs: map current content to keystatic model"
```

### Task 2: Add the admin app in Keystatic GitHub mode

**Files:**
- Create: `apps/admin/package.json`
- Create: `apps/admin/next.config.ts`
- Create: `apps/admin/src/app/layout.tsx`
- Create: `apps/admin/src/app/keystatic/[[...params]]/page.tsx`
- Create: `apps/admin/keystatic.config.ts`

- [ ] **Step 1: Add the admin app package**

Create `apps/admin/package.json`:

```json
{
  "name": "teecrownconsult-admin",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "build:cloudflare": "opennextjs-cloudflare build",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
  },
  "dependencies": {
    "@keystatic/core": "latest",
    "@keystatic/next": "latest",
    "@opennextjs/cloudflare": "^1.20.2",
    "next": "16.2.12",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  }
}
```

- [ ] **Step 2: Add the Keystatic route shell**

Create `apps/admin/src/app/layout.tsx`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

Create `apps/admin/src/app/keystatic/[[...params]]/page.tsx`:

```tsx
import { makePage } from '@keystatic/next/ui/app'
import config from '../../../../keystatic.config'

export const { generateMetadata, GET, POST, PUT } = makePage(config)

export default function KeystaticPage(props: Parameters<typeof makePage>[0]) {
  return null
}
```

Adjust to current Keystatic API once implementing against live docs.

- [ ] **Step 3: Add GitHub mode config**

Create `apps/admin/keystatic.config.ts` with a structure like:

```ts
import { config, collection, singleton, fields } from '@keystatic/core'

export default config({
  storage: {
    kind: 'github',
    repo: 'edgdmedia/teecrown',
  },
  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: '../../src/content/blog/*',
      schema: {
        title: fields.text({ label: 'Title' }),
        slug: fields.slug({ name: { label: 'Slug source' } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Blog', value: 'Blog' },
            { label: 'Guide', value: 'Guide' },
            { label: 'Impact', value: 'Impact' }
          ],
          defaultValue: 'Blog',
        }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        body: fields.mdx({ label: 'Body' }),
      },
    }),
  },
})
```

- [ ] **Step 4: Verify the admin app boots locally**

Run:

```bash
npm install --prefix apps/admin
npm run dev --prefix apps/admin
```

Expected: Next dev server starts and the Keystatic route renders without build-time crashes.

- [ ] **Step 5: Commit**

```bash
git add apps/admin
git commit -m "feat: add keystatic admin app"
```

### Task 3: Move the public site to file-based content reads

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/**`
- Modify: `src/lib/cms.ts`
- Modify: `src/app/**`

- [ ] **Step 1: Create stable content reader helpers**

Create `src/content/config.ts`:

```ts
import fs from 'node:fs/promises'
import path from 'node:path'

const contentRoot = path.join(process.cwd(), 'src/content')

export async function readJsonFile<T>(relativePath: string): Promise<T> {
  const fullPath = path.join(contentRoot, relativePath)
  const raw = await fs.readFile(fullPath, 'utf8')
  return JSON.parse(raw) as T
}
```

- [ ] **Step 2: Replace Payload-backed fallback logic**

Refactor `src/lib/cms.ts` from "fetch Payload, else fallback" to "read repo content directly":

```ts
import { readJsonFile } from '@/content/config'
import type { Package } from '@/data/packages'
import type { BlogPost } from '@/data/blog'
import type { Testimonial } from '@/data/testimonials'

export async function getTourPackages(): Promise<Package[]> {
  return readJsonFile<Package[]>('tours/index.json')
}

export async function getPosts(): Promise<BlogPost[]> {
  return readJsonFile<BlogPost[]>('blog/index.json')
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return readJsonFile<Testimonial[]>('testimonials.json')
}
```

- [ ] **Step 3: Remove unused Payload-specific helper usage**

Delete `src/lib/payload.ts` if no imports remain, or reduce it to a compatibility wrapper only if needed during migration.

Run:

```bash
rg "@/lib/payload|NEXT_PUBLIC_PAYLOAD_URL|/api/posts|/api/tour-packages" src
```

Expected: no live route still depends on Payload API fetches.

- [ ] **Step 4: Run the app locally against file-based content**

Run:

```bash
npm run dev
```

Expected: homepage, blog list/detail, tours list/detail render from repo content with no Payload dependency.

- [ ] **Step 5: Commit**

```bash
git add src/content src/lib/cms.ts src/lib/payload.ts src/app
git commit -m "feat: switch site content reads to repo files"
```

### Task 4: Add GitHub auth and Cloudflare deployment for `dash.teecrownconsult.org`

**Files:**
- Create: `apps/admin/wrangler.jsonc`
- Create: `.github/workflows/deploy-admin.yml`
- Modify: Cloudflare DNS/docs references in `README.md`

- [ ] **Step 1: Add admin Worker config**

Create `apps/admin/wrangler.jsonc`:

```jsonc
{
  "$schema": "../../node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "teecrownconsult-admin",
  "workers_dev": false,
  "preview_urls": false,
  "compatibility_date": "2026-08-04",
  "compatibility_flags": ["nodejs_compat"]
}
```

- [ ] **Step 2: Add admin deploy workflow**

Create `.github/workflows/deploy-admin.yml`:

```yaml
name: Deploy Admin Studio

on:
  push:
    branches: [main]
    paths:
      - 'apps/admin/**'
      - 'src/content/**'
      - '.github/workflows/deploy-admin.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: apps/admin/package.json
      - run: npm install --prefix apps/admin
      - run: npm run deploy --prefix apps/admin
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

- [ ] **Step 3: Document GitHub auth prerequisites**

Add README instructions covering:

```md
- GitHub OAuth/App credentials for Keystatic GitHub mode
- Cloudflare route for `admin.teecrownconsult.org`
- required admin env vars:
  - `KEYSTATIC_GITHUB_CLIENT_ID`
  - `KEYSTATIC_GITHUB_CLIENT_SECRET`
  - `KEYSTATIC_SECRET`
  - repo owner/name
```

- [ ] **Step 4: Validate deployment shape**

Expected architecture after deploy:

```text
teecrownconsult.org         -> public frontend Worker
dash.teecrownconsult.org    -> Keystatic admin Worker
GitHub repo                 -> content source of truth
Cloudflare R2 (optional)    -> media assets
```

- [ ] **Step 5: Commit**

```bash
git add apps/admin/wrangler.jsonc .github/workflows/deploy-admin.yml README.md
git commit -m "feat: deploy keystatic admin to cloudflare"
```

### Task 5: Migrate media and cut over from Payload

**Files:**
- Modify: `src/content/**`
- Modify: frontend components that render images
- Modify: Cloudflare env/docs if R2 is used
- Delete: `client-cms/**` only after final cutover confirmation

- [ ] **Step 1: Decide media strategy explicitly**

Choose one and document it:

```md
Option A: keep image URLs in content files pointing to Cloudflare-hosted assets
Option B: migrate image uploads into R2 and store public URLs in content files
```

- [ ] **Step 2: Update image fields to match the chosen strategy**

For example, if using URLs directly:

```json
{
  "title": "Adventure in Kenya",
  "image": "https://cdn.teecrownconsult.org/tours/kenya-hero.jpg"
}
```

- [ ] **Step 3: Run full end-to-end validation**

Run:

```bash
npm run build
npm run deploy
npm run build --prefix apps/admin
npm run deploy --prefix apps/admin
```

Expected:
- public site deploy succeeds
- admin deploy succeeds
- content edits in admin produce GitHub commits
- edited content appears on the public site after deploy/build pipeline runs

- [ ] **Step 4: Remove Payload only after successful cutover**

Delete only after the new content flow is live and verified:

```text
client-cms/
src/lib/payload.ts
old Payload-specific docs/workflows/env vars
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "refactor: replace payload cms with keystatic workflow"
```

## Self-Review

- Spec coverage: covers branded admin subdomain, zero-VPS content editing, Cloudflare-hosted public site, GitHub-backed content, and Payload removal after cutover.
- Placeholder scan: implementation will still need live Keystatic API shape verified against current docs during execution; that is the main doc-sensitive area.
- Type consistency: content migration should preserve existing `Package`, `BlogPost`, and `Testimonial` shapes or update all consumers together.

Plan complete and saved to `docs/superpowers/plans/2026-08-04-keystatic-cloudflare-admin-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
