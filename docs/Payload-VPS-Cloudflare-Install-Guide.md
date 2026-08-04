# Payload CMS Install Guide — VPS Backend + Cloudflare Frontend
### (with on-demand revalidation built in from day one)

**Domains for this project:**
- `teecrownconsult.org` → the public site (Cloudflare Workers)
- `admin.teecrownconsult.org` → the Payload admin/API (VPS)

*(Note: Payload serves its panel at the `/admin` path by default, so the full admin URL will be `admin.teecrownconsult.org/admin`. If that visual redundancy bothers you, `dash.teecrownconsult.org` is a clean alternative — just swap it in below.)*

**Architecture:**

```
┌──────────────────────────┐        HTTPS / REST API         ┌───────────────────────────┐
│  Cloudflare Workers        │  ────────────────────────────►  │  Client VPS                 │
│  Next.js frontend           │  ◄────────────────────────────  │  Payload CMS + Postgres     │
│  (cached, ISR + webhook)    │   fetch only on revalidation     │  (admin panel, /api)        │
└──────────────────────────┘                                    └───────────────────────────┘
```

Visitor traffic never touches the VPS — pages are served from Cloudflare's edge cache. The VPS is only contacted when: (a) the client saves an edit in Payload admin (triggers one webhook call), or (b) a timed ISR fallback expires (rare, since edits are infrequent — this exists purely as a safety net).

---

## Part 1 — Payload CMS on the VPS

### 1.1 Prerequisites

```bash
node -v          # confirm 20.9+
docker --version
docker compose version
```

If missing:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20
```

### 1.2 Scaffold locally, review, then deploy

```bash
npx create-payload-app@latest client-cms
```

- **Template:** `blank`
- **Database:** `PostgreSQL`
- **Package manager:** your preference

### 1.3 Define collections

Match field names to whatever content types this client needs edited (pages, posts, team members, etc. — adjust per project). Example:

```typescript
// collections/Pages.ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
  ],
  hooks: {
    afterChange: [triggerRevalidation], // see Part 3 below
  },
}
```

### 1.4 Postgres setup

```sql
CREATE DATABASE client_cms;
CREATE USER client_cms_user WITH ENCRYPTED PASSWORD 'CHANGE_ME';
GRANT ALL PRIVILEGES ON DATABASE client_cms TO client_cms_user;
```

### 1.4.5 Migration workflow — read before deploying

By default in local dev, Payload's Postgres adapter auto-pushes schema changes straight to the database (no migration files) — convenient for prototyping, but **must be disabled in production**, or you'll hit schema drift and "column does not exist" errors once real migrations enter the picture.

```typescript
// payload.config.ts
db: postgresAdapter({
  pool: { connectionString: process.env.DATABASE_URI },
  push: process.env.NODE_ENV !== 'production', // auto-push only in dev
}),
```

**The workflow, whenever a collection/schema changes:**

1. Change the collection field(s) locally — dev-mode push handles your local DB as normal.
2. When ready to ship: `npx payload migrate:create` — diffs your schema and writes a migration file into `./src/migrations`, which gets **committed to the repo** (never run locally against production).
3. Deploy as normal (Part 4). The deploy step runs `payload migrate`, applying any pending migration files against the production database.

`payload migrate` is safe to run on **every single deploy**, whether or not anything changed — if there's nothing pending, it detects that and exits without doing anything. That's why it's fine to bake it unconditionally into the deploy script rather than trying to detect "is there a migration this time" yourself — see Part 4.3 below.

### 1.5 Environment variables

```bash
# .env
DATABASE_URI=postgresql://client_cms_user:CHANGE_ME@localhost:5432/client_cms
PAYLOAD_SECRET=generate-a-long-random-string-here
NEXT_PUBLIC_SERVER_URL=https://admin.teecrownconsult.org

CORS_ORIGINS=https://teecrownconsult.org,https://www.teecrownconsult.org

# For the revalidation webhook (Part 3)
REVALIDATE_SECRET=another-long-random-string-here
FRONTEND_REVALIDATE_URL=https://teecrownconsult.org/api/revalidate
```

Wire CORS in `payload.config.ts`:

```typescript
export default buildConfig({
  cors: process.env.CORS_ORIGINS?.split(',') ?? [],
  csrf: process.env.CORS_ORIGINS?.split(',') ?? [],
  // ...
})
```

### 1.5.5 Local development — test before touching the VPS

Never test directly against production. Local loop first:

```bash
# Start just the Postgres service locally (reuse the same docker-compose.yml)
docker compose up -d db

# Local .env (separate from production .env — don't reuse the same file)
DATABASE_URI=postgresql://client_cms_user:CHANGE_ME@localhost:5432/client_cms
PAYLOAD_SECRET=any-random-string-for-local-dev
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3001   # or whatever port the frontend runs on locally

# Run Payload in dev mode
npm run dev
```

This gives you the admin panel and API at `localhost:3000/admin` and `localhost:3000/api` — create a test entry, confirm it saves.

Then run the **frontend** locally too, pointed at this local Payload instance (`NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000`), and confirm the full loop: edit content locally → frontend reflects it. Only once this round-trip works locally should you build the Docker image and deploy to the VPS (Part 1.6 onward).

### 1.6 Dockerize

`next.config.mjs`:
```javascript
import { withPayload } from '@payloadcms/next/withPayload'
export default withPayload({ output: 'standalone' })
```

`Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 payload
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN mkdir -p /app/public/media && chown -R payload:nodejs /app/public/media
USER payload
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

`docker-compose.yml` (omit the `db` service if reusing an existing Postgres instance on the box):
```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: client_cms
      POSTGRES_USER: client_cms_user
      POSTGRES_PASSWORD: CHANGE_ME
    volumes:
      - client_cms_pgdata:/var/lib/postgresql/data

  payload:
    build: .
    restart: unless-stopped
    env_file: .env
    ports:
      - "127.0.0.1:3000:3000"
    volumes:
      - ./media:/app/public/media
    depends_on:
      - db

volumes:
  client_cms_pgdata:
```

```bash
docker compose up -d --build
```

### 1.7 Reverse proxy + SSL (Caddy)

Point `admin.teecrownconsult.org` at the VPS IP in DNS first, then:

```bash
sudo apt install caddy
```

`/etc/caddy/Caddyfile`:
```
admin.teecrownconsult.org {
    reverse_proxy 127.0.0.1:3000
}
```

```bash
sudo systemctl reload caddy
```

### 1.8 First run

Visit `https://admin.teecrownconsult.org/admin` and create the first admin user. This is the client's editing dashboard going forward.

---

## Part 2 — Frontend fetch layer (Cloudflare side)

```typescript
// lib/payload.ts
const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL!

export async function getPage(slug: string) {
  const res = await fetch(
    `${PAYLOAD_URL}/api/pages?where[slug][equals]=${slug}`,
    { next: { revalidate: 3600, tags: [`page-${slug}`] } } // 1hr fallback; webhook handles instant updates
  )
  const data = await res.json()
  return data.docs[0]
}
```

The `tags` array matters — it's what lets the revalidation webhook target just the affected page rather than nuking the whole cache.

Environment variable (Cloudflare Workers dashboard or `wrangler.toml`):
```
NEXT_PUBLIC_PAYLOAD_URL=https://admin.teecrownconsult.org
```

---

## Part 3 — On-demand revalidation (the piece that gets edits live in seconds)

### 3.1 Next.js API route

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const { tag } = await req.json()
  if (!tag) {
    return NextResponse.json({ message: 'Missing tag' }, { status: 400 })
  }

  revalidateTag(tag)
  return NextResponse.json({ revalidated: true, tag, now: Date.now() })
}
```

`REVALIDATE_SECRET` needs to be set as an environment variable in the Cloudflare Workers dashboard too, matching the VPS-side value — this prevents anyone else from triggering arbitrary revalidations.

### 3.2 Payload hook (fires on every save)

```typescript
// hooks/triggerRevalidation.ts
import type { CollectionAfterChangeHook } from 'payload'

export const triggerRevalidation: CollectionAfterChangeHook = async ({ doc, collection }) => {
  const tag = collection.slug === 'pages' ? `page-${doc.slug}` : collection.slug

  try {
    await fetch(
      `${process.env.FRONTEND_REVALIDATE_URL}?secret=${process.env.REVALIDATE_SECRET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag }),
      }
    )
  } catch (err) {
    // Log but don't fail the save if the frontend is briefly unreachable
    console.error('Revalidation webhook failed:', err)
  }

  return doc
}
```

Already wired into the `Pages` collection's `hooks.afterChange` in step 1.3 — repeat that pattern for every collection the client can edit.

### 3.3 What this gets you

- Client saves a page in Payload admin → hook fires → frontend revalidates that one tag → next visitor gets fresh content within **1–5 seconds**
- If the webhook call fails for any reason (network blip), the `revalidate: 3600` fallback still guarantees the page updates within an hour regardless — belt and suspenders, no edit is ever permanently stuck stale

---

## Part 4 — GitHub → VPS deploy pipeline

Cloudflare Workers Builds (used for the frontend) doesn't apply here — a VPS needs its own deploy mechanism. The equivalent, same-shape flow: work on **`development`** → push → **automatic deploy via GitHub Actions**, which SSHs into the VPS, pulls the branch, installs deps, applies migrations, builds the standalone bundle and restarts the PM2 process. The workflow also fires on pushes to `main` and can be triggered manually from the Actions tab.

The CMS runs on the VPS under **PM2** (not Docker), serving the `.next/standalone` build produced by `next build`. Deploys are a no-downtime sequence run from the `client-cms/` directory.

### 4.1 Generate a deploy key

On the VPS:
```bash
ssh-keygen -t ed25519 -C "teecrown-github-actions-deploy" -f ~/.ssh/github_actions_deploy -N ""
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
```

Then from your local machine, **fetch the full private key** (the entire `-----BEGIN OPENSSH PRIVATE KEY-----` … `-----END OPENSSH PRIVATE KEY-----` block, newlines included — a one-line blob will fail with `ssh.ParsePrivateKey: ssh: no key found`):
```bash
ssh <VPS_USER>@<VPS_HOST> "cat ~/.ssh/github_actions_deploy"
```

Permissions matter — verify on the VPS:
```bash
chmod 700 ~/.ssh && chmod 600 ~/.ssh/github_actions_deploy
grep -q teecrown-github-actions-deploy ~/.ssh/authorized_keys && echo "pubkey authorized" || echo "MISSING: run: cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys"
```

### 4.2 Add GitHub repository secrets

In the repo → **Settings → Secrets and variables → Actions**, add:
- `VPS_HOST` — the VPS IP or hostname
- `VPS_USER` — the SSH user
- `VPS_SSH_KEY` — the **full private key block** from 4.1
- `VPS_PROJECT_PATH` — the repo root on the VPS, e.g. `/home/teecrownconsult/teecrown` (the workflow `cd`s into `client-cms/` inside it)
- `VPS_PORT` — *optional*, SSH port, defaults to `22` if unset
- `VPS_FINGERPRINT` — *optional*, server host key fingerprint for stricter host verification

Connectivity check: GitHub Actions runners must be able to reach `VPS_HOST` on the SSH port. If the run logs `connect: connection refused`, open that port to the runner in the firewall / security group (or set `VPS_PORT` to the real port).

### 4.3 Workflow file

```yaml
# .github/workflows/deploy-cms.yml
name: Deploy Payload CMS

on:
  push:
    branches: [development, main]
  workflow_dispatch:

concurrency:
  group: cms-deploy
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT || '22' }}
          fingerprint: ${{ secrets.VPS_FINGERPRINT || '' }}
          script_stop: true
          timeout: 30s
          command_timeout: 30m
          envs: BRANCH
          script: |
            set -e

            echo ">> Deploying branch: $BRANCH"
            cd ${{ secrets.VPS_PROJECT_PATH }}

            git fetch origin
            git checkout $BRANCH
            git reset --hard origin/$BRANCH

            cd client-cms

            echo ">> Installing dependencies"
            npm install --no-audit --no-fund

            echo ">> Applying database migrations"
            npm run migrate

            echo ">> Building standalone bundle"
            npm run build

            echo ">> Restarting PM2 process"
            pm2 delete teecrown-cms || true
            pm2 start .next/standalone/server.js --name teecrown-cms
            pm2 save

            echo ">> Final status"
            pm2 status teecrown-cms
        env:
          BRANCH: ${{ github.ref_name }}
```

`npm run migrate` checks for and applies any pending migrations **before** the new bundle restarts — a safe no-op if there's nothing to migrate (per 1.4.5 above), so it runs unconditionally on every deploy. `script_stop: true` + `set -e` make the run fail fast if a migration errors, before any restart. `git reset --hard` keeps the server's working tree identical to the pushed branch (`.env` is untracked/ignored and is untouched).

### 4.4 The resulting flow

1. Work happens on `development`, pushed freely — each push triggers a deploy.
2. Review as normal; merging `development` → `main` also triggers a deploy with the same pipeline.
3. The workflow SSHs into the VPS → pulls the branch → installs deps → runs migrations → builds the standalone bundle → restarts the `teecrown-cms` PM2 process and runs `pm2 save`.
4. Payload picks up the change; the on-demand revalidation hook (Part 3) still fires normally on the next content edit, independent of code deploys.

Same mental model as the Cloudflare side (`development` → live), just a different mechanism under the hood since a VPS has no native git-integrated build system the way Workers does.

**One thing still worth verifying manually:** the workflow updates code and applies schema migrations automatically, but it does **not** manage `.env` changes — if a new feature needs a new environment variable, add it to the VPS's `.env` file yourself before merging the PR that depends on it. Secrets should never live in the repo, so this one step stays manual by design.

---

## Part 5 — User accounts & permissions (giving someone limited upload access)

Yes — Payload has a built-in `Users` collection (created automatically by `create-payload-app`) with full role-based access control. You're not limited to "everyone with a login is a full admin." You can create restricted accounts that can only touch specific collections, or only certain actions within them.

### 5.1 Add a roles field to the Users collection

```typescript
// collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' }, // can only manage content, not users/settings
      ],
    },
  ],
}
```

### 5.2 Restrict access per collection based on role

Each collection can define its own `access` rules, checking the logged-in user's role:

```typescript
// collections/Pages.ts
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true, // public read, unrelated to admin login
    create: ({ req }) => Boolean(req.user), // any logged-in user (admin or editor)
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.roles?.includes('admin') ?? false, // only admins can delete
  },
  // ...fields
}
```

For a collection you want an editor to have **zero access to** (e.g., a "Settings" or "Users" collection), just check for the admin role explicitly:

```typescript
access: {
  read: ({ req }) => req.user?.roles?.includes('admin') ?? false,
  create: ({ req }) => req.user?.roles?.includes('admin') ?? false,
  update: ({ req }) => req.user?.roles?.includes('admin') ?? false,
  delete: ({ req }) => req.user?.roles?.includes('admin') ?? false,
},
```

### 5.3 Field-level restriction (if needed)

You can go even more granular — restrict a single *field* within a collection an editor otherwise has access to (e.g., an editor can update page content, but not change the URL slug):

```typescript
{
  name: 'slug',
  type: 'text',
  access: {
    update: ({ req }) => req.user?.roles?.includes('admin') ?? false,
  },
}
```

### 5.4 Creating the actual account

Once roles exist, creating a limited account is just: log into `admin.teecrownconsult.org/admin` as an admin → **Users → Create New** → set their role to `editor` → send them the login. They'll see the admin panel, but only the collections/actions their role permits — no user management, no settings, no delete access, whatever you've restricted.

This is genuinely one of Payload's strong points versus rolling your own CMS — this access-control system is built in, not something to build yourself.

---

## Rollout order

1. Build and test the full loop **locally** first (Part 1.5.5) — Payload + frontend both running on your machine, confirm edits reflect correctly.
2. Stand up Payload on the VPS (Part 1.6–1.8), confirm `/admin` works, create one test page.
3. Confirm `https://admin.teecrownconsult.org/api/pages` returns it over HTTPS with correct CORS headers.
4. Wire the frontend fetch layer for one content type, confirm it renders against the live VPS instance.
5. Wire the revalidation route + hook, make a test edit, confirm the live page updates within seconds without a manual redeploy.
6. Set up the GitHub Actions deploy pipeline (Part 4) so future code changes ship via `development` → PR → `main`, same as the frontend.
7. Repeat the collection + hook pattern for every other content type the client needs to manage.
