# Payload CMS — TeeCrown Consulting

## Prerequisites

- Node.js 20.9+
- Docker & Docker Compose
- Caddy (for reverse proxy)

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Postgres
docker compose up -d db

# 3. Create .env (copy from .env.example, adjust for local dev)
cp .env.example .env

# 4. Run dev server
npm run dev
```

Admin panel: `http://localhost:3000/admin`

## Docker Production Build

```bash
docker compose up -d --build
```

## Migrations

```bash
# Create a migration file after schema changes
npm run migrate:create

# Apply pending migrations
npm run migrate
```

## Deploy

See `.github/workflows/deploy-cms.yml` — auto-deploys on push to `main`.

## Reference

Full install guide: `docs/Payload-VPS-Cloudflare-Install-Guide.md`
