# Tee'Crown Consult

Travel and tourism website for Tee'Crown Consult Limited — a Nigerian travel and tourism company offering flights, visas, insurance, tours, and vacation packages.

Built with [Next.js](https://nextjs.org) (App Router) and deployed on [Cloudflare Workers](https://workers.cloudflare.com) via `@opennextjs/cloudflare`.

The repo now has two Cloudflare apps:

- `teecrownconsult.org` - public website
- `dash.teecrownconsult.org` - Keystatic admin studio in GitHub mode

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + inline styles
- **Deployment:** Cloudflare Workers (`@opennextjs/cloudflare` + Wrangler)

## Project Structure

```
apps/
├── admin/            # Keystatic admin app for dash.teecrownconsult.org
└── web/              # Public website for teecrownconsult.org
```

## Getting Started

```bash
npm install
npm run dev --workspace apps/web
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Content Editing

The public site now reads its editable content from `apps/web/src/content/**` at build time.

Keystatic manages that content through the admin app in `apps/admin`.

### Local public site

```bash
npm run dev --workspace apps/web
```

### Local admin studio

```bash
npm install --prefix apps/admin
npm run dev --prefix apps/admin
```

### Required admin env vars

Keystatic GitHub mode requires these for the deployed admin app:

- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET`

GitHub OAuth app settings:

- Homepage URL: `https://dash.teecrownconsult.org`
- Authorization callback URL: `https://dash.teecrownconsult.org/api/keystatic/github/oauth/callback`

Generate `KEYSTATIC_SECRET` locally with:

```bash
openssl rand -base64 32
```

### Where to set admin secrets

For the deployed admin Worker, set these in Cloudflare:

```bash
cd apps/admin
npx wrangler secret put KEYSTATIC_GITHUB_CLIENT_ID
npx wrangler secret put KEYSTATIC_GITHUB_CLIENT_SECRET
npx wrangler secret put KEYSTATIC_SECRET
```

Paste the matching values when prompted.

## Content Source

Public editable content now lives under `apps/web/src/content/`:

- `apps/web/src/content/site.json`
- `apps/web/src/content/contact.json`
- `apps/web/src/content/blog/*.json`
- `apps/web/src/content/tours/*.json`
- `apps/web/src/content/testimonials/*.json`

The public site reads those files directly during build.

Some marketing/support data is still static TypeScript for now:

- `apps/web/src/data/services.ts`
- `apps/web/src/data/reasons.ts`
- `apps/web/src/data/stats.ts`
- `apps/web/src/data/steps.ts`

## Deploying To Cloudflare

### Public site

```bash
cd apps/web
npm run build:cloudflare
npm run deploy
```

### Admin studio

```bash
npm run build:cloudflare --prefix apps/admin
npx wrangler deploy --config apps/admin/wrangler.jsonc
```

### GitHub Actions secrets for automated deploys

Add these repository secrets before using `.github/workflows/deploy-site.yml` and `.github/workflows/deploy-admin.yml`:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET`

### GitHub Actions workflows

- `.github/workflows/deploy-site.yml` deploys the public Worker named `teecrownconsult` from `apps/web`
- `.github/workflows/deploy-admin.yml` deploys the admin Worker named `teecrownconsult-admin`

On first successful run, `wrangler deploy` will create the Worker script if it does not already exist in the target Cloudflare account.

### Cloudflare route

After the admin Worker is deployed, add a custom domain in Cloudflare:

- Worker: `teecrownconsult-admin`
- Route/domain: `dash.teecrownconsult.org`

The admin UI is mounted directly at `/` on that subdomain, while the Keystatic API remains under `/api/keystatic/*`.

### Architecture after deploy

```text
teecrownconsult.org      -> public frontend Worker
dash.teecrownconsult.org -> Keystatic admin Worker
GitHub repo              -> content source of truth
Cloudflare R2            -> public site incremental cache
```

## Image Guidelines

- All images should be in **WebP** format for optimal performance
- Place images in `public/images/`
- Reference as `/images/your-image.webp`
- Gallery images should use a 4:3 aspect ratio for consistent display

## Branching

- Work on the `development` branch
- Merge `development` into `main` when ready to deploy
- Cloudflare auto-deploys when `main` is updated (if Git integration is configured)
