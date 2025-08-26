#!/usr/bin/env bash
set -euo pipefail
echo "[DEPLOY] Starting production deployment script (bash)"

POSTGRES_URL=${POSTGRES_URL:-""}
SKIP_BACKUP=${SKIP_BACKUP:-"false"}
RUN_SEED=${RUN_SEED:-"false"}

if [ -z "$POSTGRES_URL" ]; then
  echo "POSTGRES_URL not set" >&2
  exit 1
fi

if [ "$SKIP_BACKUP" != "true" ]; then
  if command -v pg_dump >/dev/null 2>&1; then
    mkdir -p backups
    TS=$(date +%Y%m%d%H%M%S)
    FILE="backups/db-backup-$TS.dump"
    echo "[DEPLOY] Creating DB backup: $FILE"
    pg_dump "$POSTGRES_URL" -Fc -f "$FILE" || echo "[DEPLOY] Backup failed (continuing)" >&2
  else
    echo "[DEPLOY] pg_dump not found, skipping backup" >&2
  fi
else
  echo "[DEPLOY] Skipping backup (SKIP_BACKUP=true)"
fi

if [ -f package-lock.json ]; then
  echo "[DEPLOY] Installing dependencies (npm ci)"
  npm ci
else
  echo "[DEPLOY] Installing dependencies (npm install --production)"
  npm install --production
fi

echo "[DEPLOY] Running migrations"
npm run db:migrate

echo "[DEPLOY] Ensuring core tables exist"
npm run db:restore:core

if [ "$RUN_SEED" = "true" ]; then
  echo "[DEPLOY] Seeding database"
  npm run db:seed || echo "[DEPLOY] Seed failed (continuing)" >&2
fi

echo "[DEPLOY] Building application"
npm run build

echo "[DEPLOY] Build complete. Start with: npm start"
echo "[DEPLOY] Done."
