# Tee'Crown Consult Operations Manual

## VPS Details

- **Host:** `server.edgdmedia.com`
- **User:** `teecrownconsult`
- **CMS URL:** `https://dash.teecrownconsult.org`
- **Deploy key:** ed25519 key stored in GitHub secret `VPS_SSH_KEY`

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Cloudflare                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │  Workers: teecrown-  │  │  R2: teecrownconsult-│ │
│  │  consult (web)       │  │  media                │ │
│  │  teecrownconsult-cms │  │  teecrownconsult-     │ │
│  │  (legacy, dead)      │  │  opennext-cache       │ │
│  └──────────────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────┘
         │
         │ fetches content
         ▼
┌─────────────────────────────────────────────────────┐
│  VPS: dash.teecrownconsult.org                      │
│  ┌──────────────────────┐                           │
│  │  Payload CMS         │                           │
│  │  Next.js standalone  │                           │
│  │  PostgreSQL          │                           │
│  │  PM2 process         │                           │
│  └──────────────────────┘                           │
└─────────────────────────────────────────────────────┘
```

## Deploy Triggers

| Event | Web (Cloudflare) | CMS (VPS) |
|---|---|---|
| PR merged to `main` (paths match) | Auto via GitHub Actions | Auto via GitHub Actions |
| Tag `deploy-web-*` pushed | Manual via Actions | — |
| Tag `deploy-cms-*` pushed | — | Manual via Actions |
| `workflow_dispatch` from GitHub UI | Builds + deploys | SSH + deploys |
| Local terminal | `pnpm run deploy` | `bash scripts/deploy-vps.sh` |

## Manual Deploys From Terminal

### Web deploy

```bash
cd apps/web
pnpm run build:cloudflare
pnpm opennextjs-cloudflare deploy -- --keep-vars
```

### CMS deploy (on VPS)

The workflow uploads a source archive and builds **on the VPS**. The extracted
repo *is* the running app — it is built and run in place at
`/home/teecrownconsult/apps/cms`, with no release/current swap. For manual
deploys:

```bash
# SSH into VPS
ssh teecrownconsult@server.edgdmedia.com

cd /home/teecrownconsult/apps/cms
bash scripts/deploy-vps.sh
```

The script installs, builds, migrates, restarts PM2, then polls
`http://127.0.0.1:3000/api/tour-packages?limit=1` and exits non-zero if the app
never answers. `pm2 start` exits 0 even when the app is crash-looping, so
without that check a dead CMS reports as a successful deploy.

## Server Prerequisites (one-time, per machine)

These live on the VPS, not in the repo. A rebuilt or replacement server needs
them re-done or **every CMS deploy will fail**.

### Approve pnpm build scripts

pnpm 10.16+ refuses to run dependency install/postinstall scripts unless they are
explicitly approved, and pnpm 11 makes an unapproved script a **fatal error**
rather than a warning:

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild, sharp, unrs-resolver
```

`sharp` is required for Payload image processing, so this is not optional. Run
once, as the deploy user, in the app directory, and select all:

```bash
cd /home/teecrownconsult/apps/cms
pnpm approve-builds
```

The approval persists on the machine and survives redeploys.

> This bit once already: the VPS pnpm auto-updated from 10.33 to 11.23
> mid-afternoon, turning a warning into a hard failure. Every CMS deploy broke
> until `pnpm approve-builds` was run, with no repo change involved.

Pinning pnpm on the server (`corepack use pnpm@10.33.2`) would prevent a repeat
of the surprise upgrade, but the approval is still required.

## GitHub Actions Secrets

### Required for web deploy

| Secret | Description | How to get |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | API token with Workers permissions | Cloudflare dashboard → My Profile → API Tokens → Create Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Cloudflare dashboard → right sidebar |

### Required for CMS deploy (VPS)

| Secret | Description | Value |
|---|---|---|
| `VPS_HOST` | VPS hostname | `server.edgdmedia.com` |
| `VPS_USER` | SSH username | `teecrownconsult` |
| `VPS_SSH_KEY` | Deploy SSH private key | Generated ed25519 key |

### CMS env vars (on VPS)

Set in `/home/teecrownconsult/apps/cms/shared/.env.production`:

```bash
DATABASE_URL=postgres://teecrowncms:PASSWORD@127.0.0.1:5432/teecrowncms
PAYLOAD_SECRET=YOUR_SECRET
PAYLOAD_URL=https://dash.teecrownconsult.org
FRONTEND_REVALIDATE_URL=https://teecrownconsult.org/api/revalidate
REVALIDATE_SECRET=SHARED_SECRET
SMTP_HOST=mail.teecrownconsult.org
SMTP_PORT=587
SMTP_USER=noreply@teecrownconsult.org
SMTP_PASS=YOUR_SMTP_PASSWORD
SMTP_TLS_REJECT_UNAUTHORIZED=false
FROM_EMAIL=noreply@teecrownconsult.org
EMAIL_FROM_NAME=Tee'Crown Consult
ADMIN_EMAIL=info@teecrownconsult.org
NODE_ENV=production
```

### Web Worker vars (on Cloudflare)

Set via wrangler or Cloudflare dashboard:

| Var | Value |
|---|---|
| `PAYLOAD_URL` | `https://dash.teecrownconsult.org` |

## Content Management

### Via Payload admin (preferred for content)

- Tours: `https://dash.teecrownconsult.org/admin/collections/tour-packages`
- Blog: `https://dash.teecrownconsult.org/admin/collections/posts`
- Testimonials: `https://dash.teecrownconsult.org/admin/collections/testimonials`
- Contact submissions: `https://dash.teecrownconsult.org/admin/collections/contact-submissions`
- Media: `https://dash.teecrownconsult.org/admin/collections/media`

### Via code (for schema/feature changes)

1. Change code locally
2. Commit to Git
3. Push to `main` (auto-deploys via GitHub Actions)
4. Or deploy manually from terminal

## Troubleshooting

### Web returns 500

1. Check Cloudflare Workers logs: `wrangler tail`
2. Verify `PAYLOAD_URL` is set correctly
3. Rebuild: `pnpm run build:cloudflare && pnpm opennextjs-cloudflare deploy -- --keep-vars`

### CMS not responding

1. SSH into VPS: `ssh teecrownconsult@<VPS_HOST>`
2. Check PM2: `pm2 list`
3. Check logs: `pm2 logs teecrownconsult-cms`
4. Restart: `pm2 restart teecrownconsult-cms`

### CMS deploy fails with ERR_PNPM_IGNORED_BUILDS

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild, sharp, unrs-resolver
Run "pnpm approve-builds" to pick which dependencies should be allowed
```

The build-script approval is missing on the server — see
[Server Prerequisites](#server-prerequisites-one-time-per-machine). SSH in, run
`pnpm approve-builds` in `/home/teecrownconsult/apps/cms`, select all, then
re-run the deploy. Nothing in the repo can fix this; the setting is machine-local.

### CMS deploy fails with "doesn't have a root layout"

A stray directory named `app/` exists at `/home/teecrownconsult/apps/cms/`.
Next.js treats a root-level `app/` as the App Router directory, which collides
with `src/app`. Delete it (and any leftover `current/`, `release/`, `repo-src/`
from the old release-swap deploy) and redeploy. Keep `shared/`, `node_modules`
and `.next`.

### Contact form not saving

1. Check CMS is running and reachable: `curl https://dash.teecrownconsult.org/api/contact-submissions`
2. Check SMTP is configured: Payload admin → Email log (if available)
3. Check web API logs: `wrangler tail` on the web worker
