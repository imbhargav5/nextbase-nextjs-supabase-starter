#!/usr/bin/env bash
set -euo pipefail

# Stop any stale Supabase containers from a previous run to avoid port-bind failures.
( cd apps/database && pnpm supabase stop --no-backup 2>/dev/null || true ) || true

# Copy root .env*.example files to their .env counterparts if missing.
for ex in .env.local.example .env.development.local.example; do
  if [ ! -f "$ex" ]; then
    continue
  fi
  target="${ex%.example}"
  if [ ! -f "$target" ]; then
    cp "$ex" "$target"
    echo "Created $target"
  fi
done

# Install dependencies.
pnpm i

# Bring up the local Supabase stack.
pnpm database#start

# Sync local Supabase keys into env files (non-fatal if it fails).
pnpm supabase:sync-env || true

# Generate local DB types (non-fatal).
pnpm gen-types-local || true

echo "Setup complete"
