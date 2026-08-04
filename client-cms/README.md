# Tee'Crown Consult — Payload CMS

```bash
npm install
npm run dev          # → http://localhost:3000/admin
```

First visit auto-pushes schema to Postgres. Create admin user at `/admin`.

## Deploy

```bash
git pull origin main
npm install
PAYLOAD_ENABLE_SMTP=false npm run build
pm2 restart teecrown-cms
```

## VPS Setup (Webmin + Caddy)

This server runs Webmin. The CMS runs on the host via PM2 behind Caddy.

### DNS (Cloudflare)

Since `teecrownconsult.org` is on Cloudflare (proxied), the admin subdomain needs a **DNS-only** A record:

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | `admin` | VPS_IP | **DNS only** (grey cloud) |

Do NOT proxy admin through Cloudflare — Caddy on the VPS handles SSL directly.

### Install Caddy on VPS

```bash
sudo apt install caddy
```

Create `/etc/caddy/Caddyfile` with:

```
admin.teecrownconsult.org {
    reverse_proxy 127.0.0.1:3000
}
```

```bash
sudo systemctl reload caddy
```

### Update `.env` on VPS

```bash
NEXT_PUBLIC_SERVER_URL=https://admin.teecrownconsult.org
CORS_ORIGINS=https://teecrownconsult.org,https://www.teecrownconsult.org
FRONTEND_REVALIDATE_URL=https://teecrownconsult.org/api/revalidate
```

Full guide: `docs/Payload-VPS-Cloudflare-Install-Guide.md`
