#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/home/teecrownconsult/apps/cms"
CURRENT_DIR="$APP_ROOT/current"
RELEASE_DIR="$APP_ROOT/release"
SHARED_DIR="$APP_ROOT/shared"
MEDIA_DIR="$SHARED_DIR/media"
ENV_FILE="$SHARED_DIR/.env.production"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file: $ENV_FILE"
  exit 1
fi

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm use 24.15.0
fi

mkdir -p "$APP_ROOT" "$SHARED_DIR" "$MEDIA_DIR"

# --ignore-workspace is required, not cosmetic.
#
# next.config.mjs sets `outputFileTracingRoot: __dirname` (= apps/cms). A normal
# workspace install puts the real packages in <repo-root>/node_modules/.pnpm and
# leaves apps/cms/node_modules/next as a symlink pointing OUTSIDE that tracing
# root. Next then emits `.next/standalone/node_modules/{next,react,graphql}` as
# dangling symlinks and copies no actual files — a ~9MB standalone that dies on
# boot with "Cannot find module 'next'".
#
# With --ignore-workspace the real packages land in apps/cms/node_modules/.pnpm,
# inside the tracing root, so the standalone output contains them (~82MB) and
# the relative symlinks still resolve after the tar copy below.
pnpm install --ignore-workspace --no-frozen-lockfile
pnpm run generate:importmap
pnpm run generate:types
pnpm run build

rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

tar -C .next/standalone -cf - . | tar -C "$RELEASE_DIR" -xf -
tar -C . -cf - public | tar -C "$RELEASE_DIR" -xf -
mkdir -p "$RELEASE_DIR/.next"
tar -C .next -cf - static | tar -C "$RELEASE_DIR/.next" -xf -
cp package.json "$RELEASE_DIR/"
cp ecosystem.config.cjs "$RELEASE_DIR/"

rm -rf "$CURRENT_DIR"
mv "$RELEASE_DIR" "$CURRENT_DIR"

rm -rf "$CURRENT_DIR/media"
ln -s "$MEDIA_DIR" "$CURRENT_DIR/media"

node -e "const fs=require('fs');const path=process.argv[1];for(const line of fs.readFileSync(path,'utf8').split(/\\r?\\n/)){if(!line||line.trim().startsWith('#'))continue;const i=line.indexOf('=');if(i===-1)continue;const key=line.slice(0,i);const value=line.slice(i+1);process.stdout.write(key+'='+JSON.stringify(value)+'\n')}" "$ENV_FILE" > /tmp/teecrown-cms-env
set -a
. /tmp/teecrown-cms-env
set +a
rm -f /tmp/teecrown-cms-env

pnpm run deploy:database

# Fail fast if the standalone output is missing its dependencies, rather than
# swapping a release that cannot boot. This is the exact failure the
# --ignore-workspace note above describes.
if [ ! -e "$CURRENT_DIR/node_modules/next/package.json" ]; then
  echo "FATAL: $CURRENT_DIR/node_modules/next does not resolve."
  echo "The standalone build shipped dangling symlinks; refusing to restart."
  exit 1
fi

pm2 delete teecrownconsult-cms 2>/dev/null || true
pm2 start "$CURRENT_DIR/ecosystem.config.cjs"
pm2 save

# pm2 start exits 0 even when the app immediately crash-loops, which is how a
# 15-restart "errored" process previously passed as a green deploy. Poll the
# real endpoint before declaring success.
echo "Waiting for CMS to answer on 127.0.0.1:3000 ..."
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null --max-time 5 "http://127.0.0.1:3000/api/tour-packages?limit=1"; then
    echo "CMS is up (after ${i} attempt(s))."
    exit 0
  fi
  sleep 2
done

echo "FATAL: CMS did not become healthy within 60s."
pm2 describe teecrownconsult-cms || true
pm2 logs teecrownconsult-cms --lines 40 --nostream --err || true
exit 1
