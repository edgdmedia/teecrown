<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:payload-cms -->
# Payload CMS — Local Dev

```bash
cd client-cms
npm run dev    # starts on :3000
```

- Admin panel: http://localhost:3000/admin
- API: http://localhost:3000/api/{collection}
- Postgres runs locally via Homebrew (not Docker on this machine)
- DB: `client_cms`, user: `client_cms_user` / `local_dev`

## Local testing (full loop)

Terminal 1: `cd client-cms && npm run dev`
Terminal 2: `cd .. && NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000 npx next dev --port 3001`

Frontend at :3001 fetches from local CMS.

## Seeding

The first visit to `/admin` auto-pushes schema to local DB (`push: true` in dev).
Create the first admin user at `/admin`, then run:
```bash
npx ts-node scripts/seed.ts   # from client-cms/
```
<!-- END:payload-cms -->
