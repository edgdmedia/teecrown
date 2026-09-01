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

pnpm install --no-frozen-lockfile
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

pm2 delete teecrownconsult-cms 2>/dev/null || true
pm2 start "$CURRENT_DIR/ecosystem.config.cjs"
pm2 save
