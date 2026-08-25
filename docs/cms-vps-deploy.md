# CMS VPS Deploy

Target server:

- Virtual server: `teecrownconsult`
- Home: `/home/teecrownconsult`
- CMS URL: `https://dash.teecrownconsult.org`

## Directory layout

```text
/home/teecrownconsult/apps/cms/
  current/
  shared/
    .env.production
    media/
```

## Required software on the VPS

1. Node `24.15.0`
2. `pnpm`
3. `pm2`
4. PostgreSQL server running on the VPS

## Environment file

Create:

```text
/home/teecrownconsult/apps/cms/shared/.env.production
```

Use `apps/cms/.env.production.example` as the template.

## Deploy flow on the VPS

From the CMS checkout on the server:

```bash
cd /home/teecrownconsult/current-repo/apps/cms
bash scripts/deploy-vps.sh
```

This script:

1. installs dependencies
2. regenerates Payload artifacts
3. builds the standalone Next server
4. copies the runtime into `/home/teecrownconsult/apps/cms/current`
5. symlinks persistent media storage
6. runs Payload migrations against local Postgres
7. starts or reloads PM2

## Reverse proxy target

Your web server for `dash.teecrownconsult.org` should proxy to:

```text
127.0.0.1:3000
```

## Persistent uploads

Uploads are stored in:

```text
/home/teecrownconsult/apps/cms/shared/media
```

Do not point uploads at the deploy directory itself.

## First boot checklist

1. Create Postgres database and user
2. Create `.env.production`
3. Run `bash scripts/deploy-vps.sh`
4. Confirm PM2 process is online
5. Point `dash.teecrownconsult.org` to `127.0.0.1:3000`
6. Open the admin and create the first user if needed
