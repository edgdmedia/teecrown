#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/home/teecrownconsult/apps/cms"
CURRENT_DIR="$APP_ROOT/current"
SHARED_DIR="$APP_ROOT/shared"
MEDIA_DIR="$SHARED_DIR/media"
ENV_FILE="$SHARED_DIR/.env.production"
REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"

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

cd "$REPO_ROOT"
pnpm install --frozen-lockfile

cd "$REPO_ROOT/apps/cms"
pnpm run generate:importmap
pnpm run generate:types
pnpm run build

cp -R public .next/standalone/
mkdir -p .next/standalone/.next
cp -R .next/static .next/standalone/.next/

rm -rf "$CURRENT_DIR"
mkdir -p "$CURRENT_DIR"

cp -R .next "$CURRENT_DIR/"
cp -R public "$CURRENT_DIR/"
cp -R src "$CURRENT_DIR/"
cp package.json "$CURRENT_DIR/"
cp ecosystem.config.cjs "$CURRENT_DIR/"
cp -R node_modules "$CURRENT_DIR/"

rm -rf "$CURRENT_DIR/.next/standalone/media"
ln -s "$MEDIA_DIR" "$CURRENT_DIR/.next/standalone/media"

set -a
. "$ENV_FILE"
set +a

pnpm run deploy:database

pm2 startOrReload "$CURRENT_DIR/ecosystem.config.cjs" --update-env
pm2 save
