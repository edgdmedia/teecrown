#!/usr/bin/env bash
set -euo pipefail

# Build and run in place.
#
# The previous version built into .next/standalone, tarred that into a `release`
# directory and swapped it over `current`. With pnpm, standalone's node_modules
# is three relative symlinks into the store; moving that tree (and flattening it
# one level shallower) left them dangling, so the app died on boot with
# "Cannot find module 'next'" while the deploy still reported success.
#
# Now the extracted repo IS the running app. node_modules never moves.

APP_ROOT="/home/teecrownconsult/apps/cms"
SHARED_DIR="$APP_ROOT/shared"
MEDIA_DIR="$SHARED_DIR/media"
ENV_FILE="$SHARED_DIR/.env.production"

# The CMS package this script lives in, whatever it was extracted to.
CMS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file: $ENV_FILE"
  exit 1
fi

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm use 24.15.0
fi

mkdir -p "$SHARED_DIR" "$MEDIA_DIR"

cd "$CMS_DIR"

pnpm install --no-frozen-lockfile
pnpm run generate:importmap
pnpm run generate:types
pnpm run build

# Uploads live outside the deploy directory so they survive redeploys.
rm -rf "$CMS_DIR/media"
ln -s "$MEDIA_DIR" "$CMS_DIR/media"

# Export .env.production into this shell so pm2 inherits it. Parsed by node
# rather than sourced directly: unquoted values containing spaces (e.g.
# EMAIL_FROM_NAME=TeeCrown Consult) are word-split by the shell and blow up.
node -e "const fs=require('fs');const path=process.argv[1];for(const line of fs.readFileSync(path,'utf8').split(/\\r?\\n/)){if(!line||line.trim().startsWith('#'))continue;const i=line.indexOf('=');if(i===-1)continue;const key=line.slice(0,i);const value=line.slice(i+1);process.stdout.write(key+'='+JSON.stringify(value)+'\n')}" "$ENV_FILE" > /tmp/teecrown-cms-env
set -a
. /tmp/teecrown-cms-env
set +a
rm -f /tmp/teecrown-cms-env

pnpm run deploy:database

pm2 delete teecrownconsult-cms 2>/dev/null || true
pm2 start "$CMS_DIR/ecosystem.config.cjs" --update-env
pm2 save

# `pm2 start` exits 0 even when the app immediately crash-loops. That is how a
# dead CMS passed as a green deploy for two hours. Poll the real endpoint.
echo "Waiting for CMS on 127.0.0.1:3000 ..."
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null --max-time 5 "http://127.0.0.1:3000/api/tour-packages?limit=1"; then
    echo "CMS healthy after ${i} attempt(s)."
    exit 0
  fi
  sleep 2
done

echo "FATAL: CMS did not become healthy within 60s."
pm2 describe teecrownconsult-cms || true
pm2 logs teecrownconsult-cms --lines 40 --nostream --err || true
exit 1
