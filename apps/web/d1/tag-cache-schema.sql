-- Schema for the OpenNext D1 tag cache (binding NEXT_TAG_CACHE_D1).
-- Matches the queries in
-- @opennextjs/cloudflare/dist/api/overrides/tag-cache/d1-next-tag-cache.js:
--   INSERT INTO revalidations (tag, revalidatedAt, stale, expire) VALUES (?, ?, ?, ?)
--   SELECT tag, revalidatedAt, stale, expire FROM revalidations WHERE tag IN (...)
--
-- Apply with:
--   npx wrangler d1 execute teecrownconsult-tag-cache --remote \
--     --file=d1/tag-cache-schema.sql

CREATE TABLE IF NOT EXISTS revalidations (
  tag           TEXT    NOT NULL,
  revalidatedAt INTEGER NOT NULL,
  stale         INTEGER,
  expire        INTEGER
);

CREATE INDEX IF NOT EXISTS idx_revalidations_tag ON revalidations (tag);
