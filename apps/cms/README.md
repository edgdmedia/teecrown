# TeeCrown Consult CMS

Payload CMS backend for the TeeCrown Consult site (`apps/web`), intended for self-hosting on a VPS with Postgres and local media storage.

## Runtime

- Node.js `24.15.0`
- Postgres
- Local filesystem storage for media uploads

## Required environment variables

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DB_NAME
PAYLOAD_SECRET=replace-with-a-long-random-string
FRONTEND_REVALIDATE_URL=https://teecrownconsult.org/api/revalidate
REVALIDATE_SECRET=shared-secret-with-apps-web
PAYLOAD_URL=https://cms.your-domain.com
SMTP_HOST=mail.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASS=replace-with-smtp-password
FROM_EMAIL=noreply@example.com
EMAIL_FROM_NAME=Your Company Name
```

`PAYLOAD_URL` is used by the seed script and should point to the running CMS URL.

## Email

Payload is configured to send email through SMTP using `@payloadcms/email-nodemailer`.

For Tee'Crown Consult, configure these in `/home/teecrownconsult/apps/cms/shared/.env.production`:

```bash
SMTP_HOST=mail.teecrownconsult.org
SMTP_PORT=587
SMTP_USER=noreply@teecrownconsult.org
SMTP_PASS=...
FROM_EMAIL=noreply@teecrownconsult.org
EMAIL_FROM_NAME=Tee'Crown Consult
```

## Local development

Requires Node `24.15.0`.

```bash
pnpm install
pnpm run generate:importmap
pnpm run generate:types
pnpm payload migrate:create
pnpm dev
```

In another terminal, run the web app against the local CMS:

```bash
cd ../web
PAYLOAD_URL=http://localhost:3000 npm run dev
```

## Database workflow

Create a migration after schema changes:

```bash
pnpm payload migrate:create
```

Apply migrations:

```bash
pnpm run deploy:database
```

## Production build

Build the standalone server bundle:

```bash
pnpm run build
```

Start the production server:

```bash
pnpm start
```

When deploying the standalone output, copy static assets alongside the standalone server:

```bash
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
mkdir -p .next/standalone/media
```

The `media` directory must be persistent on disk in production or uploaded files will be lost on redeploy/restart.

## Media storage

Uploads are stored locally under `media/` via the `media` collection's `staticDir` setting.

If you later want object storage, replace local media storage with an S3-compatible adapter without changing the frontend integration.

## Revalidation

CMS collection updates trigger POST requests to the web app's `/api/revalidate` endpoint using:

- `FRONTEND_REVALIDATE_URL`
- `REVALIDATE_SECRET`

This keeps `apps/web` on Cloudflare while the CMS runs elsewhere.
