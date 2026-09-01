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

The workflow builds on GitHub Actions runner and uploads to VPS. For manual deploys:

```bash
# SSH into VPS
ssh teecrownconsult@server.edgdmedia.com

# Run the deploy script
cd /home/teecrownconsult/apps/cms/current
bash /path/to/deploy-vps.sh
```

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

### Contact form not saving

1. Check CMS is running and reachable: `curl https://dash.teecrownconsult.org/api/contact-submissions`
2. Check SMTP is configured: Payload admin → Email log (if available)
3. Check web API logs: `wrangler tail` on the web worker
